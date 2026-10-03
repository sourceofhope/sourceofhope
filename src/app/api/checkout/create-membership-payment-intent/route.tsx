import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment.server';
import Stripe from 'stripe';
import { rateLimit } from '@/lib/rate-limit';

type MembershipPlanId = 'bronze' | 'silver' | 'gold' | 'individual' | 'partner' | 'sponsor' | 'champion';

type MembershipRequestBody = {
    membershipPlanId?: MembershipPlanId;
    membershipType?: string;
    amount?: number;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    contactName?: string;
    companyInfo?: string;
    email?: string;
    phone?: string;
};

type MembershipProduct = {
    id: string;
    name: string;
    description: string;
    /**
     * Fixed monthly price in cents. `null` means the member chooses the
     * amount (individual plan); `undefined` means the plan is not currently
     * offered and cannot be purchased.
     */
    priceCents?: number | null;
};

// Must match the prices shown in MembersPlansSection.
const INDIVIDUAL_MIN_CENTS = 100;
const INDIVIDUAL_MAX_CENTS = 1_000_000;
const EMAIL_PATTERN = /^[^\s@<>"\\]{1,64}@[^\s@<>"\\]{1,255}\.[^\s@<>"\\]+$/;

function asString(value: unknown, maxLength: number): string | undefined {
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

const membershipProducts: Record<MembershipPlanId, MembershipProduct> = {
    bronze: {
        id: 'prod_membership_bronze',
        name: 'Hope Advocate [Bronze Pin]',
        description: 'Bronze tier membership - Monthly recurring subscription providing community impact support',
    },
    silver: {
        id: 'prod_membership_silver',
        name: 'Hope Professional [Silver Pin]',
        description: 'Silver tier membership - Monthly recurring subscription for professional partners',
    },
    gold: {
        id: 'prod_membership_gold',
        name: 'Hope Enterprise Partner [Gold Pin]',
        description: 'Gold tier membership - Monthly recurring subscription for enterprise partnerships',
    },
    individual: {
        id: 'prod_membership_individual',
        name: 'Monthly Individual Support',
        description: 'Individual monthly support - Recurring gift sustaining meals, wellness care, and education programs',
        priceCents: null,
    },
    partner: {
        id: 'prod_membership_partner',
        name: 'Company Partner',
        description: 'Company Partner - Monthly partnership sustaining community outreach and program operations',
        priceCents: 5_000,
    },
    sponsor: {
        id: 'prod_membership_sponsor',
        name: 'Program Sponsor',
        description: 'Program Sponsor - Monthly partnership expanding capacity and strengthening sustained service',
        priceCents: 10_000,
    },
    champion: {
        id: 'prod_membership_champion',
        name: 'Impact Champion',
        description: 'Impact Champion - Monthly partnership underwriting major mission work across programs',
        priceCents: 50_000,
    },
};

/**
 * Create a membership subscription with Stripe
 * POST /api/checkout/create-membership-payment-intent
 */
export async function GET() {
    return NextResponse.json({
        message: 'Membership payment intent endpoint is available. Use POST to create a subscription.',
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
        const limited = rateLimit(request, 'membership', 5, 10 * 60 * 1000);
        if (limited) return limited;

        const { stripeSecretKey } = getEnvironment();

        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 });
        }

        const stripe = new Stripe(stripeSecretKey, { apiVersion: '2022-11-15' } as any);
        const body = (await request.json()) as MembershipRequestBody;
        const membershipPlanId = body.membershipPlanId;
        const membershipType = body.membershipType === 'company' ? 'company' : 'individual';
        const firstName = asString(body.firstName, 100);
        const lastName = asString(body.lastName, 100);
        const companyName = asString(body.companyName, 200);
        const contactName = asString(body.contactName, 200);
        const companyInfo = asString(body.companyInfo, 450);
        const email = asString(body.email, 254);
        const phone = asString(body.phone, 30);

        const isCompanyMembership = membershipType === 'company';

        // Validate required fields
        if (!email || !EMAIL_PATTERN.test(email)) {
            return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
        }
        if (isCompanyMembership && (!companyName || !contactName)) {
            return NextResponse.json(
                { error: 'Company name and contact name are required' },
                { status: 400 },
            );
        }
        if (!isCompanyMembership && (!firstName || !lastName)) {
            return NextResponse.json(
                { error: 'First name and last name are required' },
                { status: 400 },
            );
        }

        const productConfig = Object.hasOwn(membershipProducts, membershipPlanId ?? '')
            ? membershipProducts[membershipPlanId as MembershipPlanId]
            : undefined;
        if (!productConfig || productConfig.priceCents === undefined) {
            return NextResponse.json({ error: 'Invalid membership type' }, { status: 400 });
        }

        // Fixed-price plans always charge their listed price; only the
        // individual plan lets the member choose an amount.
        let unitAmountCents: number;
        if (productConfig.priceCents === null) {
            unitAmountCents = Math.round(Number(body.amount) * 100);
            if (
                !Number.isFinite(unitAmountCents) ||
                unitAmountCents < INDIVIDUAL_MIN_CENTS ||
                unitAmountCents > INDIVIDUAL_MAX_CENTS
            ) {
                return NextResponse.json({ error: 'Invalid membership amount' }, { status: 400 });
            }
        } else {
            unitAmountCents = productConfig.priceCents;
        }

        const membershipName = productConfig.name;

        // Find or create customer. Existing customer records are reused but
        // never overwritten, since this endpoint is unauthenticated.
        let customer;
        const existingCustomers = await stripe.customers.list({
            email,
            limit: 1,
        });

        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
        } else {
            customer = await stripe.customers.create({
                email,
                name: isCompanyMembership ? companyName : `${firstName} ${lastName}`,
                phone: phone || undefined,
                metadata: {
                    membership_type: membershipType,
                    ...(isCompanyMembership
                        ? { contact_name: contactName, company_info: companyInfo || '' }
                        : {}),
                },
            });
        }

        // Check if the product exists or create it
        let product;
        try {
            product = await stripe.products.retrieve(productConfig.id);
        } catch (retrieveErr) {
            // Product doesn't exist, try to create it
            try {
                product = await stripe.products.create({
                    id: productConfig.id,
                    name: productConfig.name,
                    description: productConfig.description,
                    metadata: {
                        type: 'membership',
                        membership_type: membershipType,
                    },
                });
            } catch (createErr) {
                // If product already exists (race condition), retrieve it
                const code = (createErr as any).code;
                if (code === 'resource_already_exists') {
                    product = await stripe.products.retrieve(productConfig.id);
                } else {
                    throw createErr;
                }
            }
        }

        // Search for existing price for this product
        const prices = await stripe.prices.list({
            product: product.id,
            recurring: { interval: 'month' },
            active: true,
            limit: 10,
        });

        let price = prices.data.find((p) => p.unit_amount === unitAmountCents);

        // If price doesn't exist, create it
        if (!price) {
            price = await stripe.prices.create({
                product: product.id,
                unit_amount: unitAmountCents,
                currency: 'usd',
                recurring: {
                    interval: 'month',
                },
                metadata: {
                    membership_type: membershipType,
                },
            });
        }

        // Create the subscription
        const subscriptionMetadata: Record<string, string> = isCompanyMembership
            ? {
                  membership_type: membershipType,
                  membership_name: membershipName,
                  company_name: companyName || '',
                  contact_name: contactName || '',
                  company_info: companyInfo || '',
                  contact_email: email,
                  contact_phone: phone || '',
              }
            : {
                  membership_type: membershipType,
                  membership_name: membershipName,
                  customer_name: `${firstName} ${lastName}`,
                  customer_email: email,
                  customer_phone: phone || '',
              };

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [
                {
                    price: price.id,
                },
            ],
            payment_behavior: 'default_incomplete',
            payment_settings: {
                payment_method_types: ['card'],
                save_default_payment_method: 'on_subscription',
            },
            expand: ['latest_invoice.payment_intent'],
            metadata: subscriptionMetadata,
        } as any);

        const paymentIntent = (subscription.latest_invoice as any).payment_intent;

        // Propagate metadata to the PaymentIntent so it appears on the Stripe dashboard transaction view
        await stripe.paymentIntents.update(paymentIntent.id, {
            metadata: subscriptionMetadata,
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            subscriptionId: subscription.id,
            customerId: customer.id,
            invoiceId: (subscription.latest_invoice as any).id,
        });
    } catch (error) {
        console.error('Membership subscription creation error:', error);
        return NextResponse.json(
            {
                error: 'Failed to create membership subscription',
            },
            { status: 500 },
        );
    }
}