import { useState } from "react";

export default function Input({
  title,
  htmlFor,
  type,
  onChange = (event) => {
    return true;
  },
  className,
  border = true,
}) {
  const [isValid, setIsValid] = useState(true);

  return (
    <div
      className={`flex flex-col gap-1 ${
        isValid ? "text-neutral-950" : "text-red-600"
      } ${className}`}>
      <label
        htmlFor={htmlFor}
        className="text-sm md:text-md translate-3.5 md:translate-4 px-1 z-10 w-fit select-none after:content-[''] after:absolute after:left-0 after:top-[11px]
		after:block after:h-1 after:w-full font-semibold
		after:bg-neutral-50 after:-z-10 after:pointer-events-none">
        {title}
      </label>
      <input
        name={htmlFor}
        type={type}
        onChange={(event) => setIsValid(onChange(event))}
        className={`bg-neutral-50 rounded-2xl border-0 shadow-sm w-full h-[4ch] px-2 select-none ${
          isValid
            ? `${border ? "border-2" : "border-0"} border-neutral-950`
            : "border-red-600"
        }`}
      />
      <p className={isValid ? "invisible select-none" : "visible"}>
        {`Please enter a valid ${title.toLowerCase()}`}.
      </p>
    </div>
  );
}
