import PageSection from '@/components/ui/PageSection';
import Emphasis from '@/components/ui/Emphasis';
import Title from '@/components/ui/Title';
import Heading from '@/components/ui/Heading';
import Blockquote from '@/components/ui/Blockquote';
import Bold from '@/components/ui/Bold';

export default function ServeShowcaseSection() {
  return (
    <PageSection className="justify-items-center grid gap-5 text-sm md:text-md lg:text-lg">
      <div className="grid gap-1 justify-self-start justify-start">
        <Title>Be the Source Of Hope</Title>
        <Heading>
          EVERY MEAL SERVED, SMILE SHARED, AND ACT OF LOVE MAKES A DIFFERENCE.
        </Heading>
      </div>
      <div className="hidden md:grid gap-5 text-neutral-600">
        <p>
          At The Source of Hope, we&apos;re not just another nonprofit—we&apos;re a
          movement dedicated to creating{' '}
          <Bold>lasting, sustainable change</Bold>. Our mission goes beyond
          temporary fixes. We focus on{' '}
          <Bold>
            empowering individuals with skills, education, and opportunities
          </Bold>{' '}
          that transform their lives and communities for generations to come.
        </p>
        <p>
          Think of us as <Bold>five nonprofits in one</Bold>—a united force for
          holistic health and wellness, outdoor education and survival skills,
          entrepreneurship and workforce development, community service, and
          academic mentorship.
        </p>
        <Blockquote className="border-accent-600 text-balance max-w-2xl">
          &quot;Give a man a fish, and you feed him for a day. Teach a man to fish,
          and you feed him for a lifetime.&quot;
        </Blockquote>
        <p>
          By equipping individuals with practical tools and real-world
          experience, we ensure that every dollar invested becomes a ripple of
          impact—
          <Bold>
            creating independent leaders, stronger families, and thriving
            communities.
          </Bold>{' '}
          From nourishing the body to uplifting the spirit, we believe that true
          hope is sustainable when it&apos;s shared.
        </p>
        <p>
          That&apos;s our guiding principle—
          <Bold>
            <Emphasis>empower</Emphasis>, <Emphasis>educate</Emphasis>, and{' '}
            <Emphasis>elevate</Emphasis>.
          </Bold>
        </p>
      </div>
      <div className="grid gap-3 md:hidden text-neutral-600">
        <p>
          At The Source of Hope, we&apos;re more than a nonprofit. We&apos;re a movement
          for lasting change. Our mission is to empower through skills,
          education, and opportunity that transform lives for generations.
        </p>
        <p>
          <Bold>We&apos;re like five nonprofits in one</Bold>, uniting health and
          wellness, outdoor education, entrepreneurship, community service, and
          mentorship.
        </p>
        <p className="pl-3 py-0 border-l-4 border-accent-600 text-balance">
          &quot;Give a man a fish, and you feed him for a day. Teach a man to fish,
          and you feed him for a lifetime.&quot;
        </p>
        <p>
          Every effort creates stronger families and thriving communities. True{' '}
          <Bold>hope lasts when it&apos;s shared</Bold>.
        </p>
        <p>
          <Bold>
            Together we <Emphasis>empower</Emphasis>,
            <Emphasis>educate</Emphasis>, and <Emphasis>elevate</Emphasis>.
          </Bold>
        </p>
      </div>
    </PageSection>
  );
}
