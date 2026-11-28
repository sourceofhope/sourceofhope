import type { HelpNeed } from "@/lib/hub-url";
import type { ProgramKey } from "./programs";

/**
 * Built-in Get Help services (spec §9.5) until the v2 Sanity `service`
 * documents are filled in. Plain language, 6th–8th grade. Content tasks:
 * the clinic and tutoring application links (they say "Call us" until the
 * links are entered in Sanity) and the scholarship process.
 */

export type HowToStart = "call" | "apply" | "come" | "contact";

export type HelpService = {
  slug: string;
  need: Exclude<HelpNeed, "other">;
  program: ProgramKey | null;
  name: string;
  summary: string;
  whoFor: string;
  when: string | null;
  address: string | null;
  bring: string | null;
  cost: string | null;
  howToStart: HowToStart;
  applyUrl: `https://${string}` | null;
  languages: string[];
};

export const FALLBACK_SERVICES: readonly HelpService[] = [
  {
    slug: "meal-service",
    need: "food",
    program: "servingHope",
    name: "Free meals at our events",
    summary: "We serve hot meals at our Serving Hope events. Food is only given out at our events.",
    whoFor: "Anyone who needs a meal.",
    when: "Every fourth Friday and Saturday of the month. See the dates below.",
    address: null,
    bring: null,
    cost: "Free",
    howToStart: "come",
    applyUrl: null,
    languages: ["en"],
  },
  {
    slug: "wellness-clinic",
    need: "health",
    program: "wellnessHope",
    name: "Wellness of Hope clinic",
    summary: "Wellness treatments at free or low cost for people who could not pay for them otherwise.",
    whoFor: "People with low income, seniors, teachers, first responders and families.",
    when: null,
    address: null,
    bring: null,
    cost: "Free or low cost",
    howToStart: "call",
    applyUrl: null,
    languages: ["en"],
  },
  {
    slug: "tutoring",
    need: "education",
    program: "educationHope",
    name: "Education for Hope tutoring",
    summary: "Free online tutoring in reading and writing, and help getting ready for tests.",
    whoFor: "Students who want extra help with reading and writing.",
    when: null,
    address: null,
    bring: null,
    cost: "Free",
    howToStart: "call",
    applyUrl: null,
    languages: ["en"],
  },
  {
    slug: "scholarships",
    need: "education",
    program: "educationHope",
    name: "Education for Hope scholarships",
    summary: "Scholarships and support for students in training programs.",
    whoFor: "Students in vocational and training programs.",
    when: null,
    address: null,
    bring: null,
    cost: null,
    howToStart: "contact",
    applyUrl: null,
    languages: ["en"],
  },
  {
    slug: "outdoor-programs",
    need: "outdoors",
    program: "outdoorHope",
    name: "Hope for the Outdoors",
    summary: "Camping, fishing and outdoor skills for young people and families who are new to nature.",
    whoFor: "Young people and families, especially those new to the outdoors.",
    when: null,
    address: null,
    bring: null,
    cost: null,
    howToStart: "contact",
    applyUrl: null,
    languages: ["en"],
  },
];
