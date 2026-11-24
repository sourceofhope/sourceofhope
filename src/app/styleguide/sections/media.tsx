import { LinkButton } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Marquee } from "@/components/ui/marquee";
import { VideoHero } from "@/components/ui/video-hero";
import { YouTubeEmbed } from "@/components/ui/youtube-embed";

const PHOTOS = [
  { src: "/v2/servingHope/Carousel-1.webp", alt: "Volunteers serving hot meals" },
  { src: "/v2/servingHope/Carousel-2.webp", alt: "Guests at a Serving Hope meal" },
  { src: "/v2/servingHope/Carousel-3.webp", alt: "Volunteers preparing food" },
  { src: "/v2/servingHope/Carousel-4.webp", alt: "A volunteer handing out a meal" },
];

// Placeholder sponsor logos until the real files arrive (spec §9.1).
const SPONSORS = ["Sponsor one", "Sponsor two", "Sponsor three", "Sponsor four", "Sponsor five", "Sponsor six"];

export function MediaSection() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Heading level={3} size="xl">
          VideoHero
        </Heading>
        <p className="max-w-prose text-muted">
          Full-bleed background video with text on top. Poster only for reduced motion, Data Saver and 2G. The pause button
          sits bottom right. The homepage adds the shrink-to-card scroll effect (slice 1.5).
        </p>
        <VideoHero
          className="rounded-lg"
          poster="/v2/core/TSOH-Poster.webp"
          sources={[
            { src: "/v2/core/TSOH-Hero-720.webm", type: "video/webm" },
            { src: "/v2/core/TSOH-Hero-720.mp4", type: "video/mp4" },
          ]}
        >
          <div className="flex min-h-96 flex-col items-start justify-end gap-4 p-8 md:p-12">
            <Heading level={4} size="4xl" surface="inverse">
              Empowering and providing hope through education, health, and wellness
            </Heading>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/styleguide#media" surface="inverse">
                Get Help
              </LinkButton>
              <LinkButton href="/styleguide#media" variant="secondary" surface="inverse">
                Volunteer
              </LinkButton>
            </div>
          </div>
        </VideoHero>
      </div>

      <div className="flex flex-col gap-3">
        <Heading level={3} size="xl">
          Marquee (sponsor strip)
        </Heading>
        <Marquee label="Our sponsors">
          {SPONSORS.map((name) => (
            // Real logos are images too, so the faded edges never hold live text.
            <Image key={name} src="/v2/core/placeholder.webp" alt={name} width={144} height={48} radius="md" className="h-12 w-36 object-cover" />
          ))}
        </Marquee>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Heading level={3} size="xl">
            Carousel
          </Heading>
          <Carousel label="Photos from Serving Hope">
            {PHOTOS.map((photo) => (
              <Image key={photo.src} src={photo.src} alt={photo.alt} width={800} height={500} radius="lg" className="aspect-video w-full object-cover" />
            ))}
          </Carousel>
        </div>
        <div className="flex flex-col gap-3">
          <Heading level={3} size="xl">
            YouTubeEmbed
          </Heading>
          <YouTubeEmbed id="K7WGjKoaqto" title="Education Hope" />
        </div>
      </div>
    </div>
  );
}
