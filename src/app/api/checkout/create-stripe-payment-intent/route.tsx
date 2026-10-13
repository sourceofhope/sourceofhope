import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment.server';
import Stripe from 'stripe';
import { rateLimit } from '@/lib/rate-limit';
import { PricingError, quoteStoreOrder, toCents } from '@/lib/store-pricing';
import { readJsonObject } from '@/lib/validation';

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
    items?: unknown;
    shippingMethod?: string;
    processingFee?: number;
    shippingAddress?: CheckoutAddress;
    email?: string;
    /** The total the checkout page showed the customer. */
    totalAmount?: number | string;
};

const EMAIL_PATTERN = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,255}\.[^\s@<>"]+$/;

/** Keep only short string fields from a client-supplied address. */
function cleanAddress(address: unknown): CheckoutAddress | undefined {
    if (!address || typeof address !== 'object') return undefined;
    const source = address as Record<string, unknown>;
    const pick = (key: keyof CheckoutAddress) =>
        typeof source[key] === 'string' ? (source[key] as string).trim().slice(0, 200) : undefined;
    return {
        firstName: pick('firstName'),
        lastName: pick('lastName'),
        address: pick('address'),
        city: pick('city'),
        state: pick('state'),
        zipCode: pick('zipCode'),
        country: pick('country'),
    };
}

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
        const limited = rateLimit(request, 'store-checkout', 10, 10 * 60 * 1000);
        if (limited) return limited;

        const { stripeSecretKey } = getEnvironment();

        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
        }

        const stripe = new Stripe(stripeSecretKey);

        const body = (await readJsonObject(request)) as CreateStripePaymentIntentBody | null;
        if (!body) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        // Prices, tax, shipping, and fees are computed on the server from the
        // CMS; any amounts sent by the browser are ignored.
        const quote = await quoteStoreOrder(body);
        const shippingAddress = cleanAddress(body.shippingAddress);
        const email =
            typeof body.email === 'string' && EMAIL_PATTERN.test(body.email.trim())
                ? body.email.trim()
                : undefined;
        const shippingMethod = quote.shippingMethod.id;
        const shippingCost = quote.shipping;
        const taxAmount = quote.tax;
        const processingFee = quote.processingFee;
        const amountInCents = toCents(quote.total);

        // The client's total is only used to make sure the customer is charged
        // exactly what the checkout page showed them.
        const shownTotal = Number(body.totalAmount);
        if (!Number.isFinite(shownTotal) || toCents(shownTotal) !== amountInCents) {
            return NextResponse.json(
                { error: 'Prices in your cart have changed. Please remove and re-add your items, then try again.' },
                { status: 409 },
            );
        }

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

        for (const line of quote.lines) {
            await stripe.invoiceItems.create({
                customer: customerId,
                invoice: pendingInvoice.id,
                description: `${line.name}${line.size ? ` (${line.size})` : ''} x${line.quantity}`,
                amount: toCents(line.unitPrice) * line.quantity,
                currency: 'usd',
            });
        }

        if (shippingCost > 0) {
            await stripe.invoiceItems.create({
                customer: customerId,
                invoice: pendingInvoice.id,
                description: `Shipping (${shippingMethod || 'standard'})`,
                amount: toCents(shippingCost),
                currency: 'usd',
            });
        }

        if (taxAmount > 0) {
            await stripe.invoiceItems.create({
                customer: customerId,
                invoice: pendingInvoice.id,
                description: 'Tax',
                amount: toCents(taxAmount),
                currency: 'usd',
            });
        }

        if (processingFee > 0) {
            await stripe.invoiceItems.create({
                customer: customerId,
                invoice: pendingInvoice.id,
                description: 'Processing fee',
                amount: toCents(processingFee),
                currency: 'usd',
            });
        }

        const metadata: Record<string, string> = {
            shipping_method: shippingMethod || 'standard',
            order_type: 'storefront',
            items_count: String(quote.lines.length),
            customer_email: email || '',
            processing_fee: processingFee.toFixed(2),
            shipping_cost: shippingCost.toFixed(2),
            tax_amount: taxAmount.toFixed(2),
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
            amount: quote.total,
        });
    } catch (error) {
        if (error instanceof PricingError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        console.error('Payment Intent creation error:', error);
        return NextResponse.json(
            {
                error: 'Failed to create payment intent',
            },
            { status: 500 },
        );
    }
}