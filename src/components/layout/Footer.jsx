import ExpressiveLink from "../ui/expressive/ExpressiveLink";
import ExpressiveAnchor from "../ui/expressive/ExpressiveAnchor";
import { NavLink } from "react-router-dom";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";

export default function Footer() {
  return (
    <footer className="relative w-full mt-10">
      <div className="relative w-full h-[50vh]">
        <Parallax pages={1.25} style={{ height: "100%", width: "100%", overscrollBehavior: "none"}}>
          <ParallaxLayer
            offset={0}
            factor={1.25}
            speed={-0.2}
            style={{
              backgroundImage:
                'url("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344")',
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          />
          <ParallaxLayer
            offset={0} 
            factor={1} 
            speed={-0.01}>
            <div className="h-full flex items-center justify-center">
              <h2 className="text-5xl font-bold text-white drop-shadow-lg">
                Subscription Card
              </h2>
            </div>
          </ParallaxLayer>
        </Parallax>
      </div>
      <section className="w-full h-full bg-primary-800 text-neutral-50 p-5 z-10">
        <div className="relative z-10 flex flex-col items-center gap-5 w-full md:max-w-[50%] lg:max-w-[35%] mx-auto">
          <div className="flex w-full gap-5 flex-col md:justify-between md:flex-row">
            <NavLink
              to="/"
              className="text-lg w-[60px] h-[60px] flex items-center border-2 border-neutral-50"
            >
              <p className="text-center w-full">ICON</p>
            </NavLink>
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
          <FooterBottom />
        </div>
      </section>
    </footer>
  );
}

function FooterColumn({ title, children }) {
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
    <section className="text-center mt-5">
      <p>Copyright © {new Date().getFullYear()} The Source Of Hope</p>
    </section>
  );
}

function FooterCard() {
  return (
    <section className={`rounded-2xl shadow-2xl overflow-hidden w-full`}>
      <div className="bg-accent-500 p-5 text-center">
        <h2 className="text-lg hidden md:block text-white font-semibold">
          BE THE FIRST TO KNOW ABOUT UPCOMING EVENTS
        </h2>
        <h2 className="text-lg block md:hidden text-white font-semibold">
          GET UPDATES
        </h2>
      </div>
      <div className="bg-accent-300 p-5 grid gap-5">
        <p>
          Join our family of supporters and receive inspiring stories, holistic
          wellness tips, and community updates right to your inbox.
        </p>
        <div className="bg-accent-identity p-5 text-primary-50 rounded-2xl justify-self-start w-fit inline-flex">
          <ExpressiveLink className="text-accent-300" href="">
            SUBSCRIBE
          </ExpressiveLink>
        </div>
        <p className="text-sm text-gray-500">No spam, unsubscribe anytime.</p>
      </div>
    </section>
  );
}
