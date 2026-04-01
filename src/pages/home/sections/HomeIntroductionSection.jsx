import { useEffect, useRef, useState } from "react";
import { AnchorButton, LinkButton } from "../../../components/ui/Button";
import { ASSET_VERSION, CANONICAL } from "../../../routes";
import { HomeContent } from "../HomePage";

export default function HomeIntroductionSection() {
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef();

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    video.pause();
    video.currentTime = 0;

    const play = async () => {
      try {
        await video.play();
      } catch {}
    };

    play();
  }, []);

  return (
    <HomeContent className="relative flex mb-10 h-[80vh] md:min-h-screen">
      <div
        className="absolute inset-0 z-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, white 80%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, white 80%, transparent 100%)",
        }}>
        <img
          src={`/${ASSET_VERSION}/core/TSOH-Poster.webp`}
          alt="The Source of Hope community impact"
          className="h-full w-full object-cover brightness-75"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
        />
        {!videoFailed && (
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover brightness-75 opacity-0 transition-opacity duration-700"
              onCanPlayThrough={() =>
                videoRef.current.classList.add("opacity-100")
              }
              onError={() => setVideoFailed(true)}>
              <source
                src={`/${ASSET_VERSION}/core/TSOH-Poster.webm`}
                type="video/webm"
              />
            </video>
          </div>
        )}
      </div>
      <div className="relative z-10 w-full max-w-[80ch] md:max-w-[90ch] self-end grid gap-3 p-5 md:pb-15 lg:px-35">
        <h2 className="text-neutral-50 font-urbanist text-md md:text-lg font-semibold">
          THE SOURCE OF HOPE
        </h2>
        <h2 className="text-neutral-50 font-urbanist text-md md:text-xlg font-bold line-clamp-2">
          EMPOWERING AND PROVIDING HOPE THROUGH HEALTH AND WELLNESS
        </h2>
        <p className="hidden md:block text-neutral-300 text-justify text-sm">
          We are a non-profit organization dedicated to providing holistic
          health and wellness, education, and support to individuals in need.
          Our team of volunteers is committed to serving the DFW community,
          including at-risk families, veterans, and first responders. Your
          donation helps us ensure that those in need have access to health,
          safety, and resources to live healthier, fulfilling lives.
        </p>
        <div className="flex gap-5 flex-col md:flex-row">
          <div className="w-fit">
            <AnchorButton
              className="w-fit"
              href="https://donate.stripe.com/8wM5kHal16fC4so8ww"
              text="DONATE"
            />
          </div>
          <div className="w-fit">
            <LinkButton
              className="w-fit"
              to={CANONICAL.about.absolute}
              text="OUR MISSION"
              ariaLabel="Learn more about The Source of Hope nonprofit organization and its mission"
            />
          </div>
        </div>
      </div>
    </HomeContent>
  );
}
