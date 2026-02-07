import { forwardRef } from "react";

const HookInput = forwardRef(function HookInput(
  { title, name, type = "text", error, className = "", border = true, ...rest },
  ref,
) {
  const hasError = !!error;

  return (
    <div
      className={`flex flex-col gap-1 ${
        hasError ? "text-red-600" : "text-neutral-950"
      } ${className}`}>
      <label
        htmlFor={name}
        className="text-sm md:text-md px-1 font-semibold select-none">
        {title}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        ref={ref}
        {...rest}
        className={`bg-neutral-50 rounded-2xl shadow-sm w-full h-[4ch] px-2 ${
          hasError
            ? "border-2 border-red-600"
            : `${border ? "border-2" : "border-0"} border-neutral-950`
        }`}
      />

      <p
        className={`text-xs ${hasError ? "visible" : "invisible select-none"}`}>
        {error?.message || `Please enter a valid ${title.toLowerCase()}.`}
      </p>
    </div>
  );
});

export default HookInput;
