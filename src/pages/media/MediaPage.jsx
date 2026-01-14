import { CANONICAL_URL } from "../../routes";
import PageHeader from "../PageHeader";

import { Helmet } from "react-helmet";
import MediaNewsletterSection from "./sections/MediaNewsletterSection";
import MediaBlogPage from "./sections/MediaBlogSection";

export default function MediaPage() {
  return (
    <>
      <Helmet>
        <title>Media | The Source of Hope</title>
        <meta
          name="description"
          content="Explore The Source of Hope media hub featuring podcasts, radio shows, videos, press coverage, and stories highlighting our mission and community impact across Dallas–Fort Worth."
        />
        <link rel="canonical" href={CANONICAL_URL.media} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.media} />
        <meta property="og:title" content="Media | The Source of Hope" />
        <meta
          property="og:description"
          content="Watch, listen, and explore podcasts, radio segments, videos, and press coverage sharing the heart and impact of The Source of Hope."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.media} />
        <meta name="twitter:title" content="Media | The Source of Hope" />
        <meta
          name="twitter:description"
          content="Podcasts, radio shows, videos, and press stories sharing hope, healing, and community impact across DFW."
        />
      </Helmet>
      <PageHeader>
        <h2 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
          MEDIA
        </h2>
        <p className="font-semibold text-neutral-200 text-sm">
          OUR COMMUNITY CONTRIBUTION
        </p>
      </PageHeader>
      <MediaBlogPage />
      <MediaNewsletterSection />
    </>
  );
}
