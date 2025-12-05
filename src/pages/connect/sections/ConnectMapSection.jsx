import PageSection from "../../PageSection";

import Title from "../../../components/ui/text/Title";
import Input from "../../../components/ui/Input";
import Heading from "../../../components/ui/text/Heading";

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
    <PageSection className="justify-items-between grid md:grid-cols-[9fr_4fr] gap-10 relative m-0 text-sm md:text-md lg:text-lg">
      <article className="w-full grid gap-5 row-start-2 md:row-start-auto">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3222.689727867567!2d-96.7169406!3d33.03989449999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c185a0bc47b6b%3A0x6ed25b35d24b54f1!2sThe%20Source%20of%20Hope!5e1!3m2!1sen!2sus!4v1763741256946!5m2!1sen!2sus"
          className="w-full aspect-video rounded-2xl border-none"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
        <div className="grid grid-cols-[1fr] lg:grid-flow-col gap-5 text-accent-800 justify-center items-start py-5 md:text-center text-sm md:text-md">
          <div className="bg-neutral-100 shadow-sm md:h-full rounded-2xl items-center justify-center flex">
            <div className="grid w-full grid-flow-row gap-3 justify-items-center h-fit p-5">
              <div className="grid grid-flow-row gap-1 justify-items-center">
                <EnvelopeIcon className="w-[20px] h-[20px]" />
                <Heading>Contact</Heading>
              </div>
              <p>+1 (469) 969-0244</p>
              <p>info@thesourceofhope.org</p>
            </div>
          </div>
          <div className="bg-neutral-100 shadow-sm md:h-full rounded-2xl items-center justify-center flex">
            <div className="grid w-full grid-flow-row gap-1 justify-items-center h-fit p-5">
              <div className="grid grid-flow-row gap-3 justify-items-center">
                <BuildingStorefrontIcon className="w-[20px] h-[20px]" />
                <Heading>Hours</Heading>
              </div>
              <p className="text-balance text-center">
                Mon - Fri: 10:00 - 5:00
              </p>
              <p>Sat - Sun: Closed</p>
            </div>
          </div>{" "}
          <div className="bg-neutral-100 shadow-sm md:h-full rounded-2xl items-center justify-center flex">
            <div className="grid w-full grid-flow-row gap-1 justify-items-center h-fit p-5 ">
              <div className="grid grid-flow-row gap-1 justify-items-center">
                <MapIcon className="w-[20px] h-[20px]" />
                <Heading>Location</Heading>
              </div>
              <p className="text-balance text-center">
                1108 W Parker Rd Ste 102,
                <br />
                Plano, TX 75075
              </p>
            </div>
          </div>
        </div>
      </article>
      <article className="w-full grid gap-5 row-start-1 md:row-start-auto">
        <Title className="w-full text-left">Contact Us</Title>
        <p className="text-sm md:text-md">
          We'd love to hear from you! Contact us by dropping us a message below,
          and we'll get back to you soon.
        </p>
        <form className="flex flex-col w-full gap-1">
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
              className="rounded-2xl w-full h-[4ch] px-2 bg-primary-700 text-neutral-50 font-semibold cursor-pointer hover:bg-primary-800 transition-colors duration-300"
            />
          </div>
        </form>
      </article>
    </PageSection>
  );
}
