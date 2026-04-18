import { NextResponse } from "next/server";
import { client } from "../../../../studio/client";

interface CheckoutProvider {
  id: string;
  providerId: string;
  name: string;
  description?: string;
  enabled: boolean;
  icon?: string;
}

const CHECKOUT_PROVIDERS_QUERY = `
*[_type == "checkoutProvider"] | order(name asc) {
  "id": _id,
  providerId,
  name,
  description,
  enabled,
  icon
}
`;

export async function GET() {
  try {
    const providers = await client.fetch<CheckoutProvider[]>(
      CHECKOUT_PROVIDERS_QUERY,
    );

    // Filter to only enabled providers
    const enabledProviders = providers.filter((provider) => provider.enabled);

    return NextResponse.json({
      success: true,
      data: enabledProviders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch checkout providers",
        details: message,
      },
      { status: 500 },
    );
  }
}
