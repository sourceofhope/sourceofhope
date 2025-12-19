import { CANONICAL_URL } from "../../routes";
import PageHeader from "../PageHeader";

import { Helmet } from "react-helmet";
import MediaPressSection from "./sections/MediaPressSection";
import MediaNewsletterSection from "./sections/MediaNewsletterSection";
import MediaPodcastSection from "./sections/MediaPodcastSection";
import MediaBlogPage from "./sections/MediaBlogSection";

export default function MediaPage() {
	return (
		<>
			<Helmet></Helmet>
			<PageHeader>
				<h2 className="font-urbanist font-bold text-neutral-50 text-xxxlg">
					MEDIA
				</h2>
				<p className="font-semibold text-neutral-200 text-sm">
					OUR CONTRIBUTION.
				</p>
			</PageHeader>
			<MediaBlogPage />
			<MediaNewsletterSection />
			<MediaPodcastSection />
			<MediaPressSection />
		</>
	);
}
