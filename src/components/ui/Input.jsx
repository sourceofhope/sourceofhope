import { useState } from "react";

export default function Input({
  title,
  htmlFor,
  type,
  onChange = (event) => {
    false;
  },
  className,
}) {
  const [isValid, setIsValid] = useState(true);

  return (
    <div
      className={`flex flex-col gap-1 ${
        isValid ? "text-neutral-950" : "text-red-600"
      } ${className}`}>
      <label
        htmlFor={htmlFor}
        className="text-sm md:text-md translate-3.5 md:translate-4 px-1 z-10 w-fit select-none after:content-[''] after:absolute after:left-0 after:top-[7px]
		after:block after:h-[5px] after:w-full font-semibold
		after:bg-neutral-50 after:-z-10 after:pointer-events-none">
        {title}
      </label>
      <input
        name={htmlFor}
        type={type}
        onChange={(event) => setIsValid(onChange(event))}
        className={`rounded-sm border-1 w-full h-[4ch] px-2 ${
          isValid ? "border-neutral-950" : "border-red-600"
        }`}
      />
      <p className={isValid ? "invisible select-none" : "visible"}>
        {`Please enter a valid ${title.toLowerCase()}`}.
      </p>
    </div>
  );
}
