import ExpressiveLink from "../ui/expressive/ExpressiveLink";
import ExpressiveAnchor from "../ui/expressive/ExpressiveAnchor";
import ParallaxSection from "../ui/parallax/ParallaxSection";
import ParallaxLayer from "../ui/parallax/ParallaxLayer";
import Favicon from "../ui/Favicon";

export default function Footer() {
  return (
    <footer className="relative w-full">
      <ParallaxSection className="relative h-95 overflow-hidden [mask-image:linear-gradient(to_top,white_85%,transparent_100%)] [webkit-mask-image:linear-gradient(to_top,white_85%,transparent_100%)]">
        <ParallaxLayer layer={0} ratio={1}>
          <img
            className="w-full h-full object-cover brightness-[.8] contrast-[1.1]"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
            alt=""
          />
        </ParallaxLayer>

        <ParallaxLayer
          layer={1}
          ratio={0}
          className="flex items-center justify-end p-5 lg:px-[35px]"
        >
          <FooterCard />
        </ParallaxLayer>
      </ParallaxSection>
      <section className="w-full h-full bg-primary-800 text-neutral-50 p-5 py-10 z-10">
        <div className="relative z-10 flex flex-col md:items-center gap-5 w-full">
          <div className="flex w-fit gap-10 flex-col md:justify-between md:flex-row">
            <FooterColumn>
              <div className="grid gap-3">
                <Favicon className="w-[60px] h-[60px]" />
                <p className="text-neutral-300 text-sm">
                  info@thesourceofhope.org
                </p>
              </div>
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
                  <ExpressiveLink to="">Get Involved</ExpressiveLink>
                </li>
                <li>
                  <ExpressiveLink to="">Donate</ExpressiveLink>
                </li>
                <li>
                  <ExpressiveLink to="">Volunteer</ExpressiveLink>
                </li>
                <li>
                  <ExpressiveLink to="">Careers</ExpressiveLink>
                </li>
                <li>
                  <ExpressiveLink to="">Site Map</ExpressiveLink>
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

function FooterColumn({ title = "", children }) {
  return (
    <div className="w-fit">
      <h2 className="text-lg font-bold whitespace-nowrap w-fit mb-2">
        {title}
      </h2>
      {children}
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
      className={`flex flex-col gap-3 rounded-2xl shadow-2x overflow-hidden w-175 h-fit p-5 bg-neutral-50 text-neutral-950`}
    >
      <div className="h-fit w-full text-lg font-bold">
        <h2 className="hidden md:block">
          Be The First To Know About Upcoming Events
        </h2>
        <h2 className="block md:hidden">Get Updates</h2>
      </div>
      <p className="text-sm">
        Join our family of supporters and receive inspiring stories, holistic
        wellness tips, and community updates right to your inbox by subscribing
        to our newsletter.
      </p>
      <button className="border-5 rounded-2xl font-bold w-fit px-10 py-5 bg-accent-500 border-accent-500 text-neutral-50/75 hover:text-neutral-50/95 transition-colors">
        <ExpressiveLink>SUBSCRIBE</ExpressiveLink>
      </button>
      <p className="text-sm text-neutral-500">No spam, unsubscribe anytime.</p>
    </article>
  );
}
