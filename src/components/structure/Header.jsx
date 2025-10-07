import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import ExpressiveLink from "../ui/expressive/ExpressiveLink";
import Favicon from "../ui/Favicon";
import { useLocation } from "react-router-dom";

export default function Header({ isError }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/sourceofhope/";

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`backdrop-filter fixed top-0 left-0 right-0 z-50 w-full overflow-hidden transition-[height_backdrop] duration-500 border-b-4 border-primary-800/0 md:border-none
        ${
          open
            ? `h-85 md:h-25 md:backdrop-blur-none backdrop-blur-sm ${
                isHomePage || isError ? "border-primary-800/100" : "border-neutral-50"
              }`
            : "h-25 backdrop-blur-none"
        }
        ${
          scrolled
            ? `bg-primary-800 text-neutral-50 border-transparent`
            : `bg-transparent ${
                isHomePage || isError ? "text-primary-800" : "text-neutral-50"
              }`
        }`}>
      <section className="flex w-full h-25 items-center justify-between px-5 lg:px-35">
        <Favicon className="w-[60px] h-[60px]" />
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
  );
}

function HeaderMenu({ open, setOpen }) {
  return (
    <button
      onClick={() => setOpen((open) => !open)}
      className="block md:hidden"
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}>
      {open ? (
        <XMarkIcon className="w-[16px] h-[16px]" aria-hidden="true" />
      ) : (
        <Bars3Icon className="w-[16px] h-[16px]" aria-hidden="true" />
      )}
    </button>
  );
}

function HeaderNavigator() {
  const links = [
    { label: "ABOUT", to: "/sourceofhope/about" },
    { label: "SERVE", to: "" },
    { label: "CONNECT", to: "" },
    { label: "MEDIA", to: "" },
    { label: "RESOURCES", to: "" },
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
