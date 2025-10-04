import { HomeSection } from "../HomePage";
import Emphasis from "../../../components/ui/Emphasis";
import ExpressiveAnchor from "../../../components/ui/expressive/ExpressiveAnchor";
import { HighlightedText } from "../../../components/ui/expressive/ExpressiveText";

export default function HomeMissionSection() {
  return (
    <HomeSection className="flex flex-col w-full gap-5 justify-self-center">
      <p className="w-fit text-md md:text-lg lg:text-xxlg lg:text-2xl text-center self-center text-balance leading-relaxed lg:max-w-[50ch]">
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
        that uplift and <HighlightedText>empower communities in need.</HighlightedText>"
      </p>
      <p className="w-fit font-light self-end text-sm sm:text-base md:text-left text-neutral-600">
        <ExpressiveAnchor href="https://www.linkedin.com/in/qu%E1%BB%B3nh-ch%C3%A2u-qc-stone-87185b34/">
          – Co-founder,{" "}
          <strong className="font-semibold">Quynh Chau Stone</strong>
        </ExpressiveAnchor>
      </p>
    </HomeSection>
  );
}
