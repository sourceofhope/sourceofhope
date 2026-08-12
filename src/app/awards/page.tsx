import Image from "next/image";
import { Metadata } from "next";
import type { ReactNode } from "react";
import PageHeader from "@/components/layout/PageHeader";
import {
	AcademicCapIcon,
	ArrowDownIcon,
	ArrowPathIcon,
	BuildingOfficeIcon,
	GlobeAltIcon,
	HeartIcon,
	NewspaperIcon,
	ShieldCheckIcon,
	StarIcon,
	UserGroupIcon,
	TrophyIcon,
} from "@heroicons/react/24/solid";

export const metadata: Metadata = {
	title: "Awards & Recognition | The Source of Hope",
	description:
		"Explore the awards and recognitions honoring The Source of Hope and President Quynh Chau Stone for leadership, service, diversity, innovation, and community impact.",
	openGraph: {
		type: "website",
		title: "Awards & Recognition | The Source of Hope",
		description:
			"Discover more than a decade of awards and recognitions celebrating leadership, humanitarian service, community impact, and advocacy.",
	},
	twitter: {
		card: "summary_large_image",
		title: "Awards & Recognition | The Source of Hope",
		description:
			"Explore the awards and recognitions received by The Source of Hope and Quynh Chau Stone.",
	},
};

const timelineItems = [
	{
		year: "2024",
		title: "Global Visionaries Convention - Champion of Change",
		description:
			"Recognized as a Champion of Change for sustained community leadership and advocacy.",
		tag: "Champion of Change",
		major: true,
	},
	{
		year: "2024",
		title: "Asian Hustle Network - Unsung Hero Award",
		description: "Honored for quiet, tireless service to the community.",
	},
	{
		year: "2021",
		title: "“You Can Live Again” Humanitarian Award",
		description:
			"Presented in recognition of humanitarian work and dedication to those in need.",
		tag: "Humanitarian",
	},
	{
		year: "2020",
		title: "Presidential Volunteer Service Award",
		description:
			"Recognized by the President of the United States for outstanding volunteer service and a deep commitment to community.",
		tag: "National honor",
		major: true,
	},
	{
		year: "2020",
		title: "Each Moment Matters Award",
		description:
			"Received at a veterans tribute where a World War II veteran served as the honored keynote speaker.",
	},
	{
		year: "2019",
		title: "PullCorpMedia Women of All Cultures Award",
		description: "Honored during Women’s History Month.",
	},
	{
		year: "2019",
		title: "Junior League of Collin County Spirit Award",
		description: "Recognized for community spirit and volunteer leadership.",
	},
	{
		year: "2018",
		title: "Featured & spotlighted - Women of All Cultures",
		description:
			"Featured on PullCorpMedia’s platform during Women’s History Month, and on the 10-year anniversary of the Women That Soar Award, aired across TV stations in 12 major states.",
	},
	{
		year: "2018",
		title: "“50 Inspiring Voices of Migrant Women”",
		description:
			"Featured in the book by Mireya Sula - foreword by Seema Malhotra, MP, with a contribution from Mary Ann Thompson Frenk.",
	},
	{
		year: "2018",
		title: "Against The Grain - Groundbreaker Award",
		description:
			"Honored for excellence in her career path, leadership that paved the way for others, and a servant’s heart for the community.",
	},
	{
		year: "2018",
		title: "Inspirique Circle of Light Award",
		description:
			"Presented in Beverly Hills, California, honoring her dedication to philanthropy and community service.",
	},
	{
		year: "2017",
		title: "GDAACC Beyond Boundaries Award",
		description:
			"Presented alongside Governor Greg Abbott at the GDAACC Annual Awards.",
	},
	{
		year: "2017",
		title: "Audrey Kaplan Inspiring Women Award",
		description:
			"Southwest Jewish Congress - featured in The Dallas Morning News.",
	},
	{
		year: "2016",
		title: "Women That Soar Community Outreach Award",
		description:
			"Hosted by Kevin Frazier, co-host of Entertainment Tonight. Featured in The Dallas Morning News and on Viet Face TV.",
	},
	{
		year: "2016",
		title: "Dallas, Texas State Proclamation",
		description:
			"Issued in recognition of The Source of Hope’s three years of community service.",
		tag: "Government proclamation",
		major: true,
	},
	{
		year: "2015",
		title: "GDAACC Women in Business Award",
		description: "Nominated for the Women in Business Award.",
	},
	{
		year: "2014",
		title: "Community Leadership Award",
		description: "Tarrant County Asian American Chamber of Commerce.",
	},
	{
		year: "2013",
		title: "GDAACC Awards Gala",
		description:
			"Recognized at the Greater Dallas Asian American Chamber of Commerce Awards Gala.",
	},
	{
		year: "2013",
		title: "GPCC - nominated in four categories",
		description: "Greater Plano Chamber of Commerce recognition.",
	},
	{
		year: "2011",
		title: "Plano Profiles - “Women in Business”",
		description: "Featured in the magazine’s Women in Business edition.",
	},
	{
		year: "2010",
		title: "SBDC Small Business Award",
		description: "Awarded in Collin County.",
	},
];

type BaseGalleryItem = {
	alt: string;
	year: string;
	title: string;
	position: string;
};

type SingleGalleryItem = BaseGalleryItem & {
	src: string;
	flip?: false;
};

type FlipGalleryItem = BaseGalleryItem & {
	frontSrc: string;
	backSrc: string;
	backTitle?: string;
	backYear?: string;
	backPosition?: string;
	containBack?: boolean;
	flip: true;
};

type GalleryItem = SingleGalleryItem | FlipGalleryItem;



const galleryItems: GalleryItem[] = [
	{
		src: "/v2/core/awards-2024-uplifted.webp",
		alt: "Recognized among Asian American community leaders",
		year: "2024 · Uplifted Conference",
		title: "Recognized among Asian American community leaders",
		position: "50% 24%",
	},
	{
		src: "/v2/core/awards-2021-humanitarian.webp",
		alt: "“You Can Live Again” - honored for humanitarian service",
		year: "2021 · Humanitarian Award",
		title: "“You Can Live Again” - honored for humanitarian service",
		position: "68% 42%",
	},
	{
		src: "/v2/core/awards-2020-presidential.webp",
		alt: "With the framed presidential certificate and medal",
		year: "2020 · Presidential Volunteer Service Award",
		title: "With the framed presidential certificate and medal",
		position: "50% 40%",
	},
	{
		frontSrc: "/v2/core/awards-2020-each-moment-1.webp",
		backSrc: "/v2/core/awards-2020-each-moment-2.webp",
		alt: "Quynh Chau Stone at the Each Moment Matters Award",
		year: "2020 · Each Moment Matters Award",
		title: "Recognized with the Each Moment Matters Award",
		backTitle: "Celebrating the Each Moment Matters Award",
		position: "42% 20%",
		backPosition: "62% 40%",
		flip: true,
	},
	{
		src: "/v2/core/awards-2019-spirit.webp",
		alt: "Spirit Award - for community spirit and volunteer leadership",
		year: "2019 · Junior League of Collin County",
		title: "Spirit Award - for community spirit and volunteer leadership",
		position: "50% 24%",
	},
	{
		frontSrc: "/v2/core/awards-2017-beyond-boundaries-1.webp",
		backSrc: "/v2/core/awards-2017-beyond-boundaries-2.webp",
		alt: "Beyond Boundaries Award at GDAACC Annual Awards 2017 with Governor Greg Abbott",
		year: "2017 · GDAACC Annual Awards",
		title: "Beyond Boundaries Award - presented alongside Governor Greg Abbott",
		backTitle: "With Governor Greg Abbott and the State of Texas recognition",
		backYear: "2017 · Beyond Boundaries",
		position: "50% 42%",
		backPosition: "50% 2%",
		flip: true,
	},
	{
		src: "/v2/core/awards-2016-women-that-soar.webp",
		alt: "Accepting the Community Outreach Award on stage",
		year: "2016 · Women That Soar",
		title: "Accepting the Community Outreach Award on stage",
		position: "50% 38%",
	},
	{
		src: "/v2/core/awards-2014-community-leadership.webp",
		alt: "2014 TCAACC Annual Banquet - Community Leadership Award",
		year: "2014 · Community Leadership Award",
		title: "Tarrant County Asian American Chamber of Commerce Annual Banquet",
		position: "50% 40%",
	},
	{
		src: "/v2/core/awards-2018-migrant-women.webp",
		alt: "Celebrating the book's release",
		year: "2018 · 50 Inspiring Voices of Migrant Women",
		title: "Celebrating the book's release",
		position: "50% 22%",
	},
	{
		frontSrc: "/v2/core/awards-2018-groundbreaker-1.webp",
		backSrc: "/v2/core/awards-2018-groundbreaker-2.webp",
		alt: "Accepting the Against The Grain Groundbreaker Award on stage",
		year: "2018 · Against The Grain",
		title: "Groundbreaker Award - accepting on stage",
		backYear: "2018 · Groundbreaker Award",
		backTitle: "Presented alongside fellow honorees",
		position: "50% 20%",
		backPosition: "50% 30%",
		flip: true,
	},
	{
		frontSrc: "/v2/core/awards-2018-inspirique-1.webp",
		backSrc: "/v2/core/awards-2018-inspirique-2.webp",
		alt: "Quynh Chau Stone at the Inspirique Circle of Light Awards red carpet",
		year: "2018 · Inspirique Circle of Light",
		title: "Honored in Beverly Hills, California",
		backYear: "2018 · Inspirique Circle of Light",
		backTitle: "For her dedication to philanthropy and community service",
		position: "50% 20%",
		backPosition: "center",
		flip: true,
		containBack: true,
	},
];

export default function AwardsPage() {
	return (
		<>
         <PageHeader
        src="/v2/core/awards-humanitarian-stage-light.webp"
        className="!h-[340px] md:!h-[420px] lg:!h-[480px] xl:!h-[520px]"
        >
        <h2 className="font-bold text-neutral-50 text-4xl md:text-5xl">
            AWARDS &amp; RECOGNITION
        </h2>
        
        </PageHeader>

			<HeroSection />
			<HighlightedHonors />
			<RecognitionTimeline />
			<RecognitionGallery />
			<RecognitionDetails />
			<CallToAction />
		</>
	);
}

function HeroSection() {
	return (
		<section className="bg-blue-950 text-white pt-0 pb-16 md:pb-20">
			<div className="max-w-6xl mx-auto px-7">
				<div className="grid grid-cols-1 md:grid-cols-[1.15fr_.85fr] gap-12 md:gap-14 items-center py-16 md:py-20">
					<div>
						
						<h1 className="text-5xl md:text-7xl font-bold leading-tight mt-5 mb-4">
							A Legacy of
							<br />
							<span className="text-teal-300">Leadership</span>
						</h1>
						<p className="text-xl md:text-2xl italic text-teal-300 mb-6">
							A lifetime of impact - earned one community at a time.
						</p>
						<p className="text-base text-blue-100 max-w-2xl mb-4">
							For more than a decade, The Source of Hope and our president,{" "}
							<strong className="text-white">Quynh Chau Stone</strong>, have
							been recognized by national, state, and community organizations
							for leadership, innovation, diversity, and service.
						</p>
						<p className="text-base text-blue-100 max-w-2xl mb-8">
							Every honor here represents the same thing: lives changed
							through hope, education, wellness, and community impact.
						</p>
						<a
							href="#timeline"
							className="inline-flex items-center gap-2 bg-blue-500 text-white px-7 py-3.5 rounded-full font-semibold text-sm shadow-lg hover:bg-blue-600 transition-colors"
						>
							See the honors
							<ArrowDownIcon className="w-4 h-4" />
						</a>
					</div>

					<div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-blue-900">
						<Image
							src="/v2/core/awards-hero.webp"
							alt="Quynh Chau Stone holding her 2020 Presidential Volunteer Service Award medal beside the framed certificate"
							fill
							sizes="(max-width: 768px) 100vw, 40vw"
							priority
							className="object-cover object-center"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
						<div className="absolute left-4 bottom-4 flex items-center gap-2 bg-blue-950/80 backdrop-blur-sm border border-white/15 px-3.5 py-2.5 rounded-xl text-xs font-semibold">
							<StarIcon className="w-4 h-4 text-teal-300" />
							2020 Presidential Volunteer Service Award
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
	return (
		<div className="text-center mb-12 md:mb-14">
			<span className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase text-blue-500">
				<span className="w-7 h-px bg-teal-300" />
				{eyebrow}
				<span className="w-7 h-px bg-teal-300" />
			</span>
			<h2 className="text-3xl md:text-4xl font-bold text-blue-900 mt-4">
				{title}
			</h2>
		</div>
	);
}

function HighlightedHonors() {
	const honors = [
		{
			year: "2020",
			title: "Presidential Volunteer Service Award",
			description:
				"The highest national recognition for volunteer service, awarded by the President of the United States.",
			icon: <TrophyIcon className="w-6 h-6" />,
		},
		{
			year: "2017",
			title: "Beyond Boundaries Award",
			description:
				"Recognized for promoting diversity and inclusion, and building stronger communities through collaborative outreach.",
			icon: <GlobeAltIcon className="w-6 h-6" />,
		},
		{
			year: "2016",
			title: "Women That Soar Community Award",
			description:
				"Presented for exceptional community leadership, service, and a commitment to empowering individuals and families.",
			icon: <HeartIcon className="w-6 h-6" />,
		},
		{
			year: "2017",
			title: "Audrey Kaplan Inspiring Women Award",
			description:
				"Awarded by the Southwest Jewish Congress and featured in The Dallas Morning News.",
			icon: <ShieldCheckIcon className="w-6 h-6" />,
		},
	];

	return (
		<section id="honors" className="bg-white py-20 md:py-24">
			<div className="max-w-6xl mx-auto px-7">
				<SectionHeading
					eyebrow="Our highlighted honors"
					title="The recognitions we hold closest"
				/>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
					{honors.map((honor) => (
						<article
							key={`${honor.year}-${honor.title}`}
							className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all relative overflow-hidden"
						>
							<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-teal-300" />
							<div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 mb-5">
								{honor.icon}
							</div>
							<div className="text-xs font-bold tracking-[0.1em] text-blue-500">
								{honor.year}
							</div>
							<h3 className="text-lg font-bold text-blue-900 mt-1.5 mb-3 leading-tight">
								{honor.title}
							</h3>
							<p className="text-sm text-gray-600 leading-relaxed">
								{honor.description}
							</p>
						</article>
					))}
				</div>

				<div className="text-center mt-10">
					<a
						href="#timeline"
						className="inline-flex items-center gap-2 border border-blue-500 text-blue-600 px-6 py-3 rounded-full font-semibold text-sm hover:bg-blue-500 hover:text-white transition-colors"
					>
						Jump to full timeline
						<ArrowDownIcon className="w-4 h-4" />
					</a>
				</div>
			</div>
		</section>
	);
}

function RecognitionTimeline() {
	return (
		<section
			id="timeline"
			className="bg-gradient-to-b from-white to-gray-50 py-20 md:py-24"
		>
			<div className="max-w-5xl mx-auto px-7">
				<SectionHeading
					eyebrow="Our recognition timeline"
					title="More than a decade of honors"
				/>

				<div className="max-w-3xl mx-auto relative pl-2">
					<div className="absolute left-[112px] top-1.5 bottom-1.5 w-0.5 bg-gradient-to-b from-blue-100 to-gray-200 hidden sm:block" />

					{timelineItems.map((item, index) => (
						<div
							key={`${item.year}-${item.title}`}
							className="relative grid grid-cols-[70px_1fr] sm:grid-cols-[104px_1fr] gap-6 sm:gap-10 pb-8 last:pb-0"
						>
							<div className="text-right text-lg sm:text-2xl font-semibold text-blue-900 pt-0.5">
								{item.year}
							</div>

							<div
								className={`absolute left-[63px] sm:left-[105px] top-2 w-3.5 h-3.5 rounded-full bg-white border-2 z-10 ${
									item.major
										? "bg-blue-500 border-blue-500 shadow-[0_0_0_5px_rgba(153,212,192,.45)]"
										: "border-blue-500"
								}`}
							/>

							<div>
								<h3 className="text-base font-bold text-blue-900 leading-snug">
									{item.title}
								</h3>
								<p className="text-sm text-gray-600 mt-1 leading-relaxed">
									{item.description}
								</p>
								{item.tag && (
									<span className="inline-block mt-2 text-[10px] font-bold tracking-[0.1em] uppercase text-blue-600 bg-blue-50 rounded px-2 py-1">
										{item.tag}
									</span>
								)}
							</div>
						</div>
					))}
				</div>

				<div className="max-w-4xl mx-auto mt-14 bg-blue-900 text-white rounded-2xl p-7 md:p-8 flex flex-col sm:flex-row gap-5 items-start shadow-xl relative overflow-hidden">
					<div className="w-11 h-11 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-teal-300">
						<UserGroupIcon className="w-6 h-6" />
					</div>
					<p className="text-sm md:text-[15px] text-blue-100 leading-relaxed">
						Quynh Chau Stone was also nominated to serve on an exclusive{" "}
						<strong className="text-white">City of Dallas board</strong> to
						develop the Asian American Cultural Center of Dallas - endorsed by
						Mayor Mike Rawlings and Deputy Mayor Pro-Tem Monica Alonzo.
					</p>
				</div>
			</div>
		</section>
	);
}

function RecognitionGallery() {
	return (
		<section id="moments" className="bg-white py-20 md:py-24">
			<div className="max-w-6xl mx-auto px-7">
				<SectionHeading eyebrow="In the spotlight" title="Moments of recognition" />

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
					{galleryItems.map((item, index) =>
						item.flip ? (
							<FlipGalleryCard key={index} item={item} />
						) : (
							<GalleryCard key={index} item={item} />
						),
					)}
				</div>
			</div>
		</section>
	);
}

//type GalleryItem = (typeof galleryItems)[number];

function GalleryCard({ item }: { item: SingleGalleryItem }) {
	//if (!("src" in item)) return null;

	return (
		<figure className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-blue-950">
			<Image
				src={item.src}
				alt={item.alt}
				fill
				sizes="(max-width: 768px) 100vw, 50vw"
				className="object-cover transition-transform duration-500 hover:scale-105"
				style={{ objectPosition: item.position }}
			/>
			<figcaption className="absolute inset-x-0 bottom-0 p-5 pt-12 bg-gradient-to-t from-black/90 via-black/25 to-transparent text-white">
				<div className="text-[11px] font-bold tracking-[0.12em] text-teal-300 uppercase">
					{item.year}
				</div>
				<h4 className="text-sm font-semibold mt-1 leading-snug">{item.title}</h4>
			</figcaption>
		</figure>
	);
}

function FlipGalleryCard({ item }: { item: FlipGalleryItem }) {
	//if (!("frontSrc" in item) || !item.backSrc) return null;

	return (
		<div className="group relative aspect-[4/3] [perspective:1200px]">
			<div className="absolute inset-0 transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
				<figure className="absolute inset-0 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-blue-950 [backface-visibility:hidden]">
					<Image
						src={item.frontSrc}
						alt={item.alt}
						fill
						sizes="(max-width: 768px) 100vw, 50vw"
						className="object-cover"
						style={{ objectPosition: item.position }}
					/>
					<FlipHint />
					<figcaption className="absolute inset-x-0 bottom-0 p-5 pt-12 bg-gradient-to-t from-black/90 via-black/25 to-transparent text-white">
						<div className="text-[11px] font-bold tracking-[0.12em] text-teal-300 uppercase">
							{item.year}
						</div>
						<h4 className="text-sm font-semibold mt-1 leading-snug">
							{item.title}
						</h4>
					</figcaption>
				</figure>

				<figure className="absolute inset-0 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-blue-950 [backface-visibility:hidden] [transform:rotateY(180deg)]">
					<Image
						src={item.backSrc}
						alt={item.alt}
						fill
						sizes="(max-width: 768px) 100vw, 50vw"
						className={item.containBack ? "object-contain" : "object-cover"}
						style={{ objectPosition: item.backPosition }}
					/>
					<figcaption className="absolute inset-x-0 bottom-0 p-5 pt-12 bg-gradient-to-t from-black/90 via-black/25 to-transparent text-white">
						<div className="text-[11px] font-bold tracking-[0.12em] text-teal-300 uppercase">
							{"backYear" in item && item.backYear ? item.backYear : item.year}
						</div>
						<h4 className="text-sm font-semibold mt-1 leading-snug">
							{"backTitle" in item && item.backTitle ? item.backTitle : item.title}
						</h4>
					</figcaption>
				</figure>
			</div>
		</div>
	);
}

function FlipHint() {
	return (
		<div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-full border border-white/20">
			<ArrowPathIcon className="w-3.5 h-3.5" />
			Tap or hover to flip · 2 photos
		</div>
	);
}

function RecognitionDetails() {
	return (
		<section className="bg-gray-50 py-20 md:py-24">
			<div className="max-w-6xl mx-auto px-7">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
						<span className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-500">
							Featured in press &amp; media
						</span>

						<ul className="mt-7 space-y-5">
							<DetailItem
								icon={<AcademicCapIcon className="w-5 h-5" />}
								title="50 Inspiring Voices of Migrant Women"
								text="Featured contributor highlighting the journey from struggle to success."
							/>
							<DetailItem
								icon={<StarIcon className="w-5 h-5" />}
								title="Women That Soar Anniversary Special"
								text="Featured across television stations in 12 major states."
							/>
							<DetailItem
								icon={<NewspaperIcon className="w-5 h-5" />}
								title="The Dallas Morning News"
								text="Featured for multiple community awards and leadership recognition."
							/>
							<DetailItem
								icon={<ArrowPathIcon className="w-5 h-5" />}
								title="Viet Face TV"
								text="Featured for the Community Outreach Award."
							/>
						</ul>
					</div>

					<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
						<span className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600">
							Government recognitions
						</span>

						<ul className="mt-7 space-y-5">
							<DetailItem
								icon={<TrophyIcon className="w-5 h-5" />}
								title="2016 Texas State Proclamation"
								text="Presented by Governor Greg Abbott in recognition of three years of community service."
								accent
							/>
							<DetailItem
								icon={<BuildingOfficeIcon className="w-5 h-5" />}
								title="City of Dallas Board Nomination"
								text="Nominated to help develop the Asian American Cultural Center of Dallas - endorsed by Mayor Mike Rawlings and Deputy Mayor Pro-Tem Monica Alonzo."
								accent
							/>
						</ul>
					</div>

					<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
						<span className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-500">
							Our heart, our honor
						</span>
						<div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mt-6 mb-5">
							<HeartIcon className="w-7 h-7" />
						</div>
						<p className="text-sm md:text-base text-gray-700 leading-relaxed mb-5">
							Awards are an honor - but our greatest achievement is the impact
							we create together. Every volunteer, donor, partner, and
							supporter plays a vital role in bringing hope, healing, and
							opportunity to our community.
						</p>
						<p className="text-lg italic text-blue-600">
							Thank you for being part of our mission.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

function DetailItem({
	icon,
	title,
	text,
	accent = false,
}: {
	icon: ReactNode;
	title: string;
	text: string;
	accent?: boolean;
}) {
	return (
		<li className="flex gap-3 items-start">
			<div
				className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
					accent ? "bg-blue-50 text-blue-600" : "bg-blue-50 text-blue-500"
				}`}
			>
				{icon}
			</div>
			<div>
				<h4
					className={`text-sm font-bold ${
						accent ? "text-blue-700" : "text-blue-900"
					}`}
				>
					{title}
				</h4>
				<p className="text-xs text-gray-600 leading-relaxed mt-0.5">{text}</p>
			</div>
		</li>
	);
}

function CallToAction() {
	return (
		<section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
			<div className="max-w-6xl mx-auto px-7 py-12 md:py-14">
				<div className="flex flex-col md:flex-row items-center justify-between gap-7 text-center md:text-left">
					<div className="flex items-center gap-5">
						<div className="shrink-0">
							<HeartIcon className="w-12 h-12 text-white/85" />
						</div>
						<div>
							<h2 className="text-2xl md:text-3xl font-bold mb-2">
								Together, we are creating lasting hope - one community at a
								time.
							</h2>
							<p className="text-sm md:text-base text-blue-100">
								Your support helps us continue to serve, empower, and transform
								lives.
							</p>
						</div>
					</div>

					<a
						href="/members"
						className="bg-white text-blue-900 px-8 py-3.5 rounded-full font-bold text-sm whitespace-nowrap hover:-translate-y-0.5 hover:shadow-lg transition-all"
					>
						Get involved
					</a>
				</div>
			</div>
		</section>
	);
}
