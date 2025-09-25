import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import ExpressiveLink from "../ui/expressive/ExpressiveLink";
import { NavLink } from "react-router-dom";

export default function Header() {
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
      className={`fixed top-0 left-0 right-0 z-50 w-full overflow-hidden transition-all duration-300
        ${open ? "h-[40vh] md:h-[10vh]" : "h-[10vh]"}
        ${
          scrolled
            ? "bg-primary-identity text-primary-background"
            : "bg-transparent text-primary-identity"
        }`}
    >
      <section className="flex w-full h-[10vh] items-center justify-between px-5">
        <NavLink to="/" className="text-lg">
          ICON
        </NavLink>
        <nav className="hidden md:flex gap-6">
          <HeaderNavigator />
        </nav>
        <HeaderMenu open={open} setOpen={setOpen} />
      </section>
      <nav
        className={`${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        } will-change-[opacity,transform] transition-all duration-300 ease-out md:hidden flex flex-col justify-end items-center px-5 h-fit`}
        aria-hidden={!open}
      >
        <HeaderNavigator />
      </nav>
    </header>
  );
}

function HeaderMenu({ open, setOpen }) {
  return (
    <button
      onClick={() => setOpen((v) => !v)}
      className="block md:hidden"
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
    >
      {open ? (
        <XMarkIcon className="w-[1.25em] h-[1.25em]" aria-hidden="true" />
      ) : (
        <Bars3Icon className="w-[1em] h-[1em]" aria-hidden="true" />
      )}
    </button>
  );
}

function HeaderNavigator() {
  const links = [
    { label: "ABOUT", to: "" },
    { label: "SERVE", to: "" },
    { label: "CONNECT", to: "" },
    { label: "MEDIA", to: "" },
    { label: "RESOURCES", to: "" },
  ];

  return (
    <>
      {links.map(({ label, to }) => (
        <div className="py-2.5 h-full w-full">
          <ExpressiveLink key={label} to={to}>
            {label}
          </ExpressiveLink>
        </div>
      ))}
    </>
  );
}
