import PageSection from "../../PageSection";

export default function ServeGuidelinesSection() {
  return (
    <PageSection>
      <div className="grid gap-1 justify-self-start justify-start text-sm md:text-md">
        <h2 className="text-xlg md:text-xxlg text-balance font-urbanist">
          View our Serving Guidelines
        </h2>
      </div>
      <article className="grid gap-5">
        <h3 className="text-md md:text-lg">
          Who can volunteer?
        </h3>
        <div className="grid gap-3">
          <p className="md:text-balance">
            We welcome volunteers of all ages--from kids and students to adults
            and seniors! If you're looking to gain volunteer hours for school,
            participate as a family, or give back to your community, we have
            opportunities for everyone.
          </p>
          <p className="md:text-balance">
            For students, some local schools offer service hours for
            volunteering with us.{" "}
            <a
              className="font-semibold text-accent-500"
              href={`mailto:info@thesourceofhope.org?subject=High-school Participation Inquiry`}>
              Contact us
            </a>{" "}
            to check if your school participates.
          </p>
        </div>
      </article>
      <article className="grid gap-5">
        <h3 className="text-md md:text-lg">
          What's expected of me?
        </h3>
        <div className="grid gap-3">
          <p className="md:text-balance">
            We value every volunteer and their contributions. To ensure a
            meaningful and productive experience:
          </p>
          <ul className="list-disc pl-4">
            <li>Arrive on time and be ready to help</li>
            <li>Actively participate in tasks assigned by our team</li>
            <li>
              Respect our nonprofit’s mission and stay engaged throughout your
              shift
            </li>
            <li>If unsure of what to do, ask a team member for guidance</li>
          </ul>
          <p className="md:text-balance">
            By signing up, you acknowledge and agree to our volunteer terms and
            guidelines. Thank you for being the Source of Hope in our community!
          </p>
        </div>
      </article>
    </PageSection>
  );
}
