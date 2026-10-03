import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment.server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

/**
 * Stripe webhook handler.
 * POST /api/checkout/stripe-webhook
 *
 * Verifies the Stripe signature and finalizes the pending invoice after
 * a successful payment.
 */
export async function POST(request: Request) {
    try {
        const { stripeSecretKey, stripeWebhookSecret } = getEnvironment();

        if (!stripeSecretKey || !stripeWebhookSecret) {
            return NextResponse.json(
                { error: 'Stripe webhook is not configured.' },
                { status: 500 },
            );
        }

        const stripe = new Stripe(stripeSecretKey);
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'Missing stripe-signature header.' },
                { status: 400 },
            );
        }

        const payload = await request.text();
        const event = stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecret);

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const invoiceId = paymentIntent.metadata?.invoice_id;

            if (invoiceId) {
                const invoice = await stripe.invoices.retrieve(invoiceId);

                if (invoice.status === 'draft') {
                    await stripe.invoices.finalizeInvoice(invoiceId, {
                        auto_advance: false,
                    });
                }

                const refreshedInvoice = await stripe.invoices.retrieve(invoiceId);

                // Never mark an order paid unless the payment covers it in full.
                if (paymentIntent.amount_received < refreshedInvoice.total) {
                    console.error(
                        `Payment ${paymentIntent.id} (${paymentIntent.amount_received}) does not cover invoice ${invoiceId} (${refreshedInvoice.total})`,
                    );
                    await stripe.invoices.update(invoiceId, {
                        metadata: {
                            ...refreshedInvoice.metadata,
                            checkout_status: 'amount_mismatch',
                            payment_intent_id: paymentIntent.id,
                        },
                    });
                    return NextResponse.json({ received: true });
                }

                if (refreshedInvoice.status !== 'paid') {
                    await stripe.invoices.pay(invoiceId, {
                        paid_out_of_band: true,
                    });
                }

                await stripe.invoices.update(invoiceId, {
                    metadata: {
                        ...refreshedInvoice.metadata,
                        checkout_status: 'paid',
                        payment_intent_id: paymentIntent.id,
                    },
                });
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Stripe webhook error:', error);

        return NextResponse.json(
            {
                error: 'Failed to process Stripe webhook',
            },
            { status: 400 },
        );
    }
}
