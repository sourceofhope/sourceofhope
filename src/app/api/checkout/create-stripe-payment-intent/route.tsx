import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment';
import { enforceRateLimit } from '@/lib/rate-limit';
import { CartError, formatCents, priceCart, wantsProcessingFee } from '@/lib/store-checkout';
import {
    MAX_EMAIL_LENGTH,
    MAX_NAME_LENGTH,
    isValidEmail,
    parseAmount,
    readJsonObject,
    readString,
} from '@/lib/validation';
import Stripe from 'stripe';

// 10 checkout initializations per IP per 10 minutes.
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 10 * 60 * 1000;

type CheckoutAddress = {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
};

// Validates the optional shipping address; returns null if any field is invalid.
function readAddress(value: unknown): CheckoutAddress | undefined | null {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== 'object' || Array.isArray(value)) return null;

    const raw = value as Record<string, unknown>;
    const address = {
        firstName: readString(raw.firstName, MAX_NAME_LENGTH),
        lastName: readString(raw.lastName, MAX_NAME_LENGTH),
        address: readString(raw.address, 200),
        city: readString(raw.city, 100),
        state: readString(raw.state, 100),
        zipCode: readString(raw.zipCode, 20),
        country: readString(raw.country, 100),
    };

    return Object.values(address).some((field) => field === null)
        ? null
        : (address as CheckoutAddress);
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
        const limited = enforceRateLimit(request, 'store-payment-intent', RATE_LIMIT, RATE_WINDOW_MS);
        if (limited) return limited;

        const { stripeSecretKey } = getEnvironment();

        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
        }

        const stripe = new Stripe(stripeSecretKey);

        const body = await readJsonObject(request);
        if (!body) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const email = readString(body.email, MAX_EMAIL_LENGTH);
        if (email === null || (email && !isValidEmail(email))) {
            return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
        }

        const shippingAddress = readAddress(body.shippingAddress);
        if (shippingAddress === null) {
            return NextResponse.json({ error: 'Invalid shipping address' }, { status: 400 });
        }

        const totalAmount = parseAmount(body.totalAmount);
        if (totalAmount === null) {
            return NextResponse.json({ error: 'Total amount is required' }, { status: 400 });
        }

        // Every amount is computed server-side from the product catalog.
        const cart = await priceCart(body.items, body.shippingMethod, wantsProcessingFee(body.processingFee));
        const shippingMethod = cart.shippingMethod;

        // The client's total is only used to make sure the customer is charged what they were shown.
        if (Math.round(totalAmount * 100) !== cart.totalCents) {
            return NextResponse.json(
                { error: 'Prices in your cart have changed. Please remove and re-add your items, then try again.' },
                { status: 409 },
            );
        }

        const customerName = shippingAddress
            ? `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim()
            : '';
        const customerAddress = shippingAddress
            ? {
                line1: shippingAddress.address || undefined,
                city: shippingAddress.city || undefined,
                state: shippingAddress.state || undefined,
                postal_code: shippingAddress.zipCode || undefined,
                country: shippingAddress.country || 'US',
            }
            : undefined;

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
                    name: customerName || undefined,
                    address: customerAddress,
                });
                customerId = customer.id;
            }
        }

        if (!customerId) {
            const guestCustomer = await stripe.customers.create({
                name: customerName || 'Guest Customer',
                address: customerAddress,
            });
            customerId = guestCustomer.id;
        }

        const pendingInvoice = await stripe.invoices.create({
            customer: customerId,
            auto_advance: false,
            metadata: {
                order_type: 'storefront',
                checkout_status: 'pending',
                customer_email: email,
                shipping_method: shippingMethod,
            },
            description: 'Pending checkout invoice',
        });

        for (const item of cart.items) {
            await stripe.invoiceItems.create({
                customer: customerId,
                invoice: pendingInvoice.id,
                description: `${item.name} x${item.quantity}`,
                amount: item.unitAmountCents * item.quantity,
                currency: 'usd',
            });
        }

        if (cart.shippingCents > 0) {
            await stripe.invoiceItems.create({
                customer: customerId,
                invoice: pendingInvoice.id,
                description: `Shipping (${shippingMethod})`,
                amount: cart.shippingCents,
                currency: 'usd',
            });
        }

        if (cart.taxCents > 0) {
            await stripe.invoiceItems.create({
                customer: customerId,
                invoice: pendingInvoice.id,
                description: 'Tax',
                amount: cart.taxCents,
                currency: 'usd',
            });
        }

        if (cart.processingFeeCents > 0) {
            await stripe.invoiceItems.create({
                customer: customerId,
                invoice: pendingInvoice.id,
                description: 'Processing fee',
                amount: cart.processingFeeCents,
                currency: 'usd',
            });
        }

        const metadata: Record<string, string> = {
            shipping_method: shippingMethod,
            order_type: 'storefront',
            items_count: String(cart.items.length),
            customer_email: email,
            processing_fee: formatCents(cart.processingFeeCents),
            shipping_cost: formatCents(cart.shippingCents),
            tax_amount: formatCents(cart.taxCents),
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
            amount: cart.totalCents,
            currency: 'usd',
            customer: customerId,
            automatic_payment_methods: {
                enabled: true,
            },
            receipt_email: email || undefined,
            metadata,
            shipping: shippingAddress
                ? {
                    name: customerName,
                    address: {
                        line1: shippingAddress.address,
                        city: shippingAddress.city,
                        state: shippingAddress.state,
                        postal_code: shippingAddress.zipCode,
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
        if (error instanceof CartError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        console.error('Payment Intent creation error:', error);
        return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
    }
}
