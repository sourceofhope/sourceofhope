import { NextRequest, NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment.server';
import { rateLimit } from '@/lib/rate-limit';
import { readJsonObject } from '@/lib/validation';
import Stripe from 'stripe';

// 5 PaymentIntent creations per IP per 10 minutes.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const PROCESSING_RATE = 0.03;
const MAX_DONATION = 100_000;
const EMAIL_PATTERN = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,255}\.[^\s@<>"]+$/;

function asString(value: unknown, maxLength: number): string | undefined {
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

type CreateDonationPaymentIntentBody = {
    amount?: number;
    processingFee?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    dedication?: string;
    coverFee?: boolean;
};

/**
 * Create a Stripe Payment Intent for a donation
 * POST /api/checkout/create-donation-payment-intent
 */
export async function GET() {
    return NextResponse.json({
        message: 'Donation payment intent endpoint is available. Use POST to create a payment intent.',
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

export async function POST(request: NextRequest) {
    try {
        // ── Rate limiting ──────────────────────────────────────────────────
        const limited = rateLimit(request, 'donation', RATE_LIMIT, RATE_WINDOW_MS);
        if (limited) return limited;

        // ── Payment intent creation ────────────────────────────────────────
        const { stripeSecretKey } = getEnvironment();
        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
        }

        const stripe = new Stripe(stripeSecretKey);

        const body = (await readJsonObject(request)) as CreateDonationPaymentIntentBody | null;
        if (!body) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const amount = Number(body.amount);
        const coverFee = body.coverFee === true;
        const email = asString(body.email, 254);
        const firstName = asString(body.firstName, 100);
        const lastName = asString(body.lastName, 100);
        const dedication = asString(body.dedication, 500);

        if (!Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json({ error: 'A valid donation amount is required.' }, { status: 400 });
        }

        if (amount > MAX_DONATION) {
            return NextResponse.json(
                { error: 'For donations over $100,000, please contact us directly.' },
                { status: 400 },
            );
        }

        if (email && !EMAIL_PATTERN.test(email)) {
            return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
        }

        // The fee is computed here (same formula as the donate page) rather
        // than trusted from the request.
        const donationAmountCents = Math.round(amount * 100);
        const processingFeeCents = coverFee
            ? Math.round(Number((amount * PROCESSING_RATE).toFixed(2)) * 100)
            : 0;
        const totalCents = donationAmountCents + processingFeeCents;

        if (totalCents < 50) {
            return NextResponse.json({ error: 'Minimum donation amount is $0.50.' }, { status: 400 });
        }

        const metadata: Record<string, string> = {
            type: 'donation',
            donation_amount: (donationAmountCents / 100).toFixed(2),
            cover_fee: coverFee ? 'true' : 'false',
        };

        if (email) metadata.customer_email = email;
        if (firstName) metadata.first_name = firstName;
        if (lastName) metadata.last_name = lastName;
        if (dedication) metadata.dedication = dedication;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalCents,
            currency: 'usd',
            receipt_email: email || undefined,
            description: 'Donation to The Source of Hope',
            metadata,
            automatic_payment_methods: { enabled: true },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Create donation payment intent error:', error);
        return NextResponse.json(
            { error: 'Failed to create donation payment intent' },
            { status: 500 },
        );
    }
}
