import { useState } from "react";

export default function LocalInput({
  title,
  htmlFor,
  type,
  onChange = () => true,
  className = "",
  border = false,
  setFormData,
}) {
  const [isValid, setIsValid] = useState(true);

  return (
    <div
      className={`flex flex-col gap-1 ${
        isValid ? "text-neutral-950" : "text-red-600"
      } ${className}`}>
      <label
        htmlFor={htmlFor}
        className="text-sm md:text-md px-1 font-semibold select-none">
        {title}
      </label>
      <input
        name={htmlFor}
        type={type}
        onChange={(event) => {
          const value = event.target.value;

          if (setFormData) {
            setFormData((prev) => ({
              ...prev,
              [htmlFor]: value,
            }));
          }

          setIsValid(onChange(event));
        }}
        className={`bg-neutral-50 rounded-2xl shadow-sm w-full h-[4ch] px-2 ${
          isValid
            ? `${border ? "border-2" : "border-0"} border-neutral-950`
            : "border-2 border-red-600"
        }`}
      />

      <p className={`text-xs ${isValid ? "invisible select-none" : "visible"}`}>
        Please enter a valid {title.toLowerCase()}.
      </p>
    </div>
  );
}
