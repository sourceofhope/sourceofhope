import ExpressiveAnchor from "./expressive/ExpressiveAnchor";

export default function Button({ text, to, className }) {
  return (
    <button
      className={`${className} flex justify-center w-full h-fit rounded-2xl px-2 py-3 bg-accent-500 hover:bg-accent-600 duration-750 transition-colors font-semibold text-neutral-50`}>
      <div className="w-fit justify-self-center">
        <ExpressiveAnchor to={to} className="text-center w-fit">
          {text}
        </ExpressiveAnchor>
      </div>
    </button>
  );
}
