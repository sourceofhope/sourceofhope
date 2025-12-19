import { CANONICAL_URL } from "../../routes";
import PageHeader from "../PageHeader";

import ConnectMapSection from "./sections/ConnectMapSection";
import ConnectVolunteerSection from "./sections/ConnectVolunteerSection";
import ConnectCareersSection from "./sections/ConnectCareersSection";

import { Helmet } from "react-helmet";

export default function ConnectPage() {
	return (
		<>
			<Helmet></Helmet>
			<PageHeader>
				<h2 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
					CONNECT
				</h2>
				<p className="font-semibold text-neutral-200 text-sm">JOIN US TODAY.</p>
			</PageHeader>
			<ConnectVolunteerSection />
			<ConnectMapSection />
			<ConnectCareersSection />
		</>
	);
}
