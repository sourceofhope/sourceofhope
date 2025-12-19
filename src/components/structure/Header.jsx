import { useState, useEffect, useContext, createContext } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";

import ExpressiveLink from "../ui/expressive/ExpressiveLink";
import Favicon from "../ui/Favicon";

import { CANONICAL } from "../../routes";
import { fetchContent } from "../../cms";

export default function Header({ isBlocking }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [banner, setBanner] = useState(true);

  const [bannerMessage, setBannerMessage] = useState();

  const bannerActive = banner && banner.acf?.bannerMessage;

  useEffect(() => {
    fetchContent("bannerMessage")
      .then((data) => {
        setBannerMessage(data);
      })
      .catch(() => setBannerMessage(""));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {banner.acf?.bannerMessage ? (
        <HeaderBanner
          text="Welcome To The New Source of Hope 🎉"
          open={banner}
          setOpen={setBanner}
        />
      ) : null}
      {isBlocking && bannerActive ? <div className="h-15 md:h-10"></div> : null}
      <header
        className={`backdrop-filter fixed ${
          bannerActive ? "top-15 md:top-10" : "top-0"
        } left-0 right-0 z-50 w-full overflow-hidden transition-[height_backdrop] duration-500 border-b-4 md:border-none
          ${
            open
              ? `h-85 md:h-25 md:backdrop-blur-none backdrop-blur-sm ${
                  isBlocking ? "border-primary-800/100" : "border-neutral-50"
                }`
              : "h-25 backdrop-blur-none border-none"
          }
          ${
            scrolled
              ? `bg-primary-800 text-neutral-50 border-transparent`
              : `bg-transparent ${
                  isBlocking ? "text-primary-800" : "text-neutral-50"
                }`
          }`}>
        <section className="flex w-full h-25 items-center justify-between px-5 lg:px-35">
          <div className="flex flex-row gap-5 items-center">
            <Favicon className="w-[60px] h-[60px]" />
            <h1 className="hidden lg:block font-bold">THE SOURCE OF HOPE</h1>
          </div>

          <nav className="hidden md:flex gap-5">
            <HeaderNavigator />
          </nav>
          <HeaderMenu open={open} setOpen={setOpen} />
        </section>
        <nav
          className={`${
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } will-change-[opacity] transition-opacity duration-500 ease-out md:hidden flex flex-col justify-end items-center px-5 h-fit`}
          aria-hidden={!open}>
          <HeaderNavigator />
        </nav>
      </header>
    </>
  );
}

function HeaderBanner({ href, text, open, setOpen }) {
  return open ? (
    <div className="flex gap-3 justify-between md:justify-center h-15 md:h-10 items-center px-5 lg:px-35 bg-accent-500 border-y-2 text-accent-800 border-accent-600 fixed top-0 left-0 right-0 z-50 w-full overflow-hidden">
      <a href={href} className="hover:underline">
        {text}
      </a>
      <button
        className="justify-self-end"
        onClick={() => setOpen((open) => false)}
        aria-expanded={open}>
        <XMarkIcon className="w-[20px] h-[20px]" />
      </button>
    </div>
  ) : null;
}

function HeaderMenu({ open, setOpen }) {
  return (
    <button
      onClick={() => setOpen((open) => !open)}
      className="block md:hidden"
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}>
      {open ? (
        <XMarkIcon className="w-[20px] h-[20px]" aria-hidden="true" />
      ) : (
        <Bars3Icon className="w-[20px] h-[20px]" aria-hidden="true" />
      )}
    </button>
  );
}

function HeaderNavigator() {
  const links = [
    { label: "ABOUT", to: CANONICAL.about },
    { label: "SERVE", to: CANONICAL.serve },
    { label: "CONNECT", to: CANONICAL.connect },
    { label: "MEDIA", to: CANONICAL.media },
    { label: "MEMBERS", to: CANONICAL.member },
  ];

  return (
    <>
      {links.map(({ label, to }) => (
        <div key={label} className="py-2.5 h-full w-full font-bold">
          <ExpressiveLink to={to}>{label}</ExpressiveLink>
        </div>
      ))}
    </>
  );
}

export const HeaderFlagContext = createContext({
  isBlocking: false,
  setIsBlocking: () => {},
});
export const useHeaderFlag = () => useContext(HeaderFlagContext);
