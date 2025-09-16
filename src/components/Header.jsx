import { useState, useEffect } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 w-full min-h-[10vh] px-10 transition-colors duration-300 ${
        scrolled ? "bg-transparent" : "bg-primary-identity"
      }`}
    >
      
    </header>
  );
}
