import { Helmet } from "react-helmet";
import { useSetHeaderBlocking } from "../../components/structure/Header";
import StorefrontProductSection from "./sections/StorefrontProductSection";
import StorefrontFooterSection from "./sections/StorefrontFooterSection";
import { useEffect } from "react";

export default function StorefrontPage() {
  const setBlocking = useSetHeaderBlocking();

  useEffect(() => {
    setBlocking(true);
    return () => setBlocking(false);
  }, [setBlocking]);

  return (
    <>
      <Helmet>/* TODO */</Helmet>
      <StorefrontProductSection />
      <StorefrontFooterSection />
    </>
  );
}
