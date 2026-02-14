import Header, { HeaderFlagContext } from "../structure/Header";
import { useState } from "react";
import { CANONICAL } from "../../routes";
import { StoreCartProvider } from "../../context/StoreCartContext";
import Footer from "../structure/Footer";
import ExpressiveLink from "../ui/expressive/ExpressiveLink";

export default function ErrorLayout({ code = 500, message }) {
  const defaults = {
    403: "Sorry, you don't have permission to access this page.",
    404: "Sorry, we couldn’t find the page you were looking for.",
    418: "I'm a teapot. (But seriously, something went wrong).",
    500: "Oops! Something went wrong on our end.",
  };
  const display = defaults[code] || "An unexpected error occurred.";

  const [isBlocking, setIsBlocking] = useState(false);
  const [bannerActive, setBannerActive] = useState(false);

  return (
    <HeaderFlagContext.Provider
      value={{ bannerActive, setBannerActive, isBlocking, setIsBlocking }}>
      <StoreCartProvider>
        <Header />
        <main className="w-full min-h-screen flex flex-col justify-center items-start gap-5 px-5 lg:px-35 text-sm md:text-md lg:text-lg">
          <h2 className="text-lg font-semibold">
            Error {code}:{" "}
            <span className="font-mono font-normal">{message}</span>
          </h2>
          <p className="text-md">{display}</p>
          <p className="text-md">
            If you are unable to resolve this error, please contact{" "}
            <a
              className="font-semibold text-accent-500"
              href={`mailto:it@thesourceofhope.org?subject=Website Error Code ${code}: ${message}`}>
              it@thesourceofhope.org
            </a>{" "}
            for further assistance.
          </p>
          <button className="border-5 rounded-2xl font-bold w-fit px-10 py-5 bg-accent-500 border-accent-500 text-neutral-50/75 hover:text-neutral-50/95 transition-colors">
            <ExpressiveLink to={CANONICAL.home.absolute}>
              GO HOME
            </ExpressiveLink>
          </button>
        </main>
        <Footer />
      </StoreCartProvider>
    </HeaderFlagContext.Provider>
  );
}
