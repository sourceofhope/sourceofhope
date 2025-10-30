import { HomeSection } from "../HomePage";
import Emphasis from "../../../components/ui/Emphasis";
import ExpressiveAnchor from "../../../components/ui/expressive/ExpressiveAnchor";

export default function HomeMissionSection() {
  return (
    <HomeSection className="grid grid-flow-row md:grid-flow-col items-center w-full gap-5 justify-center md:justify-between">
      <div className="grid grid-flow-row gap-5 justify-items-center">
        <h2 className="text-xlg md:hidden lg:text-xxlg font-urbanist font-semibold text-center">
          Our Mission
        </h2>
        <img
          className="inset-0 w-full object-cover max-w-[400px] aspect-square rounded-2xl hover:shadow-2xl duration-500 transition-all text-center"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
          alt="The Source of Hope Founder, Quynh Chau Stone"
        />
      </div>
      <div className="grid gap-3 max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">
        <h2 className="hidden text-xlg md:block lg:text-xxlg pl-5 w-fit font-urbanist font-semibold">
          Our Mission
        </h2>
        <p className="text-md md:text-lg pl-5 py-0 border-l-2 text-justify">
          "Bringing hope and healing by providing <Emphasis>meals</Emphasis>, <Emphasis>education</Emphasis>, <Emphasis>wellness</Emphasis>,
          and <Emphasis>resources</Emphasis> that uplift and empower communities in need."
        </p>
        <p className="text-md md:text-lg pl-5 w-fit">
          <ExpressiveAnchor href="https://www.linkedin.com/in/qu%E1%BB%B3nh-ch%C3%A2u-qc-stone-87185b34/">
            – Co-founder,{" "}
            <strong className="font-semibold">Quynh Chau Stone</strong>
          </ExpressiveAnchor>
        </p>
      </div>
    </HomeSection>
  );
}
