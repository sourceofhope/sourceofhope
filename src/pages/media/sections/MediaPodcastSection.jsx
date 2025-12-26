import Blockquote from "../../../components/ui/text/Blockquote";
import Heading from "../../../components/ui/text/Heading";
import Title from "../../../components/ui/text/Title";
import PageSection from "../../PageSection";

export default function MediaPodcastSection() {
  return (
    <PageSection className="grid gap-5 relative m-0 text-sm md:text-md lg:text-lg">
      <Title>The Quyhn Chau Stone Show</Title>
      <p>
        At The Source of Hope, we are dedicated to empowering communities and
        fighting hunger through a variety of impactful initiatives. The Source
        of Hope media page is your gateway to learning more about our mission,
        our founder, and the lives we touch.
      </p>
      <Blockquote className="border-accent-500 text-balance">
        Prefer podcasts? The Source of Hope media is also available on
        <span className="font-semibold"> Spotify</span>.
      </Blockquote>
      <p>
        We use engaging video content, podcast episodes, and community
        storytelling. This page serves as a resource for consumers to learn
        about the organization through her interactive show called{" "}
        <span className="font-semibold">The QC Show!</span>
      </p>
      <article className="flex flex-col gap-5">
        <Heading>Listen on Spotify</Heading>
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <iframe
            data-testid="embed-iframe"
            src="https://open.spotify.com/embed/show/4o2EoOQx3dyY6BAFrorBql?utm_source=generator&theme=0"
            width="100%"
            height="352"
            className="rounded-2xl shadow-lg"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"></iframe>
          <div className="flex flex-col gap-5 leading-relaxed text-balance">
            <p>
              Hear powerful testimonies, stay updated on monthly and quarterly
              initiatives, and discover how your support creates tangible change
              for families, students, seniors, veterans, and first responders
              throughout the DFW community. hope.
            </p>
            <p>
              Each episode goes beyond announcements, sharing the heart of our
              mission through thoughtful conversations, behind-the-scenes
              moments, and real stories of hope. When you tune in, you’re not
              just listening—you’re becoming part of a growing movement rooted
              in compassion, resilience, and purpose.
            </p>
          </div>
        </div>
      </article>
      <article className="flex flex-col gap-5">
        <Heading>Radio Saigon Dallas</Heading>
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <div className="space-y-5 items-start">
            <p className="leading-relaxed">
              In partnership with{" "}
              <span className="font-semibold">
                Stone International Wellness Center
              </span>
              , our founder{" "}
              <span className="font-semibold">Quỳnh Châu Stone</span> hosts a
              weekly Vietnamese radio program dedicated to wellness,
              encouragement, and uplifting stories from the community.
            </p>
            <Blockquote className="border-accent-500 text-balance text-sm md:text-md">
              Our podcast is hosted entirely in Vietnamese, without English
              captions available.
            </Blockquote>
            <p>
              Each broadcast creates a welcoming space for listeners to
              reconnect with culture, find hope, and receive practical guidance
              for healthier living.
            </p>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-sm md:text-md space-y-1">
              <p>
                <span className="font-semibold">Thời gian phát sóng:</span> Thứ
                Bảy hàng tuần, lúc 10 giờ sáng
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

          <div className="flex flex-col sm:flex-row gap-5 items-center">
            <iframe
              className="rounded-2xl aspect-video w-full shadow-lg h-fit"
              src="https://www.youtube-nocookie.com/embed/videoseries?si=CvRwYk4wRytxx-4s&amp;list=PLBMzNCNIF_VE0Wy2oMSEhQJINlek1FMvi"
              title="Radio Saigon Dallas Playlist"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowFullScreen></iframe>
          </div>
        </div>
      </article>
    </PageSection>
  );
}
