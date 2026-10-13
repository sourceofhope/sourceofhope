import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import MediaBlogPage, {
  type MediaBlogPost,
} from "@/components/media/MediaBlogSection";
import MediaNewsletterSection, {
  type MediaNewsletterPost,
} from "@/components/media/MediaNewsletterSection";
import { fetchNewsletters, fetchPublications } from "@/lib/sanity-content";

export const metadata: Metadata = {
  title: "Media | The Source of Hope",
  description:
    "Explore The Source of Hope media hub featuring podcasts, radio shows, videos, press coverage, and stories highlighting our mission and community impact across Dallas–Fort Worth.",
  openGraph: {
    type: "website",
    title: "Media | The Source of Hope",
    description:
      "Watch, listen, and explore podcasts, radio segments, videos, and press coverage sharing the heart and impact of The Source of Hope.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Media | The Source of Hope",
    description:
      "Podcasts, radio shows, videos, and press stories sharing hope, healing, and community impact across DFW.",
  },
};

// Fall back to empty lists if the CMS is unreachable.
async function getMedia(): Promise<[MediaBlogPost[], MediaNewsletterPost[]]> {
  try {
    return await Promise.all([
      fetchPublications(10) as Promise<MediaBlogPost[]>,
      fetchNewsletters(5) as Promise<MediaNewsletterPost[]>,
    ]);
  } catch {
    return [[], []];
  }
}

export default async function Media() {
  const [posts, newsletters] = await getMedia();

  return (
    <>
      <PageHeader
        title="MEDIA"
        subtitle="OUR COMMUNITY CONTRIBUTION"
      />
      <MediaBlogPage posts={posts} />
      <MediaNewsletterSection newsletters={newsletters} />
    </>
  );
}
