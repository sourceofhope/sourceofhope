import { HomeSection } from "../HomePage";
import Emphasis from "../../../components/ui/Emphasis"

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
          <Emphasis>
            <a href="">meals</a>
          </Emphasis>
          ,{" "}
          <Emphasis>
            <a href="">education</a>
          </Emphasis>
          ,{" "}
          <Emphasis>
            <a href="">wellness</a>
          </Emphasis>
          , and{" "}
          <Emphasis>
            <a href="">resources</a>
          </Emphasis>{" "}
          that uplift and empower communities in need."{" "}
        </p>
				<p className="pl-10 italic text-md">
            – Co-founder, Quynh Chau Stone
          </p>
      </article>
    </HomeSection>
  );
}
