import { useState, useEffect } from "react";
import { Bars2Icon } from "@heroicons/react/20/solid";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [clicked, setClicked] = useState(false);

  return (
    <header
      className={`sticky top-0 z-9999 w-full transition-colors duration-300 ${
        clicked ? "h-[40vh]" : "h-[10vh]"
      }   ${
        scrolled
          ? "bg-primary-identity text-primary-background"
          : "bg-transparent text-primary-identity"
      }`}
    >
      <div className="flex w-full h-[10vh] justify-between items-center px-5">
        <h1 className="text-lg">The Source Of Hope</h1>
        <Navigator clicked={clicked} setClicked={setClicked} />        
      </div>
    </header>
  );
}

function Navigator({ clicked, setClicked }) {
  return (
    <nav>
      <button onClick={() => setClicked(!clicked)} className="block :md:hidden">
        <Bars2Icon className="w-[1em] h-[1em]" aria-hidden="true" />
      </button>
      <section className={`${clicked ? "block" : "hidden md:flex"}`}>

      </section>
      <section className="hidden :md:block">

      </section>
    </nav>
  );
}
