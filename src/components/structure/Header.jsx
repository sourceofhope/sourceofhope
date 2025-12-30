import { useState, useEffect, useContext, createContext } from "react";
import {
  Bars3Icon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

import Favicon from "../ui/Favicon";

import { CANONICAL } from "../../routes";
import { fetchContent } from "../../cms";
import { NavLink } from "react-router-dom";

export default function Header({ isBlocking }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const [banner, setBanner] = useState(null);
  const [bannerOpen, setBannerOpen] = useState(true);

  const bannerActive =
    bannerOpen &&
    banner?.acf?.enabled &&
    new Date(banner?.acf?.expires) >= Date.now();

  useEffect(() => {
    fetchContent("/banner-configuration?per_page=1&_embed")
      .then((data) => {
        if (!data?.length) return setBanner(null);
        setBanner(data[0]);
      })
      .catch(() => setBanner(null));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {bannerActive && (
        <HeaderBanner
          href={banner?.acf?.link?.url}
          text={banner?.acf?.text}
          open={bannerOpen}
          setOpen={setBannerOpen}
        />
      )}
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

function HeaderBanner({ href = "", text = "Donate Today!", open, setOpen }) {
  return open ? (
    <div className="flex gap-3 justify-between md:justify-center h-15 md:h-10 items-center px-5 lg:px-35 bg-accent-500 border-b-2 text-accent-800 border-accent-600 fixed top-0 left-0 right-0 z-50 w-full overflow-hidden">
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
        <XMarkIcon className="w-[1.5rem] h-[1.5rem]" aria-hidden="true" />
      ) : (
        <Bars3Icon className="w-[1.5rem] h-[1.5rem]" aria-hidden="true" />
      )}
    </button>
  );
}

function HeaderNavigator() {
  const [hovering, setHovering] = useState(null);

  const links = [
    {
      label: "ABOUT",
      to: {
        main: CANONICAL.about,
      },
    },
    {
      label: "SERVE",
      to: {
        main: CANONICAL.serve,
      },
    },
    {
      label: "CONNECT",
      to: {
        main: CANONICAL.connect,
      },
    },
    {
      label: "MEDIA",
      to: {
        main: CANONICAL.media,
      },
    },
    {
      label: "MEMBERS",
      to: {
        main: CANONICAL.member,
      },
    },
  ];

  return (
    <>
      {links.map(({ label, to }) => {
        return (
          <div key={label} className="py-2.5 h-full w-full font-bold">
            <HeaderButton
              className={
                hovering
                  ? hovering == label
                    ? ""
                    : "text-neutral-300/50 scale-90"
                  : ""
              }
              setHovering={setHovering}
              to={to.main}
              label={label}
            />
          </div>
        );
      })}
    </>
  );
}

function HeaderButton({ ariaLabel, label, className, to, setHovering }) {
  return (
    <NavLink
      aria-label={ariaLabel}
      onMouseEnter={() => setHovering(label)}
      onMouseLeave={() => setHovering(null)}
      to={to}
      className={`!no-underline text-sm md:text-md group transition-[color_transform] ease-in-out duration-300 inline-flex w-full justify-between items-center gap-1 focus:outline-none ${className}`}>
      <span>{label}</span>
      <ChevronRightIcon
        className="w-[1.5rem] h-[1.5rem] transition-transform duration-500 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </NavLink>
  );
}

export const HeaderFlagContext = createContext({
  isBlocking: false,
  setIsBlocking: () => {},
});
export const useHeaderFlag = () => useContext(HeaderFlagContext);
