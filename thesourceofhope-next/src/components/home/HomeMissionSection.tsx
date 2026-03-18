import Title from "@/components/ui/Title";
import Emphasis from "@/components/ui/Emphasis";
import ExpressiveAnchor from "@/components/ui/ExpressiveAnchor";
import Blockquote from "@/components/ui/Blockquote";
import PageSection from "@/components/ui/PageSection";

const ASSET_VERSION = "v2";

export default function HomeMissionSection() {
  return (
    <PageSection className="grid grid-flow-row md:grid-cols-[1fr_2fr] pb-5 items-center w-full gap-10 md:gap-5 justify-items-end md:justify-between">
      <div className="grid grid-flow-row gap-5 justify-items-center">
        <Title className="text-xlg md:hidden lg:text-xxlg font-urbanist text-center">
          Our Mission
        </Title>
        <img
          src={`/${ASSET_VERSION}/core/TSOH-Founder.webp`}
          alt="The Source of Hope Founder, Quynh Chau Stone"
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
        />
      </div>
      <div className="grid gap-3 max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">
        <Title className="hidden text-xlg md:block lg:text-xxlg pl-5 w-fit font-urbanist">
          Our Mission
        </Title>
        <Blockquote className="text-md md:text-lg md:text-justify">
          &quot;Bringing hope and healing by providing <Emphasis>meals</Emphasis>,{" "}
          <Emphasis>education</Emphasis>, <Emphasis>wellness</Emphasis>, and{" "}
          <Emphasis>resources</Emphasis> that uplift and empower communities in
          need.&quot;
        </Blockquote>
        <p className="text-md md:text-lg pl-5 w-fit">
          <ExpressiveAnchor href="https://www.linkedin.com/in/quynh-chau-qc-stone-87185b34/">
            - Co-founder,{" "}
            <strong className="font-semibold">Quynh Chau Stone</strong>
          </ExpressiveAnchor>
        </p>
      </div>
    </PageSection>
  );
}
