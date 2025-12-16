import { useState } from "react";

import Input from "../../../components/ui/Input";
import Title from "../../../components/ui/text/Title";

export default function FormInputSection() {
  const [submit, setSubmit] = useState(false);

  const validateName = (event) => {
    if (submit) {
      const input = event.target.value;
      if (typeof input !== "string") return false;

      const trimmed = input.trim();
      if (trimmed.length === 0 || trimmed.length > 50) return false;

      // const allowedCharactersRegex = /^[\p{L}\p{M}'- ]+$/u;
      // const consecutiveCharactersRegex = /--|''|\s{2,}/;

      // if (!allowedCharactersRegex.test(trimmed)) return false;
      // if (!consecutiveCharactersRegex.test(trimmed)) return false;
    }
    return true;
  };

  return (
    <section className="grid gap-5 w-full p-5 lg:px-35">
      <Title>Community Impact Form</Title>
      <form className="flex flex-wrap justify-between gap-y-5">
        <Input
          title="First name"
          htmlFor="fname"
          type="text"
          onChange={validateName}
          className="w-full md:w-[49%]"
          border={false}
        />
        <Input
          title="Last Name"
          htmlFor="lname"
          type="text"
          onChange={validateName}
          className="w-full md:w-[49%]"
          border={false}
        />
        <Input
          title="Email Address"
          htmlFor="email"
          type="email"
          className="w-full md:w-[49%]"
          border={false}
          onChange={(event) => {
            if (submit) {
              const input = event.target.value;
              if (typeof input !== "string") return false;

              const trimmed = input.trim();
              if (trimmed.length === 0 || trimmed.length > 50) return false;

              const valid =
                trimmed.includes("@") &&
                trimmed
                  .substring(trimmed.lastIndexOf("@"), trimmed.length)
                  .includes(".") &&
                trimmed.substring(0, trimmed.lastIndexOf("@")).length > 0;
              return valid;
            }
            return true;
          }}
        />
        <Input
          title="Phone Number"
          htmlFor="phone"
          type="tel"
          className="w-full md:w-[49%]"
          border={false}
          onChange={(event) => {
            if (submit) {
              const input = event.target.value;
              if (typeof input !== "string") return false;

              const trimmed = input.trim();
              if (trimmed.length === 0 || trimmed.length > 50) return false;

              const valid =
                input.split("-").length == 3 ||
                input.split(".").length == 3 ||
                (input.length >= 11 && input.length <= 13);
              return valid;
            }
            return true;
          }}
        />
        <div className="flex flex-col gap-1 w-full md:w-[49%]">
          <label
            htmlFor="membership"
            className="text-sm md:text-md translate-3.5 md:translate-4 px-1 z-10 w-fit select-none after:content-[''] after:absolute after:left-0 after:top-[11px]
		after:block after:h-1 after:w-full font-semibold
		after:bg-neutral-50 after:-z-10 after:pointer-events-none">
            Membership Type
          </label>
          <select
            name="membership"
            className="bg-neutral-50 rounded-2xl border-0 shadow-sm w-full h-[4ch] px-2 select-none">
            <option value="empty"></option>
            <option value="bronze">
              Hope Advocate [Bronze Pin] ($50/month)
            </option>
            <option value="silver">
              Hope Professional [Silver Pin] ($199/month)
            </option>
            <option value="gold">
              Hope Enterprise Partner [Gold Pin] ($500/month)
            </option>
          </select>
        </div>
        <div className="flex flex-col gap-1 w-full md:w-[49%]">
          <label
            htmlFor="submit"
            className="text-sm md:text-md hidden md:block invisible select-none">
            Submit
          </label>
          <input
            name="submit"
            type="submit"
            value="Submit"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmit(true);
            }}
            className="rounded-2xl w-full h-[4ch] px-2 bg-primary-700 text-neutral-50 font-semibold cursor-pointer hover:bg-primary-800 transition-colors duration-300"
          />
        </div>
      </form>
    </section>
  );
}
