import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment';

/**
 * Retrieve the Stripe publishable key
 * POST /api/checkout/retrieve-stripe-publishable-key
 */
export async function GET() {
  return NextResponse.json({
    message: 'Stripe publishable key endpoint is available. Use POST to retrieve the key.',
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

// POST: /api/checkout/retrieve-stripe-publishable-key
export async function POST() {
  try {
    const { stripePublishableKey } = getEnvironment();

    if (!stripePublishableKey) {
      return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
    }

    return NextResponse.json({ publishableKey: stripePublishableKey });
  } catch (error) {
    console.error('Retrieve Stripe publishable key error:', error);
    const details = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to retrieve Stripe publishable key',
        details,
      },
      { status: 500 },
    );
  }
}