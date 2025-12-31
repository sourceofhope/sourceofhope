import Bold from "../../../components/ui/text/Bold";

export default function FormDescriptionSection() {
  return (
    <section className="flex flex-col gap-5 p-5 lg:px-35">
      <p>
        When you become a member of The Source of Hope, you’re investing in the{" "}
        <Bold>heartbeat of our community</Bold>, supporting hospital staff,
        teachers, veterans, first responders, city workers, police officers,
        firefighters, students, at-risk families, and our unhoused neighbors.
      </p>

      <p>
        Your membership also helps uplift{" "}
        <Bold>
          single parents, immigrants, survivors, bedridden seniors, and everyday
          individuals
        </Bold>{" "}
        who are courageously working to rebuild their lives. Together, we create
        lasting impact through holistic programs in education, wellness, and
        community empowerment. Membership begins at just $50 per month, and
        every contribution helps us <Bold>feed, educate, and restore hope</Bold>
        .
      </p>

      <p>
        As a member, you’ll receive meaningful <Bold>exclusive benefits</Bold>,
        including special discounts from our community partners and branded
        items such as a Source of Hope apron, shirt, or hat, our way of saying
        thank you for standing with us.
      </p>
    </section>
  );
}
