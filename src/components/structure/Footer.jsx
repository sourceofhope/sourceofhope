import ExpressiveLink from "../ui/expressive/ExpressiveLink";
import ExpressiveAnchor from "../ui/expressive/ExpressiveAnchor";
import ParallaxSection from "../ui/parallax/ParallaxSection";
import ParallaxLayer from "../ui/parallax/ParallaxLayer";
import Favicon from "../ui/Favicon";
import { useLocation } from "react-router-dom";
import { CANONICAL } from "../../routes";
import { LinkButton } from "../ui/Button";

export default function Footer() {
  const location = useLocation();

  return (
    <footer className="relative w-full lg:mt-15">
      {!(location.pathname === "/home") ? <FooterParallax /> : null}
      <section className="w-full h-full bg-primary-700 text-neutral-50 p-5 md:py-10 z-10">
        <div className="relative z-10 flex flex-col md:items-center gap-5 w-full">
          <div className="flex w-fit gap-10 flex-col md:justify-between md:flex-row">
            <FooterColumn>
              <ul className="grid gap-5 grid-flow-col md:grid-flow-row">
                <Favicon className="w-[60px] h-[60px]" />
                <a
                  href="https://app.candid.org/profile/9393304/the-source-of-hope-46-2491772"
                  target="_blank"
                  className="w-[60px] h-[60px]">
                  {" "}
                  <img src="https://widgets.guidestar.org/prod/v1/pdp/transparency-seal/9393304/svg" />{" "}
                </a>
              </ul>
            </FooterColumn>
            <FooterColumn title="CONNECT">
              <ul className="grid gap-1">
                <li>
                  <ExpressiveAnchor href="https://www.instagram.com/sourceofhope/">
                    Instagram
                  </ExpressiveAnchor>
                </li>
                <li>
                  <ExpressiveAnchor href="https://www.facebook.com/sourceofhope/">
                    Facebook
                  </ExpressiveAnchor>
                </li>
                <li>
                  <ExpressiveAnchor href="https://x.com/thesourceofhope/">
                    Twitter
                  </ExpressiveAnchor>
                </li>
                <li>
                  <ExpressiveAnchor href="https://www.youtube.com/@thesourceofhope">
                    YouTube
                  </ExpressiveAnchor>
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
                  <ExpressiveLink to={CANONICAL.member}>
                    Get Involved
                  </ExpressiveLink>
                </li>
                <li>
                  <ExpressiveLink to="">Donate</ExpressiveLink>
                </li>
                <li>
                  <ExpressiveLink to={CANONICAL.serve}>
                    Volunteer
                  </ExpressiveLink>
                </li>
                <li>
                  <ExpressiveLink to="">Careers</ExpressiveLink>
                </li>
                <li>
                  <ExpressiveLink to="">Site Map</ExpressiveLink>
                </li>
              </ul>
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
              </ul>
            </FooterColumn>
          </div>
        </div>
      </section>
      <FooterBottom />
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
            src="/Footer.png"
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

function FooterColumn({ title = "", children }) {
  return (
    <div className="w-fit">
      <h2 className="text-lg font-bold whitespace-nowrap w-fit mb-2">
        {title}
      </h2>
      <div className="text-neutral-300 text-sm">{children}</div>
    </div>
  );
}

function FooterBottom() {
  return (
    <section className="text-center p-5 w-full text-md bg-primary-900 text-neutral-50">
      <p>Copyright © {new Date().getFullYear()} The Source Of Hope</p>
    </section>
  );
}

function FooterCard() {
  return (
    <article
      className={`flex flex-col gap-3 rounded-2xl shadow-2x overflow-hidden w-175 max-w-fit h-fit py-5 px-10 bg-neutral-50 text-neutral-950`}>
      <p className="h-fit w-full text-sm font-bold text-primary-700">
        SUBSCRIBE TO OUR NEWSLETTER
      </p>
      <div className="h-fit w-full text-lg md:text-xlg font-urbanist font-semibold">
        <h2 className="hidden md:block">Be the first to know about events</h2>
        <h2 className="block md:hidden">Get Updates</h2>
      </div>
      <div className="grid grid-flow-row md:grid-cols-[7fr_3fr] gap-5 items-center">
        <p className="text-sm md:text-md text-balance">
          Join our family of supporters and receive inspiring stories, holistic
          wellness tips, and community updates right to your inbox by
          subscribing to our newsletter.
        </p>
        <LinkButton className="w-fit" text="SUBSCRIBE" />
      </div>

      <p className="text-sm text-neutral-600 italic">
        No spam, unsubscribe anytime.
      </p>
    </article>
  );
}
