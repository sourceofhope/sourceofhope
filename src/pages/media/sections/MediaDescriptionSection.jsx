import Heading from "../../../components/ui/text/Heading";
import Title from "../../../components/ui/text/Title";
import PageSection from "../../PageSection";

export default function MediaDescriptionSection() {
  return (
    <PageSection className="justify-items-center grid gap-10 relative m-0 text-sm md:text-md lg:text-lg">
      <article className="grid gap-5">
        <Title>Press Coverage</Title>

        <p>
          The Source of Hope Press Page features our television appearances,
          highlighting our mission and impact in the community. Watch our media
          coverage to see how we are making a difference through our programs
          and initiatives!
        </p>
        <div className="flex flex-col gap-5">
          <Heading>NBC5 Coverage</Heading>
          <p>
            The NBC5 segment spotlights The Source of Hope (TSOH), a nonprofit
            providing wellness, holistic healing education, and beauty industry
            training for underprivileged students. It highlights key programs
            such as Serving Hope, which delivers fresh, home-cooked meals each
            month, and Juice for Hope, a turmeric-based wellness initiative
            supporting health and immunity.
          </p>

          <MediaCard title="NBC5 - The Source of Hope" mediaID="6iUccVeIxWw">
            <p>
              A coverage to see how we are making a difference through our
              programs and initiatives!
            </p>
            <p>
              The NBC5 segment highlights Serving Hope, Juice for Hope, and our
              wellness & education programs.
            </p>
            <p>
              Watch the interview with our founder,{" "}
              <strong>Quynh Chau Stone</strong>, as she shares her journey and
              mission!
            </p>
          </MediaCard>
        </div>
        <div className="flex flex-col gap-5">
          <Heading>
            Quynh Chau Stone{" "}
            <span className="hidden md:inline">on The Source of Hope</span>{" "}
            Interview
          </Heading>

          <p>
            In this two-part interview, founder{" "}
            <strong>Quynh Chau Stone</strong> reflects on the remarkable growth
            and mission of The Source of Hope. She highlights key milestones,
            hunger relief efforts, healthcare access, educational empowerment,
            and the organization's deep community impact. She also discusses
            challenges, development, and future initiatives while emphasizing
            the dedication of her team.
          </p>

          <MediaCard
            title="Interview (Part 1)"
            mediaID="lypvdQjpe1w"
            reverse={true}>
            <p>
              Part 1 features our founder <strong>Quynh Chau Stone</strong>{" "}
              sharing insights into the mission, key milestones, and community
              impact of The Source of Hope, including essential efforts in
              hunger relief, healthcare support, and empowerment programs.
            </p>
          </MediaCard>

          <MediaCard title="Interview (Part 2)" mediaID="n6WTGDCinVY">
            <p>
              Part 2 focuses on further development, challenges, and successes.
              Our founder highlights community impact, future goals, and the
              dedication of the TSOH team in serving individuals and families in
              need.
            </p>
          </MediaCard>
        </div>
        <div className="flex flex-col gap-5">
          <Heading>
            <span className="hidden md:inline">
              The Source of Hope - 5-Year
            </span>{" "}
            Anniversary Celebration
          </Heading>

          <p>
            The Source of Hope's 5-Year Anniversary Celebration features our
            founder <strong>Quynh Chau Stone</strong> reflecting on milestones,
            testimonials, and heartfelt moments of gratitude. This celebration
            honors volunteers, donors, and partners who have contributed to our
            journey and community impact. It is both a reflection on past
            achievements and a hopeful look toward continued growth and service.
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
          <Heading>
            The Fielder Report{" "}
            <span className="hidden md:inline">
              - A Conversation with Quynh Chau Stone
            </span>
          </Heading>
          <p>
            In this special interview on <strong>The Fielder Report</strong>,
            host Kathy Fielder speaks with our founder{" "}
            <strong>Quynh Chau Stone</strong> about her life, philanthropy, and
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
              Listen to founder <strong>Quynh Chau Stone</strong> share powerful
              stories of resilience, purpose, and compassion. This interview
              gives a deeper look into her journey, her vision, and her impact
              through The Source of Hope.
            </p>
          </MediaCard>
        </div>
      </article>
    </PageSection>
  );
}

function MediaCard({ title, mediaID, reverse = false, children }) {
  return (
    <div
      className={`
        grid gap-5 items-center
        border-4 border-neutral-300 rounded-2xl shadow-lg bg-neutral-50
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
        {title && <Title className="text-accent-800 ">{title}</Title>}
        <div className="grid gap-3 text-sm md:text-md lg:text-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
