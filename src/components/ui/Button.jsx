import ExpressiveAnchor from "./expressive/ExpressiveAnchor";
import ExpressiveLink from "./expressive/ExpressiveLink";

export function AnchorButton({ text, href, className }) {
  return (
    <button
      className={`${className} flex justify-center w-full h-fit rounded-2xl px-2 py-3 bg-accent-500 hover:bg-accent-600 duration-750 transition-all font-semibold text-neutral-50`}>
      <div className="w-fit justify-self-center">
        <ExpressiveAnchor href={href} className="w-fit">
          {text}
        </ExpressiveAnchor>
      </div>
    </button>
  );
}

export function LinkButton({ text, to, className }) {
  return (
    <button
      className={`${className} flex justify-center w-full h-fit rounded-2xl px-2 py-3 bg-accent-500 hover:bg-accent-600 duration-750 transition-all font-semibold text-neutral-50`}>
      <div className="w-fit justify-self-center">
        <ExpressiveLink to={to} className="text-center w-fit">
          {text}
        </ExpressiveLink>
      </div>
    </button>
  );
}
