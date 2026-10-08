import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment';
import { enforceRateLimit } from '@/lib/rate-limit';
import Stripe from 'stripe';

const SESSION_ID_PATTERN = /^cs_(test|live)_[A-Za-z0-9]{1,250}$/;

// 30 status lookups per IP per 10 minutes.
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/**
 * Get Stripe Session Status
 * GET /api/checkout/retrieve-stripe-session-status?session_id=SESSION_ID
 */
export async function GET(request: Request) {
    try {
        const limited = enforceRateLimit(request, 'payment-status', RATE_LIMIT, RATE_WINDOW_MS);
        if (limited) return limited;

        const { stripeSecretKey } = getEnvironment();

        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }

        if (!SESSION_ID_PATTERN.test(sessionId)) {
            return NextResponse.json({ error: 'Invalid Session ID' }, { status: 400 });
        }

        const stripe = new Stripe(stripeSecretKey, {

        });
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        return NextResponse.json({
            status: session.status,
            customer_email: session.customer_details?.email || '',
        });
    } catch (error) {
        console.error('Retrieve session status error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve session status' },
            { status: 500 },
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            Allow: 'GET,OPTIONS',
        },
    });
}