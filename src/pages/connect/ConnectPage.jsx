import { CANONICAL_URL } from "../../routes";
import PageHeader from "../PageHeader";

import ConnectMapSection from "./sections/ConnectMapSection";
import ConnectVolunteerSection from "./sections/ConnectVolunteerSection";
import ConnectCareersSection from "./sections/ConnectCareersSection";

import { Helmet } from "react-helmet-async";

export default function ConnectPage() {
  return (
    <>
      <Helmet>
        <title>Connect | The Source of Hope</title>
        <meta
          name="description"
          content="Connect with The Source of Hope to volunteer, partner, donate, or stay engaged with our programs serving families, students, seniors, veterans, and first responders across DFW."
        />
        <link rel="canonical" href={CANONICAL_URL.connect} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.connect} />
        <meta property="og:title" content="Connect | The Source of Hope" />
        <meta
          property="og:description"
          content="Get involved with The Source of Hope through volunteering, partnerships, donations, and community programs making a real impact."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.connect} />
        <meta name="twitter:title" content="Connect | The Source of Hope" />
        <meta
          name="twitter:description"
          content="Volunteer, partner, donate, and stay connected with The Source of Hope's mission to serve and uplift our community."
        />
      </Helmet>
      <PageHeader>
        <h2 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
          CONNECT
        </h2>
        <p className="font-semibold text-neutral-200 text-sm">JOIN US TODAY</p>
      </PageHeader>
      <ConnectVolunteerSection />
      <ConnectMapSection />
      <ConnectCareersSection />
    </>
  );
}
