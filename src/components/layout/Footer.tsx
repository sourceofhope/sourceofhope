"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LinkButton } from "@/components/ui/Button";
import Heading from "../ui/Heading";
import ParallaxSection from "../ui/parallax/ParallaxSection";
import ParallaxLayer from "../ui/parallax/ParallaxLayer";
import { ASSET_VERSION } from "@/lib/environment";

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <footer className="relative w-full lg:mt-15">
      {!isHomePage && <FooterParallax />}
      <section className="w-full h-full bg-primary-700 text-neutral-50 p-5 md:py-10 z-10">
        <div className="relative z-10 flex flex-col md:items-center gap-5 w-full">
          <div className="flex w-fit gap-10 flex-col md:justify-between md:flex-row">
            <FooterColumn>
              <div className="grid gap-3 grid-flow-col md:grid-flow-row">
                <Link
                  href="/"
                  aria-label="The Source of Hope"
                  className="w-20 h-20 flex items-center justify-center bg-neutral-100 rounded-sm">
                  <Image
                    src={"/" + ASSET_VERSION + "/core/TSOH-Logo.webp"}
                    alt="The Source of Hope Logo"
                    className="w-full h-full object-contain rounded-lg p-2"
                    width={80}
                    height={80}
                  />
                </Link>
                <a
                  href="https://app.candid.org/profile/9393304/the-source-of-hope-46-2491772"
                  target="_blank"
                  rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://widgets.guidestar.org/prod/v1/pdp/transparency-seal/9393304/svg"
                    alt="Candid.org Badge"
                    className="w-20 h-20 rounded-sm"
                  />
                </a>
              </div>
            </FooterColumn>
            <FooterColumn title="CONTACT">
              <ul className="grid gap-1">
                <li>
                  <a href="mailto:info@thesourceofhope.org">
                    info@thesourceofhope.org
                  </a>
                </li>
                <li>
                  <a href="tel:4699690244">(469)-969-0244</a>
                </li>
                <li>EIN: 46-2491772</li>
              </ul>
              <p className="mt-5">
                ©{new Date().getFullYear()} The Source Of Hope
              </p>
            </FooterColumn>
            <FooterColumn title="CONNECT">
              <ul className="grid gap-1">
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.instagram.com/sourceofhope/">
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.facebook.com/TheSourceOfHope/">
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://x.com/thesourceofhope/">
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.youtube.com/@thesourceofhope">
                    YouTube
                  </a>
                </li>
              </ul>
            </FooterColumn>
            <FooterColumn title="LOCATION">
              <p>
                1108 W Parker Rd <br /> Ste 102 <br /> Plano, TX 75078
              </p>
            </FooterColumn>
            <FooterColumn title="QUICK LINKS">
              <ul className="grid gap-1">
                <li>
                  <Link href="/members">Get Involved</Link>
                </li>
                <li>
                  <Link href="/donate">Donate</Link>
                </li>
                <li>
                  <Link href="/serve">Volunteer</Link>
                </li>
                <li>
                  <Link href="/connect">Careers</Link>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="/sitemap.xml">
                    Site Map
                  </a>
                </li>
              </ul>
            </FooterColumn>
          </div>
        </div>
      </section>
    </footer>
  );
}

function FooterParallax() {
  return (
    <>
      <ParallaxSection className="hidden md:block relative h-115 overflow-hidden">
        <ParallaxLayer layer={0} ratio={1}>
          <img
            className="w-full overflow-hidden h-full object-cover brightness-[.8] contrast-[1.1]"
            src={`/${ASSET_VERSION}/core/TSOH-Family.webp`}
            alt=""
          />
        </ParallaxLayer>
        <ParallaxLayer
          layer={1}
          ratio={0}
          className="flex w-full items-center justify-center p-5 lg:px-35">
          <FooterCard />
        </ParallaxLayer>
      </ParallaxSection>
      <section className="w-full block md:hidden bg-primary-700 p-5 justify-center">
        <FooterCard />
      </section>
    </>
  );
}

function FooterColumn({
  title = "",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-fit">
      {title && (
        <h2 className="text-lg font-bold whitespace-nowrap w-fit mb-2">
          {title}
        </h2>
      )}
      <div className="text-neutral-300 text-sm">{children}</div>
    </div>
  );
}

function FooterCard() {
  return (
    <article className="flex flex-col gap-3 rounded-2xl shadow-2xl overflow-hidden w-175 max-w-fit h-fit py-5 px-10 bg-neutral-50 text-neutral-950">
      <Heading className="text-lg font-bold text-neutral-950">
        SUBSCRIBE TO OUR NEWSLETTER
      </Heading>
      <div className="h-fit w-full text-lg md:text-xlg font-urbanist font-semibold">
        <h2 className="hidden md:block">Be the first to know about events</h2>
        <h2 className="block md:hidden">Get Updates</h2>
      </div>
      <p className="text-sm md:text-md">
        Join our family of supporters and receive inspiring stories, holistic
        wellness tips, and community updates right to your inbox by subscribing
        to our newsletter.
      </p>
      <LinkButton className="w-fit" href="/members" text="SUBSCRIBE" />
      <p className="text-sm text-neutral-600 italic">
        No spam, unsubscribe anytime.
      </p>
    </article>
  );
}
