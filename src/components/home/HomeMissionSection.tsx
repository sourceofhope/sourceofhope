import Title from "@/components/ui/Title";
import Emphasis from "@/components/ui/Emphasis";
import ExpressiveAnchor from "@/components/ui/expressive/ExpressiveAnchor";
import Blockquote from "@/components/ui/Blockquote";
import PageSection from "@/components/ui/PageSection";
import Image from "next/image";
import { ASSET_VERSION } from "@/lib/environment";

export default function HomeMissionSection() {
  return (
    <PageSection className="grid grid-flow-row md:grid-cols-[1fr_2fr] pt-5 pb-10 items-center w-full gap-10 md:gap-5 justify-items-end md:justify-between">
      <div className="grid grid-flow-row gap-5 justify-items-center">
        <Title className="text-xlg md:hidden lg:text-xxlg font-urbanist text-center">
          Our Mission
        </Title>
        <Image
          src={`/${ASSET_VERSION}/core/TSOH-Group.webp`}
          alt="The Source of Hope Founder, Quynh Chau Stone"
          width={1200}
          height={1600}
          className=" object-cover rounded-lg"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, white 60%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, white 60%, transparent 100%)",
          }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="grid gap-3 max-w-100 md:max-w-150 lg:max-w-165">
        <Title className="hidden text-xlg md:block lg:text-xxlg pl-5 w-fit font-urbanist">
          Our Mission
        </Title>
        <Blockquote className="text-md md:text-lg">
          &quot;Bringing hope and healing by providing{" "}
          <Emphasis>meals</Emphasis>, <Emphasis>education</Emphasis>,{" "}
          <Emphasis>wellness</Emphasis>, and <Emphasis>resources</Emphasis>{" "}
          {"that "} uplift and empower communities in need.&quot;
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
