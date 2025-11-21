import PageSection from "../../PageSection";

import Title from "../../../components/ui/text/Title";
import Input from "../../../components/ui/Input";

import { useState } from "react";
import {
  BuildingStorefrontIcon,
  EnvelopeIcon,
  MapIcon,
} from "@heroicons/react/20/solid";

export default function ConnectMapSection() {
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
    <PageSection className="justify-items-center grid md:grid-cols-[6fr_4fr] gap-10 relative m-0">
      <article className="w-full grid gap-5 row-start-2 md:row-start-auto">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3222.689727867567!2d-96.7169406!3d33.03989449999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c185a0bc47b6b%3A0x6ed25b35d24b54f1!2sThe%20Source%20of%20Hope!5e1!3m2!1sen!2sus!4v1763741256946!5m2!1sen!2sus"
          className="w-full aspect-video rounded-2xl border-none"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
        <div className="grid grid-cols-[1fr] md:grid-flow-col gap-5 text-accent-800 justify-center items-start py-5 md:text-center">
          <div className="grid w-full grid-flow-row gap-1 items-start md:justify-items-center h-full p-5 rounded-2xl bg-neutral-200">
            <div>
              <EnvelopeIcon className="w-[1em] h-[1em]" />
            </div>
            <h3 className="font-semibold text-accent-400">Phone:</h3>
            <p>+1 (469) 969-0244</p>
            <h3 className="font-semibold text-accent-400">Email:</h3>
            <p>info@thesourceofhope.org</p>
          </div>
          <div className="grid w-full grid-flow-row gap-1 items-start md:justify-items-center h-full p-5 rounded-2xl bg-neutral-200">
            <div>
              <BuildingStorefrontIcon className="w-[1em] h-[1em]" />
            </div>
            <h3 className="font-semibold text-accent-400">Hours:</h3>
            <p>Mon - Fri: 10:00 AM - 5:00 PM</p>
            <p>Sat - Sun: Closed</p>
          </div>
          <div className="grid w-full grid-flow-row gap-1 items-start md:justify-items-center h-full p-5 rounded-2xl bg-neutral-200">
            <div>
              <MapIcon className="w-[1em] h-[1em]" />
            </div>
            <h3 className="font-semibold text-accent-400">Location:</h3>
            <p>1108 W Parker Rd Ste 102, Plano, TX 75075</p>
          </div>
        </div>
      </article>
      <article className="w-full grid gap-5 row-start-1 md:row-start-auto">
        <Title className="w-full text-left">Contact Us</Title>
        <p>
          We'd love to hear from you! Contact The Source of Hope by dropping us
          a message below, and we'll get back to you soon.
        </p>
        <form className="flex flex-col w-full gap-3">
          <Input
            title="First name"
            htmlFor="fname"
            type="text"
            onChange={validateName}
          />
          <Input
            title="Last Name"
            htmlFor="lname"
            type="text"
            onChange={validateName}
          />
          <Input
            title="Email Address"
            htmlFor="email"
            type="email"
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
          <div className="flex flex-col gap-1">
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
              className="rounded-sm w-full h-[4ch] px-2 bg-primary-700 text-neutral-50 font-semibold cursor-pointer hover:bg-primary-800 transition-colors duration-300"
            />
          </div>
        </form>
      </article>
    </PageSection>
  );
}
