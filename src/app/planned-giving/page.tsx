'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { useHeaderContext } from "@/context/HeaderContext";
//added this import to replace all the svg tags in the file
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
  SparklesIcon
} from '@heroicons/react/24/solid';
import { StarIcon } from '@heroicons/react/20/solid';

export default function PlannedGivingPage() {
  const [status, setStatus] = useState('IDLE');
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    message: '',
    infoCheck: false,
    contactCheck: false,
  });

  //added this on 07/28/2026 to display the header correctly on this page
  const header = useHeaderContext();
  const setIsBlocking = header?.setIsBlocking;

  useEffect(() => {
    setIsBlocking?.(true);
    return () => setIsBlocking?.(false);   // reset on navigate away
  }, [setIsBlocking]);

  // Email validation
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate
    if (!formData.fname || !formData.lname || !formData.email || !validateEmail(formData.email)) {
      alert('Please fill in all required fields with a valid email.');
      return;
    }

    setStatus('SUBMITTING');

    try {
      // Format message exactly like the React component
      const messageLines = [
        'Planned Giving Interest Form',
        `Name: ${formData.fname} ${formData.lname}`,
        `Email: ${formData.email}`,
        formData.phone ? `Phone: ${formData.phone}` : null,
        formData.message ? `Message: ${formData.message}` : null,
	formData.infoCheck ? 'Inquiry Type: Information about planned giving' : null,
        formData.contactCheck ? 'Request: Please contact me to start a conversation' : null,
      ]
        .filter(Boolean)
        .join('\n');

      // Send to the same endpoint as the React component
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.fname} ${formData.lname}`.trim(),
          email: formData.email,
          message: messageLines,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      // Success
      alert('Thank you! We\'ve received your inquiry. A member of our team will reach out to you soon.');
      setFormData({
        fname: '',
        lname: '',
        email: '',
        phone: '',
        message: '',
        infoCheck: false,
        contactCheck: false,
      });
      setStatus('SUCCESS');
      setTimeout(() => setStatus('IDLE'), 3000);

    } catch (error) {
      console.error('Form submission error:', error);
      alert('Something went wrong. Please try again or contact us directly.');
      setStatus('ERROR');
      setTimeout(() => setStatus('IDLE'), 3000);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-white px-7 md:px-0 py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-14 items-center">
            <div>
              <p className="text-sm text-center font-bold tracking-widest text-blue-600 uppercase mb-4">Planned Giving</p>
              <h1 className="text-5xl md:text-7xl font-bold text-blue-900 leading-tight mb-6">
                <span className="whitespace-nowrap">Your Legacy.</span><br />
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
                What you leave behind can do more than change lives today. It can create hope for generations to come.
              </p>
              <p className="text-base text-gray-600 max-w-2xl mb-8">
                Through planned giving, your values and compassion can continue making a difference long after you're gone.
              </p>
              <a href="#form-section" className="inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-4 rounded-full font-bold text-base shadow-lg hover:bg-blue-800 transition-colors">
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

      {/* ============ WAYS TO LEAVE SECTION ============ */}
      <section className="bg-white px-7 md:px-0 py-20 md:py-24">
        <div className="max-w-5xl mx-auto px-7">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">Ways to Leave a Legacy</h2>
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
              <h3 className="text-xl font-bold text-blue-900 mb-3">In Your Will or Trust</h3>
              <p className="text-gray-600 text-base">A simple way to leave a lasting gift that reflects your values.</p>
            </div>

            {/* Retirement Accounts */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
              {/* <svg className="w-10 h-10 text-blue-500 mb-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                <path d="M4 11a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1a4 4 0 0 1-2 3.4V19h-2v-2h-4v2H8v-2.6A4.7 4.7 0 0 1 5 13H4a1 1 0 0 1 0-2Z" />
                <path d="M13 6V4h-2M16.5 10.5h.01" />
              </svg> */}
              <BriefcaseIcon className="w-10 h-10 text-blue-500 mb-5" />
              <h3 className="text-xl font-bold text-blue-900 mb-3">Retirement Accounts</h3>
              <p className="text-gray-600 text-base">Name The Source of Hope as a beneficiary of your IRA, 401(k), or other plan.</p>
            </div>

            {/* Life Insurance */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
              {/* <svg className="w-10 h-10 text-blue-500 mb-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                <path d="M12 21c-5-2.5-7-6-7-10V6l7-3 7 3v5c0 4-2 7.5-7 10Z" />
                <path d="M12 14s-3-1.8-3-3.6a1.6 1.6 0 0 1 3-.6 1.6 1.6 0 0 1 3 .6C15 12.2 12 14 12 14Z" />
              </svg> */}
              <ShieldCheckIcon className="w-10 h-10 text-blue-500 mb-5" />
              <h3 className="text-xl font-bold text-blue-900 mb-3">Life Insurance</h3>
              <p className="text-gray-600 text-base">Name The Source of Hope as a beneficiary of an existing or new life insurance policy to make a meaningful future gift.</p>
            </div>

            {/* Stocks & Investments */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
              {/* <svg className="w-10 h-10 text-blue-500 mb-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                <path d="M4 20h16M7 20v-6M12 20v-9M17 20v-4" />
                <path d="m6 9 4-3 3 2 5-5M18 3h2v2" />
              </svg> */}
              <ChartBarIcon className="w-10 h-10 text-blue-500 mb-5" />
              <h3 className="text-xl font-bold text-blue-900 mb-3">Stocks &amp; Investments</h3>
              <p className="text-gray-600 text-base">Donate appreciated securities and help our mission while receiving tax benefits.</p>
            </div>

            {/* Real Estate & Land */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
              {/* <svg className="w-10 h-10 text-blue-500 mb-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                <path d="m4 11 8-6 8 6M6 10v10h12V10" />
                <path d="M10 20v-5h4v5" />
                <path d="M18 8V5h2v4.5" />
              </svg> */}
              <HomeIcon className="w-10 h-10 text-blue-500 mb-5" />
              <h3 className="text-xl font-bold text-blue-900 mb-3">Real Estate &amp; Land</h3>
              <p className="text-gray-600 text-base">Leave a home, land, or property to support hope for generations to come.</p>
            </div>

            {/* Business Interests */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
              {/* <svg className="w-10 h-10 text-blue-500 mb-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                <path d="M4 21V6h9v15M13 21V10h7v11" />
                <path d="M7 9h2M7 12h2M7 15h2M16 13h1M16 16h1" />
              </svg> */}
              <BuildingOfficeIcon className="w-10 h-10 text-blue-500 mb-5" />
              <h3 className="text-xl font-bold text-blue-900 mb-3">Business Interests</h3>
              <p className="text-gray-600 text-base">Business owners may leave a portion of their business to support our mission.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ IMPACT SECTION ============ */}
      <section className="bg-blue-900 text-blue-100 px-7 md:px-0 py-20 md:py-24">
        <div className="max-w-5xl mx-auto px-7">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">The Impact of Your Legacy</h2>
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
              <h3 className="text-lg font-bold text-white mb-2">Stronger Families</h3>
              <p className="text-sm text-blue-200">Providing stability, resources, and hope when families need it most.</p>
            </div>

            {/* Brighter Futures */}
            <div className="text-center p-6 py-8 relative lg:border-r border-blue-700 last:border-r-0">
                {/* <svg className="w-12 h-12 text-teal-400 mx-auto mb-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="m3 9 9-4 9 4-9 4-9-4Z" />
                  <path d="M7 11v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4M21 9v4" />
                </svg> */}
                <AcademicCapIcon className="w-12 h-12 text-teal-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Brighter Futures</h3>
              <p className="text-sm text-blue-200">Opening doors to education and opportunity so students can reach their potential.</p>
            </div>

            {/* Compassionate Care */}
            <div className="text-center p-6 py-8 relative lg:border-r border-blue-700 last:border-r-0">
              {/* <svg className="w-12 h-12 text-teal-400 mx-auto mb-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <path d="M12 20s-6-4-6-8a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 4-6 8-6 8Z" />
                <path d="M4 15a3 3 0 0 1 0-6M20 15a3 3 0 0 0 0-6" />
              </svg> */}
              <HeartIcon className="w-12 h-12 text-teal-400 mx-auto mb-4" />

              <h3 className="text-lg font-bold text-white mb-2">Compassionate Care</h3>
              <p className="text-sm text-blue-200">Supporting seniors with dignity, respect, and the care they deserve.</p>
            </div>

            {/* Supporting Veterans */}
            <div className="text-center p-6 py-8 relative lg:border-r border-blue-700 last:border-r-0">
              {/* <svg className="w-12 h-12 text-teal-400 mx-auto mb-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <circle cx="12" cy="8" r="3.2" />
                <path d="M9.2 5.5 12 3l2.8 2.5M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" />
              </svg> */}
              <UserIcon className="w-12 h-12 text-teal-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Supporting Veterans</h3>
              <p className="text-sm text-blue-200">Honoring those who served by walking alongside them in their next chapter.</p>
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
              <h3 className="text-lg font-bold text-white mb-2">Thriving Communities</h3>
              <p className="text-sm text-blue-200">Building stronger, more hopeful communities together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LEGACY JOURNEY ============ */}
      <section className="bg-gray-100 px-7 md:px-0 py-20 md:py-24">
        <div className="max-w-5xl mx-auto px-7">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">Your Legacy Journey</h2>
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
              <div className="w-14 h-14 rounded-full bg-blue-900 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-5 shadow-md">1</div>
              <h3 className="text-lg font-bold text-blue-900 mb-3">Explore Your Legacy</h3>
              <p className="text-sm text-gray-600 max-w-xs mx-auto">Think about the impact you'd like to leave for future generations.</p>
              {/* Connector line */}
              {/* <div className="hidden lg:block absolute top-7 left-full w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300"></div> */}
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-14 h-14 rounded-full bg-blue-900 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-5 shadow-md">2</div>
              <h3 className="text-lg font-bold text-blue-900 mb-3">Have a Conversation</h3>
              <p className="text-sm text-gray-600 max-w-xs mx-auto">Reach out to us confidentially. We'll answer your questions and explain your options.</p>
              {/* Connector line */}
              {/* <div className="hidden lg:block absolute top-7 left-full w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300"></div> */}
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="w-14 h-14 rounded-full bg-blue-900 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-5 shadow-md">3</div>
              <h3 className="text-lg font-bold text-blue-900 mb-3">Meet With Your Attorney</h3>
              <p className="text-sm text-gray-600 max-w-xs mx-auto">Your attorney can help you include us in your will, trust, or estate plans.</p>
              {/* Connector line */}
              {/* <div className="hidden lg:block absolute top-7 left-full w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-300"></div> */}
            </div>

            {/* Step 4 */}
            <div className="text-center relative">
              <div className="w-14 h-14 rounded-full bg-blue-900 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-5 shadow-md">4</div>
              <h3 className="text-lg font-bold text-blue-900 mb-3">Leave a Legacy of Hope</h3>
              <p className="text-sm text-gray-600 max-w-xs mx-auto">Your gift will one day help families, veterans, seniors, and students.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FORM SECTION ============ */}
      <section className="bg-white px-7 md:px-0 py-20 md:py-24" id="form-section">
        <div className="max-w-5xl mx-auto px-7">
          <div className="text-center mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-14">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">A Legacy That Lives On</h2>
                <div className="flex items-center justify-center gap-3 mb-8">
                  <span className="w-12 h-0.5 bg-blue-400 opacity-55"></span>
                  {/* <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 7.5 3c0 5.3-7.5 10-7.5 10Z"/>
                  </svg> */}
                  <HeartIcon className="w-4 h-4 text-blue-500" />
                  <span className="w-12 h-0.5 bg-blue-400 opacity-55"></span>
                </div>
                <p className="text-base text-gray-700 mb-4">Your legacy is more than what you leave behind. It's the lives you touch, the hope you inspire, and the future you help create.</p>
                <p className="text-base text-gray-700 mb-4">The people we serve today, and the volunteers who serve alongside us, are the living proof of what a legacy of hope can build.</p>
                <p className="text-xl font-semibold text-blue-900">Your story can be the reason someone else finds hope.</p>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <div className="relative w-full h-96 bg-gradient-to-br from-gray-300 to-green-100">
                  <Image src="/v2/plannedgiving/plannedgiving_storymedia.webp" alt="storymedia-image" fill sizes="(max-width: 1000px) 100vw, (max-width: 1920px) 50vw, 600px" loading="eager" className="object-cover"/>
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
                <h3 className="text-2xl font-bold text-blue-900">Let's Start a Conversation</h3>
              </div>
              <p className="text-gray-600 text-base mb-6">You don't need to have everything figured out today. We're here to listen, answer your questions, and help you explore the possibilities.</p>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input 
                    type="text" 
                    placeholder="First name" 
                    aria-label="First name"
                    value={formData.fname}
                    onChange={(e) => handleInputChange('fname', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl font-base text-gray-800 bg-blue-50 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
                  />
                  <input 
                    type="text" 
                    placeholder="Last name" 
                    aria-label="Last name"
                    value={formData.lname}
                    onChange={(e) => handleInputChange('lname', e.target.value)}
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
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl font-base text-gray-800 bg-blue-50 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone (optional)" 
                    aria-label="Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl font-base text-gray-800 bg-blue-50 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
                  />
                </div>
                <textarea 
                  placeholder="How can we help you?" 
                  aria-label="Message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl font-base text-gray-800 bg-blue-50 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors mb-4 resize-none min-h-12"
                />
                <label className="flex items-start gap-3 text-sm text-gray-600 mb-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.infoCheck}
                    onChange={(e) => handleInputChange('infoCheck', e.target.checked)}
                    className="w-4 h-4 accent-blue-500 mt-0.5 flex-shrink-0 cursor-pointer"
                  />
                  <span>I'd like information about planned giving.</span>
                </label>
                <label className="flex items-start gap-3 text-sm text-gray-600 mb-6 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.contactCheck}
                    onChange={(e) => handleInputChange('contactCheck', e.target.checked)}
                    className="w-4 h-4 accent-blue-500 mt-0.5 flex-shrink-0 cursor-pointer"
                  />
                  <span>Please contact me to start a conversation.</span>
                </label>
                <button 
                  type="submit" 
                  disabled={status === 'SUBMITTING'}
                  className="w-full flex items-center justify-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-full font-bold text-base shadow-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {/* <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3c-.5 2.8-2.2 4.6-5 5.4 2.1.4 3.7 1.6 4.6 3.6.9-2 2.5-3.2 4.6-3.6-2.8-.8-4.5-2.6-4.6-5.4Z"/>
                  </svg> */}
                  {status === 'SUBMITTING' ? "Sending…" : "Let's Talk About Your Legacy"}
                </button>
              </form>
            </div>

            {/* Quote Card */}
            <aside className="bg-gradient-to-b from-blue-900 to-blue-800 text-blue-50 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
              <span className="text-8xl leading-none text-teal-300 opacity-95 mb-2">&ldquo;</span>
              <blockquote className="text-xl font-medium leading-relaxed text-white mb-6">Give a man a fish and you feed him for a day. Teach him how to fish and you feed him for a lifetime.</blockquote>
              <cite className="block text-sm text-blue-200 tracking-wide font-normal">&mdash; Traditional proverb</cite>
              {/* <svg className="absolute right-0 bottom-0 w-32 h-32 text-teal-400 opacity-20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4c-9 0-15 5-15 13 0 1 .1 2 .3 3 .8-2.4 2.3-4.3 4.4-5.6C7 16 6 14 6 14s3 1 5-1c1.6-1.6 2-4 2-4s2.2.4 4-1.4C18.6 6 20 4 20 4Z"/>
              </svg> */}
              <SparklesIcon className="absolute right-0 bottom-0 w-32 h-32 text-teal-400 opacity-20" />
            </aside>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-t border-gray-300 bg-blue-50 px-7 md:px-0 py-12 md:py-14">
          <div className="max-w-5xl mx-auto px-7">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center p-6">
                {/* <svg className="w-8 h-8 text-blue-600 mb-3 stroke-current flex-shrink-0" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="M12 20s-7-4.4-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.6 12 20 12 20Z"/>
                </svg> */}
                <HeartIcon className="w-8 h-8 text-blue-600 mb-3" />
                <p className="text-sm text-gray-900 font-medium leading-relaxed">Planned giving isn't only for wealthy individuals. Any gift, of any size, can create lasting hope.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                {/* <svg className="w-8 h-8 text-blue-600 mb-3 stroke-current flex-shrink-0" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="M12 21c-5-2.5-7-6-7-10V6l7-3 7 3v5c0 4-2 7.5-7 10Z"/>
                </svg> */}
                <ShieldCheckIcon className="w-8 h-8 text-blue-600 mb-3" />
                <p className="text-sm text-gray-900 font-medium leading-relaxed">You can support your family and still leave a legacy that makes a difference.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                {/* <svg className="w-8 h-8 text-blue-600 mb-3 stroke-current flex-shrink-0" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <circle cx="8" cy="9" r="2"/>
                  <circle cx="16" cy="9" r="2"/>
                  <path d="M4 19c0-2.5 1.8-4 4-4s4 1.5 4 4M12 19c0-2.5 1.8-4 4-4s4 1.5 4 4"/>
                </svg> */}
                <UserIcon className="w-8 h-8 text-blue-600 mb-3" />
                
                <p className="text-sm text-gray-900 font-medium leading-relaxed">Many supporters continue giving during their lifetime while also including a future gift.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                {/* <svg className="w-8 h-8 text-blue-600 mb-3 stroke-current flex-shrink-0" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="M4 5h16v11H9l-4 3v-3H4V5Z"/>
                  <path d="M8 9h8M8 12h5"/>
                </svg> */}
                <ChatBubbleLeftIcon className="w-8 h-8 text-blue-600 mb-3" />
                <p className="text-sm text-gray-900 font-medium leading-relaxed">Already included The Source of Hope in your plans? We'd love to hear from you.</p>
              </div>
            </div>
          </div>
      </section>
    </>
  );
}
