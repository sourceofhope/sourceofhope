import Link from "next/link";
import Title from "@/components/ui/Title";
import Emphasis from "@/components/ui/Emphasis";

export default function AboutSummarySection() {
  return (
    <section className="w-full md:justify-items-left items-center grid my-5 px-5 lg:px-35 gap-5 text-sm md:text-md lg:text-lg">
      <Title className="font-semibold text-balance">
        Ready to take <span className="text-accent-600">your next step</span>?
      </Title>
      
      <div className="text-sm md:text-md lg:text-lg grid gap-5 text-neutral-600">
        <p>
          <strong>
            At The Source of Hope, we meet people where they are—and we don&rsquo;t
            give up on them.
          </strong>{" "}
          Our work is built on compassion, trust, and showing up consistently
          for our community. We don&rsquo;t just provide services; we walk alongside
          individuals and families with dignity, care, and the belief that
          healing and renewal are possible. Whether someone is facing hunger,
          housing instability, or simply feeling forgotten, we are here.
        </p>
        
        <p>
          Every meal shared and every moment of support reflects a commitment to
          long-term change, not quick fixes. Through the hands and hearts of
          volunteers, partners, and neighbors, we help create stability, restore
          confidence, and open doors to new opportunities.
        </p>
        
        <p>
          As an independent nonprofit, we receive no government
          funding—everything we do is made possible through the generosity of
          people who believe in this mission. When you stand with us, you become
          part of something deeply human and deeply hopeful—
          <Emphasis>one life, one family, one step forward at a time.</Emphasis>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 text-center text-sm md:text-md">
        <a
          href="https://app.joinhandshake.com/e/806999/jobs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-6 py-3 rounded font-semibold bg-neutral-200 hover:bg-neutral-300 text-neutral-950 transition"
        >
          Apply for Emerging Professional
        </a>
        
        <a
          href="https://www.eventbrite.com/o/quynh-chau-stone-92264017613"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-6 py-3 rounded font-semibold bg-neutral-200 hover:bg-neutral-300 text-neutral-950 transition"
        >
          Volunteer for an Event
        </a>
        
        <Link
          href="/members"
          className="flex-1 px-6 py-3 rounded font-semibold bg-neutral-200 hover:bg-neutral-300 text-neutral-950 transition"
        >
          Become a Community Sponsor
        </Link>
      </div>
    </section>
  );
}
