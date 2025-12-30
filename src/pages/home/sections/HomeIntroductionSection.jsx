import { useState } from "react";
import { AnchorButton, LinkButton } from "../../../components/ui/Button";
import { CANONICAL_URL } from "../../../routes";
import { HomeContent } from "../HomePage";

export default function HomeIntroductionSection() {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <HomeContent className="relative flex mb-10 h-[80vh] md:min-h-screen">
      {!videoFailed && (
        <video
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline
          preload="auto"
          disablePictureInPicture
          onError={() => setVideoFailed(true)}
          poster="/core/TSOH-Poster.jpg"
          className="absolute inset-0 z-0 h-full w-full object-cover brightness-75"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, white 70%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, white 70%, transparent 100%)",
          }}>
          <source src="/core/TSOH-Poster.mp4" type="video/mp4" />
        </video>
      )}

      {videoFailed && (
        <img
          src="/core/TSOH-Poster.jpg"
          alt="TSOH Poster"
          className="absolute inset-0 z-0 h-full w-full object-cover brightness-75"
        />
      )}
      <div className="relative z-10 w-full max-w-[75ch] md:max-w-[85ch] self-end grid gap-3 p-5 md:pb-15 lg:px-35">
        <h2 className="text-neutral-50 font-urbanist text-md md:text-lg font-semibold">
          THE SOURCE OF HOPE
        </h2>
        <h2 className="text-neutral-50 font-urbanist text-lg md:text-xlg font-bold">
          EMPOWERING AND PROVIDING THROUGH HEALTH AND WELLNESS
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
              to={CANONICAL_URL.about}
              text="OUR MISSION"
              ariaLabel="Learn more about The Source of Hope nonprofit organization and its mission"
            />
          </div>
        </div>
      </div>
    </HomeContent>
  );
}
