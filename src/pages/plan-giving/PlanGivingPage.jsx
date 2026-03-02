import { Helmet } from "react-helmet-async";
import { CANONICAL_URL, ASSET_VERSION } from "../../routes";
import PageHeader from "../PageHeader";

import PlanGivingIntroSection from "./sections/PlanGivingIntroSection";
import PlanGivingFactsSection from "./sections/PlanGivingFactsSection";
import PlanGivingFaqSection from "./sections/PlanGivingFaqSection";
import PlanGivingContactSection from "./sections/PlanGivingContactSection";

export default function PlanGivingPage() {
  return (
    <>
      <Helmet>
        <title>Planned Giving | The Source of Hope</title>
        <meta
          name="description"
          content="Leave a lasting legacy with The Source of Hope through planned giving. Learn how bequests, trusts, and beneficiary designations can create transformational impact for generations to come."
        />
        <link rel="canonical" href={CANONICAL_URL.planGiving} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.planGiving} />
        <meta
          property="og:title"
          content="Planned Giving | The Source of Hope"
        />
        <meta
          property="og:description"
          content="Secure the future of The Source of Hope through planned giving. Discover how legacy gifts through wills, trusts, and retirement accounts create lasting impact in the DFW community."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.planGiving} />
        <meta
          name="twitter:title"
          content="Planned Giving | The Source of Hope"
        />
        <meta
          name="twitter:description"
          content="Leave a legacy of hope. Explore planned giving options with The Source of Hope and ensure your values live on for generations."
        />
      </Helmet>

      <PageHeader src={`/${ASSET_VERSION}/core/TSOH-Family.webp`}>
        <h2 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
          PLANNED GIVING
        </h2>
        <p className="font-semibold text-neutral-200 text-sm">
          LEAVE A LASTING LEGACY
        </p>
      </PageHeader>

      <PlanGivingIntroSection />
      <PlanGivingFactsSection />
      <PlanGivingFaqSection />
      <PlanGivingContactSection />
    </>
  );
}
