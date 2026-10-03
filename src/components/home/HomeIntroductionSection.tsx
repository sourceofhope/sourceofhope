"use client";

import { useRef, useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { ASSET_VERSION } from "@/lib/environment";
import Image from "next/image";

const POSTER_SRC = `/${ASSET_VERSION}/core/TSOH-Poster.webp`;

type VideoSource = { src: string; type: string };

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

/**
 * Pick the smallest rendition that still looks sharp on this screen, or
 * nothing at all when the visitor prefers reduced motion / reduced data.
 */
function chooseVideoSources(): VideoSource[] | null {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }

  const connection = (navigator as Navigator & { connection?: NetworkInformation })
    .connection;
  if (
    connection?.saveData ||
    ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "")
  ) {
    return null;
  }

  const renderedWidth = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
  const webm =
    renderedWidth > 1600
      ? `/${ASSET_VERSION}/core/TSOH-Hero-1080.webm`
      : `/${ASSET_VERSION}/core/TSOH-Hero-720.webm`;

  return [
    { src: webm, type: "video/webm" },
    // H.264 fallback for browsers without VP9 WebM support (older Safari).
    { src: `/${ASSET_VERSION}/core/TSOH-Hero-720.mp4`, type: "video/mp4" },
  ];
}

export default function HomeIntroductionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sources, setSources] = useState<VideoSource[] | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  // Defer the video until the page (and its poster image) has finished
  // loading, so it never competes with critical resources.
  useEffect(() => {
    let idleHandle: number | undefined;

    const start = () => {
      const schedule =
        window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idleHandle = schedule(() => setSources(chooseVideoSources()));
    };

    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }

    return () => {
      window.removeEventListener("load", start);
      if (idleHandle !== undefined) {
        (window.cancelIdleCallback ?? window.clearTimeout)(idleHandle);
      }
    };
  }, []);

  // Only play while the hero is on screen to save CPU and battery.
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!sources || !video || !section) return;

    video.load();

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    observer.observe(section);

    return () => observer.disconnect();
  }, [sources]);

  return (
    <section
      ref={sectionRef}
      className="relative flex mb-10 h-[80vh] md:min-h-screen w-full">
      <div
        className="absolute inset-0 z-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, white 80%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, white 80%, transparent 100%)",
        }}>
        <div className="relative h-full w-full">
          <Image
            src={POSTER_SRC}
            alt="The Source of Hope community impact"
            fill
            priority
            className="object-cover brightness-75"
            sizes="100vw"
          />
        </div>
        {sources && !videoFailed && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover brightness-75 transition-opacity duration-700 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
            onPlaying={() => setVideoReady(true)}
            onError={() => setVideoFailed(true)}>
            {sources.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
        )}
      </div>
      <div className="relative z-10 w-full max-w-[80ch] md:max-w-[90ch] self-end grid gap-3 p-5 md:px-15 md:pb-15 lg:px-35">
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
