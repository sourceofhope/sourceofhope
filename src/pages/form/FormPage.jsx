import { Helmet } from "react-helmet";
import { CANONICAL_URL } from "../../routes";
import { useSetHeaderBlocking } from "../../components/structure/Header";
import { useEffect } from "react";
import FormDescriptionSection from "./sections/FormDescriptionSection";
import FormInputSection from "./sections/FormInputSection";
import FormShowcaseSection from "./sections/FormShowcaseSection";
import Title from "../../components/ui/text/Title";
import Heading from "../../components/ui/text/Heading";

export default function FormPage() {
  const setBlocking = useSetHeaderBlocking();

  useEffect(() => {
    setBlocking(true);
    return () => setBlocking(false);
  }, [setBlocking]);
  return (
    <>
      <Helmet>
        <title>Program Sign-Up | The Source of Hope</title>
        <meta
          name="description"
          content="Join The Source of Hope’s mission by signing up for our community programs in Dallas–Fort Worth. Volunteer, mentor, or participate in initiatives that bring holistic health, education, and hope to those in need."
        />
        <link rel="canonical" href={CANONICAL_URL.member} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.member} />
        <meta
          property="og:title"
          content="Program Sign-Up | The Source of Hope"
        />
        <meta
          property="og:description"
          content="Be part of The Source of Hope’s volunteer and community programs. Sign up today to serve, learn, and make a difference through our holistic health, education, and outreach initiatives."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.member} />
        <meta
          name="twitter:title"
          content="Program Sign-Up | The Source of Hope"
        />
        <meta
          name="twitter:description"
          content="Join The Source of Hope’s mission by signing up for our community programs. Volunteer, learn, and serve with compassion throughout the Dallas–Fort Worth area."
        />
      </Helmet>
      <section className="md:justify-items-left items-center grid gap-5 pt-25 p-5 lg:px-35">
        <div className="grid gap-1 justify-self-start justify-start">
          <Title>Members</Title>
          <Heading>Become a Member Today</Heading>
        </div>
      </section>
      <FormDescriptionSection />
      <FormShowcaseSection />
      <FormInputSection />
    </>
  );
}
