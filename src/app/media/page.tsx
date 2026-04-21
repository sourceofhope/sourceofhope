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

export default async function Media() {
  const [posts, newsletters] = await Promise.all([
    fetchPublications(10) as Promise<MediaBlogPost[]>,
    fetchNewsletters(5) as Promise<MediaNewsletterPost[]>,
  ]);

  return (
    <>
      <PageHeader>
        <h2 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
          MEDIA
        </h2>
        <p className="font-semibold text-neutral-200 text-sm">
          OUR COMMUNITY CONTRIBUTION
        </p>
      </PageHeader>
      <MediaBlogPage posts={posts} />
      <MediaNewsletterSection newsletters={newsletters} />
    </>
  );
}
