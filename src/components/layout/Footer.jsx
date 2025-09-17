export default function Footer() {
  return (
    <footer className="relative min-h-[50vh] w-full bg-accent-background px-5 pb-10">
      <div className="absolute inset-0 grid grid-rows-[30%_70%]">
        <div className="bg-primary-background" />
        <div className="bg-accent-background" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-5">
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
              SUBSCRIBE
            </a>
            <p className="text-sm text-gray-500">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </section>
        <section className="grid gap-15 w-full md:grid-flow-col md:auto-cols-fr md:w-fit ">
          <div>
            <h2 className="text-lg border-b-2 w-fit mb-2">QUICK LINKS</h2>
            <ul className="grid gap-1">
              <li>GET INVOLVED</li>
              <li>DONATE</li>
              <li>VOLUNTEER</li>
              <li>CAREERS</li>
              <li>SITE MAP</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg border-b-2 w-fit mb-2">CONNECT</h2>
            <ul className="grid gap-1">
              <li>INSTAGRAM</li>
              <li>FACEBOOK</li>
              <li>TWITTER</li>
              <li>YOUTUBE</li>
              <li>EMAIL</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg border-b-2 w-fit mb-2">ADDRESS</h2>
            <p>
              1108 W PARKER RD <br /> STE 102 <br /> PLANO, TX 75078
            </p>
          </div>
        </section>
        <section>
          <p>Copyright © {new Date().getFullYear()} The Source Of Hope</p>
        </section>
      </div>
    </footer>
  );
}
