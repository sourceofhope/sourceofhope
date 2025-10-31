import { Helmet } from "react-helmet";
import { CANONICAL_URL } from "../../routes";
import {
  HeaderFlagContext,
  useHeaderFlag,
} from "../../components/structure/Header";
import { useEffect } from "react";
import ServeDescriptionSection from "./sections/ServeDescriptionSection";

export default function FormPage() {
  const { setIsBlocking } = useHeaderFlag();

  useEffect(() => {
    setIsBlocking(true);
    return () => setIsBlocking(false); // reset on leave
  }, [setIsBlocking]);
  return (
    <HeaderFlagContext.Provider value={true}>
      <Helmet>
        <title>Program Sign-Up | The Source of Hope</title>
        <meta
          name="description"
          content="Join The Source of Hope’s mission by signing up for our community programs in Dallas–Fort Worth. Volunteer, mentor, or participate in initiatives that bring holistic health, education, and hope to those in need."
        />
        <link rel="canonical" href={CANONICAL_URL.member} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_URL.member} />
        <meta
          property="og:title"
          content="Program Sign-Up | The Source of Hope"
        />
        <meta
          property="og:description"
          content="Be part of The Source of Hope’s volunteer and community programs. Sign up today to serve, learn, and make a difference through our holistic health, education, and outreach initiatives."
        />
        <meta
          property="og:image"
          content="https://sourceofhope.org/assets/social-share-programs.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={CANONICAL_URL.member} />
        <meta
          name="twitter:title"
          content="Program Sign-Up | The Source of Hope"
        />
        <meta
          name="twitter:description"
          content="Join The Source of Hope’s mission by signing up for our community programs. Volunteer, learn, and serve with compassion throughout the Dallas–Fort Worth area."
        />
        <meta
          name="twitter:image"
          content="https://sourceofhope.org/assets/social-share-programs.jpg"
        />
      </Helmet>
      <section className="w-full md:justify-items-left items-center grid gap-5 pt-25 p-5 lg:px-35">
        <div className="grid gap-1 justify-self-start justify-start">
          <h2 className="text-xlg md:text-xxlg text-balance font-urbanist">
            Community Impact Form
          </h2>
          <h3 className="text-sm md:text-md text-accent-700 font-semibold uppercase">
            Become a Member. Be the Source of Hope. <span className="hidden md:inline">Stand With the People Who
            Keep Our Communities Strong</span>
          </h3>
        </div>
       <ServeDescriptionSection />
        <form className="flex flex-wrap justify-between gap-y-5">
          <div className="flex flex-col gap-1 w-full md:w-[48%]">
            <label htmlFor="fname" className="text-sm md:text-md">
              First Name
            </label>
            <input
              name="fname"
              type="text"
              className="rounded-sm border-1 w-full h-[4ch] px-2"
            />
          </div>
          <div className="flex flex-col gap-1 w-full md:w-[48%]">
            <label htmlFor="lname" className="text-sm md:text-md">
              Last Name
            </label>
            <input
              name="lname"
              type="text"
              className="rounded-sm border-1 w-full h-[4ch] px-2"
            />
          </div>
          <div className="flex flex-col gap-1 w-full md:w-[48%]">
            <label htmlFor="email" className="text-sm md:text-md">
              E-Mail Address
            </label>
            <input
              name="email"
              type="email"
              className="rounded-sm border-1 w-full h-[4ch] px-2"
            />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-[48%]">
            <label htmlFor="phone" className="text-sm md:text-md">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              className="rounded-sm border-1 w-full h-[4ch] px-2"
            />
          </div>
          <div className="flex flex-col gap-1 w-full md:w-[48%]">
            <label htmlFor="membership" className="text-sm md:text-md">
              Membership Type
            </label>
            <select
              name="membership"
              className="rounded-sm border-1 w-full h-[4ch] px-2 relative">
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
          <div className="flex flex-col gap-1 w-full md:w-[48%]">
            <label htmlFor="submit" className="text-sm md:text-md hidden md:block invisible">
              Submit
            </label>
            <input
              name="submit"
              type="submit"
              value="Submit"
              className="rounded-sm w-full h-[4ch] px-2 bg-primary-700 text-neutral-50 font-semibold cursor-pointer hover:bg-primary-800 transition-colors duration-300"
            />
          </div>
        </form>
      </section>
    </HeaderFlagContext.Provider>
  );
}
