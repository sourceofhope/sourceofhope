import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment';
import Stripe from 'stripe';

type CheckoutItem = {
  id?: string;
  name?: string;
  title?: string;
  size?: string;
  image?: string;
  price: number;
  quantity: number;
};

type CreateStripeSessionBody = {
  items: CheckoutItem[];
  shippingMethod?: string;
  shippingCost?: number;
  taxAmount?: number;
  processingFee?: number;
  return_url?: string;
};

function buildStripeShippingOptions(shippingMethod?: string, shippingCost = 0): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
  if (!shippingCost || shippingCost <= 0) {
    return [];
  }

  return [
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: {
          amount: Math.round(shippingCost * 100),
          currency: 'usd',
        },
        display_name: shippingMethod || 'Standard Shipping',
      },
    },
  ];
}

export async function GET() {
    return NextResponse.json({ message: 'Stripe session endpoint is available. Use POST to create a session.' });
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
        const { stripeSecretKey, stripeSalesTaxRateId } = getEnvironment();

        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
        }

        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2020-08-27',
        });
        const body = (await request.json()) as CreateStripeSessionBody;
        const {
            items,
            shippingMethod,
            shippingCost,
            taxAmount,
            processingFee,
            return_url,
        } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
        }

        if (!return_url) {
            return NextResponse.json({ error: 'Return URL is required' }, { status: 400 });
        }

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name || item.title || 'Product',
                    description: item.size ? `Size: ${item.size}` : undefined,
                    images: item.image ? [item.image] : undefined,
                    metadata: {
                        product_id: item.id || '',
                        size: item.size || '',
                    },
                },
                unit_amount: Math.round(Number(item.price) * 100),
            },
            quantity: item.quantity,
            tax_rates: stripeSalesTaxRateId ? [stripeSalesTaxRateId] : undefined,
        }));

        const totalShippingCost = Number(shippingCost || 0) + Number(processingFee || 0);
        const shippingOptions = buildStripeShippingOptions(shippingMethod, totalShippingCost);

        if (processingFee && processingFee > 0 && shippingOptions.length > 0 && shippingOptions[0].shipping_rate_data) {
            const shippingRateData = shippingOptions[0].shipping_rate_data;
            shippingRateData.display_name = `${shippingRateData.display_name} + Processing Fee (3%)`;
        }

        const session = await (stripe.checkout.sessions.create as unknown as (params: Record<string, unknown>) => Promise<{
            client_secret?: string | null;
            id: string;
        }>)({
            ui_mode: 'embedded',
            line_items: lineItems,
            mode: 'payment',
            return_url: `${return_url}?session_id={CHECKOUT_SESSION_ID}`,
            shipping_address_collection: {
                allowed_countries: ['US'],
            },
            shipping_options: shippingOptions,
            billing_address_collection: 'required',
            metadata: {
                shipping_method: shippingMethod || 'standard',
                order_type: 'storefront',
                stripe_tax_rate_id: stripeSalesTaxRateId || '',
                ui_tax_amount: typeof taxAmount === 'number' ? taxAmount.toFixed(2) : '0.00',
            },
        });

        return NextResponse.json({
            clientSecret: session.client_secret,
            sessionId: session.id,
        });
    } catch (error) {
        console.error('Embedded checkout error:', error);
        const details = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to create embedded checkout session', details },
            { status: 500 },
        );
    }
}
