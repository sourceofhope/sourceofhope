"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHeaderContext } from "@/context/HeaderContext";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const ASSET_VERSION = "v2";

const navigationLinks = [
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
      { label: "QUICK DONATE", href: "https://donate.stripe.com/8wM5kHal16fC4so8ww" },
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
  const headerContext = useHeaderContext();

  const isBlocking = headerContext?.isBlocking ?? false;
  const bannerActive = headerContext?.bannerActive ?? false;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
        } left-0 right-0 z-[9998] text-sm md:text-md w-full transition-[height_backdrop] ease-in duration-200 md:border-none ${
          open
            ? `md:backdrop-blur-none backdrop-blur-sm shadow-lg ${
                isBlocking ? "border-primary-800/100" : "border-neutral-50"
              }`
            : "shadow-none backdrop-blur-none border-none"
        } ${
          scrolled
            ? "bg-primary-800 text-neutral-50 border-transparent"
            : `bg-transparent ${open ? "border-b-4" : ""} ${
                isBlocking ? "text-primary-800" : "text-neutral-50"
              }`
        }`}
      >
        <section className="flex gap-5 h-15 md:h-20 w-full items-center justify-between px-5 lg:px-35">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label="Go Home"
            className="!no-underline h-full flex gap-5 flex-row items-center w-fit z-0 overflow-clip"
          >
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
          }`}
        >
          {open && (
            <nav
              className="flex flex-col justify-end items-center px-5 pb-5 h-fit"
              aria-label="Mobile"
            >
              <HeaderNavigator isMobile={true} />
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
      src={`/${ASSET_VERSION}/core/TSOH-Logo.webp`}
      alt="The Source of Hope"
      className="h-12 w-12 object-contain"
    />
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
      aria-label={open ? "Close menu" : "Open menu"}
    >
      {open ? (
        <XMarkIcon className="w-6 h-6" aria-hidden="true" />
      ) : (
        <Bars3Icon className="w-6 h-6" aria-hidden="true" />
      )}
    </button>
  );
}

function HeaderNavigator({
  isMobile = false,
}: {
  isMobile?: boolean;
}) {
  return (
    <>
      {navigationLinks.map((link) => (
        <NavItem
          key={link.label}
          label={link.label}
          href={link.href}
          submenu={link.children}
          isMobile={isMobile}
        />
      ))}
    </>
  );
}

function NavItem({
  label,
  href,
  submenu,
  isMobile = false,
}: {
  label: string;
  href: string;
  submenu?: { label: string; href: string }[];
  isMobile?: boolean;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  if (isMobile) {
    return (
      <div className="w-full">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full py-2 text-center font-semibold flex items-center justify-center gap-2 hover:opacity-75 transition"
        >
          {label}
          {submenu && submenu.length > 0 && (
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>
        {dropdownOpen && submenu && submenu.length > 0 && (
          <div className="flex flex-col gap-2 py-2 px-3 bg-neutral-100/10">
            {submenu.map((child) => (
              <MobileNavLink
                key={child.label}
                label={child.label}
                href={child.href}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <Link
        href={href}
        className={`py-2 px-3 rounded transition font-semibold ${
          isActive
            ? "bg-primary-700/50 text-neutral-50"
            : "hover:bg-primary-700/30 text-current"
        }`}
      >
        {label}
      </Link>
      {submenu && submenu.length > 0 && (
        <div className="absolute left-0 top-full hidden group-hover:flex flex-col bg-primary-800 rounded shadow-lg overflow-hidden z-50">
          {submenu.map((child) => (
            <Link
              key={child.label}
              href={child.href}
              className="px-4 py-2 text-neutral-50 hover:bg-primary-700 transition whitespace-nowrap text-sm"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNavLink({ label, href }: { label: string; href: string }) {
  const isExternal = href.startsWith("http");
  
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm py-1 hover:opacity-75 transition"
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className="text-sm py-1 hover:opacity-75 transition">
      {label}
    </Link>
  );
}

function HeaderBanner({ onClose }: { onClose: () => void }) {
  const bannerText = "Donate Today!";
  const bannerLink = "https://donate.stripe.com/8wM5kHal16fC4so8ww";

  return (
    <div
      className="flex gap-3 justify-between md:justify-center h-15 md:h-10 items-center px-5 lg:px-35 bg-accent-500 border-b-2 text-neutral-50 border-accent-700 fixed top-0 left-0 right-0 z-[9998] w-full overflow-hidden"
      role="region"
      aria-label="Site banner"
    >
      <a
        href={bannerLink}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline font-semibold"
      >
        {bannerText}
      </a>

      <button
        type="button"
        className="justify-self-end z-[9999]"
        aria-label="Close banner"
        onClick={onClose}
      >
        <XMarkIcon className="w-6 h-6" aria-hidden="true" />
      </button>
    </div>
  );
}
