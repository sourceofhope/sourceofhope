import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Carousel from "../../components/ui/Carousel";
import PageSection from "../PageSection";
import Title from "../../components/ui/text/Title";
import { fetchContent, getFeaturedImage } from "../../cms";
import { ASSET_VERSION, CANONICAL_URL } from "../../routes";
import { Helmet } from "react-helmet-async";
import PageHeader from "../PageHeader";

export default function TeamPage() {
  return (
    <>
      <Helmet>
        <title>Team | The Source of Hope</title>
        <meta
          name="description"
          content="Learn about The Source of Hope’s mission to restore dignity and opportunity through food, education, and holistic wellness programs in Dallas–Fort Worth."
        />
        <link rel="canonical" href={CANONICAL_URL.about} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.about} />
        <meta property="og:title" content="About | The Source of Hope" />
        <meta
          property="og:description"
          content="Learn about The Source of Hope’s mission to restore dignity and opportunity through food, education, and holistic wellness programs in Dallas–Fort Worth."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.about} />
        <meta name="twitter:title" content="About | The Source of Hope" />
        <meta
          name="twitter:description"
          content="Learn about The Source of Hope’s mission to restore dignity and opportunity through food, education, and holistic wellness programs in Dallas–Fort Worth."
        />
      </Helmet>
      <PageHeader>
        <h2 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
          TEAM
        </h2>
        <p className="font-semibold text-neutral-200 text-sm">WHO WE ARE</p>
      </PageHeader>
      <PageSection className="pt-5">
        <div className="grid gap-5">
          <CarouselLayer
            title="Board of Executives"
            groupName="executiveBoard"
          />
          <CarouselLayer title="Board of Directors" groupName="directorBoard" />
          <CarouselLayer
            title="Interns Spring 2026"
            groupName="internSpring26"
          />
          <CarouselLayer title="Interns Fall 2025" groupName="internFall25" />
          <CarouselLayer
            title="Interns Summer 2025"
            groupName="internSummer25"
          />
          <CarouselLayer
            title="Advisory Spring 2025"
            groupName="advisorySpring25"
          />
          <CarouselLayer
            title="Interns Spring 2025"
            groupName="internSpring25"
          />
          <CarouselLayer title="Interns Fall 2024" groupName="internFall24" />
          <CarouselLayer
            title="Interns Summer 2024"
            groupName="internSummer24"
          />
          <CarouselLayer
            title="Interns Spring 2024"
            groupName="internSpring24"
          />
        </div>
      </PageSection>
    </>
  );
}

function CarouselLayer({ title, groupName, options = {} }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent(
      `/team-member?per_page=100&_embed&meta_key=team_group&meta_value=${encodeURIComponent(
        groupName
      )}`,
      options
    )
      .then((data) => {
        const filtered = data.filter(
          (member) => member.acf?.team_group === groupName
        );
        setPosts(filtered);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="grid gap-5">
      <Title>{title}</Title>
      <div
        className={`min-h-40 flex items-center ${
          loading ? "opacity-0" : "opacity-100 transition-opacity duration-750"
        }`}>
        {!loading && posts.length === 0 && (
          <p className="w-full text-center text-gray-500">
            No team members to display
          </p>
        )}
        {!loading && posts.length > 0 && (
          <Carousel itemsPerView={{ base: 1, md: 2, lg: 3 }} showProgress>
            {posts.map((post) => (
              <CarouselCard key={post.id} post={post} />
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
}

export function CarouselCard({ post }) {
  const [loaded, setLoaded] = useState(false);
  const image = getFeaturedImage(post);
  const memberSlug = post.slug || post.acf?.name?.toLowerCase().replace(/\s+/g, '-') || 'member';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-48 h-48 overflow-hidden rounded-lg border-[6px] border-white shadow-xl ring-1 ring-gray-200">
        <img
          src={
            image?.source_url ||
            `/${ASSET_VERSION}/core/Member-Placeholder.webp`
          }
          alt={image?.alt_text || ""}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-750 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-lg font-semibold text-neutral-900 text-center">
          {post.acf?.name}
        </h2>
        <h3 className="text-sm text-neutral-600 text-center">
          {post.acf?.title}
        </h3>
        <Link 
          to={`/about/team/${memberSlug}`}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
        >
          View bio →
        </Link>
      </div>
    </div>
  );
}
