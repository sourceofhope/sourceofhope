import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";

import {
	HeartIcon,
	DocumentCheckIcon,
	BriefcaseIcon,
	ShieldCheckIcon,
	ChartBarIcon,
	HomeIcon,
	BuildingOfficeIcon,
	UserGroupIcon,
	AcademicCapIcon,
	UsersIcon,
	UserIcon,
	ChatBubbleLeftIcon,
} from "@heroicons/react/24/solid";
import { Metadata } from "next";
import FormSection from "@/components/planned-giving/FormSection";
import { useHeaderContext } from "@/context/HeaderContext";

export const metadata: Metadata = {
	title: "Planned Giving | The Source of Hope",
	description:
		"Leave a lasting legacy with The Source of Hope through planned giving. Learn how bequests, trusts, and beneficiary designations can create transformational impact for generations to come.",
	openGraph: {
		type: "website",
		title: "Planned Giving | The Source of Hope",
		description:
			"Secure the future of The Source of Hope through planned giving. Discover how legacy gifts through wills, trusts, and retirement accounts create lasting impact in the DFW community.",
	},
	twitter: {
		card: "summary_large_image",
		title: "Planned Giving | The Source of Hope",
		description:
			"Leave a legacy of hope. Explore planned giving options with The Source of Hope and ensure your values live on for generations.",
	},
};

const header = useHeaderContext();
const setIsBlocking = header?.setIsBlocking;
setIsBlocking?.(true);

export default function PlannedGivingPage() {
	return (
		<>
			<>
				<PageHeader src="/v2/servingHope/Carousel-7.webp">
					<h2 className="font-bold text-neutral-50 text-4xl md:text-5xl">
						PLANNED GIVING
					</h2>
					<p className="font-semibold text-neutral-200 text-sm">
						LEAVE A LASTING LEGACY
					</p>
				</PageHeader>
			</>

			<HeroSection />
			<LeaveSection />
			<ImpactSection />
			<LegacySection />
			<FormSection />
			<TrustStrip />
		</>
	);
}

function HeroSection() {
	return (
		<section className="bg-white pt-0 pb-20 md:pb-28">
			<div className="max-w-5xl mx-auto px-7">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-14 items-center">
					<div>
						<h1 className="text-5xl md:text-7xl font-bold text-blue-900 leading-tight mb-6">
							<span className="whitespace-nowrap">Your Legacy.</span>
							<br />
							<span className="text-blue-500">Their Hope.</span>
						</h1>
						<div className="flex items-center justify-center gap-3 my-6">
							<span className="w-12 h-0.5 bg-blue-400 opacity-55"></span>
							{/* <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 7.5 3c0 5.3-7.5 10-7.5 10Z"/>
                </svg> */}
							<HeartIcon className="w-4 h-4 text-blue-500" />
							<span className="w-12 h-0.5 bg-blue-400 opacity-55"></span>
						</div>
						<p className="text-xl font-semibold text-blue-900 max-w-xl mb-4">
							What you leave behind can do more than change lives today. It can
							create hope for generations to come.
						</p>
						<p className="text-base text-gray-600 max-w-2xl mb-8">
							Through planned giving, your values and compassion can continue
							making a difference long after you're gone.
						</p>
						<a
							href="#form-section"
							className="inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-4 rounded-full font-bold text-base shadow-lg hover:bg-blue-800 transition-colors"
						>
							{/* <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c-.5 2.8-2.2 4.6-5 5.4 2.1.4 3.7 1.6 4.6 3.6.9-2 2.5-3.2 4.6-3.6-2.8-.8-4.5-2.6-4.6-5.4Z"/>
                </svg> */}
							Begin Your Legacy Journey
						</a>
					</div>
					<div className="relative rounded-3xl overflow-hidden shadow-lg w-full aspect-square md:aspect-auto md:h-96">
						<Image
							src="/v2/plannedgiving/plannedgiving_hero.webp"
							alt="hero-image"
							fill
							sizes="(max-width: 1000px) 100vw, (max-width: 1920px) 50vw, 600px"
							loading="eager"
							className="object-cover"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

function LeaveSection() {
	return (
		<section className="bg-white md:px-0 py-20 md:py-24">
			<div className="max-w-5xl mx-auto px-7">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">
						Ways to Leave a Legacy
					</h2>
					<div className="flex items-center justify-center gap-3">
						<span className="w-12 h-0.5 bg-blue-400 opacity-55"></span>
						{/* <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 7.5 3c0 5.3-7.5 10-7.5 10Z" />
              </svg> */}
						<HeartIcon className="w-4 h-4 text-blue-500" />
						<span className="w-12 h-0.5 bg-blue-400 opacity-55"></span>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					{/* Will or Trust */}
					<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
						{/* <svg className="w-10 h-10 text-blue-500 mb-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                <path d="M6 3h8l4 4v14H6V3Z" />
                <path d="M14 3v4h4M9 12h6M9 16h4" />
                <path d="m17 13 2 2-3.5 3.5-2.2.5.5-2.2L17 13Z" />
              </svg> */}
						<DocumentCheckIcon className="w-10 h-10 text-blue-500 mb-5" />
						<h3 className="text-xl font-bold text-blue-900 mb-3">
							In Your Will or Trust
						</h3>
						<p className="text-gray-600 text-base">
							A simple way to leave a lasting gift that reflects your values.
						</p>
					</div>

					{/* Retirement Accounts */}
					<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
						{/* <svg className="w-10 h-10 text-blue-500 mb-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                <path d="M4 11a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1a4 4 0 0 1-2 3.4V19h-2v-2h-4v2H8v-2.6A4.7 4.7 0 0 1 5 13H4a1 1 0 0 1 0-2Z" />
                <path d="M13 6V4h-2M16.5 10.5h.01" />
              </svg> */}
						<BriefcaseIcon className="w-10 h-10 text-blue-500 mb-5" />
						<h3 className="text-xl font-bold text-blue-900 mb-3">
							Retirement Accounts
						</h3>
						<p className="text-gray-600 text-base">
							Name The Source of Hope as a beneficiary of your IRA, 401(k), or
							other plan.
						</p>
					</div>

					{/* Life Insurance */}
					<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
						{/* <svg className="w-10 h-10 text-blue-500 mb-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                <path d="M12 21c-5-2.5-7-6-7-10V6l7-3 7 3v5c0 4-2 7.5-7 10Z" />
                <path d="M12 14s-3-1.8-3-3.6a1.6 1.6 0 0 1 3-.6 1.6 1.6 0 0 1 3 .6C15 12.2 12 14 12 14Z" />
              </svg> */}
						<ShieldCheckIcon className="w-10 h-10 text-blue-500 mb-5" />
						<h3 className="text-xl font-bold text-blue-900 mb-3">
							Life Insurance
						</h3>
						<p className="text-gray-600 text-base">
							Name The Source of Hope as a beneficiary of an existing or new
							life insurance policy to make a meaningful future gift.
						</p>
					</div>

					{/* Stocks & Investments */}
					<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
						{/* <svg className="w-10 h-10 text-blue-500 mb-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                <path d="M4 20h16M7 20v-6M12 20v-9M17 20v-4" />
                <path d="m6 9 4-3 3 2 5-5M18 3h2v2" />
              </svg> */}
						<ChartBarIcon className="w-10 h-10 text-blue-500 mb-5" />
						<h3 className="text-xl font-bold text-blue-900 mb-3">
							Stocks &amp; Investments
						</h3>
						<p className="text-gray-600 text-base">
							Donate appreciated securities and help our mission while receiving
							tax benefits.
						</p>
					</div>

					{/* Real Estate & Land */}
					<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
						{/* <svg className="w-10 h-10 text-blue-500 mb-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                <path d="m4 11 8-6 8 6M6 10v10h12V10" />
                <path d="M10 20v-5h4v5" />
                <path d="M18 8V5h2v4.5" />
              </svg> */}
						<HomeIcon className="w-10 h-10 text-blue-500 mb-5" />
						<h3 className="text-xl font-bold text-blue-900 mb-3">
							Real Estate &amp; Land
						</h3>
						<p className="text-gray-600 text-base">
							Leave a home, land, or property to support hope for generations to
							come.
						</p>
					</div>

					{/* Business Interests */}
					<div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
						{/* <svg className="w-10 h-10 text-blue-500 mb-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                <path d="M4 21V6h9v15M13 21V10h7v11" />
                <path d="M7 9h2M7 12h2M7 15h2M16 13h1M16 16h1" />
              </svg> */}
						<BuildingOfficeIcon className="w-10 h-10 text-blue-500 mb-5" />
						<h3 className="text-xl font-bold text-blue-900 mb-3">
							Business Interests
						</h3>
						<p className="text-gray-600 text-base">
							Business owners may leave a portion of their business to support
							our mission.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

function ImpactSection() {
	return (
		<section className="bg-blue-900 text-blue-100 md:px-0 py-20 md:py-24">
			<div className="max-w-5xl mx-auto px-7">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
						The Impact of Your Legacy
					</h2>
					<div className="flex items-center justify-center gap-3">
						<span className="w-12 h-0.5 bg-teal-400 opacity-55"></span>
						{/* <svg className="w-4 h-4 text-teal-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 7.5 3c0 5.3-7.5 10-7.5 10Z" />
              </svg> */}
						<HeartIcon className="w-4 h-4 text-blue-500" />
						<span className="w-12 h-0.5 bg-teal-400 opacity-55"></span>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0">
					{/* Stronger Families */}
					<div className="text-center p-6 py-8 relative lg:border-r border-blue-700 last:border-r-0">
						{/* <svg className="w-12 h-12 text-teal-400 mx-auto mb-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <circle cx="8" cy="8" r="2.5" />
                <circle cx="16" cy="8" r="2.5" />
                <path d="M3 20c0-3 2-4.5 5-4.5s5 1.5 5 4.5M13 20c0-3 2-4.5 5-4.5s3 1.2 3 4.5" />
              </svg> */}
						<UsersIcon className="w-12 h-12 text-teal-400 mx-auto mb-4" />
						<h3 className="text-lg font-bold text-white mb-2">
							Stronger Families
						</h3>
						<p className="text-sm text-blue-200">
							Providing stability, resources, and hope when families need it
							most.
						</p>
					</div>

					{/* Brighter Futures */}
					<div className="text-center p-6 py-8 relative lg:border-r border-blue-700 last:border-r-0">
						{/* <svg className="w-12 h-12 text-teal-400 mx-auto mb-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="m3 9 9-4 9 4-9 4-9-4Z" />
                  <path d="M7 11v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4M21 9v4" />
                </svg> */}
						<AcademicCapIcon className="w-12 h-12 text-teal-400 mx-auto mb-4" />
						<h3 className="text-lg font-bold text-white mb-2">
							Brighter Futures
						</h3>
						<p className="text-sm text-blue-200">
							Opening doors to education and opportunity so students can reach
							their potential.
						</p>
					</div>

					{/* Compassionate Care */}
					<div className="text-center p-6 py-8 relative lg:border-r border-blue-700 last:border-r-0">
						{/* <svg className="w-12 h-12 text-teal-400 mx-auto mb-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <path d="M12 20s-6-4-6-8a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 4-6 8-6 8Z" />
                <path d="M4 15a3 3 0 0 1 0-6M20 15a3 3 0 0 0 0-6" />
              </svg> */}
						<HeartIcon className="w-12 h-12 text-teal-400 mx-auto mb-4" />

						<h3 className="text-lg font-bold text-white mb-2">
							Compassionate Care
						</h3>
						<p className="text-sm text-blue-200">
							Supporting seniors with dignity, respect, and the care they
							deserve.
						</p>
					</div>

					{/* Supporting Veterans */}
					<div className="text-center p-6 py-8 relative lg:border-r border-blue-700 last:border-r-0">
						{/* <svg className="w-12 h-12 text-teal-400 mx-auto mb-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <circle cx="12" cy="8" r="3.2" />
                <path d="M9.2 5.5 12 3l2.8 2.5M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" />
              </svg> */}
						<UserIcon className="w-12 h-12 text-teal-400 mx-auto mb-4" />
						<h3 className="text-lg font-bold text-white mb-2">
							Supporting Veterans
						</h3>
						<p className="text-sm text-blue-200">
							Honoring those who served by walking alongside them in their next
							chapter.
						</p>
					</div>

					{/* Thriving Communities */}
					<div className="text-center p-6 py-8 relative lg:border-r border-blue-700 last:border-r-0">
						{/* <svg className="w-12 h-12 text-teal-400 mx-auto mb-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <circle cx="7" cy="8" r="2" />
                <circle cx="17" cy="8" r="2" />
                <circle cx="12" cy="6.5" r="2.2" />
                <path d="M3.5 19c0-2.5 1.6-3.8 3.5-3.8M20.5 19c0-2.5-1.6-3.8-3.5-3.8M8 19c0-2.8 1.8-4.2 4-4.2s4 1.4 4 4.2" />
              </svg> */}
						<UserGroupIcon className="w-12 h-12 text-teal-400 mx-auto mb-4" />
						<h3 className="text-lg font-bold text-white mb-2">
							Thriving Communities
						</h3>
						<p className="text-sm text-blue-200">
							Building stronger, more hopeful communities together.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

function LegacySection() {
	return (
		<section className="bg-gray-100 md:px-0 py-20 md:py-24">
			<div className="max-w-5xl mx-auto px-7">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">
						Your Legacy Journey
					</h2>
					<div className="flex items-center justify-center gap-3">
						<span className="w-12 h-0.5 bg-blue-400 opacity-55"></span>
						{/* <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 7.5 3c0 5.3-7.5 10-7.5 10Z"/>
              </svg> */}
						<HeartIcon className="w-4 h-4 text-blue-500" />
						<span className="w-12 h-0.5 bg-blue-400 opacity-55"></span>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{/* Step 1 */}
					<div className="text-center relative">
						<div className="w-14 h-14 rounded-full bg-blue-900 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-5 shadow-md">
							1
						</div>
						<h3 className="text-lg font-bold text-blue-900 mb-3">
							Explore Your Legacy
						</h3>
						<p className="text-sm text-gray-600 max-w-xs mx-auto">
							Think about the impact you'd like to leave for future generations.
						</p>
						{/* Connector line */}
						{/* <div className="hidden lg:block absolute top-7 left-full w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300"></div> */}
					</div>

					{/* Step 2 */}
					<div className="text-center relative">
						<div className="w-14 h-14 rounded-full bg-blue-900 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-5 shadow-md">
							2
						</div>
						<h3 className="text-lg font-bold text-blue-900 mb-3">
							Have a Conversation
						</h3>
						<p className="text-sm text-gray-600 max-w-xs mx-auto">
							Reach out to us confidentially. We'll answer your questions and
							explain your options.
						</p>
						{/* Connector line */}
						{/* <div className="hidden lg:block absolute top-7 left-full w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300"></div> */}
					</div>

					{/* Step 3 */}
					<div className="text-center relative">
						<div className="w-14 h-14 rounded-full bg-blue-900 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-5 shadow-md">
							3
						</div>
						<h3 className="text-lg font-bold text-blue-900 mb-3">
							Meet With Your Attorney
						</h3>
						<p className="text-sm text-gray-600 max-w-xs mx-auto">
							Your attorney can help you include us in your will, trust, or
							estate plans.
						</p>
						{/* Connector line */}
						{/* <div className="hidden lg:block absolute top-7 left-full w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300"></div> */}
					</div>

					{/* Step 4 */}
					<div className="text-center relative">
						<div className="w-14 h-14 rounded-full bg-blue-900 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-5 shadow-md">
							4
						</div>
						<h3 className="text-lg font-bold text-blue-900 mb-3">
							Leave a Legacy of Hope
						</h3>
						<p className="text-sm text-gray-600 max-w-xs mx-auto">
							Your gift will one day help families, veterans, seniors, and
							students.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

function TrustStrip() {
	return (
		<section className="border-t border-gray-300 bg-blue-50 md:px-0 py-12 md:py-14">
			<div className="max-w-5xl mx-auto px-7">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="flex flex-col items-center text-center p-6">
						{/* <svg className="w-8 h-8 text-blue-600 mb-3 stroke-current flex-shrink-0" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="M12 20s-7-4.4-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.6 12 20 12 20Z"/>
                </svg> */}
						<HeartIcon className="w-8 h-8 text-blue-600 mb-3" />
						<p className="text-sm text-gray-900 font-medium leading-relaxed">
							Planned giving isn't only for wealthy individuals. Any gift, of
							any size, can create lasting hope.
						</p>
					</div>
					<div className="flex flex-col items-center text-center p-6">
						{/* <svg className="w-8 h-8 text-blue-600 mb-3 stroke-current flex-shrink-0" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="M12 21c-5-2.5-7-6-7-10V6l7-3 7 3v5c0 4-2 7.5-7 10Z"/>
                </svg> */}
						<ShieldCheckIcon className="w-8 h-8 text-blue-600 mb-3" />
						<p className="text-sm text-gray-900 font-medium leading-relaxed">
							You can support your family and still leave a legacy that makes a
							difference.
						</p>
					</div>
					<div className="flex flex-col items-center text-center p-6">
						{/* <svg className="w-8 h-8 text-blue-600 mb-3 stroke-current flex-shrink-0" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <circle cx="8" cy="9" r="2"/>
                  <circle cx="16" cy="9" r="2"/>
                  <path d="M4 19c0-2.5 1.8-4 4-4s4 1.5 4 4M12 19c0-2.5 1.8-4 4-4s4 1.5 4 4"/>
                </svg> */}
						<UserIcon className="w-8 h-8 text-blue-600 mb-3" />

						<p className="text-sm text-gray-900 font-medium leading-relaxed">
							Many supporters continue giving during their lifetime while also
							including a future gift.
						</p>
					</div>
					<div className="flex flex-col items-center text-center p-6">
						{/* <svg className="w-8 h-8 text-blue-600 mb-3 stroke-current flex-shrink-0" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="M4 5h16v11H9l-4 3v-3H4V5Z"/>
                  <path d="M8 9h8M8 12h5"/>
                </svg> */}
						<ChatBubbleLeftIcon className="w-8 h-8 text-blue-600 mb-3" />
						<p className="text-sm text-gray-900 font-medium leading-relaxed">
							Already included The Source of Hope in your plans? We'd love to
							hear from you.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
