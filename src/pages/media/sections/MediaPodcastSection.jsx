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
        our founder, and the lives we touch—through engaging video content,
        podcast episodes, and community storytelling. This page serves as a
        resource for consumers to learn about the organization through her
        interactive show called{" "}
        <span className="font-semibold">The QC Show!</span>
      </p>
      <article className="flex flex-col gap-10">
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
            <p>
              Prefer podcasts? The Source of Hope media is also available on
              <span className="font-semibold"> Spotify</span>, giving you a
              convenient way to stay connected, uplifted, and informed wherever
              life takes you. Our podcast series goes beyond simple updates — it
              shares the heart of our mission through meaningful conversations,
              behind-the-scenes stories, and powerful testimonies.
            </p>
            <p>
              By tuning in, you’re not just listening to a show — you’re joining
              a movement of compassion, hope, and purpose. Stay updated on
              monthly and quarterly initiatives, hear stories of resilience and
              transformation, and learn how your support makes a direct
              difference in the lives of families, students, seniors, veterans,
              and first responders across DFW.
            </p>
          </div>
        </div>
      </article>

      <article className="flex flex-col gap-10">
        <Heading>Radio Saigon Dallas</Heading>

        <div className="grid gap-10 md:grid-cols-2 items-center text-balance">
          <div className="flex gap-5 items-start">
            <p className="leading-relaxed">
              In partnership with{" "}
              <span className="font-semibold">
                Stone International Wellness Center
              </span>
              , our founder Quỳnh Châu Stone hosts a weekly Vietnamese radio
              show sharing wellness, community stories, and encouragement.
              <br />
              <br />
              <span className="font-semibold">Thời gian:</span> Thứ Bảy hàng
              tuần, 10 giờ sáng.
              <br />
              <span className="font-semibold">Nghe qua điện thoại:</span>{" "}
              213-493-0188
              <br />
              <span className="text-neutral-500 italic text-sm md:text-md">
                (Vietnamese Only)
              </span>
            </p>

            <img className="md:hidden rounded-2xl aspect-[9/16] bg-accent-900 w-44 shrink-0" />
          </div>

          <div className="flex flex-col sm:flex-row gap-5 items-center">
            <img className="hidden md:block rounded-2xl aspect-[9/16] bg-accent-900 w-33 shrink-0" />
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
