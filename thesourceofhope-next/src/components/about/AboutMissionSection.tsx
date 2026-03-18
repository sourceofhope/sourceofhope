import Title from "@/components/ui/Title";

const ASSET_VERSION = "v2";

export default function AboutMissionSection() {
  return (
    <section className="w-full md:justify-items-left items-center grid text-sm md:text-md lg:text-lg md:grid-cols-[6fr_4fr] gap-5 bg-neutral-200 px-5 lg:px-35 py-10 items-center">
      <article className="grid gap-5 self-start">
        <div className="grid gap-5">
          <Title className="font-semibold md:text-balance">
            Founded in 2014 on{" "}
            <span className="hidden md:inline-block">our guiding</span> principle
          </Title>
          <blockquote className="pl-5 border-l-4 border-accent-600 text-neutral-600 italic">
            &ldquo;Empower with dignity, meet urgent needs while equipping people with
            lifelong skills, wellness, and community so hope becomes
            sustainable.&rdquo;
          </blockquote>
          <p className="pl-5 w-fit text-neutral-600">
            <a 
              href="https://www.linkedin.com/in/qu%E1%BB%B3nh-ch%C3%A2u-qc-stone-87185b34/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              - Co-founder, <strong>Quynh Chau Stone</strong>
            </a>
          </p>
        </div>
        
        <div className="grid gap-5">
          <h3 className="border-b-2 pb-1/2 w-fit font-semibold">Mission</h3>
          <p className="text-neutral-600">
            Bringing hope and healing by providing meals, education, wellness,
            and resources that uplift and empower communities in need.
          </p>
        </div>
        
        <div className="grid gap-5">
          <h3 className="border-b-2 pb-1/2 w-fit font-semibold">Vision</h3>
          <p className="text-neutral-600">
            A world where every person has the wellness, skills, and community
            to thrive, so cycles of hardship give way to lives of purpose.
          </p>
        </div>
      </article>
      
      <article className="grid self-center justify-items-end">
        <img
          src={`/${ASSET_VERSION}/servingHope/SH-ResourceTile.webp`}
          alt="About mission visual"
          className="w-full aspect-square bg-accent-900 max-w-[450px] rounded-2xl object-cover object-center"
          loading="lazy"
        />
      </article>
    </section>
  );
}
