import { HomeSection } from "../HomePage";
import Emphasis from "../../../components/ui/Emphasis";
import ExpressiveAnchor from "../../../components/ui/expressive/ExpressiveAnchor";
import Title from "../../../components/ui/text/Title";
import Blockquote from "../../../components/ui/text/Blockquote";

export default function HomeMissionSection() {
  return (
    <HomeSection className="grid grid-flow-row md:grid-cols-[1fr_2fr] pb-5 items-center w-full gap-10 md:gap-5 justify-items-end md:justify-between">
      <div className="grid grid-flow-row gap-5 justify-items-center">
        <Title className="text-xlg md:hidden lg:text-xxlg font-urbanist text-center">
          Our Mission
        </Title>
        <img
          className="inset-0 w-full object-cover max-w-[400px] aspect-square rounded-2xl text-center"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/PNG_Test.png/960px-PNG_Test.png?20250623065344"
          alt="The Source of Hope Founder, Quynh Chau Stone"
        />
      </div>
      <div className="grid gap-3 max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">
        <Title className="hidden text-xlg md:block lg:text-xxlg pl-5 w-fit font-urbanist">
          Our Mission
        </Title>
        <Blockquote className="text-md md:text-lg border-accent-600 md:text-justify">
          "Bringing hope and healing by providing <Emphasis>meals</Emphasis>,{" "}
          <Emphasis>education</Emphasis>, <Emphasis>wellness</Emphasis>, and{" "}
          <Emphasis>resources</Emphasis> that uplift and empower communities in
          need."
        </Blockquote>
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
