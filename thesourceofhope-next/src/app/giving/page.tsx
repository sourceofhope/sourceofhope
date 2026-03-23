import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import GivingIntroSection from "@/components/giving/GivingIntroSection";
import GivingFactsSection from "@/components/giving/GivingFactsSection";
import GivingFAQSection from "@/components/giving/GivingFAQSection";
import GivingContactSection from "@/components/giving/GivingContactSection";

export const metadata: Metadata = {
  title: "Planned Giving | The Source of Hope",
  description:
    "Leave a lasting legacy with The Source of Hope through planned giving. Learn how bequests, trusts, and beneficiary designations can create transformational impact for generations to come.",
  openGraph: {
    type: "website",
    title: "Planned Giving | The Source of Hope",
    description:
      "Secure the future of The Source of Hope through planned giving. Discover how legacy gifts through wills, trusts, and retirement accounts create lasting impact in the DFW community.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Planned Giving | The Source of Hope",
    description:
      "Leave a legacy of hope. Explore planned giving options with The Source of Hope and ensure your values live on for generations.",
  },
};

export default function GivingPage() {
  return (
    <>
      <PageHeader src="/v2/core/TSOH-Family.webp">
        <h2 className="font-bold text-neutral-50 text-4xl md:text-5xl">
          PLANNED GIVING
        </h2>
        <p className="font-semibold text-neutral-200 text-sm">
          LEAVE A LASTING LEGACY
        </p>
      </PageHeader>

      <GivingIntroSection />
      <GivingFactsSection />
      <GivingFAQSection />
      <GivingContactSection />
    </>
  );
}
