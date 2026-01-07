import { Helmet } from "react-helmet";
import { useHeaderFlag } from "../../components/structure/Header";
import { useEffect } from "react";
import StorefrontProductSection from "./sections/StorefrontProductSection";
import StorefrontFooterSection from "./sections/StorefrontFooterSection";

export default function StorefrontPage() {
  const { setIsBlocking } = useHeaderFlag();

  useEffect(() => {
    setIsBlocking(true);
    return () => setIsBlocking(false);
  }, [setIsBlocking]);

  return (
    <>
      <Helmet>/* TODO */</Helmet>
      <StorefrontProductSection />
      <StorefrontFooterSection />
    </>
  );
}
