import { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ConnectVolunteerSection from "@/components/connect/ConnectVolunteerSection";
import ConnectMapSection from "@/components/connect/ConnectMapSection";
import ConnectCareersSection from "@/components/connect/ConnectCareersSection";

export const metadata: Metadata = {
  title: "Connect | The Source of Hope",
  description:
    "Connect with The Source of Hope to volunteer, partner, donate, or stay engaged with our programs serving families, students, seniors, veterans, and first responders across DFW.",
  openGraph: {
    title: "Connect | The Source of Hope",
    description:
      "Get involved with The Source of Hope through volunteering, partnerships, donations, and community programs making a real impact.",
  },
  twitter: {
    title: "Connect | The Source of Hope",
    description:
      "Volunteer, partner, donate, and stay connected with The Source of Hope's mission to serve and uplift our community.",
  },
};

export default function Connect() {
  return (
    <>
      <PageHeader>
        <h1 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
          CONNECT
        </h1>
        <p className="font-semibold text-neutral-200 text-sm">JOIN US TODAY</p>
      </PageHeader>
      <ConnectVolunteerSection />
      <ConnectMapSection />
      <ConnectCareersSection />
    </>
  );
}
