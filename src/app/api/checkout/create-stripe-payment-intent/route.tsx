import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment';
import Stripe from 'stripe';

type CheckoutItem = {
    id?: string;
    name?: string;
    title?: string;
    price?: number;
    quantity?: number;
};

type CheckoutAddress = {
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
};

type CreateStripePaymentIntentBody = {
    items?: CheckoutItem[];
    shippingMethod?: string;
    shippingCost?: number;
    taxAmount?: number;
    processingFee?: number;
    shippingAddress?: CheckoutAddress;
    billingAddress?: CheckoutAddress;
    totalAmount?: number | string;
    email?: string;
};

/**
 * Create a Stripe Payment Intent
 * POST /api/checkout/create-stripe-payment-intent
 * For direct payment processing with Stripe Elements
 */
export async function GET() {
    return NextResponse.json({
        message: 'Stripe payment intent endpoint is available. Use POST to create a payment intent.',
    });
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            Allow: 'GET,POST,OPTIONS',
        },
    });
}

export async function POST(request: Request) {
    try {
        const { stripeSecretKey } = getEnvironment();

        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
        }

        const stripe = new Stripe(stripeSecretKey);

        const body = (await request.json()) as CreateStripePaymentIntentBody;
        const {
            items,
            shippingMethod,
            shippingCost,
            taxAmount,
            processingFee,
            shippingAddress,
            totalAmount,
            email,
        } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
        }

        if (totalAmount === undefined || totalAmount === null || Number.isNaN(Number(totalAmount))) {
            return NextResponse.json({ error: 'Total amount is required' }, { status: 400 });
        }

        const amountInCents = Math.round(Number(totalAmount) * 100);

        // Create/find a Stripe customer so we can attach a draft invoice that stores full line-item details.
        let customerId: string | undefined;
        if (email) {
            const existingCustomers = await stripe.customers.list({
                email,
                limit: 1,
            });

            if (existingCustomers.data.length > 0) {
                customerId = existingCustomers.data[0].id;
            } else {
                const customer = await stripe.customers.create({
                    email,
                    name: shippingAddress
                        ? `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim() || undefined
                        : undefined,
                    address: shippingAddress
                        ? {
                            line1: shippingAddress.address || undefined,
                            city: shippingAddress.city || undefined,
                            state: shippingAddress.state || undefined,
                            postal_code: shippingAddress.zipCode || undefined,
                            country: shippingAddress.country || 'US',
                        }
                        : undefined,
                });
                customerId = customer.id;
            }
        }

        if (!customerId) {
            const guestCustomer = await stripe.customers.create({
                name: shippingAddress
                    ? `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim() || 'Guest Customer'
                    : 'Guest Customer',
                address: shippingAddress
                    ? {
                        line1: shippingAddress.address || undefined,
                        city: shippingAddress.city || undefined,
                        state: shippingAddress.state || undefined,
                        postal_code: shippingAddress.zipCode || undefined,
                        country: shippingAddress.country || 'US',
                    }
                    : undefined,
            });
            customerId = guestCustomer.id;
        }

        const pendingInvoice = await stripe.invoices.create({
            customer: customerId,
            auto_advance: false,
            metadata: {
                order_type: 'storefront',
                checkout_status: 'pending',
                customer_email: email || '',
                shipping_method: shippingMethod || 'standard',
            },
            description: 'Pending checkout invoice',
        });

        for (const item of items) {
            const quantity = Math.max(1, Number(item.quantity || 1));
            const unitAmount = Math.max(0, Math.round(Number(item.price || 0) * 100));
            const description = item.name || item.title || item.id || 'Item';

            await stripe.invoiceItems.create({
                customer: customerId,
                invoice: pendingInvoice.id,
                description: `${description} x${quantity}`,
                amount: unitAmount * quantity,
                currency: 'usd',
            });
        }

        if (shippingCost && Number(shippingCost) > 0) {
            await stripe.invoiceItems.create({
                customer: customerId,
                invoice: pendingInvoice.id,
                description: `Shipping (${shippingMethod || 'standard'})`,
                amount: Math.round(Number(shippingCost) * 100),
                currency: 'usd',
            });
        }

        if (taxAmount && Number(taxAmount) > 0) {
            await stripe.invoiceItems.create({
                customer: customerId,
                invoice: pendingInvoice.id,
                description: 'Tax',
                amount: Math.round(Number(taxAmount) * 100),
                currency: 'usd',
            });
        }

        if (processingFee && Number(processingFee) > 0) {
            await stripe.invoiceItems.create({
                customer: customerId,
                invoice: pendingInvoice.id,
                description: 'Processing fee',
                amount: Math.round(Number(processingFee) * 100),
                currency: 'usd',
            });
        }

        const metadata: Record<string, string> = {
            shipping_method: shippingMethod || 'standard',
            order_type: 'storefront',
            items_count: String(items.length),
            customer_email: email || '',
            processing_fee: processingFee ? Number(processingFee).toFixed(2) : '0.00',
            shipping_cost: shippingCost ? Number(shippingCost).toFixed(2) : '0.00',
            tax_amount: taxAmount ? Number(taxAmount).toFixed(2) : '0.00',
            invoice_id: pendingInvoice.id,
            shipping_first_name: shippingAddress?.firstName || '',
            shipping_last_name: shippingAddress?.lastName || '',
            shipping_address: shippingAddress?.address || '',
            shipping_city: shippingAddress?.city || '',
            shipping_state: shippingAddress?.state || '',
            shipping_zip: shippingAddress?.zipCode || '',
            shipping_country: shippingAddress?.country || 'US',
        };

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            customer: customerId,
            automatic_payment_methods: {
                enabled: true,
            },
            receipt_email: email,
            metadata,
            shipping: shippingAddress
                ? {
                    name: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(),
                    address: {
                        line1: shippingAddress.address || '',
                        city: shippingAddress.city || '',
                        state: shippingAddress.state || '',
                        postal_code: shippingAddress.zipCode || '',
                        country: shippingAddress.country || 'US',
                    },
                }
                : undefined,
        });

        await stripe.invoices.update(pendingInvoice.id, {
            metadata: {
                ...pendingInvoice.metadata,
                payment_intent_id: paymentIntent.id,
            },
            description: `Pending checkout invoice for payment intent ${paymentIntent.id}`,
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            invoiceId: pendingInvoice.id,
        });
    } catch (error) {
        console.error('Payment Intent creation error:', error);
        const details = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                error: 'Failed to create payment intent',
                details,
            },
            { status: 500 },
        );
    }
}