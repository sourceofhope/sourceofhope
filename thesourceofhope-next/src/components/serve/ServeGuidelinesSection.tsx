import PageSection from '@/components/ui/PageSection';
import Title from '@/components/ui/Title';
import Heading from '@/components/ui/Heading';
import ExpressiveCard from '@/components/ui/ExpressiveCard';

export default function ServeGuidelinesSection() {
  return (
    <PageSection className="gap-5 text-sm md:text-md lg:text-lg">
      <div className="grid gap-1 justify-self-start justify-start">
        <Title className="text-xlg md:text-xxlg text-balance font-urbanist">
          View our Serving Guidelines
        </Title>
      </div>
      <ExpressiveCard className="grid gap-3" title="Who can volunteer?">
        <p className="md:text-balance">
          We welcome volunteers of all ages, from kids and students to adults
          and seniors! If you&apos;re looking to gain volunteer hours for school,
          participate as a family, or give back to your community, we have
          opportunities for everyone.
        </p>
        <p className="md:text-balance">
          For students, some local schools offer service hours for volunteering
          with us.{' '}
          <a
            className="font-semibold text-accent-500"
            href="mailto:info@thesourceofhope.org?subject=High-school Participation Inquiry"
          >
            Contact us
          </a>{' '}
          to check if your school participates.
        </p>
      </ExpressiveCard>
      <ExpressiveCard className="grid gap-3" title="What's expected of me?">
        <p className="md:text-balance">
          We value every volunteer and their contributions. To ensure a
          meaningful and productive experience:
        </p>
        <ul className="list-disc pl-5">
          <li>Arrive on time and be ready to help</li>
          <li>Actively participate in tasks assigned by our team</li>
          <li>
            Respect our nonprofit&apos;s mission and stay engaged throughout your
            shift
          </li>
          <li>If unsure of what to do, ask a team member for guidance</li>
        </ul>
        <p className="md:text-balance">
          By signing up, you acknowledge and agree to our volunteer terms and
          guidelines. Thank you for being the Source of Hope in our community!
        </p>
      </ExpressiveCard>
      <ExpressiveCard className="grid gap-3" title="What should I bring?">
        <p className="md:text-balance">
          We recommend dressing comfortably and appropriately for the activity.
          Closed-toe shoes are required for safety, and we suggest wearing
          clothing you don&apos;t mind getting a little messy.
        </p>
        <ul className="list-disc pl-5">
          <li>Reusable water bottle to stay hydrated</li>
          <li>
            Weather-appropriate clothing (hat, sunscreen, or light jacket)
          </li>
          <li>A positive attitude and willingness to serve</li>
        </ul>
        <p className="md:text-balance">
          All tools and materials needed for the day&apos;s activities will be
          provided unless stated otherwise.
        </p>
      </ExpressiveCard>
      <ExpressiveCard className="grid gap-3" title="How do I sign up?">
        <p className="md:text-balance">
          Signing up is simple! You can register through our online volunteer
          form or reach out to us directly by email.
        </p>
        <ul className="list-disc pl-5">
          <li>
            Visit{' '}
            <a
              className="font-semibold text-accent-500"
              href="/volunteer"
            >
              thesourceofhope.org/volunteer
            </a>
          </li>
          <li>
            Or email us at{' '}
            <a
              className="font-semibold text-accent-500"
              href="mailto:info@thesourceofhope.org?subject=Volunteer Sign-up"
            >
              info@thesourceofhope.org
            </a>
          </li>
        </ul>
        <p className="md:text-balance">
          Once registered, you&apos;ll receive a confirmation and details about your
          volunteer shift.
        </p>
      </ExpressiveCard>
      <ExpressiveCard
        className="grid gap-3"
        title="Can I volunteer as a group?"
      >
        <p className="md:text-balance">
          Absolutely! We welcome group volunteers from schools, churches, clubs,
          and companies. Volunteering together strengthens teamwork and builds
          community connections.
        </p>
        <p className="md:text-balance">
          To coordinate a group, please{' '}
          <a
            className="font-semibold text-accent-500"
            href="mailto:info@thesourceofhope.org?subject=Group Volunteering Inquiry"
          >
            contact us
          </a>{' '}
          in advance so we can plan a project that fits your group size and
          interests.
        </p>
      </ExpressiveCard>
      <ExpressiveCard className="grid gap-3" title="What if I need to cancel?">
        <p className="md:text-balance">
          We understand that plans can change. If you&apos;re unable to attend for
          volunteering, please let us know as soon as possible so we can offer
          your spot to someone else.
        </p>
        <ul className="list-disc pl-5">
          <li>Notify us at least 24-hours in advance if you can</li>
          <li>
            Email us at{' '}
            <a
              className="font-semibold text-accent-500"
              href="mailto:info@thesourceofhope.org?subject=Volunteer Cancellation"
            >
              info@thesourceofhope.org
            </a>
          </li>
        </ul>
        <p className="md:text-balance">
          Your communication helps us stay organized and ensures every event
          runs smoothly.
        </p>
      </ExpressiveCard>
      <ExpressiveCard className="grid gap-3" title="Do I need experience?">
        <p className="md:text-balance">
          No prior experience is needed! Our team will guide you through each
          task and make sure you&apos;re comfortable with what you&apos;re doing.
        </p>
        <p className="md:text-balance">
          We believe every volunteer brings unique strengths, whether it&apos;s
          teamwork, compassion, or creativity — and every helping hand makes a
          difference.
        </p>
      </ExpressiveCard>
    </PageSection>
  );
}
