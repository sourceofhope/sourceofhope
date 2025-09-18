import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import ExpressiveLink from "../ui/ExpressiveLink";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        open ? "h-[40vh] md:h-[10vh]" : "h-[10vh]"
      } ${
        scrolled
          ? "bg-primary-identity text-primary-background"
          : "bg-transparent text-primary-identity"
      }`}
    >
      <div className="flex w-full h-[10vh] items-center justify-between px-5">
        <h1 className="text-lg">The Source Of Hope</h1>
        <nav className="hidden md:flex gap-6">
          <HeaderNavigator />
        </nav>
        <HeaderMenu open={open} setOpen={setOpen} />
      </div>
      {open ? (
        <nav className="flex flex-col justify-end items-center gap-5 p-5 h-[30vh] md:hidden">
          <HeaderNavigator />
        </nav>
      ) : null}
    </header>
  );
}

function HeaderMenu({ open, setOpen }) {
  return (
    <button onClick={() => setOpen(!open)} className="block md:hidden">
      {open ? (
        <XMarkIcon className="w-[1em] h-[1em]" aria-hidden="true" />
      ) : (
        <Bars3Icon className="w-[1em] h-[1em]" aria-hidden="true" />
      )}
    </button>
  );
}

function HeaderNavigator() {
  return (
    <>
      <ExpressiveLink>About</ExpressiveLink>
      <ExpressiveLink>Serve</ExpressiveLink>
      <ExpressiveLink>Connect</ExpressiveLink>
      <ExpressiveLink>Media</ExpressiveLink>
      <ExpressiveLink>Resources</ExpressiveLink>
    </>
  );
}
