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
          <div className="flex flex-col gap-5">
            <p className="leading-relaxed text-neutral-700">
              Prefer podcasts? The Source of Hope media is also available on
              <span className="font-semibold"> Spotify</span>, offering a
              meaningful and convenient way to stay connected, encouraged, and
              informed—wherever life takes you. Each episode goes beyond
              announcements, sharing the heart of our mission through thoughtful
              conversations, behind-the-scenes moments, and real stories of
              hope.
            </p>

            <p className="leading-relaxed text-neutral-700">
              When you tune in, you’re not just listening—you’re becoming part
              of a growing movement rooted in compassion, resilience, and
              purpose. Hear powerful testimonies, stay updated on monthly and
              quarterly initiatives, and discover how your support creates
              tangible change for families, students, seniors, veterans, and
              first responders throughout the DFW community.
            </p>
          </div>
        </div>
      </article>

      <article className="flex flex-col gap-5">
        <Heading>Radio Saigon Dallas</Heading>
        <div className="grid gap-10 md:grid-cols-2 items-center text-balance">
          <div className="space-y-5 items-start">
            <p className="leading-relaxed text-neutral-700">
              In partnership with{" "}
              <span className="font-semibold">
                Stone International Wellness Center
              </span>
              , our founder{" "}
              <span className="font-semibold">Quỳnh Châu Stone</span> hosts a
              weekly Vietnamese radio program dedicated to wellness,
              encouragement, and uplifting stories from the community. Each
              broadcast creates a welcoming space for listeners to reconnect
              with culture, find hope, and receive practical guidance for
              healthier living.
            </p>
            <Blockquote className="border-accent-500 text-balance">
              Our podcast is hosted entirely in Vietnamese, without English
              captions available.
            </Blockquote>
            <p>
              <span className="font-semibold">Thời gian phát sóng:</span> Thứ
              Bảy hàng tuần, lúc 10 giờ sáng
              <br />
              <span className="font-semibold">Nghe qua điện thoại:</span>{" "}
              213-493-0188
              <br />
              <span className="text-neutral-500 italic text-sm md:text-md">
                Chương trình phát sóng bằng tiếng Việt
              </span>
            </p>
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
