/**
 * Privacy Policy and Terms drafts (slice 3.8), written from what the system
 * actually collects and keeps (02 §8.2–8.3, spec §16). DRAFTS: TSOH reviews
 * them; the pages say "pending review" until `LEGAL_APPROVED` is true.
 */
export const LEGAL_APPROVED = false;
export const LEGAL_UPDATED = "2026-11-27";

export type LegalSection = { id: string; title: string; paragraphs?: string[]; list?: string[] };

export const PRIVACY: readonly LegalSection[] = [
  {
    id: "who",
    title: "Who we are",
    paragraphs: [
      "The Source of Hope (TSOH) is a 501(c)(3) nonprofit in Plano, Texas (EIN 46-2491772). This policy explains what we collect through thesourceofhope.org, why, who can see it, and how long we keep it.",
    ],
  },
  {
    id: "collect",
    title: "What we collect, and when",
    list: [
      "Get Help: nothing. Looking up services and events asks for no personal details.",
      "Contact form: your name, email, optional phone number and message. We email it to our staff so we can reply; the website doesn't store it.",
      "Newsletter: your email address, which goes to our email provider, Constant Contact.",
      "Volunteering: the name, email and phone of each person you sign up, the shifts chosen, and for anyone under 18 their birth year and a parent or guardian's contact. Volunteer agreements are signed through DocuSign.",
      "Giving: your name, email, the amount, the program you chose and any tribute name. Card, bank and PayPal details go straight to Stripe or PayPal; we never see or store them.",
      "Store orders: your contact and shipping details and what you ordered.",
      "Staff accounts: our staff's names, work emails and sign-in records.",
    ],
  },
  {
    id: "use",
    title: "How we use it",
    paragraphs: [
      "We use your details only to do what you asked: reply to you, run the event you signed up for, process your gift or order and send its receipt, or send the newsletter you joined. We record which campaign link brought you to us (UTM codes) to learn what outreach works. We never sell or rent personal information.",
    ],
  },
  {
    id: "access",
    title: "Who can see it",
    paragraphs: [
      "Inside TSOH, each staff member sees only what their role needs. For example, volunteer phone numbers are visible only to staff who coordinate volunteers. Every view of sensitive records, every export and every change to access is logged.",
      "Service providers handle data for us under their own privacy terms: Vercel (website hosting and analytics), Supabase (our database), Resend (email delivery), Stripe and PayPal (payments), DocuSign (volunteer agreements), Eventbrite (event listings), Constant Contact (newsletter), Sanity (website content) and Google Tag Manager and Google Analytics (site analytics).",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and analytics",
    paragraphs: [
      "We use a short-lived cookie when you open a link we emailed you, so we can show your sign-up without asking you to log in, and cookies that keep staff signed in. We measure visits with Vercel Analytics and Google Analytics. We don't use advertising or retargeting pixels.",
    ],
  },
  {
    id: "retention",
    title: "How long we keep it",
    list: [
      "Volunteer sign-ups and contact details: 3 years after your last activity.",
      "Planned-giving and sponsorship inquiries: 2 years after we close them.",
      "Volunteer agreement records: 7 years; for minors, until 7 years after they turn 18.",
      "Gift and order records: 7 years, as financial records.",
      "Emailed sign-in and sign-up links: deleted 30 days after they expire.",
    ],
    paragraphs: ["When a record reaches its limit we remove the personal details and keep only anonymous totals."],
  },
  {
    id: "children",
    title: "Children",
    paragraphs: [
      "Volunteers under 18 take part only with a parent or guardian, who signs their agreement. We collect a minor's birth year, not their full birth date, and use it only to apply age rules for events.",
    ],
  },
  {
    id: "choices",
    title: "Your choices",
    paragraphs: [
      "You can unsubscribe from the newsletter with the link in any issue. You can cancel a monthly gift any time from the link in your receipt. To see, correct or delete what we hold about you, email info@thesourceofhope.org or call (469) 969-0244.",
    ],
  },
  {
    id: "changes",
    title: "Changes",
    paragraphs: ["If this policy changes, we'll update the date at the top of this page."],
  },
];

export const TERMS: readonly LegalSection[] = [
  {
    id: "use",
    title: "Using this site",
    paragraphs: [
      "These terms apply to thesourceofhope.org, run by The Source of Hope (TSOH), a 501(c)(3) nonprofit in Plano, Texas. By using the site you agree to them. Please don't misuse the site, try to break its security, or submit information that isn't yours to share.",
    ],
  },
  {
    id: "giving",
    title: "Gifts",
    paragraphs: [
      "Gifts to TSOH are tax-deductible to the extent the law allows; we email a receipt for each one. Monthly gifts continue until you cancel, which you can do any time from the link in your receipt. If you made a gift by mistake, contact us and we'll review it.",
    ],
  },
  {
    id: "store",
    title: "Store purchases",
    paragraphs: [
      "Store prices are in US dollars and include the shipping and tax shown at checkout. If there's a problem with your order, contact us and we'll work it out with you. Purchases are not tax-deductible gifts.",
    ],
  },
  {
    id: "volunteering",
    title: "Volunteering",
    paragraphs: ["Volunteering at our events is covered by the volunteer agreement you sign when you sign up, which applies alongside these terms."],
  },
  {
    id: "content",
    title: "Our content",
    paragraphs: [
      "The words, photos and logos on this site belong to TSOH or are used with permission. You may share links and quote short passages with credit; please ask before reusing photos.",
    ],
  },
  {
    id: "links",
    title: "Other sites",
    paragraphs: ["We link to partner sites, Eventbrite, YouTube, Spotify and others. We're not responsible for their content or their privacy practices."],
  },
  {
    id: "liability",
    title: "No guarantees",
    paragraphs: [
      "We work to keep the site accurate and available, but we provide it as is. Event details can change; we'll email people who signed up. To the extent the law allows, TSOH isn't liable for losses from using the site.",
    ],
  },
  {
    id: "law",
    title: "Governing law and changes",
    paragraphs: ["These terms are governed by the laws of Texas. If they change, we'll update the date at the top of this page."],
  },
];
