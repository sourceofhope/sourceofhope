import { NavLink } from "react-router-dom";
import Header from "../structure/Header";
import Footer from "../structure/Footer";
import ExpressiveLink from "../ui/expressive/ExpressiveLink";
import Favicon from "../ui/Favicon";

export default function ErrorLayout({ code = 500, message }) {
  const defaults = {
    403: "Sorry, you don't have permission to access this page.",
    404: "Sorry, we couldn’t find the page you were looking for.",
    418: "I'm a teapot. (But seriously, something went wrong.)",
    500: "Oops! Something went wrong on our end.",
  };
  const display = defaults[code] || "An unexpected error occurred.";

  return (
    <div className="bg-neutral-50">
      <Header />
      <main className="w-screen min-h-screen flex flex-col justify-center items-start gap-5 px-5 lg:px-35">
        <Favicon className="w-[60px] h-[60px]"/>
        <h2 className="text-lg font-semibold">
          Error {code}: {message}
        </h2>
        <p className="text-md">
          {display}
        </p>
        <p className="text-md">
          If you are unable to resolve this error, please contact <a className="font-semibold text-accent-500" href={`mailto:info@thesourceofhope.org?subject=Website Error Code ${code} : ${message}`}>info@thesourceofhope.org</a> to resolve this issue.
        </p>
        <button className="border-5 rounded-2xl font-bold w-fit px-10 py-5 bg-accent-500 border-accent-500 text-neutral-50/75 hover:text-neutral-50/95 transition-colors">
          <ExpressiveLink to="/">GO HOME</ExpressiveLink>
        </button>
      </main>
      <Footer />
    </div>
  );
}
