import { AnchorButton, LinkButton } from "../../../components/ui/Button";
import ExpressiveLink from "../../../components/ui/expressive/ExpressiveLink";
import { CANONICAL_URL } from "../../../routes";
import { HomeContent } from "../HomePage";

export default function HomeIntroductionSection() {
	return (
		<HomeContent className="relative flex mb-10 h-[80vh] md:min-h-screen">
			<video
				controls={false}
				autoPlay
				muted
				loop
				playsInline
				className="absolute inset-0 z-0 h-full md:h-full w-full object-cover brightness-75"
				style={{
					WebkitMaskImage:
						"linear-gradient(to bottom, white 70%, transparent 100%)",
					maskImage: "linear-gradient(to bottom, white 70%, transparent 100%)",
				}}
				preload="auto"
				disablePictureInPicture
			>
				<source src="/core/TSOH-Poster.mp4" type="video/mp4" />
			</video>
			<div className="relative z-10 w-full max-w-[75ch] md:max-w-[105ch] self-end grid gap-3 p-5 md:pb-15 lg:px-35">
				<h2 className="text-neutral-50 font-urbanist text-md md:text-lg font-semibold">
					THE SOURCE OF HOPE
				</h2>
				<h2 className="text-neutral-50 font-urbanist text-lg md:text-xlg font-bold">
					EMPOWERING AND PROVIDING THROUGH HEALTH AND WELLNESS
				</h2>
				<p className="hidden md:block text-neutral-300 text-justify text-sm">
					We are a non-profit organization dedicated to providing holistic
					health and wellness, education, and support to individuals in need.
					Our team of volunteers is committed to serving the DFW community,
					including at-risk families, veterans, and first responders. Your
					donation helps us ensure that those in need have access to health,
					safety, and resources to live healthier, fulfilling lives.
				</p>
				<div className="flex gap-5 flex-col md:flex-row">
					<div className="w-fit">
						<AnchorButton className="w-fit" text="DONATE" />
					</div>
					<div className="w-fit">
						<LinkButton
							className="w-fit"
							to={CANONICAL_URL.about}
							text="LEARN MORE"
						/>
					</div>
				</div>
			</div>
		</HomeContent>
	);
}
