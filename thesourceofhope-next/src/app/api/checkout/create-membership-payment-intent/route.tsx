import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment';
import Stripe from 'stripe';

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

const membershipProducts: Record<MembershipPlanId, { id: string; name: string; description: string }> = {
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
    },
    partner: {
        id: 'prod_membership_partner',
        name: 'Company Partner',
        description: 'Company Partner - Monthly partnership sustaining community outreach and program operations',
    },
    sponsor: {
        id: 'prod_membership_sponsor',
        name: 'Program Sponsor',
        description: 'Program Sponsor - Monthly partnership expanding capacity and strengthening sustained service',
    },
    champion: {
        id: 'prod_membership_champion',
        name: 'Impact Champion',
        description: 'Impact Champion - Monthly partnership underwriting major mission work across programs',
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
        const { stripeSecretKey } = getEnvironment();

        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 });
        }

        const stripe = new Stripe(stripeSecretKey, { apiVersion: '2022-11-15' } as any);
        const body = (await request.json()) as MembershipRequestBody;
        const {
            membershipPlanId,
            membershipType,
            amount,
            firstName,
            lastName,
            companyName,
            contactName,
            companyInfo,
            email,
            phone,
        } = body;

        const isCompanyMembership = membershipType === 'company';

        // Validate required fields
        if (!membershipType || !amount || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

        const productConfig = membershipProducts[membershipPlanId as MembershipPlanId];
        if (!productConfig) {
            return NextResponse.json({ error: 'Invalid membership type' }, { status: 400 });
        }

        const membershipName = productConfig.name;

        // Find or create customer
        let customer;
        const existingCustomers = await (stripe.customers.search as any)({
            query: `email:"${email}"`,
            limit: 1,
        });

        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
            // Update customer info
            customer = await stripe.customers.update(customer.id, {
                name: isCompanyMembership ? companyName : `${firstName} ${lastName}`,
                phone: phone || undefined,
                metadata: {
                    membership_type: membershipType,
                    ...(isCompanyMembership
                        ? { contact_name: contactName, company_info: companyInfo || '' }
                        : {}),
                },
            });
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

        let price = prices.data.find(
            (p) => p.unit_amount === Math.round(amount * 100)
        );

        // If price doesn't exist, create it
        if (!price) {
            price = await stripe.prices.create({
                product: product.id,
                unit_amount: Math.round(amount * 100),
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
        const details = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                error: 'Failed to create membership subscription',
                details,
            },
            { status: 500 },
        );
    }
}