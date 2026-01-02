import { useEffect, useState } from "react";
import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/20/solid";

import Carousel from "../../../components/ui/Carousel";
import PageSection from "../../PageSection";
import Title from "../../../components/ui/text/Title";
import { fetchContent, getFeaturedImage } from "../../../cms";
import { createPortal } from "react-dom";
import { ASSET_VERSION } from "../../../routes";

export default function AboutTeamSection() {
  return (
    <PageSection className="pt-5">
      <div className="grid gap-5">
        <CarouselLayer title="Board of Executives" groupName="executiveBoard" />
        <CarouselLayer title="Board of Directors" groupName="directorBoard" />
        <CarouselLayer title="Interns Spring 2026" groupName="internSpring26" />
        <CarouselLayer title="Interns Fall 2025" groupName="internFall25" />
        <CarouselLayer title="Interns Summer 2025" groupName="internSummer25" />
        <CarouselLayer
          title="Advisory Spring 2025"
          groupName="advisorySpring25"
        />
        <CarouselLayer title="Interns Spring 2025" groupName="internSpring25" />
        <CarouselLayer title="Interns Fall 2024" groupName="internFall24" />
        <CarouselLayer title="Interns Summer 2024" groupName="internSummer24" />
        <CarouselLayer title="Interns Spring 2024" groupName="internSpring24" />
      </div>
    </PageSection>
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
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const image = getFeaturedImage(post);
  const overlayRoot = document.getElementById("root");

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
  }, [active]);

  return (
    <>
      <button
        onClick={() => setActive(true)}
        className="relative h-full min-h-[320px] w-full group overflow-hidden rounded-2xl aspect-square">
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
        <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/90 to-transparent rounded-b-2xl flex flex-col">
          <h2 className="md:line-clamp-1 text-md lg:group-hover:text-sm transition-all duration-750 font-semibold text-center text-neutral-50">
            {post.acf?.name}
          </h2>

          <h3 className="md:line-clamp-1 text-sm lg:group-hover:text-xs transition-all duration-750 font-semibold text-center text-neutral-300">
            {post.acf?.title}
          </h3>

          <p className="text-sm hidden lg:block text-gray-200 mt-2 max-h-0 opacity-0 overflow-hidden transition-[height_opacity] duration-750 group-hover:max-h-70 group-hover:opacity-100">
            {post.acf?.bio}
          </p>
        </div>

        <div className="absolute md:hidden right-5 top-5 p-1 rounded-full bg-black/70 text-neutral-50">
          <ArrowRightIcon className="w-4 h-4 transition-transform duration-750 group-hover:translate-x-0.5" />
        </div>
      </button>

      {createPortal(
        <section
          className={`fixed inset-0 z-50 flex items-end md:hidden bg-black/50 backdrop-blur-sm transition-all duration-750 ${
            active
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setActive(false)}>
          <article
            onClick={(e) => e.stopPropagation()}
            className={`w-full rounded-t-2xl bg-neutral-100 p-5 pb-10 shadow-2xl transform transition-all duration-750 ${
              active ? "translate-y-0" : "translate-y-full"
            }`}>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-neutral-900">
                  {post.acf?.name}
                </h2>
                <button
                  onClick={() => setActive(false)}
                  className="rounded-full p-2 hover:bg-neutral-200 transition-colors duration-750">
                  <XMarkIcon className="w-5 h-5 text-neutral-600" />
                </button>
              </div>
              <p className="text-sm leading-relaxed text-neutral-600">
                {post.acf?.bio}
              </p>
            </div>
          </article>
        </section>,
        overlayRoot
      )}
    </>
  );
}
