import { HomeSection } from "../HomePage";
import Emphasis from "../../../components/ui/Emphasis";

export default function HomeMissionSection() {
  return (
    <HomeSection
      title="Mission"
      className="flex w-fit items-center justify-start gap-5"
      caption="LEARN MORE"
    >
      <article className="flex flex-col">
        <p className="w-fit text-base sm:text-lg md:text-xxlg lg:text-2xl text-left md:text-balance leading-relaxed">
          "Bringing hope and healing by providing{" "}
          <span className="inline-block">
            <Emphasis>
              <a href="">meals</a>
            </Emphasis>
            ,
          </span>{" "}
          <span className="inline-block">
            <Emphasis>
              <a href="">education</a>
            </Emphasis>
            ,
          </span>{" "}
          <span className="inline-block">
            <Emphasis>
              <a href="">wellness</a>
            </Emphasis>
            ,
          </span>{" "}
          and{" "}
          <Emphasis>
            <a href="">resources</a>
          </Emphasis>{" "}
          that uplift and empower communities in need."
        </p>
        <p className="w-fit mt-5 self-end text-sm sm:text-base md:text-left text-neutral-600">
          – Co-founder, Quynh Chau Stone
        </p>
      </article>
    </HomeSection>
  );
}
