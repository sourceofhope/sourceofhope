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
import Icon from "../ui/Icon";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const [banner, setBanner] = useState(null);
  const [bannerOpen, setBannerOpen] = useState(true);

  const { isBlocking, bannerActive, setBannerActive } = useHeaderContext();

  useEffect(() => {
    const active =
      bannerOpen &&
      banner?.acf?.enabled &&
      new Date(banner?.acf?.expires) >= Date.now();

    setBannerActive(active);
  }, [bannerOpen, banner, setBannerActive]);

  const fetchBanner = () => {
    fetchContent("/banner-configuration?per_page=1&_embed")
      .then((data) => {
        if (!data?.length) return setBanner(null);
        setBanner(data[0]);
      })
      .catch(() => setBanner(null));
  };

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(fetchBanner);
    } else {
      setTimeout(fetchBanner, 1);
    }
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
        } left-0 right-0 z-[9998] text-sm md:text-md w-full transition-[height_backdrop] ease-in duration-200 md:border-none
          ${
            open
              ? `md:backdrop-blur-none backdrop-blur-sm shadow-lg ${
                  isBlocking ? "border-primary-800/100 " : "border-neutral-50"
                }`
              : "shadow-none backdrop-blur-none border-none"
          }
          ${
            scrolled
              ? `bg-primary-800 text-neutral-50 border-transparent`
              : `bg-transparent ${open ? "border-b-4" : null} ${
                  isBlocking ? "text-primary-800" : "text-neutral-50"
                }`
          }`}>
        <section className="flex gap-5 w-full items-center justify-between px-5 lg:px-35">
          <div className="h-25 flex gap-5 flex-row items-center w-fit z-0 overflow-clip">
            <Favicon />
            <h1 className="font-bold hidden lg:block whitespace-nowrap text-ellipsis overflow-hidden">
              THE SOURCE OF HOPE
            </h1>
          </div>
          <nav className="hidden md:flex gap-3 z-10" aria-label="Primary">
            <HeaderNavigator />
          </nav>
          <HeaderMenu open={open} setOpen={setOpen} />
        </section>
        <div
          className={`md:hidden transition-opacity duration-500 ease-out ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}>
          {open && (
            <nav
              className="flex flex-col justify-end items-center px-5 pb-5 h-fit"
              aria-label="Mobile">
              <HeaderNavigator />
            </nav>
          )}
        </div>
      </header>
    </>
  );
}

function HeaderBanner({ href = "", text = "Donate Today!", open, setOpen }) {
  return open ? (
    <div className="flex gap-3 justify-between md:justify-center h-15 md:h-10 items-center px-5 lg:px-35 bg-accent-500 border-b-2 text-neutral-50 border-accent-700 fixed top-0 left-0 right-0 z-50 w-full overflow-hidden">
      <a href={href} className="hover:underline font-semibold">
        {text}
      </a>
      <button
        className="justify-self-end"
        aria-label="Close banner"
        onClick={() => setOpen((open) => false)}
        aria-expanded={open}>
        <Icon>
          <XMarkIcon className="w-6 h-6" />
        </Icon>
      </button>
    </div>
  ) : null;
}

function HeaderMenu({ open, setOpen }) {
  return (
    <button
      className="block md:hidden"
      onClick={() => setOpen((open) => !open)}
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}>
      <Icon>
        {open ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </Icon>
    </button>
  );
}

function HeaderNavigator() {
  const [hovering, setHovering] = useState(null);

  const links = [
    {
      label: "SERVE",
      route: CANONICAL.serve,
      children: [
        { label: "SERVING & SHARING HOPE", route: CANONICAL.serve.servingHope },
        { label: "EDUCATION FOR HOPE", route: CANONICAL.serve.educationHope },
        { label: "WELLNESS OF HOPE", route: CANONICAL.serve.wellnessHope },
        { label: "HOPE FOR THE OUTDOORS", route: CANONICAL.serve.outdoorHope },
        {
          label: "INTERNATIONAL HOPE",
          route: CANONICAL.serve.internationalHope,
        },
      ],
    },
    {
      label: "ABOUT",
      route: CANONICAL.about,
      children: [{ label: "TEAM", route: CANONICAL.about.team }],
    },

    {
      label: "CONNECT",
      route: CANONICAL.connect,
    },
    {
      label: "MEDIA",
      route: CANONICAL.media,
      children: [
        { label: "PRESS", route: CANONICAL.media.press },
        { label: "PODCAST", route: CANONICAL.media.podcast },
      ],
    },
    {
      label: "MEMBERS",
      route: CANONICAL.member,
    },
    {
      label: "STORE",
      route: CANONICAL.storefront,
    },
  ];

  return (
    <>
      {links.map(({ label, route, children }) => {
        return (
          <HeaderButton
            key={label}
            className={`
                py-2.5 h-full w-full font-bold
                ${
                  hovering
                    ? hovering == label
                      ? "opacity-100"
                      : "opacity-80"
                    : ""
                }`}
            hovering={hovering}
            setHovering={setHovering}
            route={route}
            children={children || []}
            label={label}
          />
        );
      })}
    </>
  );
}

function HeaderButton({
  ariaLabel,
  label,
  className,
  route,
  children,
  hovering,
  setHovering,
}) {
  return (
    <div
      className="w-full select-none"
      onMouseEnter={() => setHovering(label)}
      onClick={() => setHovering(label === hovering ? null : label)}
      onMouseLeave={() => setHovering(null)}>
      <NavLink
        aria-label={ariaLabel}
        to={route.absolute}
        className={`!no-underline group transition-[color_transform] ease-in-out duration-300 inline-flex w-full justify-between items-center gap-1 focus:outline-none ${className}`}>
        <span>{label}</span>
        <Icon>
          <ChevronRightIcon
            className={`w-6 h-6 transition-transform duration-500 ${
              hovering === label && children.length > 0
                ? "rotate-90"
                : "rotate-0 group-hover:translate-x-1"
            }`}
            onClick={(e) => {
              if (children.length > 0) {
                e.preventDefault();
                e.stopPropagation();
              }

              setHovering(label === hovering ? null : label);
            }}
            focusable="false"
            aria-hidden="true"
            role="presentation"
          />
        </Icon>
      </NavLink>
      {hovering == label && children.length > 0 && (
        <>
          <div className="absolute hidden md:flex z-50 bg-neutral-50 min-w-40 rounded-lg p-3 py-5 shadow-md text-accent-800 flex-col font-semibold text-sm">
            {children.map(({ label, route }) => {
              return (
                <NavLink
                  className="py-2.5 hover:bg-neutral-200 duration-300 transition-colors !no-underline px-3 rounded-md"
                  key={route.absolute}
                  to={route.absolute}>
                  {label}
                </NavLink>
              );
            })}
          </div>
          {children.map(({ label, route }) => {
            return (
              <NavLink
                onClick={(e) => {
                  e.stopPropagation();
                }}
                aria-label={ariaLabel}
                to={route.absolute}
                className={`pl-5 md:hidden !no-underline group transition-[color_transform] ease-in-out duration-300 inline-flex w-full justify-between items-center gap-1 focus:outline-none ${className}`}>
                {label}
              </NavLink>
            );
          })}
        </>
      )}
    </div>
  );
}

export function useHeaderBlocking() {
  const { isBlocking } = useHeaderContext();
  return isBlocking;
}

export function useSetHeaderBlocking() {
  const { setIsBlocking } = useHeaderContext();
  return setIsBlocking;
}

export const HeaderFlagContext = createContext({
  bannerActive: false,
  setBannerActive: () => {},
  isBlocking: false,
  setIsBlocking: () => {},
});

export const useHeaderContext = () => useContext(HeaderFlagContext);
