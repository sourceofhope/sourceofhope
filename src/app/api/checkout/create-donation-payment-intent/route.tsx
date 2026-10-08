import { NextRequest, NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment';
import { enforceRateLimit } from '@/lib/rate-limit';
import {
    MAX_EMAIL_LENGTH,
    MAX_NAME_LENGTH,
    isValidEmail,
    parseAmount,
    readJsonObject,
    readString,
} from '@/lib/validation';
import Stripe from 'stripe';

// 5 PaymentIntent creations per IP per 10 minutes.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

// Donation bounds in cents, and the fee rate used by the donate page.
const MIN_DONATION_CENTS = 50;
const MAX_DONATION_CENTS = 10_000_000; // $100,000
const PROCESSING_FEE_RATE = 0.03;
const MAX_DEDICATION_LENGTH = 500; // Stripe metadata limit

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
        const limited = enforceRateLimit(request, 'donation', RATE_LIMIT, RATE_WINDOW_MS);
        if (limited) return limited;

        // ── Payment intent creation ────────────────────────────────────────
        const { stripeSecretKey } = getEnvironment();
        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
        }

        const stripe = new Stripe(stripeSecretKey);

        const body = await readJsonObject(request);
        if (!body) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const amount = parseAmount(body.amount);
        const coverFee = body.coverFee === true;
        const email = readString(body.email, MAX_EMAIL_LENGTH);
        const firstName = readString(body.firstName, MAX_NAME_LENGTH);
        const lastName = readString(body.lastName, MAX_NAME_LENGTH);
        const dedication = readString(body.dedication, MAX_DEDICATION_LENGTH);

        if (amount === null || amount <= 0) {
            return NextResponse.json({ error: 'A valid donation amount is required.' }, { status: 400 });
        }

        if (email === null || (email && !isValidEmail(email))) {
            return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
        }

        if (firstName === null || lastName === null || dedication === null) {
            return NextResponse.json({ error: 'One or more fields are invalid or too long.' }, { status: 400 });
        }

        const donationAmountCents = Math.round(amount * 100);

        if (donationAmountCents < MIN_DONATION_CENTS) {
            return NextResponse.json({ error: 'Minimum donation amount is $0.50.' }, { status: 400 });
        }

        if (donationAmountCents > MAX_DONATION_CENTS) {
            return NextResponse.json(
                { error: 'For donations over $100,000, please contact us directly.' },
                { status: 400 },
            );
        }

        // The fee is recomputed here (same rounding as the donate page); the client's value is ignored.
        const processingFeeCents = coverFee
            ? Math.round(Number((amount * PROCESSING_FEE_RATE).toFixed(2)) * 100)
            : 0;
        const totalCents = donationAmountCents + processingFeeCents;

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
