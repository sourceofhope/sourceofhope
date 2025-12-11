import ExpressiveAnchor from "./expressive/ExpressiveAnchor";
import ExpressiveLink from "./expressive/ExpressiveLink";

export function AnchorButton({ text, href, className }) {
  return (
    <button
      className={`${className} flex justify-center w-full h-fit rounded-2xl px-10 py-5 bg-accent-500 hover:bg-accent-600 duration-750 transition-all font-semibold text-neutral-50`}>
      <div className="w-full">
        <ExpressiveAnchor href={href} className="w-full">
          {text}
        </ExpressiveAnchor>
      </div>
    </button>
  );
}

export function LinkButton({ text, to, className }) {
  return (
    <button
      className={`${className} flex justify-center w-full h-fit rounded-2xl px-10 py-5 bg-accent-500 hover:bg-accent-600 duration-750 transition-all font-semibold text-neutral-50`}>
      <div className="w-full">
        <ExpressiveLink to={to} className="w-full">
          {text}
        </ExpressiveLink>
      </div>
    </button>
  );
}
