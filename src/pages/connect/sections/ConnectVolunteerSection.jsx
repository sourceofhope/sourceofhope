import ExpressiveAnchor from "../../../components/ui/expressive/ExpressiveAnchor";
import Heading from "../../../components/ui/text/Heading";
import Title from "../../../components/ui/text/Title";
import PageSection from "../../PageSection";

export default function ConnectMapSection() {
  return (
    <PageSection className="justify-items-center grid gap-10 relative m-0">
      <article className="w-full grid gap-5 row-start-2 md:row-start-auto">
        <Title>Volunteer Opportunities</Title>
        <p>
          Make an Impact - Volunteer with The Source of Hope! Join us in Dallas
          and Plano to help provide food, support, and hope to those in need.
          Whether you can volunteer once or regularly, every effort makes a real
          difference in our community.
        </p>
        <p>
          Join us every 4th Friday & Saturday of the month at Cornerstone
          Kitchen (2627 S. Ervay Street, Dallas, TX 75215) for Serving Hope, a
          heartfelt community outreach event hosted by The Source of Hope.
        </p>
        <p>
          We prepare and serve fresh, homemade, organic meals to over 200
          individuals in need—including senior citizens, first responders,
          veterans, teachers, at-risk families, and those experiencing
          homelessness.
        </p>
      </article>
      <article className="w-full grid gap-5">
        <Title>Events</Title>
        <MajorEventCard
          title="Hope Run for Hunger"
          src="/images/hope-run.jpg"
          alt="Hope Run for Hunger event photo">
          <div className="grid md:grid-cols-[7fr_3fr] gap-3 items-center">
            <div className="flex flex-col gap-3">
              <p>
                Join us in a powerful community run supporting families across
                North Texas.
              </p>
              <p className="font-semibold">November 23, 2025 · Plano, Texas</p>
            </div>
            <button className="w-full rounded-2xl p-5 px-10 bg-accent-500 hover:bg-accent-600 duration-750 transition-colors font-semibold text-neutral-50">
              <ExpressiveAnchor to="">
                REGISTER <span className="hidden lg:inline">NOW</span>
              </ExpressiveAnchor>
            </button>
          </div>
        </MajorEventCard>
      </article>
    </PageSection>
  );
}

function MajorEventCard({ title, src, alt, children }) {
  return (
    <article className="relative w-full group">
      <div className="relative">
        <img
          src={src}
          alt={alt}
          className="w-full aspect-video md:aspect-9/2 rounded-t-2xl border-4 border-b-0 border-neutral-300 object-cover"
        />
        <div className="absolute m-1 inset-0 rounded-t-2xl bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
      </div>
      <div
        className="
          relative bottom-0 left-0 w-full
          p-5
          rounded-b-2xl border-x-4 border-b-4 border-neutral-300
          bg-neutral-100/95 backdrop-blur-sm
          shadow-lg
          transform transition-all
        ">
        <Title className="text-accent-800">{title}</Title>
        <div className="text-accent-700 leading-relaxed space-y-2">
          {children}
        </div>
      </div>
    </article>
  );
}
