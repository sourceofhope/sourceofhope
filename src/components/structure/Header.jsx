import { useState, useEffect, useCallback } from "react";
import {
  Bars3Icon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useHeaderContext } from "../../context/HeaderContext";
import Favicon from "../ui/Favicon";

import { CANONICAL } from "../../routes";
import { fetchContent } from "../../cms";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "../ui/Icon";

function getHeaderLinks() {
  return [
    {
      label: "ABOUT",
      route: CANONICAL.about,
      children: [{ label: "TEAM", route: CANONICAL.about.team }],
    },
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
    { label: "MEMBERS", route: CANONICAL.member },
    { label: "CONNECT", route: CANONICAL.connect },
    {
      label: "MEDIA",
      route: CANONICAL.media,
      children: [
        { label: "PRESS", route: CANONICAL.media.press },
        { label: "PODCAST", route: CANONICAL.media.podcast },
      ],
    },
    { label: "STORE", route: CANONICAL.storefront },
  ];
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const [banner, setBanner] = useState(null);
  const [bannerOpen, setBannerOpen] = useState(true);

  const header = useHeaderContext() ?? {};
  const {
    isBlocking = false,
    bannerActive = false,
    setBannerActive = () => {},
  } = header;

  useEffect(() => {
    const active =
      bannerOpen &&
      banner?.acf?.enabled &&
      new Date(banner?.acf?.expires).getTime() >= Date.now();

    setBannerActive(active);
  }, [bannerOpen, banner, setBannerActive]);

  const fetchBanner = useCallback(() => {
    fetchContent("/banner-configuration?per_page=1&_embed")
      .then((data) => {
        if (!data?.length) return setBanner(null);
        setBanner(data[0]);
      })
      .catch(() => setBanner(null));
  }, []);

  useEffect(() => {
    setTimeout(fetchBanner, 0);
  }, [fetchBanner]);

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
          link={banner?.acf?.link?.url}
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
              : `bg-transparent ${open ? "border-b-4" : ""} ${
                  isBlocking ? "text-primary-800" : "text-neutral-50"
                }`
          }`}>
        <section className="flex gap-5 h-15 md:h-20 w-full items-center justify-between px-5 lg:px-35">
          <NavLink
            to={CANONICAL.home.absolute}
            onClick={(e) => setOpen(false)}
            aria-label="Go Home"
            className="!no-underline h-full flex gap-5 flex-row items-center w-fit z-0 overflow-clip">
            <Favicon />
            <h1 className="font-bold hidden lg:block whitespace-nowrap text-ellipsis overflow-hidden">
              THE SOURCE OF HOPE
            </h1>
          </NavLink>

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
              <HeaderNavigator isMobile open={open} />
            </nav>
          )}
        </div>
      </header>
    </>
  );
}

function HeaderBanner({ link = "", text = "Donate Today!", open, setOpen }) {
  if (!open) return null;

  const isExternal = link?.startsWith("https://");

  return (
    <div
      className="flex gap-3 justify-between md:justify-center h-15 md:h-10 items-center px-5 lg:px-35 bg-accent-500 border-b-2 text-neutral-50 border-accent-700 fixed top-0 left-0 right-0 z-[9998] w-full overflow-hidden"
      role="region"
      aria-label="Site banner">
      {isExternal ? (
        <a href={link} className="hover:underline font-semibold">
          {text}
        </a>
      ) : (
        <Link to={link} className="hover:underline font-semibold">
          {text}
        </Link>
      )}

      <button
        type="button"
        className="justify-self-end z-[9999]"
        aria-label="Close banner"
        onClick={() => setOpen(false)}>
        <Icon>
          <XMarkIcon className="w-6 h-6" aria-hidden="true" focusable="false" />
        </Icon>
      </button>
    </div>
  );
}

function HeaderMenu({ open, setOpen }) {
  return (
    <button
      type="button"
      className="block md:hidden"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}>
      <Icon>
        {open ? (
          <XMarkIcon className="w-6 h-6" aria-hidden="true" focusable="false" />
        ) : (
          <Bars3Icon className="w-6 h-6" aria-hidden="true" focusable="false" />
        )}
      </Icon>
    </button>
  );
}

function HeaderNavigator({ isMobile = false, open }) {
  const links = getHeaderLinks();
  return isMobile ? (
    <MobileNavigator links={links} open={open} />
  ) : (
    <DesktopNavigator links={links} />
  );
}

function DesktopNavigator({ links }) {
  const [hovering, setHovering] = useState(null);

  return (
    <nav className="flex flex-row gap-5">
      {links.map(({ label, route, children }) => (
        <DesktopNavigatorItem
          key={label}
          label={label}
          route={route}
          children={children || []}
          hovering={hovering}
          setHovering={setHovering}
          className={`
            py-2.5 h-full w-full font-bold
            ${
              hovering
                ? hovering === label
                  ? "opacity-100"
                  : "opacity-80"
                : ""
            }`}
        />
      ))}
    </nav>
  );
}

function DesktopNavigatorItem({
  ariaLabel,
  label,
  className,
  route,
  children,
  hovering,
  setHovering,
}) {
  const isOpen = hovering === label;
  const hasChildren = children.length > 0;

  return (
    <div className="w-full select-none relative">
      <NavLink
        onMouseEnter={() => setHovering(label)}
        onMouseLeave={() => setHovering(null)}
        aria-label={ariaLabel}
        to={route.absolute}
        className={`!no-underline group transition-[color_transform] ease-in-out duration-300 inline-flex w-full justify-between items-center gap-1 focus:outline-none ${className}`}>
        <span>{label}</span>
        <Icon>
          <ChevronRightIcon
            className={`w-6 h-6 transition-transform duration-500 ${
              isOpen && hasChildren
                ? "rotate-90"
                : "rotate-0 group-hover:translate-x-1"
            }`}
            onClick={(e) => {
              if (!hasChildren) return;
              e.preventDefault();
              e.stopPropagation();
              setHovering(isOpen ? null : label);
            }}
            focusable="false"
            aria-hidden="true"
            role="presentation"
          />
        </Icon>
      </NavLink>

      {hasChildren && (
        <div
          onMouseEnter={() => setHovering(label)}
          onMouseLeave={() => setHovering(null)}
          className={`${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 -translate-y-1 pointer-events-none"
          } absolute hidden md:flex z-50 transition-[opacity_transform] delay-150 duration-300 bg-neutral-50 min-w-40 w-max rounded-lg p-3 py-5 shadow-md text-accent-800 flex-col font-semibold text-sm`}>
          {children.map(({ label: childLabel, route: childRoute }) => (
            <NavLink
              className="py-2.5 hover:bg-neutral-200 duration-300 transition-colors !no-underline px-3 rounded-md"
              key={childRoute.absolute}
              to={childRoute.absolute}>
              {childLabel}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNavigator({ links, open }) {
  const navigate = useNavigate();

  const root = { title: "BACK", route: null, items: links };
  const [stack, setStack] = useState([root]);

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!open) {
      setStack([root]);
      setVisible(true);
    }
  }, [open]);

  const current = stack[stack.length - 1];
  const canGoBack = stack.length > 1;

  const transition = (nextStack) => {
    // Fade out
    setVisible(false);

    setTimeout(() => {
      setStack(nextStack);
      // Fade in
      setVisible(true);
    }, 150);
  };

  const goBack = () => {
    if (!canGoBack) return;
    transition(stack.slice(0, -1));
  };

  const openChildren = (parent) => {
    transition([
      ...stack,
      {
        title: parent.label,
        route: parent.route,
        items: parent.children || [],
      },
    ]);
  };

  const goTo = (e, to) => {
    e.preventDefault();
    if (!to) return;
    navigate(to);
  };

  return (
    <nav className="w-full">
      <div
        className={`transition-opacity duration-200 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}>
        {canGoBack && (
          <button
            type="button"
            onClick={goBack}
            className="py-2.5 w-full group font-bold inline-flex items-center justify-between gap-2"
            aria-label="Back">
            <span>{stack[stack.length - 2]?.title || "BACK"}</span>
            <Icon>
              <ChevronRightIcon
                className="w-6 h-6 rotate-180 transition-transform duration-500 group-hover:-translate-x-1"
                focusable="false"
                aria-hidden="true"
                role="presentation"
              />
            </Icon>
          </button>
        )}

        {current.items.map((item) => {
          const hasChildren = (item.children || []).length > 0;

          return (
            <div key={item.route.absolute} className="w-full">
              <NavLink
                to={item.route.absolute}
                className="!no-underline py-2.5 h-full w-full group font-bold inline-flex justify-between items-center gap-1"
                onClick={(event) => {
                  if (hasChildren) {
                    openChildren(item);
                  } else {
                    goTo(event, item.route.absolute);
                  }
                }}
                aria-label={item.label}>
                <span className="text-left">{item.label}</span>
                <Icon>
                  <ChevronRightIcon
                    className="w-6 h-6 transition-transform duration-500 rotate-0 group-hover:translate-x-1"
                    focusable="false"
                    aria-hidden="true"
                    role="presentation"
                  />
                </Icon>
              </NavLink>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
