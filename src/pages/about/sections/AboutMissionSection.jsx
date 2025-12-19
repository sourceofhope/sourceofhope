import PageSection from "../../PageSection";

import ExpressiveAnchor from "../../../components/ui/expressive/ExpressiveAnchor";
import Title from "../../../components/ui/text/Title";
import Blockquote from "../../../components/ui/text/Blockquote";
import Bold from "../../../components/ui/text/Bold";

export default function AboutMissionSection() {
	return (
		<PageSection className="grid md:grid-cols-[6fr_4fr] gap-5 bg-neutral-200 items-center py-10">
			<article className="grid gap-5 self-start">
				<div className="grid gap-5">
					<Title className="font-semibold md:text-balance">
						Founded in 2014 on{" "}
						<span className="hidden md:inline-block">our guiding</span>{" "}
						principle
					</Title>
					<Blockquote className="text-sm md:text-md lg:text-lg text-neutral-600 border-accent-600 text-balance">
						"empower with dignity—meet urgent needs while equipping people with
						lifelong skills, wellness, and community so hope becomes
						sustainable."
					</Blockquote>
					<p className="text-sm md:text-md lg:text-lg pl-5 w-fit text-neutral-600">
						<ExpressiveAnchor href="https://www.linkedin.com/in/qu%E1%BB%B3nh-ch%C3%A2u-qc-stone-87185b34/">
							- Co-founder, <Bold>Quynh Chau Stone</Bold>
						</ExpressiveAnchor>
					</p>
				</div>
				<div className="grid gap-5">
					<h3 className="text-sm md:text-md border-b-2 pb-1/2 w-fit font-semibold">
						Mission
					</h3>
					<p className="text-sm md:text-md lg:text-lg">
						Bringing hope and healing by providing meals, education, wellness,
						and resources that uplift and empower communities in need.
					</p>
				</div>
				<div className="grid gap-5">
					<h3 className="text-sm md:text-md border-b-2 pb-1/2 w-fit font-semibold">
						Vision
					</h3>
					<p className="text-sm md:text-md lg:text-lg">
						A world where every person has the wellness, skills, and community
						to thrive—so cycles of hardship give way to lives of purpose and
						communities that flourish.
					</p>
				</div>
			</article>
			<article className="grid self-center justify-items-end">
				<img
					src="/servingHope/SH-ResourceTile.jpg"
					className="block w-full aspect-square bg-accent-900 max-w-[450px] rounded-2xl object-cover object-center"
				/>
			</article>
		</PageSection>
	);
}
