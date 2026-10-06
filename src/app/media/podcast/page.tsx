import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/ui/PageSection";
import Title from "@/components/ui/Title";
import Heading from "@/components/ui/Heading";
import Blockquote from "@/components/ui/Blockquote";

export const metadata: Metadata = {
  title: "Podcasts & Radio | The Source of Hope",
  description:
    "Listen to The Source of Hope podcasts and radio programs featuring community stories, wellness conversations, nonprofit impact, and uplifting messages of hope across Dallas–Fort Worth and beyond.",
  openGraph: {
    type: "website",
    title: "Podcasts & Radio | The Source of Hope",
    description:
      "Explore The QC Show, Radio Saigon Dallas, and other Source of Hope podcasts sharing community stories, wellness insights, nonprofit impact, and messages of hope.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Podcasts & Radio | The Source of Hope",
    description:
      "Listen to inspiring podcasts and radio programs from The Source of Hope, sharing stories of healing, resilience, wellness, and community transformation.",
  },
};

export default function Podcast() {
  return (
    <>
      <PageHeader>
        <h1 className="font-urbanist text-xxxlg font-bold text-neutral-50">
          PODCASTS & RADIO
        </h1>
        <p className="text-sm font-semibold text-neutral-200 md:text-base">
          STORIES OF HOPE, WELLNESS, AND COMMUNITY IMPACT
        </p>
      </PageHeader>

      <PageSection className="justify-items-center grid relative m-0 text-sm md:text-md lg:text-lg">
        <article className="grid gap-5">
          <Title>The Quynh Chau Stone Show</Title>
          <p>
            The Source of Hope media page is a place to hear the heart behind
            our mission through podcast episodes, radio conversations, and
            community storytelling.
          </p>
          <p>
            Through these programs, listeners can learn more about our founder,
            our outreach, and the people and stories that continue to shape our
            work across the community.
          </p>
          <Blockquote className="border-accent-500 text-balance">
            Prefer podcasts? You can also listen to The QC Show on
            <span className="font-semibold"> Spotify</span>.
          </Blockquote>
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-neutral-700 md:text-md lg:text-lg"></div>
          <article className="grid gap-5 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm md:p-8">
            <div className="grid gap-3">
              <Heading>THE QC SHOW</Heading>
              <Title>The Quynh Chau Stone Show</Title>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
              <div className="overflow-hidden rounded-2xl bg-black shadow-lg">
                <iframe
                  data-testid="embed-iframe"
                  src="https://open.spotify.com/embed/show/4o2EoOQx3dyY6BAFrorBql?utm_source=generator&theme=0"
                  width="100%"
                  height="352"
                  className="w-full"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="The QC Show on Spotify"
                />
              </div>

              <div className="grid gap-5 text-sm leading-relaxed text-neutral-700 md:text-md">
                <p>
                  Hear powerful testimonies, stay updated on monthly and
                  quarterly initiatives, and discover how your support creates
                  tangible change for families, students, seniors, veterans, and
                  first responders throughout the DFW community.
                </p>

                <p>
                  Each episode goes beyond announcements, sharing the heart of
                  our mission through thoughtful conversations, behind the
                  scenes moments, and real stories of hope. When you tune in,
                  you become part of a growing movement rooted in compassion,
                  resilience, and purpose.
                </p>

                <Blockquote className="border-accent-500 text-balance text-sm md:text-md">
                  Listen for conversations that highlight wellness, service, and
                  the real impact of community care.
                </Blockquote>
              </div>
            </div>
          </article>
          <article className="grid gap-6 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm md:p-8">
            <div className="grid gap-2">
              <Heading>RADIO</Heading>
              <Title>Radio Saigon Dallas</Title>
            </div>

            <div className="grid gap-8 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
              <div className="grid gap-5 text-sm leading-relaxed text-neutral-700 md:text-md">
                <p>
                  In partnership with
                  <span className="font-semibold">
                    {" "}
                    Stone International Wellness Center
                  </span>
                  , our founder
                  <span className="font-semibold"> Quỳnh Châu Stone</span> hosts
                  a weekly Vietnamese radio program centered on wellness,
                  encouragement, and uplifting stories from the community.
                </p>

                <Blockquote className="border-accent-500 text-balance text-sm md:text-md">
                  This program is hosted entirely in Vietnamese and currently
                  does not include English captions.
                </Blockquote>

                <p>
                  Each broadcast creates a welcoming space for listeners to
                  reconnect with culture, find hope, and receive practical
                  guidance for healthier living.
                </p>

                <div className="grid gap-2 rounded-2xl border border-neutral-200 bg-white p-5">
                  <p>
                    <span className="font-semibold">Thời gian phát sóng:</span>{" "}
                    Thứ Bảy hàng tuần, lúc 10 giờ sáng
                  </p>
                  <p>
                    <span className="font-semibold">Nghe qua điện thoại:</span>{" "}
                    213-493-0188
                  </p>
                  <p className="italic text-neutral-500">
                    Chương trình phát sóng bằng tiếng Việt
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl bg-black shadow-lg">
                <iframe
                  className="aspect-video w-full"
                  src="https://www.youtube-nocookie.com/embed/videoseries?si=CvRwYk4wRytxx-4s&amp;list=PLBMzNCNIF_VE0Wy2oMSEhQJINlek1FMvi"
                  title="Radio Saigon Dallas Playlist"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </article>
        </article>
      </PageSection>
    </>
  );
}
