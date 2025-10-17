import { HomeSection } from "../HomePage";
import Emphasis from "../../../components/ui/Emphasis";
import ExpressiveAnchor from "../../../components/ui/expressive/ExpressiveAnchor";

export default function HomeMissionSection() {
  return (
    <HomeSection
      className="grid grid-flow-row md:grid-flow-col md:grid-cols-[2fr_4fr] items-center w-full gap-5 justify-self-center"
      title="Our Mission">
      <div className="flex flex-col gap-5 w-full justify-center">
        <img
          className="aspect-square w-full rounded-2xl hover:bg-neutral-200 transition-colors duration-500 text-center"
          alt="The Source of Hope Founder, Quynh Chau Stone"
        />
        <p className="w-fit font-light self-center text-md md:text-lg text-neutral-600">
          <ExpressiveAnchor href="https://www.linkedin.com/in/qu%E1%BB%B3nh-ch%C3%A2u-qc-stone-87185b34/">
            Co-founder,{" "}
            <strong className="font-semibold">Quynh Chau Stone</strong>
          </ExpressiveAnchor>
        </p>
      </div>
      <p className="w-fit text-md md:text-lg lg:text-xxlg lg:text-2xl text-center self-center text-balance leading-relaxed lg:max-w-[50ch]">
        Bringing hope and healing by providing{" "}
        <span>
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
        </span>
        that uplift and empower communities in need.
      </p>
    </HomeSection>
  );
}
