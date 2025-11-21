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
    </PageSection>
  );
}
