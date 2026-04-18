import { NextResponse } from "next/server";
import { fetchCheckoutProviders } from "@/lib/sanity-content";

export async function GET() {
  try {
    const providers = await fetchCheckoutProviders();

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
