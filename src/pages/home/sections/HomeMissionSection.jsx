import { HomeSection } from "../HomePage";

export default function HomeMissionSection() {
  return (
    <HomeSection
      title="Our Mission"
      className="grid grid-flow-row w-fit md:grid-cols-[1fr_1fr] items-center gap-5"
      caption="LEARN MORE"
    >
      <div className="flex justify-center items-center">
        <img className="w-[200px] h-[200px] object-cover" />
      </div>
      <article>
        <p className="text-lg lg:text-xxlg text-left max-w-prose leading-relaxed">
          "Bringing hope and healing by providing{" "}
          <Emphasized>
            <a href="">meals</a>
          </Emphasized>
          ,{" "}
          <Emphasized>
            <a href="">education</a>
          </Emphasized>
          ,{" "}
          <Emphasized>
            <a href="">wellness</a>
          </Emphasized>
          , and{" "}
          <Emphasized>
            <a href="">resources</a>
          </Emphasized>{" "}
          that uplift and empower communities in need."{" "}
        </p>
				<p className="pl-10 italic text-md">
            – Co-founder, Quynh Chau Stone
          </p>
      </article>
    </HomeSection>
  );
}

function Emphasized({ children }) {
  return <span className="text-accent-500 font-semibold transition-transform hover:scale-115 duration-500">{children}</span>;
}
