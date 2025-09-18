import ExpressiveLink from "../ui/common/ExpressiveLink";

export default function Footer() {
  return (
    <footer className="relative w-full bg-accent-background px-5 pb-10">
      <div className="absolute inset-0 grid grid-rows-[30%_70%]">
        <div className="bg-primary-background" />
        <div className="bg-accent-background" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-5">
        <FooterCard />
        <section className="grid gap-15 w-full md:grid-flow-col md:auto-cols-fr md:w-fit ">
          <FooterColumn title="LOCATION">
              <p>
                1108 W PARKER RD <br /> STE 102 <br /> PLANO, TX 75078
              </p>            
          </FooterColumn>
          <FooterColumn title="CONNECT">
            <ul className="grid gap-1">
              <li>INSTAGRAM</li>
              <li>FACEBOOK</li>
              <li>TWITTER</li>
              <li>YOUTUBE</li>
              <li>EMAIL</li>
            </ul>
          </FooterColumn>       
          <FooterColumn title="QUICK LINKS">
            <ul className="grid gap-1">
              <li>
                <ExpressiveLink href="">GET INVOLVED</ExpressiveLink>
               </li>
              <li>
                <ExpressiveLink href="">DONATE</ExpressiveLink>
              </li>
              <li>
                <ExpressiveLink href="">VOLUNTEER</ExpressiveLink>
              </li>
              <li>
                <ExpressiveLink href="">CAREERS</ExpressiveLink>
                </li>
              <li>
                <ExpressiveLink href="">SITE MAP</ExpressiveLink>
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
    <div>
      <h2 className="text-lg border-b-2 w-fit mb-2">{title}</h2>
      {children}
    </div>
  );
}

function FooterBottom() {
    <section>
        <p>Copyright © {new Date().getFullYear()} The Source Of Hope</p>
    </section>
}

function FooterCard() {
    return (
    <section className="md:w-[35%] rounded-2xl shadow-2xl overflow-hidden">
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
            Join our family of supporters and receive inspiring stories,
            holistic wellness tips, and community updates right to your inbox.
            </p>
            <a className="bg-accent-identity p-5 text-primary-background rounded-2xl justify-self-start w-fit inline-flex">
              <ExpressiveLink className="text-accent-background" href="">SUBSCRIBE</ExpressiveLink>
            </a>
            <p className="text-sm text-gray-500">
            No spam, unsubscribe anytime.
            </p>
        </div>
    </section>
    );
}