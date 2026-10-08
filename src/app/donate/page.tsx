import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import DonateFormSection from "@/components/donate/DonateFormSection";
import { ASSET_VERSION } from "@/lib/environment";

const CANONICAL_URL = "https://thesourceofhope.org/donate";

export const metadata: Metadata = {
  title: "Donate | The Source of Hope",
  description:
    "Make a one-time, tax-deductible donation to The Source of Hope to support meals, wellness care, education, and community outreach across Dallas–Fort Worth.",
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    type: "website",
    url: CANONICAL_URL,
    title: "Donate | The Source of Hope",
    description:
      "Your gift supports meals, wellness care, education, and community outreach programs right here in our community.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Donate | The Source of Hope",
    description:
      "Make a one-time donation to support The Source of Hope's programs across DFW.",
  },
};

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_status?: string | string[] }>;
}) {
  const { redirect_status } = await searchParams;

  return (
    <>
      <PageHeader
        src={`/${ASSET_VERSION}/servingHope/Carousel-3.webp`}
        title="DONATE"
        subtitle="EVERY GIFT MAKES A DIFFERENCE"
      />
      <DonateFormSection redirectSucceeded={redirect_status === "succeeded"} />
    </>
  );
}
