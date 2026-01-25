import PageSection from "../../PageSection";

import Title from "@/components/ui/text/Title";
import Input from "@/components/ui/Input";
import Heading from "@/components/ui/text/Heading";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  BuildingStorefrontIcon,
  EnvelopeIcon,
  MapIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { HighlightedText } from "@/components/ui/expressive/ExpressiveText";
import { sendEmail } from "@/lib/api/email";

const formStatus = {
  IDLE: "IDLE",
  SUBMIT: "SUBMIT",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
};

export default function ConnectMapSection() {
  const [status, setStatus] = useState(formStatus.IDLE);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ mode: "onBlur"});

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
          <form className="flex flex-col w-full gap-1" onSubmit={handleSubmit(onSubmit)}>
            <Input
              title="First name"
              type="text"
              border={false}
              error={errors.fname}
              {...register("fname", {
                required: "First name is required",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "First name must be less than 50 characters",
                },
                pattern: {
                  value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
                  message: "Please enter a valid name",
                },
              })}
            />
            <Input
              title="Last Name"
              type="text"
              border={false}
              error={errors.lname}
              {...register("lname", {
                required: "Last name is required",
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Last name must be less than 50 characters",
                },
                pattern: {
                  value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
                  message: "Please enter a valid name",
                },
              })}
            />
            <Input
              title="Email Address"
              type="email"
              border={false}
              error={errors.email}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
            />
            <Input
              title="Phone Number"
              type="tel"
              border={false}
              error={errors.phone}
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[\d\s\-().+]+$/,
                  message: "Please enter a valid phone number",
                },
                minLength: {
                  value: 10,
                  message: "Phone number must be at least 10 digits",
                },
              })}
            />
            <Input
              title="Message"
              type="text"
              border={false}
              error={errors.msg}
              {...register("msg", {
                required: "Message is required",
                minLength: {
                  value: 10,
                  message: "Message must be at least 10 characters",
                },
                maxLength: {
                  value: 500,
                  message: "Message must be less than 500 characters",
                },
              })}
            />

            {/* <Input
              title="Company"
              type="text"
              border={false}
              className="hidden"
              {...register("company")}
            /> */}

            {status === formStatus.SUCCESS && (
              <div className="flex items-center gap-2 p-4 bg-green-50 text-green-800 rounded-2xl border border-green-200">
                <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                  Message sent successfully! We'll get back to you soon.
                </p>
              </div>
            )}

            {status === formStatus.ERROR && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-800 rounded-2xl border border-red-200">
                <XCircleIcon className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                  Failed to send message. Please try again later.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <button
                type="submit"
                disabled={status === formStatus.SUBMIT}
                className="rounded-2xl w-full h-[4ch] px-2 bg-primary-700 text-neutral-50 font-semibold cursor-pointer hover:bg-primary-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors duration-300">
                {status === formStatus.SUBMIT ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        </article>
      </div>
    </PageSection>
  );

  async function onSubmit(formData) {

    setStatus(formStatus.SUBMIT);

    try {
      await sendEmail({
        name: `${formData.fname} ${formData.lname}`,
        email: formData.email,
        message: `Phone: ${formData.phone || "Not provided"}\n\n${formData.msg}`,
      });

      setStatus(formStatus.SUCCESS);
      reset();
      
      setTimeout(() => {
        setStatus(formStatus.IDLE);
      }, 5000);
    } catch (error) {
      console.error("Failed to send email:", error);
      setStatus(formStatus.ERROR);
    }
  }
}

