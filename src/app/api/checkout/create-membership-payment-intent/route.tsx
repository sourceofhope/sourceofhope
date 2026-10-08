import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment';
import { enforceRateLimit } from '@/lib/rate-limit';
import {
    MAX_EMAIL_LENGTH,
    MAX_NAME_LENGTH,
    isValidEmail,
    parseAmount,
    readJsonObject,
    readString,
    toMetadataValue,
} from '@/lib/validation';
import Stripe from 'stripe';

// 5 subscription attempts per IP per 10 minutes.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

// Bounds for the individual plan's custom monthly amount, in dollars.
const MIN_CUSTOM_MONTHLY_AMOUNT = 1;
const MAX_CUSTOM_MONTHLY_AMOUNT = 10_000;

type MembershipPlanId = 'individual' | 'partner' | 'sponsor' | 'champion';

type MembershipPlan = {
    id: string;
    name: string;
    description: string;
    membershipType: 'individual' | 'company';
    // Fixed monthly price in dollars; must match MembersPlansSection. Omitted for custom amounts.
    monthlyAmount?: number;
};

const membershipProducts: Record<MembershipPlanId, MembershipPlan> = {
    individual: {
        id: 'prod_membership_individual',
        name: 'Monthly Individual Support',
        description: 'Individual monthly support - Recurring gift sustaining meals, wellness care, and education programs',
        membershipType: 'individual',
    },
    partner: {
        id: 'prod_membership_partner',
        name: 'Company Partner',
        description: 'Company Partner - Monthly partnership sustaining community outreach and program operations',
        membershipType: 'company',
        monthlyAmount: 50,
    },
    sponsor: {
        id: 'prod_membership_sponsor',
        name: 'Program Sponsor',
        description: 'Program Sponsor - Monthly partnership expanding capacity and strengthening sustained service',
        membershipType: 'company',
        monthlyAmount: 100,
    },
    champion: {
        id: 'prod_membership_champion',
        name: 'Impact Champion',
        description: 'Impact Champion - Monthly partnership underwriting major mission work across programs',
        membershipType: 'company',
        monthlyAmount: 500,
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
        const limited = enforceRateLimit(request, 'membership', RATE_LIMIT, RATE_WINDOW_MS);
        if (limited) return limited;

        const { stripeSecretKey } = getEnvironment();

        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 });
        }

        const stripe = new Stripe(stripeSecretKey, { apiVersion: '2022-11-15' } as any);
        const body = await readJsonObject(request);
        if (!body) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const membershipPlanId = body.membershipPlanId;
        const productConfig =
            typeof membershipPlanId === 'string' && Object.hasOwn(membershipProducts, membershipPlanId)
                ? membershipProducts[membershipPlanId as MembershipPlanId]
                : undefined;
        if (!productConfig) {
            return NextResponse.json({ error: 'Invalid membership type' }, { status: 400 });
        }

        // The plan, not the client, decides the membership type and (for company plans) the price.
        const membershipType = productConfig.membershipType;
        const isCompanyMembership = membershipType === 'company';
        const amount = productConfig.monthlyAmount ?? parseAmount(body.amount);

        const email = readString(body.email, MAX_EMAIL_LENGTH);
        const firstName = readString(body.firstName, MAX_NAME_LENGTH);
        const lastName = readString(body.lastName, MAX_NAME_LENGTH);
        const companyName = readString(body.companyName, MAX_NAME_LENGTH);
        const contactName = readString(body.contactName, MAX_NAME_LENGTH);
        const companyInfo = readString(body.companyInfo, 5000);
        const phone = readString(body.phone, 50);

        if (
            firstName === null ||
            lastName === null ||
            companyName === null ||
            contactName === null ||
            companyInfo === null ||
            phone === null
        ) {
            return NextResponse.json({ error: 'One or more fields are invalid or too long' }, { status: 400 });
        }

        // Validate required fields
        if (!amount || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        if (!isValidEmail(email)) {
            return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
        }
        if (amount < MIN_CUSTOM_MONTHLY_AMOUNT || amount > MAX_CUSTOM_MONTHLY_AMOUNT) {
            return NextResponse.json(
                { error: `Monthly amount must be between $${MIN_CUSTOM_MONTHLY_AMOUNT} and $${MAX_CUSTOM_MONTHLY_AMOUNT.toLocaleString('en-US')}` },
                { status: 400 },
            );
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

        const membershipName = productConfig.name;
        const amountCents = Math.round(amount * 100);
        const companyInfoMetadata = toMetadataValue(companyInfo);

        // Find or create customer (exact email match; no search-query string building)
        let customer;
        const existingCustomers = await stripe.customers.list({
            email,
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
                        ? { contact_name: contactName, company_info: companyInfoMetadata }
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
                        ? { contact_name: contactName, company_info: companyInfoMetadata }
                        : {}),
                },
            });
        }

        // Check if the product exists or create it
        let product;
        try {
            product = await stripe.products.retrieve(productConfig.id);
        } catch {
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
                const code = (createErr as { code?: string }).code;
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
            (p) => p.unit_amount === amountCents
        );

        // If price doesn't exist, create it
        if (!price) {
            price = await stripe.prices.create({
                product: product.id,
                unit_amount: amountCents,
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
                  company_name: companyName,
                  contact_name: contactName,
                  company_info: companyInfoMetadata,
                  contact_email: email,
                  contact_phone: phone,
              }
            : {
                  membership_type: membershipType,
                  membership_name: membershipName,
                  customer_name: `${firstName} ${lastName}`,
                  customer_email: email,
                  customer_phone: phone,
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
            invoiceId: (subscription.latest_invoice as any).id,
        });
    } catch (error) {
        console.error('Membership subscription creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create membership subscription' },
            { status: 500 },
        );
    }
}
