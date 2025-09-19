import { useState, useEffect, useRef } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import ExpressiveLink from "../ui/ExpressiveLink";
import { NavLink } from "react-router-dom";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const menuReference = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (open && menuReference.current) {
      if(!window.scrollY > 0) {
        setShowItems(true)
        return;
      }
      const handleTransitionEnd = () => {
        setShowItems(true);
        menuReference.current.removeEventListener(
          "transitionend",
          handleTransitionEnd
        );
      };
      menuReference.current.addEventListener("transitionend", handleTransitionEnd);
    } else {
      setShowItems(false);
    }
  }, [open]);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        open ? "h-[35vh] md:h-[10vh]" : "h-[10vh]"
      } ${
        scrolled
          ? "bg-primary-identity text-primary-background"
          : "bg-transparent text-primary-identity"
      }`}
      ref={menuReference}
    >
      <div className="flex w-full h-[10vh] items-center justify-between px-5">
        <NavLink to="/" className="text-lg">
          THE SOURCE OF HOPE
        </NavLink>
        <nav className="hidden md:flex gap-6">
          <HeaderNavigator />
        </nav>
        <HeaderMenu open={open} setOpen={setOpen} />
      </div>
      {showItems ? (
        <nav className="flex flex-col justify-end items-center mt-10 gap-5 p-5 h-[20vh] md:hidden">
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
        <XMarkIcon className="w-[1.25em] h-[1.25em]" aria-hidden="true" />
      ) : (
        <Bars3Icon className="w-[1em] h-[1em]" aria-hidden="true" />
      )}
    </button>
  );
}

function HeaderNavigator() {
  return (
    <>
      <ExpressiveLink to="">ABOUT</ExpressiveLink>
      <ExpressiveLink to="">SERVE</ExpressiveLink>
      <ExpressiveLink to="">CONNECT</ExpressiveLink>
      <ExpressiveLink to="">MEDIA</ExpressiveLink>
      <ExpressiveLink to="">RESOURCES</ExpressiveLink>
    </>
  );
}
