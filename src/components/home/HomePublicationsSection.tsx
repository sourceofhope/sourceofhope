import Title from "@/components/ui/Title";
import ExpressiveLink from "@/components/ui/ExpressiveLink";
import ExpressiveAnchor from "@/components/ui/ExpressiveAnchor";
import PageSection from "@/components/ui/PageSection";
import Carousel from "@/components/ui/Carousel";
import { client } from "@/lib/client";
import HighlightedText from "../ui/HighlightedText";

const ASSET_VERSION = "v2";

interface Publication {
  id: number;
  acf?: {
    title: string;
    date: string;
    summary: string;
    url: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      alt_text: string;
      source_url: string;
    }>;
  };
}

const PUBLICATION_QUERY = `
*[_type == "publication"] | order(date desc)[0...5] {
  "id": externalId,
  "acf": {
    "title": title,
    "date": date,
    "summary": summary,
    "url": url
  },
  "_embedded": {
    "wp:featuredmedia": [
      {
        "alt_text": featuredMedia.altText,
        "source_url": featuredMedia.sourceUrl
      }
    ]
  }
}
`;

const options = { next: { revalidate: 30 } };

async function getPublications() {
  try {
    return await client.fetch<Publication[]>(PUBLICATION_QUERY, {}, options);
  } catch {
    return [];
  }
}

export default async function HomePublicationsSection() {
  const posts = await getPublications();

  return (
    <PageSection className="py-15 px-5 md:pb-0 lg:px-15 w-full">
      <div className="grid grid-flow-row md:grid-flow-col gap-8 items-center">
        <div className="flex flex-col gap-4 max-w-2xl">
          <HighlightedText className="w-fit self-center md:self-auto">
            <Title>LATEST UPDATES</Title>
          </HighlightedText>

          <p className="text-neutral-700 dark:text-neutral-900 text-balance">
            Stay connected with the latest stories, programs, and community
            impact from The Source of Hope.
          </p>

          <div className="w-fit">
            <ExpressiveLink to="/media" className="font-semibold">
              View All Publications
            </ExpressiveLink>
          </div>
        </div>

        {posts.length === 0 && (
          <p className="text-center text-neutral-500">No updates to display</p>
        )}

        {posts.length > 0 && (
          <Carousel auto showProgress itemsPerView={{ base: 1, md: 1, lg: 1 }}>
            {posts.map((post) => (
              <PublicationCard key={post.id} post={post} />
            ))}
          </Carousel>
        )}
      </div>
    </PageSection>
  );
}

function PublicationCard({ post }: { post: Publication }) {
  const image = post._embedded?.["wp:featuredmedia"]?.[0];
  const title = post.acf?.title || "Publication";
  const summary =
    post.acf?.summary ||
    "Stay connected with the latest stories, programs, and community impact from The Source of Hope.";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition duration-300">
      <div className="relative h-64 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image?.source_url || `/${ASSET_VERSION}/core/placeholder.webp`}
          alt={image?.alt_text || title}
          className="h-full w-full object-cover transition duration-500"
          loading="lazy"
          decoding="async"
        />

        {post.acf?.date && (
          <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {formatDate(post.acf.date)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="text-lg font-bold text-neutral-900">{title}</h3>

        <p className="line-clamp-3 text-sm leading-6 text-neutral-700">
          {summary}
        </p>

        <div className="mt-auto">
          {post.acf?.url ? (
            <ExpressiveAnchor href={post.acf.url} className="font-semibold">
              Read more
            </ExpressiveAnchor>
          ) : (
            <ExpressiveLink to="/media" className="font-semibold">
              Read more
            </ExpressiveLink>
          )}
        </div>
      </div>
    </article>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.toLocaleString("default", {
    month: "short",
  })} ${date.getDate()}, ${date.getFullYear()}`;
}
