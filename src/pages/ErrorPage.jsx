// components/ErrorPage.jsx
import { NavLink } from "react-router-dom";

export default function ErrorPage({ code = 500, message }) {
  const defaults = {
    403: "Sorry, you don't have permission to access this page.",
    404: "Sorry, we couldn’t find the page you were looking for.",
    418: "I'm a teapot. (But seriously, something went wrong.)",
    500: "Oops! Something went wrong on our end.",
  };
  const display =  defaults[code] || "An unexpected error occurred.";

  return (
    <main className="w-screen min-h-screen flex justify-center items-center px-5">
      <section className="w-full md:max-w-[50%] lg:max-w-[35%] rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-accent-500 p-5 text-center">
          <h2 className="text-lg hidden md:block text-accent-50 font-semibold">
            {code} : {message}
          </h2>
          <h2 className="text-lg block md:hidden text-accent-50 font-semibold">
            {code}
          </h2>
        </div>
        <div className="bg-neutral-50 p-5 grid gap-5 text-center">
          <p>{display}</p>
          <NavLink
            to="/"
            className="bg-accent-500 p-5 text-neutral-50 rounded-2xl justify-self-center w-fit inline-flex"
          >
            Go Home
          </NavLink>
        </div>
      </section>
    </main>
  );
}
