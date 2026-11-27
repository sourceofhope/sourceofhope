/**
 * Built-in questions and answers until v2 Sanity `faq` documents exist.
 * The volunteer set is today's "Serving Guidelines", moved from the
 * Programs index to Serving Hope (spec §10.2) and updated for the Hub
 * sign-up and online volunteer agreement (no PDFs, spec §13.4).
 */
import type { ProgramKey } from "./programs";

export type Faq = { id: string; question: string; answer: string[] };

export const VOLUNTEER_FAQS: readonly Faq[] = [
  {
    id: "who",
    question: "Who can volunteer?",
    answer: [
      "Everyone is welcome, from kids and students to adults and seniors. Volunteer as a family, earn service hours for school, or simply give back.",
      "Volunteers under 16 come with an adult who signs up for the same shift. A parent or guardian signs the volunteer agreement for anyone under 18. Some local schools count these hours toward service requirements.",
    ],
  },
  {
    id: "expect",
    question: "What should I expect?",
    answer: [
      "Arrive on time, join in with the tasks our team gives you, and ask a team member whenever you're unsure. Every volunteer signs our volunteer agreement before their first event; it covers a full year.",
    ],
  },
  {
    id: "bring",
    question: "What should I bring?",
    answer: [
      "Closed-toe shoes are required. Wear comfortable clothes you don't mind getting a little messy, and dress for the weather. Bring a reusable water bottle.",
      "We provide all tools and materials unless the event says otherwise.",
    ],
  },
  {
    id: "signup",
    question: "How do I sign up?",
    answer: [
      "Choose an upcoming event, pick a shift and tell us who's coming. You'll sign the volunteer agreement online, and we'll email your confirmation and a reminder before the day.",
    ],
  },
];

export const PROGRAM_FAQS: Partial<Record<ProgramKey, readonly Faq[]>> = {
  servingHope: VOLUNTEER_FAQS,
};
