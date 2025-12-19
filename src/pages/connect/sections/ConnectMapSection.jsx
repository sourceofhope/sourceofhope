import PageSection from "../../PageSection";

import Title from "@/components/ui/text/Title";
import Input from "@/components/ui/Input";
import Heading from "@/components/ui/text/Heading";

import { useState } from "react";
import {
  BuildingStorefrontIcon,
  EnvelopeIcon,
  MapIcon,
} from "@heroicons/react/20/solid";
import { HighlightedText } from "@/components/ui/expressive/ExpressiveText";
import { post } from "../../../lib/api/client";

const formStatus = {
  IDLE: "IDLE",
  SUBMIT: "SUBMIT",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
};

export default function ConnectMapSection() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    msg: "",
    company: "",
  });
  const [status, setStatus] = useState(formStatus.IDLE);

  const validateName = (event) => {
    if (status === formStatus.SUBMIT) {
      const trimmed = event.target.value.trim();
      return trimmed.length > 0 && trimmed.length <= 50;
    }
    return true;
    return true;
  };
  return (
    <PageSection className="m-0 text-sm md:text-md lg:text-lg py-5 bg-neutral-200">
      <Title className="py-5 hidden md:block">
        Need To Reach Us? <HighlightedText>Here's How You Can</HighlightedText>
      </Title>
      <Title className="py-5 md:hidden">
        <HighlightedText>Need To Reach Us?</HighlightedText>
      </Title>
      <div className="justify-items-between grid md:grid-cols-[9fr_4fr] gap-10 items-start relative">
        <article className="w-full grid gap-5 row-start-2 md:row-start-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3222.689727867567!2d-96.7169406!3d33.03989449999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c185a0bc47b6b%3A0x6ed25b35d24b54f1!2sThe%20Source%20of%20Hope!5e1!3m2!1sen!2sus!4v1763741256946!5m2!1sen!2sus"
            className="w-full aspect-video rounded-2xl border-none"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"></iframe>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 py-5 text-accent-800">
            <div className="rounded-2xl bg-white p-6 flex flex-col items-center text-center gap-4 shadow-sm">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-100 border-2 border-neutral-300">
                <EnvelopeIcon className="w-5 h-5" />
              </div>
              <Heading className="text-base">Contact</Heading>
              <p className="text-sm leading-relaxed">
                +1 (469) 969-0244
                <br />
                info@thesourceofhope.org
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 flex flex-col items-center text-center gap-4 shadow-sm">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-100 border-2 border-neutral-300">
                <BuildingStorefrontIcon className="w-5 h-5" />
              </div>
              <Heading className="text-base">Hours</Heading>
              <p className="text-sm leading-relaxed">
                Mon – Fri: 10:00 – 5:00
                <br />
                Sat – Sun: Closed
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 flex flex-col items-center text-center gap-4 shadow-sm">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-100 border-2 border-neutral-300">
                <MapIcon className="w-5 h-5" />
              </div>
              <Heading className="text-base">Location</Heading>
              <p className="text-sm leading-relaxed">
                1108 W Parker Rd, Ste 102
                <br />
                Plano, TX 75075
              </p>
            </div>
          </div>
        </article>
        <article className="w-full grid gap-5 row-start-1 md:row-start-auto">
          <form className="flex flex-col w-full gap-1">
            <Input
              title="First name"
              htmlFor="fname"
              type="text"
              border={false}
              onChange={validateName}
              setFormData={setFormData}
            />
            <Input
              title="Last Name"
              htmlFor="lname"
              type="text"
              border={false}
              onChange={validateName}
              setFormData={setFormData}
            />
            <Input
              title="Email Address"
              htmlFor="email"
              type="email"
              border={false}
              setFormData={setFormData}
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
              border={false}
              setFormData={setFormData}
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
            <Input
              title="Message"
              htmlFor="msg"
              type="text"
              border={false}
              setFormData={setFormData}
            />
            <Input
              title="Company"
              htmlFor="company"
              type="text"
              border={false}
              setFormData={setFormData}
              className="hidden"
            />
            <div className="flex flex-col gap-1">
              <input
                name="submit"
                type="submit"
                value="Submit"
                onSubmit={handleSubmit}
                className="rounded-2xl w-full h-[4ch] px-2 bg-primary-700 text-neutral-50 font-semibold cursor-pointer hover:bg-primary-800 transition-colors duration-300"
              />
            </div>
          </form>
        </article>
      </div>
    </PageSection>
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(formStatus.SUBMIT);

    if (formData.company) {
      setStatus(formStatus.SUCCESS);
      return;
    }

    const { error } = await post("/contact", {
      fname: formData.fname,
      lname: formData.lname,
      email: formData.email,
      phone: formData.phone,
      msg: formData.msg,
    });

    if (error) {
      setStatus(formStatus.ERROR);
      return;
    }

    setStatus(formStatus.SUCCESS);
  }
}
