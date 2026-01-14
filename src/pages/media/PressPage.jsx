import Bold from "../../components/ui/text/Bold";
import Heading from "../../components/ui/text/Heading";
import Title from "../../components/ui/text/Title";
import PageSection from "../PageSection";
import { HighlightedText } from "../../components/ui/expressive/ExpressiveText";
import { CANONICAL_URL } from "../../routes";
import { Helmet } from "react-helmet";
import PageHeader from "../PageHeader";

export default function PressPage() {
  return (
    <>
      <Helmet>
        <title>Press | The Source of Hope</title>
        <meta
          name="description"
          content="Explore The Source of Hope media hub featuring podcasts, radio shows, videos, press coverage, and stories highlighting our mission and community impact across Dallas–Fort Worth."
        />
        <link rel="canonical" href={CANONICAL_URL.media} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.media} />
        <meta property="og:title" content="Media | The Source of Hope" />
        <meta
          property="og:description"
          content="Watch, listen, and explore podcasts, radio segments, videos, and press coverage sharing the heart and impact of The Source of Hope."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.media} />
        <meta name="twitter:title" content="Media | The Source of Hope" />
        <meta
          name="twitter:description"
          content="Podcasts, radio shows, videos, and press stories sharing hope, healing, and community impact across DFW."
        />
      </Helmet>
      <PageHeader>
        <h2 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
          PRESS
        </h2>
        <p className="font-semibold text-neutral-200 text-sm">
          OUR COMMUNITY COVERAGE
        </p>
      </PageHeader>
      <PageSection className="justify-items-center grid gap-10 relative m-0 text-sm md:text-md lg:text-lg">
        <article className="grid gap-5">
          <Title>Our Press Coverage</Title>
          <p className="">
            The Source of Hope Press Page showcases our television and media
            appearances, offering a closer look at how our mission comes to life
            beyond words. Our media coverage tells the stories behind the
            mission—showing how The Source of Hope transforms service into
            lasting impact for individuals, families, and communities.
          </p>
          <p>
            When our story is shared, so is the impact—
            <HighlightedText>
              bringing hope to communities that need it most.
            </HighlightedText>{" "}
            Through trusted news outlets and community features, we highlight
            the <Bold>real impact we are making in the community</Bold>—from
            wellness and holistic education to hunger relief and workforce
            development. These stories reflect the heart of our programs, the
            people we serve, and the partners who stand alongside us as we turn
            compassion into action.
          </p>

          <div className="flex flex-col gap-5">
            <Title>NBC5 Coverage</Title>
            <p>
              The NBC5 segment spotlights The Source of Hope (TSOH), a nonprofit
              providing wellness, holistic healing education, and beauty
              industry training for underprivileged students. It highlights key
              programs such as Serving Hope, which delivers fresh, home-cooked
              meals each month, and Juice for Hope, a turmeric-based wellness
              initiative supporting health and immunity.
            </p>

            <MediaCard title="NBC5 - The Source of Hope" mediaID="6iUccVeIxWw">
              <p>
                A coverage to see how we are making a difference through our
                programs and initiatives! The NBC5 segment highlights Serving
                Hope, Juice for Hope, and our wellness & education programs.
                Watch the interview with our founder,{" "}
                <Bold>Quynh Chau Stone</Bold>, as she shares her journey and
                mission!
              </p>
            </MediaCard>
          </div>
          <div className="flex flex-col gap-5">
            <Title>
              Quynh Chau Stone{" "}
              <span className="hidden md:inline">on The Source of Hope</span>{" "}
              Interview
            </Title>

            <p>
              In this two-part interview, founder <Bold>Quynh Chau Stone</Bold>{" "}
              reflects on the remarkable growth and mission of The Source of
              Hope. She highlights key milestones, hunger relief efforts,
              healthcare access, educational empowerment, and the organization's
              deep community impact. She also discusses challenges, development,
              and future initiatives while emphasizing the dedication of her
              team.
            </p>

            <MediaCard
              title="Interview (Part 1)"
              mediaID="lypvdQjpe1w"
              reverse={true}>
              <p>
                Part 1 features our founder <Bold>Quynh Chau Stone</Bold>{" "}
                sharing insights into the mission, key milestones, and community
                impact of The Source of Hope, including essential efforts in
                hunger relief, healthcare support, and empowerment programs.
              </p>
            </MediaCard>

            <MediaCard title="Interview (Part 2)" mediaID="n6WTGDCinVY">
              <p>
                Part 2 focuses on further development, challenges, and
                successes. Our founder highlights community impact, future
                goals, and the dedication of the TSOH team in serving
                individuals and families in need.
              </p>
            </MediaCard>
          </div>
          <div className="flex flex-col gap-5">
            <Title>
              <span className="hidden md:inline">
                The Source of Hope: 5-Year
              </span>{" "}
              Anniversary Celebration
            </Title>
            <p>
              The Source of Hope's 5-Year Anniversary Celebration features our
              founder <Bold>Quynh Chau Stone</Bold> reflecting on milestones,
              testimonials, and heartfelt moments of gratitude. This celebration
              honors volunteers, donors, and partners who have contributed to
              our journey and community impact. It is both a reflection on past
              achievements and a hopeful look toward continued growth and
              service.
            </p>
            <MediaCard
              title="Anniversary Celebration"
              mediaID="13Pf9LVQQ1U"
              reverse={true}>
              <p>
                Join us as we celebrate five years of service, compassion, and
                dedication. Hear inspiring stories, impactful moments, and
                messages of gratitude from our founder and community.
              </p>
            </MediaCard>
          </div>
          <div className="flex flex-col gap-5">
            <Title>
              The Fielder Report{" "}
              <span className="hidden md:inline">
                - A Conversation with Quynh Chau Stone
              </span>
            </Title>
            <p>
              In this special interview on <Bold>The Fielder Report</Bold>, host
              Kathy Fielder speaks with our founder{" "}
              <Bold>Quynh Chau Stone</Bold> about her life, philanthropy, and
              the driving purpose behind The Source of Hope. The conversation
              touches on pivotal experiences, including her escape from Vietnam,
              her heart for service, and the creation of programs supporting
              health, education, and community empowerment. The report features:
              Stone International Wellness Center, Heart for Philanthropy, The
              Source of Hope, The Escape from Vietnam, and Give to The Source of
              Hope
            </p>
            <MediaCard title="Fielder Interview" mediaID="oRHcHLkQkDM">
              <p>
                Listen to founder <Bold>Quynh Chau Stone</Bold> share powerful
                stories of resilience, purpose, and compassion. This interview
                gives a deeper look into her journey, her vision, and her impact
                through The Source of Hope.
              </p>
            </MediaCard>
          </div>
        </article>
      </PageSection>
    </>
  );
}

function MediaCard({ title, mediaID, reverse = false, children }) {
  return (
    <div
      className={`
        grid gap-5 items-center
         rounded-2xl shadow-md bg-neutral-50
        p-5
        md:grid-cols-2
        ${reverse ? "md:[&>*:first-child]:order-2" : ""}
      `}>
      <div className="w-full">
        <div className="aspect-video rounded-xl overflow-hidden shadow-md">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${mediaID}`}
            title={title || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
      <div className="space-y-4 text-accent-700 leading-relaxed">
        {title && (
          <Heading className="text-accent-800 border-b-2 border-neutral-500">
            {title}
          </Heading>
        )}
        <div className="grid gap-3 text-sm md:text-md lg:text-lg text-balance">
          {children}
        </div>
      </div>
    </div>
  );
}
