"use client";

import { useRef, useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { ASSET_VERSION } from "@/lib/environment";
import Image from "next/image";

export default function HomeIntroductionSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

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
    <section className="relative flex mb-10 h-[80vh] md:min-h-screen w-full">
      <div
        className="absolute inset-0 z-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, white 80%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, white 80%, transparent 100%)",
        }}>
        <div className="relative h-full w-full">
          <Image
            src={`/${ASSET_VERSION}/core/TSOH-Poster.webp`}
            alt="The Source of Hope community impact"
            fill
            priority
            className="object-cover brightness-75"
            sizes="100vw"
          />
        </div>
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
              onCanPlayThrough={() => {
                if (videoRef.current) {
                  videoRef.current.classList.add("opacity-100");
                }
              }}
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
          EMPOWERING AND PROVIDING HOPE THROUGH EDUCATION, HEALTH, AND WELLNESS
        </h2>
        <p className="hidden md:block text-neutral-300 text-justify text-sm">
          We are a nonprofit organization dedicated to providing education, holistic
          health and wellness, and support to individuals in need.
          Our team of volunteers is committed to serving the DFW community,
          including at-risk families, veterans, and first responders. Your
          donation helps ensure that those in need have access to essential health services,
          safety resources, and the support they need to live healthier, more fulfilling lives.
        </p>
        <div className="flex gap-5 flex-col md:flex-row">
          <LinkButton className="w-fit" href="/donate" text="DONATE NOW" />
          <LinkButton className="w-fit" href="/about" text="OUR MISSION" />
        </div>
      </div>
    </section>
  );
}
