import { Helmet } from "react-helmet";
import Title from "../../components/ui/text/Title";
import Heading from "../../components/ui/text/Heading";
import { useHeaderFlag } from "../../components/structure/Header";
import { useEffect } from "react";

export default function StorefrontPage() {
  const { setIsBlocking } = useHeaderFlag();

  useEffect(() => {
    setIsBlocking(true);
    return () => setIsBlocking(false);
  }, [setIsBlocking]);

  return (
    <>
      <Helmet>/* TODO */</Helmet>
      <section className="w-full min-h-screen pt-25 px-5 lg:px-35">
        <div>
          <Title>Store</Title>
          <Heading>Shop at The Source of Hope</Heading>
        </div>
      </section>
    </>
  );
}
