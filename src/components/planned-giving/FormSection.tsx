"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import { HeartIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { useHeaderContext } from "@/context/HeaderContext";

export default function FormSection() {
	const [status, setStatus] = useState("IDLE");
	const [formData, setFormData] = useState({
		fname: "",
		lname: "",
		email: "",
		phone: "",
		message: "",
		infoCheck: false,
		contactCheck: false,
	});

	//added this on 07/28/2026 to display the header correctly on this page
	const header = useHeaderContext();
	const setIsBlocking = header?.setIsBlocking;

	useEffect(() => {
		setIsBlocking?.(true);
		return () => setIsBlocking?.(false); // reset on navigate away
	}, [setIsBlocking]);

	// Email validation
	const validateEmail = (email: string) =>
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	// Form submission handler
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validate
		if (
			!formData.fname ||
			!formData.lname ||
			!formData.email ||
			!validateEmail(formData.email)
		) {
			alert("Please fill in all required fields with a valid email.");
			return;
		}

		setStatus("SUBMITTING");

		try {
			// Format message exactly like the React component
			const messageLines = [
				"Planned Giving Interest Form",
				`Name: ${formData.fname} ${formData.lname}`,
				`Email: ${formData.email}`,
				formData.phone ? `Phone: ${formData.phone}` : null,
				formData.message ? `Message: ${formData.message}` : null,
				formData.infoCheck
					? "Inquiry Type: Information about planned giving"
					: null,
				formData.contactCheck
					? "Request: Please contact me to start a conversation"
					: null,
			]
				.filter(Boolean)
				.join("\n");

			// Send to the same endpoint as the React component
			const response = await fetch("/api/email/send", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: `${formData.fname} ${formData.lname}`.trim(),
					email: formData.email,
					message: messageLines,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to send email");
			}

			// Success
			alert(
				"Thank you! We've received your inquiry. A member of our team will reach out to you soon.",
			);
			setFormData({
				fname: "",
				lname: "",
				email: "",
				phone: "",
				message: "",
				infoCheck: false,
				contactCheck: false,
			});
			setStatus("SUCCESS");
			setTimeout(() => setStatus("IDLE"), 3000);
		} catch (error) {
			console.error("Form submission error:", error);
			alert("Something went wrong. Please try again or contact us directly.");
			setStatus("ERROR");
			setTimeout(() => setStatus("IDLE"), 3000);
		}
	};

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	return (
		<section className="bg-white md:px-0 py-20 md:py-24" id="form-section">
			<div className="max-w-5xl mx-auto px-7">
				<div className="text-center mb-16">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-14">
						<div>
							<h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">
								A Legacy That Lives On
							</h2>
							<div className="flex items-center justify-center gap-3 mb-8">
								<span className="w-12 h-0.5 bg-blue-400 opacity-55"></span>
								{/* <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 7.5 3c0 5.3-7.5 10-7.5 10Z"/>
                  </svg> */}
								<HeartIcon className="w-4 h-4 text-blue-500" />
								<span className="w-12 h-0.5 bg-blue-400 opacity-55"></span>
							</div>
							<p className="text-base text-gray-700 mb-4">
								Your legacy is more than what you leave behind. It's the lives
								you touch, the hope you inspire, and the future you help create.
							</p>
							<p className="text-base text-gray-700 mb-4">
								The people we serve today, and the volunteers who serve
								alongside us, are the living proof of what a legacy of hope can
								build.
							</p>
							<p className="text-xl font-semibold text-blue-900">
								Your story can be the reason someone else finds hope.
							</p>
						</div>
						<div className="rounded-2xl overflow-hidden shadow-lg">
							<div className="relative w-full h-96 bg-gradient-to-br from-gray-300 to-green-100">
								<Image
									src="/v2/plannedgiving/plannedgiving_storymedia.webp"
									alt="storymedia-image"
									fill
									sizes="(max-width: 1000px) 100vw, (max-width: 1920px) 50vw, 600px"
									loading="eager"
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Form Card */}
					<div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
						<div className="flex items-center gap-3 mb-4">
							{/* <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c-.5 2.8-2.2 4.6-5 5.4 2.1.4 3.7 1.6 4.6 3.6.9-2 2.5-3.2 4.6-3.6-2.8-.8-4.5-2.6-4.6-5.4Z"/>
                </svg> */}
							<SparklesIcon className="w-6 h-6 text-blue-500" />
							<h3 className="text-2xl font-bold text-blue-900">
								Let's Start a Conversation
							</h3>
						</div>
						<p className="text-gray-600 text-base mb-6">
							You don't need to have everything figured out today. We're here to
							listen, answer your questions, and help you explore the
							possibilities.
						</p>

						<form onSubmit={handleSubmit}>
							<div className="grid grid-cols-2 gap-3 mb-3">
								<input
									type="text"
									placeholder="First name"
									aria-label="First name"
									value={formData.fname}
									onChange={(e) => handleInputChange("fname", e.target.value)}
									required
									className="w-full px-4 py-3 border border-gray-300 rounded-xl font-base text-gray-800 bg-blue-50 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
								/>
								<input
									type="text"
									placeholder="Last name"
									aria-label="Last name"
									value={formData.lname}
									onChange={(e) => handleInputChange("lname", e.target.value)}
									required
									className="w-full px-4 py-3 border border-gray-300 rounded-xl font-base text-gray-800 bg-blue-50 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
								/>
							</div>
							<div className="grid grid-cols-2 gap-3 mb-3">
								<input
									type="email"
									placeholder="Email address"
									aria-label="Email address"
									value={formData.email}
									onChange={(e) => handleInputChange("email", e.target.value)}
									required
									className="w-full px-4 py-3 border border-gray-300 rounded-xl font-base text-gray-800 bg-blue-50 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
								/>
								<input
									type="tel"
									placeholder="Phone (optional)"
									aria-label="Phone"
									value={formData.phone}
									onChange={(e) => handleInputChange("phone", e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl font-base text-gray-800 bg-blue-50 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
								/>
							</div>
							<textarea
								placeholder="How can we help you?"
								aria-label="Message"
								value={formData.message}
								onChange={(e) => handleInputChange("message", e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl font-base text-gray-800 bg-blue-50 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors mb-4 resize-none min-h-12"
							/>
							<label className="flex items-start gap-3 text-sm text-gray-600 mb-3 cursor-pointer">
								<input
									type="checkbox"
									checked={formData.infoCheck}
									onChange={(e) =>
										handleInputChange("infoCheck", e.target.checked)
									}
									className="w-4 h-4 accent-blue-500 mt-0.5 flex-shrink-0 cursor-pointer"
								/>
								<span>I'd like information about planned giving.</span>
							</label>
							<label className="flex items-start gap-3 text-sm text-gray-600 mb-6 cursor-pointer">
								<input
									type="checkbox"
									checked={formData.contactCheck}
									onChange={(e) =>
										handleInputChange("contactCheck", e.target.checked)
									}
									className="w-4 h-4 accent-blue-500 mt-0.5 flex-shrink-0 cursor-pointer"
								/>
								<span>Please contact me to start a conversation.</span>
							</label>
							<button
								type="submit"
								disabled={status === "SUBMITTING"}
								className="w-full flex items-center justify-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-full font-bold text-base shadow-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{/* <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3c-.5 2.8-2.2 4.6-5 5.4 2.1.4 3.7 1.6 4.6 3.6.9-2 2.5-3.2 4.6-3.6-2.8-.8-4.5-2.6-4.6-5.4Z"/>
                  </svg> */}
								{status === "SUBMITTING"
									? "Sending…"
									: "Let's Talk About Your Legacy"}
							</button>
						</form>
					</div>

					{/* Quote Card */}
					<aside className="bg-gradient-to-b from-blue-900 to-blue-800 text-blue-50 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
						<span className="text-8xl leading-none text-teal-300 opacity-95 mb-2">
							&ldquo;
						</span>
						<blockquote className="text-xl font-medium leading-relaxed text-white mb-6">
							Give a man a fish and you feed him for a day. Teach him how to
							fish and you feed him for a lifetime.
						</blockquote>
						<cite className="block text-sm text-blue-200 tracking-wide font-normal">
							&mdash; Chinese proverb
						</cite>
						{/* <svg className="absolute right-0 bottom-0 w-32 h-32 text-teal-400 opacity-20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4c-9 0-15 5-15 13 0 1 .1 2 .3 3 .8-2.4 2.3-4.3 4.4-5.6C7 16 6 14 6 14s3 1 5-1c1.6-1.6 2-4 2-4s2.2.4 4-1.4C18.6 6 20 4 20 4Z"/>
              </svg> */}
						<SparklesIcon className="absolute right-0 bottom-0 w-32 h-32 text-teal-400 opacity-20" />
					</aside>
				</div>
			</div>
		</section>
	);
}
