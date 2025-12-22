import Bold from "../../../components/ui/text/Bold";

export default function FormDescriptionSection() {
  return (
    <section className="flex flex-col gap-5 p-5 lg:px-35">
      <p>
        When you become a member of The Source of Hope, you're supporting the
        <Bold>heartbeat of our community</Bold>—from hospital staff, teachers,
        veterans, and first responders to city workers, police officers,
        firefighters, students, at-risk families, and our unhoused neighbors.
      </p>
      <p>
        You're also helping uplift{" "}
        <Bold>
          single parents, immigrants, survivors, bedridden seniors, and everyday
          people
        </Bold>{" "}
        working hard to rebuild their lives. Together, we're making a difference
        through holistic programs in education, wellness, and community
        empowerment. Membership starts at just $50/month—and every dollar helps
        us <Bold>feed, educate, and inspire hope.</Bold>
      </p>
      <p>
        As a member, you'll also receive <Bold>exclusive perks</Bold>, including
        discounts with our community partners, plus branded gear like a Source
        of Hope apron, shirt, or hat as a token of our appreciation.
      </p>
    </section>
  );
}
