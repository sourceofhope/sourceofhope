"use client";

import { useRef, useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { ASSET_VERSION } from "@/lib/environment";
import Image from "next/image";

type VideoSize = "1080" | "720";

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

// Decide whether (and at what size) to load the background video. Visitors who
// prefer reduced motion or are on a data-saving / slow connection keep the poster.
function pickVideoSize(): VideoSize | null {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  const connection = (navigator as Navigator & { connection?: NetworkInformation })
    .connection;
  if (connection?.saveData || /2g/.test(connection?.effectiveType ?? "")) {
    return null;
  }

  return window.matchMedia("(min-width: 1024px)").matches ? "1080" : "720";
}

export default function HomeIntroductionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSize, setVideoSize] = useState<VideoSize | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  // Wait for the page (poster, fonts, scripts) to finish loading before the
  // video starts competing for bandwidth.
  useEffect(() => {
    const size = pickVideoSize();
    if (!size) return;

    let timer: number | undefined;
    const start = () => {
      timer = window.setTimeout(() => setVideoSize(size), 0);
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      window.clearTimeout(timer);
    };
  }, []);

  // Pause the video while the hero is scrolled out of view.
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });

    observer.observe(section);
    return () => observer.disconnect();
  }, [videoSize]);

  return (
    <section
      ref={sectionRef}
      className="relative flex mb-10 h-[80vh] md:min-h-screen w-full">
      <div className="absolute inset-0 z-0 mask-[linear-gradient(to_bottom,white_80%,transparent_100%)]">
        <Image
          src={`/${ASSET_VERSION}/core/TSOH-Poster-Frame.webp`}
          alt="Runners crossing the start line at The Source of Hope's Hope Run for Hunger"
          fill
          priority
          className="object-cover brightness-75"
          sizes="100vw"
        />
        {videoSize && !videoFailed && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover brightness-75 transition-opacity duration-700 ${
              videoPlaying ? "opacity-100" : "opacity-0"
            }`}
            onPlaying={() => setVideoPlaying(true)}>
            <source
              src={`/${ASSET_VERSION}/core/TSOH-Poster-${videoSize}.webm`}
              type="video/webm"
            />
            <source
              src={`/${ASSET_VERSION}/core/TSOH-Poster-720.mp4`}
              type="video/mp4"
              onError={() => setVideoFailed(true)}
            />
          </video>
        )}
      </div>
      <div className="relative z-10 w-full max-w-[80ch] md:max-w-[90ch] self-end grid gap-3 p-5 md:pb-15 lg:px-35">
        <p className="text-neutral-50 font-urbanist text-md md:text-lg font-semibold">
          THE SOURCE OF HOPE
        </p>
        <h1 className="text-neutral-50 font-urbanist text-md md:text-xlg font-bold line-clamp-2">
          EMPOWERING AND PROVIDING HOPE THROUGH EDUCATION, HEALTH, AND WELLNESS
        </h1>
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
