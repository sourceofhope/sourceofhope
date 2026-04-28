"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHeaderContext } from "@/context/HeaderContext";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import { ASSET_VERSION } from "@/lib/environment";

interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

const getHeaderLinks = (): NavLink[] => [
  {
    label: "ABOUT",
    href: "/about",
    children: [{ label: "TEAM", href: "/about/team" }],
  },
  {
    label: "SERVE",
    href: "/serve",
    children: [
      { label: "SERVING & SHARING HOPE", href: "/serve/servingHope" },
      { label: "EDUCATION FOR HOPE", href: "/serve/educationHope" },
      { label: "WELLNESS OF HOPE", href: "/serve/wellnessHope" },
      { label: "HOPE FOR THE OUTDOORS", href: "/serve/outdoorHope" },
      { label: "INTERNATIONAL HOPE", href: "/serve/internationalHope" },
    ],
  },
  {
    label: "MEMBERS",
    href: "/members",
    children: [
      { label: "PLANNED GIVING", href: "/giving" },
      {
        label: "QUICK DONATE",
        href: "/donate",
      },
    ],
  },
  { label: "CONNECT", href: "/connect" },
  {
    label: "MEDIA",
    href: "/media",
    children: [
      { label: "PRESS", href: "/media/press" },
      { label: "PODCAST", href: "/media/podcast" },
    ],
  },
  { label: "STORE", href: "/store" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  const header = useHeaderContext() ?? {};
  const { isBlocking = false, bannerActive = false } = header;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (previousPathname.current === pathname) return;

    previousPathname.current = pathname;

    if (!open) return;

    const activeItem = getHeaderLinks().find(
      (item) => item.href === pathname && item.children?.length,
    );

    if (!activeItem) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
    }
  }, [open, pathname]);

  return (
    <>
      {bannerActive && bannerOpen && (
        <HeaderBanner onClose={() => setBannerOpen(false)} />
      )}
      {isBlocking && bannerActive && bannerOpen ? (
        <div className="h-15 md:h-10" />
      ) : null}
      <header
        className={`backdrop-filter fixed ${
          bannerActive && bannerOpen ? "top-15 md:top-10" : "top-0"
        } left-0 right-0 z-9998 text-sm md:text-md w-full transition-[height_backdrop] ease-in duration-200 md:border-none
          ${
            open
              ? `md:backdrop-blur-none backdrop-blur-sm shadow-lg ${
                  isBlocking ? "border-primary-800 " : "border-neutral-50"
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
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label="Go Home"
            className="no-underline! h-full flex gap-5 flex-row items-center w-fit z-0 overflow-clip">
            <Favicon />
            <h1 className="font-bold hidden lg:block whitespace-nowrap text-ellipsis overflow-hidden">
              THE SOURCE OF HOPE
            </h1>
          </Link>

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
              <HeaderNavigator
                isMobile={true}
                open={open}
                setOpen={setOpen}
              />
            </nav>
          )}
        </div>
      </header>
    </>
  );
}

function Favicon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/${ASSET_VERSION}/core/TSOH-Favicon.webp`}
      alt="The Source of Hope"
      className="size-10 md:size-12 object-contain"
    />
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function HeaderBanner({ onClose }: { onClose: () => void }) {
  const bannerText = "Donate Today!";
  const bannerLink = "/donate";

  return (
    <div
      className="flex gap-3 justify-between md:justify-center h-15 md:h-10 items-center px-5 lg:px-35 bg-accent-500 border-b-2 text-neutral-50 border-accent-700 fixed top-0 left-0 right-0 z-9998 w-full overflow-hidden"
      role="region"
      aria-label="Site banner">
      <Link href={bannerLink} className="hover:underline font-semibold">
        {bannerText}
      </Link>

      <button
        type="button"
        className="justify-self-end z-9999"
        aria-label="Close banner"
        onClick={onClose}>
        <Icon>
          <XMarkIcon className="w-6 h-6" aria-hidden="true" />
        </Icon>
      </button>
    </div>
  );
}

function HeaderMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      className="block md:hidden"
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}>
      <Icon>
        {open ? (
          <XMarkIcon className="w-6 h-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="w-6 h-6" aria-hidden="true" />
        )}
      </Icon>
    </button>
  );
}

function HeaderNavigator({
  isMobile = false,
  open,
  setOpen,
}: {
  isMobile?: boolean;
  open?: boolean;
  setOpen?: (value: boolean) => void;
}) {
  const links = getHeaderLinks();
  return isMobile ? (
    <MobileNavigator links={links} open={open ?? false} setOpen={setOpen} />
  ) : (
    <DesktopNavigator links={links} />
  );
}

function DesktopNavigator({ links }: { links: NavLink[] }) {
  const [hovering, setHovering] = useState<string | null>(null);

  return (
    <nav className="flex flex-row gap-5">
      {links.map(({ label, href, children }) => (
        <DesktopNavigatorItem
          key={label}
          label={label}
          href={href}
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
            }`}>
          {children || []}
        </DesktopNavigatorItem>
      ))}
    </nav>
  );
}

function DesktopNavigatorItem({
  label,
  href,
  children,
  hovering,
  setHovering,
  className,
}: {
  label: string;
  href: string;
  children: NavLink[];
  hovering: string | null;
  setHovering: (value: string | null) => void;
  className?: string;
}) {
  const isOpen = hovering === label;
  const hasChildren = children.length > 0;

  return (
    <div className="w-full select-none relative">
      <Link
        href={href}
        onMouseEnter={() => setHovering(label)}
        onMouseLeave={() => setHovering(null)}
        className={`no-underline! group transition-[color_transform] ease-in-out duration-300 inline-flex w-full justify-between items-center gap-1 focus:outline-none ${className}`}>
        <span>{label}</span>
        <Icon>
          <ChevronRightIcon
            className={`w-6 h-6 transition-transform duration-500 ${
              isOpen && hasChildren
                ? "rotate-90"
                : "rotate-0 group-hover:translate-x-1"
            }`}
            onClick={(e: React.MouseEvent) => {
              if (!hasChildren) return;
              e.preventDefault();
              e.stopPropagation();
              setHovering(isOpen ? null : label);
            }}
            aria-hidden="true"
          />
        </Icon>
      </Link>

      {hasChildren && (
        <div
          onMouseEnter={() => setHovering(label)}
          onMouseLeave={() => setHovering(null)}
          className={`${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 -translate-y-1 pointer-events-none"
          } absolute hidden md:flex z-50 transition-[opacity_transform] delay-150 duration-300 bg-neutral-50 min-w-40 w-max rounded-lg p-3 py-5 shadow-md text-accent-800 flex-col font-semibold text-sm`}>
          {children.map(({ label: childLabel, href: childHref }) => (
            <Link
              className="py-2.5 hover:bg-neutral-200 duration-300 transition-colors no-underline! px-3 rounded-md"
              key={childHref}
              href={childHref}>
              {childLabel}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNavigator({
  links,
  open,
  setOpen,
}: {
  links: NavLink[];
  open: boolean;
  setOpen?: (value: boolean) => void;
}) {
  interface StackItem {
    title: string;
    href: string | null;
    items: NavLink[];
  }

  const root: StackItem = useMemo(
    () => ({ title: "BACK", href: null, items: links }),
    [links],
  );
  const [stack, setStack] = useState<StackItem[]>([root]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStack([root]);
      setVisible(true);
    }
  }, [open, root]);

  const current = stack[stack.length - 1];
  const canGoBack = stack.length > 1;

  const transition = (nextStack: StackItem[]) => {
    setVisible(false);

    setTimeout(() => {
      setStack(nextStack);
      setVisible(true);
    }, 150);
  };

  const goBack = () => {
    if (!canGoBack) return;
    transition(stack.slice(0, -1));
  };

  const openChildren = (parent: NavLink) => {
    transition([
      ...stack,
      {
        title: parent.label,
        href: parent.href,
        items: parent.children || [],
      },
    ]);
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
                aria-hidden="true"
              />
            </Icon>
          </button>
        )}

        {current.items.map((item) => {
          const hasChildren = (item.children || []).length > 0;

          return (
            <div key={item.href} className="w-full">
              <Link
                href={item.href}
                className="no-underline! py-2.5 h-full w-full group font-bold inline-flex justify-between items-center gap-1"
                onClick={() => {
                  if (hasChildren) {
                    openChildren(item);
                    return;
                  }

                  setOpen?.(false);
                }}>
                <span className="text-left">{item.label}</span>
                <Icon>
                  <ChevronRightIcon
                    className="w-6 h-6 transition-transform duration-500 rotate-0 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Icon>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
