import { Metadata } from "next";
import HomeIntroductionSection from "@/components/home/HomeIntroductionSection";
import HomeMissionSection from "@/components/home/HomeMissionSection";
import HomeImpactSection from "@/components/home/HomeImpactSection";
import HomeResourcesSection from "@/components/home/HomeResourcesSection";
import HomeServingSection from "@/components/home/HomeServingSection";
import HomeDonationSection from "@/components/home/HomeDonationSection";
import HomePublicationsSection from "@/components/home/HomePublicationsSection";

export const metadata: Metadata = {
  title: "Home | The Source of Hope",
  description:
    "The Source of Hope is a nonprofit organization providing food, education, and holistic wellness to individuals and families across the DFW area.",
  openGraph: {
    type: "website",
    url: "https://thesourceofhope.org",
    title: "Home | The Source of Hope",
    description:
      "Join The Source of Hope to make a lasting impact through food, education, and wellness programs in the Dallas-Fort Worth community.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | The Source of Hope",
    description:
      "Join The Source of Hope to make a lasting impact through food, education, and wellness programs in the Dallas-Fort Worth community.",
  },
};

export default async function Home() {
  return (
    <>
      <HomeIntroductionSection />
      <HomeMissionSection />
      <HomeImpactSection />
      <HomeResourcesSection />
      <HomeServingSection />
      <HomeDonationSection />
      <HomePublicationsSection />
    </>
  );
}
