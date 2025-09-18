import ExpressiveLink from "../components/ui/ExpressiveLink";

export default function Home() {
  return (
    <>
      <section className="flex justify-start items-end w-full min-h-screen">
        <video
          muted="true"
          loop="true"
          poster=""
          preload="none"
          disablePictureInPicture="true"
          className="absolute left-0 top-0 z-0 h-full w-full"
        ></video>
        <div className="grid gap-3 absolute md:bottom-[15%] md:left-[10%] md:px-0 py-15 px-5 justify-self-center">
          <h2 className="text-accent-identity text-lg opacity-85">
            Empower and provide hope to individuals in need through health and
            wellness.
          </h2>
          <p className="hidden md:block w-[40%] text-accent-background text-justify text-sm opacity-90">
            We are a non-profit organization dedicated to providing holistic health and wellness, education, and support to individuals in need. Our team of volunteers is committed to serving the DFW community, including at-risk families, veterans, and first responders. Your donation helps us ensure that those in need have access to health, safety, and resources to live healthier, fulfilling lives.
          </p>
          <button className="border-4 rounded-2xl w-fit px-5 py-2 border-accent-identity text-accent-identity">
            <ExpressiveLink>DONATE</ExpressiveLink>
          </button>
        </div>
      </section>
      <section className="px-5">

      </section>
    </>
  );
}
