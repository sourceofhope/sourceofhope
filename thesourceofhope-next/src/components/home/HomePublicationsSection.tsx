import Title from "@/components/ui/Title";
import ExpressiveLink from "@/components/ui/ExpressiveLink";
import PageSection from "@/components/ui/PageSection";

const ASSET_VERSION = "v2";

interface PublicationProps {
  title: string;
  category: string;
  image: string;
  link: string;
}

function PublicationCard({ title, category, image, link }: PublicationProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-lg overflow-hidden bg-neutral-900 text-neutral-50 hover:shadow-lg transition"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <span className="text-xs font-semibold text-accent-300 uppercase">
          {category}
        </span>
        <h3 className="font-urbanist font-bold text-lg line-clamp-2">
          {title}
        </h3>
      </div>
    </a>
  );
}

export default function HomePublicationsSection() {
  return (
    <PageSection className="py-15 px-5 lg:px-35 w-full bg-neutral-900 text-neutral-50">
      <div className="flex flex-col gap-10">
        <div className="text-center">
          <Title className="text-2xl md:text-3xl text-neutral-50 mb-3">
            Featured Publications
          </Title>
          <p className="text-neutral-300 max-w-2xl mx-auto">
            Explore our stories, publications, and media coverage to learn more
            about our impact and mission.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PublicationCard
            title="Our Latest Blog Post"
            category="Blog"
            image={`/${ASSET_VERSION}/core/TSOH-Poster.webp`}
            link="/media"
          />
          <PublicationCard
            title="Podcast Series"
            category="Podcast"
            image={`/${ASSET_VERSION}/core/TSOH-Service.webp`}
            link="/media/podcast"
          />
          <PublicationCard
            title="Press Coverage"
            category="Press"
            image={`/${ASSET_VERSION}/core/TSOH-Family.webp`}
            link="/media/press"
          />
        </div>
        <div className="text-center pt-5">
          <ExpressiveLink to="/media" className="text-lg">
            View All Publications
          </ExpressiveLink>
        </div>
      </div>
    </PageSection>
  );
}
