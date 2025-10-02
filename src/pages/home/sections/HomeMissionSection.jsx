import { HomeSection } from "../HomePage";
import Emphasis from "../../../components/ui/Emphasis";
import ExpressiveAnchor from "../../../components/ui/expressive/ExpressiveAnchor";

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
        that uplift and empower communities in need."
      </p>
      <p className="w-fit font-light self-end text-sm sm:text-base md:text-left text-neutral-600">
        <ExpressiveAnchor href="https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.linkedin.com/in/qu%25E1%25BB%25B3nh-ch%25C3%25A2u-qc-stone-87185b34&ved=2ahUKEwjywp_wrYGQAxXtliYFHUMmF_UQFnoECB4QAQ&usg=AOvVaw0atvVnt9I7rD053D7ksuUk">
          – Co-founder,{" "}
          <strong className="font-semibold">Quynh Chau Stone</strong>
        </ExpressiveAnchor>
      </p>
    </HomeSection>
  );
}
