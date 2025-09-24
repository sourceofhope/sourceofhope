import ExpressiveLink from "../ui/expressive/ExpressiveLink";
import ExpressiveAnchor from "../ui/expressive/ExpressiveAnchor";

export default function Footer() {
  return (
    <footer className="relative w-full bg-accent-background px-5 pb-10 mt-10">
      <div className="absolute inset-0 grid grid-rows-[30%_70%]">
        <div className="bg-primary-background" />
        <div className="bg-accent-background" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-5 w-full md:max-w-[50%] lg:max-w-[35%] mx-auto">
        <FooterCard />
        <section className="flex w-full gap-5 flex-col md:justify-between md:flex-row">
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
        </section>
        <FooterBottom />
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div className="w-fit">
      <h2 className="text-lg font-bold whitespace-nowrap border-b-2 w-fit mb-2">
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
      <div className="bg-accent-identity p-5 text-center">
        <h2 className="text-lg hidden md:block text-white font-semibold">
          BE THE FIRST TO KNOW ABOUT UPCOMING EVENTS
        </h2>
        <h2 className="text-lg block md:hidden text-white font-semibold">
          GET UPDATES
        </h2>
      </div>
      <div className="bg-primary-background p-5 grid gap-5">
        <p>
          Join our family of supporters and receive inspiring stories, holistic
          wellness tips, and community updates right to your inbox.
        </p>
        <div className="bg-accent-identity p-5 text-primary-background rounded-2xl justify-self-start w-fit inline-flex">
          <ExpressiveLink className="text-accent-background" href="">
            SUBSCRIBE
          </ExpressiveLink>
        </div>
        <p className="text-sm text-gray-500">No spam, unsubscribe anytime.</p>
      </div>
    </section>
  );
}
