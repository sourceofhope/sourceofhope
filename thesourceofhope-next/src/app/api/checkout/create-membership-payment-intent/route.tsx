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

        const stripe = new Stripe(stripeSecretKey, { apiVersion: '2020-08-27' });
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

        if (!membershipPlanId || !(membershipPlanId in membershipProducts)) {
            return NextResponse.json({ error: 'Invalid membership type' }, { status: 400 });
        }

        const productConfig = membershipProducts[membershipPlanId];
        const membershipName = productConfig.name;

        const customerMetadata = {
            membership_type: membershipType,
            ...(isCompanyMembership ? { contact_name: contactName || '', company_info: companyInfo || '' } : {}),
        };

        const existingCustomers = await stripe.customers.list({
            email,
            limit: 1,
        });

        let customer: Stripe.Customer;
        if (existingCustomers.data.length > 0) {
            customer = await stripe.customers.update(existingCustomers.data[0].id, {
                name: isCompanyMembership ? companyName : `${firstName} ${lastName}`,
                phone: phone || undefined,
                metadata: customerMetadata,
            });
        } else {
            customer = await stripe.customers.create({
                email,
                name: isCompanyMembership ? companyName : `${firstName} ${lastName}`,
                phone: phone || undefined,
                metadata: customerMetadata,
            });
        }

        let product: Stripe.Product;
        try {
            product = await stripe.products.retrieve(productConfig.id) as Stripe.Product;
        } catch {
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
            } catch (createError) {
                const code = typeof createError === 'object' && createError && 'code' in createError
                    ? String((createError as { code?: string }).code)
                    : '';
                if (code === 'resource_already_exists') {
                    product = await stripe.products.retrieve(productConfig.id) as Stripe.Product;
                } else {
                    throw createError;
                }
            }
        }

        const prices = await stripe.prices.list({
            product: product.id,
            active: true,
            limit: 10,
        });

        let price = prices.data.find((entry) => {
            return entry.unit_amount === Math.round(amount * 100) && entry.recurring?.interval === 'month';
        });

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

        const subscriptionMetadata: Record<string, string> = {
            membership_type: membershipType,
            membership_name: membershipName,
        };

        if (isCompanyMembership) {
            subscriptionMetadata.company_name = companyName || '';
            subscriptionMetadata.contact_name = contactName || '';
            subscriptionMetadata.company_info = companyInfo || '';
            subscriptionMetadata.contact_email = email;
            subscriptionMetadata.contact_phone = phone || '';
        } else {
            subscriptionMetadata.customer_name = `${firstName} ${lastName}`;
            subscriptionMetadata.customer_email = email;
            subscriptionMetadata.customer_phone = phone || '';
        }

        const subscription = await (stripe.subscriptions.create as unknown as (params: Record<string, unknown>) => Promise<{
            id: string;
            customer: string;
            latest_invoice?: {
                id: string;
                payment_intent?: {
                    id: string;
                    client_secret?: string | null;
                } | string | null;
            } | string | null;
        }>)({
            customer: customer.id,
            items: [{ price: price.id }],
            payment_behavior: 'default_incomplete',
            payment_settings: {
                payment_method_types: ['card'],
                save_default_payment_method: 'on_subscription',
            },
            expand: ['latest_invoice.payment_intent'],
            metadata: subscriptionMetadata,
        });

        const latestInvoice = typeof subscription.latest_invoice === 'string' || !subscription.latest_invoice
            ? null
            : subscription.latest_invoice;
        const paymentIntent = latestInvoice && latestInvoice.payment_intent && typeof latestInvoice.payment_intent !== 'string'
            ? latestInvoice.payment_intent
            : null;

        if (!latestInvoice?.id || !paymentIntent?.id) {
            throw new Error('Stripe did not return an invoice payment intent');
        }

        await stripe.paymentIntents.update(paymentIntent.id, {
            metadata: subscriptionMetadata,
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            subscriptionId: subscription.id,
            customerId: customer.id,
            invoiceId: latestInvoice.id,
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