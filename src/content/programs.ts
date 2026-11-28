/**
 * Built-in program content: today's program-page copy, edited to the
 * glossary (spec §13.3) and plain language. Used until the v2 Sanity
 * dataset has program documents (slice 2.6 seeds their shells; editors
 * fill them). English only; Sanity carries translations.
 */

export const PROGRAM_KEYS = ["servingHope", "educationHope", "wellnessHope", "outdoorHope", "internationalHope"] as const;
export type ProgramKey = (typeof PROGRAM_KEYS)[number];
export type NeedKey = "food" | "health" | "education" | "outdoors";

export type ProgramContent = {
  key: ProgramKey;
  name: string;
  summary: string;
  about: string[];
  audience: string | null;
  schedule: string | null;
  image: { src: string; alt: string; width: number; height: number };
  gallery: { src: string; alt: string; width: number; height: number }[];
  participantNeed: NeedKey | null;
};

const photo = (src: string, alt: string) => ({ src, alt, width: 1200, height: 800 });

export const FALLBACK_PROGRAMS: readonly ProgramContent[] = [
  {
    key: "servingHope",
    name: "Serving and Sharing Hope",
    summary: "Hot meals, groceries and support for neighbors in need across Dallas–Fort Worth.",
    about: [
      "Serving Hope and Sharing Hope bring volunteers together to fight hunger across the Dallas–Fort Worth area.",
      "At Serving Hope events, volunteers prepare and serve fresh meals to people experiencing homelessness, veterans, nursing home residents and families who need support. Events also offer clothing, haircuts and hygiene services.",
      "Through Sharing Hope, we pass donated food on to partner organizations. Today we work with more than fifty nonprofits.",
    ],
    audience: "Anyone who needs a meal. Food is given out at our events, and no sign-up is needed.",
    schedule: "Every fourth Friday and Saturday of the month.",
    image: photo("/v2/servingHope/Carousel-5.webp", "Volunteers serving hot meals"),
    gallery: [1, 2, 3, 4].map((n) => photo(`/v2/servingHope/Carousel-${n}.webp`, `Serving Hope event photo ${n}`)),
    participantNeed: "food",
  },
  {
    key: "educationHope",
    name: "Education for Hope",
    summary: "Free tutoring and mentorship that help students grow in reading, writing and test preparation.",
    about: [
      "Education for Hope offers free virtual tutoring and mentorship through the TSOH ILA Tutoring Program, with help in reading, writing, literacy and standardized test preparation.",
      "We also support cosmetology students and offer more than 15 work-study, internship and volunteer roles for students and professionals, including federal work-study positions with the University of Texas at Dallas.",
    ],
    audience: "Students who want extra help with reading and writing, and students looking for work experience.",
    schedule: null,
    image: photo("/v2/educationHope/Carousel-1.webp", "A student working with a tutor"),
    gallery: [2, 3, 4, 5].map((n) => photo(`/v2/educationHope/Carousel-${n}.webp`, `Education for Hope photo ${n}`)),
    participantNeed: "education",
  },
  {
    key: "wellnessHope",
    name: "Wellness of Hope",
    summary: "Holistic wellness treatments at free or reduced cost for people who couldn't otherwise afford them.",
    about: [
      "Wellness of Hope offers holistic treatments, such as fire cupping and lymphatic drainage, at free or reduced cost.",
      "It serves low-income individuals, seniors, teachers, first responders and families. We also offer free makeovers to people living with HIV/AIDS, to help restore confidence.",
    ],
    audience: "Low-income individuals, seniors, teachers, first responders and families.",
    schedule: null,
    image: photo("/v2/wellnessHope/Wellness-1.webp", "A wellness treatment room"),
    gallery: [2, 3].map((n) => photo(`/v2/wellnessHope/Wellness-${n}.webp`, `Wellness of Hope photo ${n}`)),
    participantNeed: "health",
  },
  {
    key: "outdoorHope",
    name: "Hope for the Outdoors",
    summary: "Camping, fishing and outdoor skills for youth and families who may never have explored nature.",
    about: [
      "Hope for the Outdoors gives people, especially from urban backgrounds, a safe and welcoming way to experience nature.",
      "Led by Wesley Stone, a retired wildlife biologist, the program teaches camping, fishing, hunting, survival skills and care for the environment.",
    ],
    audience: "Youth and families, especially those new to the outdoors.",
    schedule: null,
    image: photo("/v2/outdoorHope/OH-Carousel-1.webp", "Families at an outdoor program"),
    gallery: [2, 3, 4, 5].map((n) => photo(`/v2/outdoorHope/OH-Carousel-${n}.webp`, `Hope for the Outdoors photo ${n}`)),
    participantNeed: "outdoors",
  },
  {
    key: "internationalHope",
    name: "Hope Beyond Borders",
    summary: "Partnerships abroad that bring education, wellness and relief to communities in need.",
    about: [
      "Hope Beyond Borders carries our mission beyond the United States.",
      "With partners abroad, we support vocational students with scholarships and tools, offer beauty and wellness services, and help with community outreach such as food distribution.",
    ],
    audience: null,
    schedule: null,
    image: photo("/v2/internationalHope/nicaragua/Carousel-1.webp", "A community event abroad"),
    gallery: [2, 3, 4, 5].map((n) => photo(`/v2/internationalHope/nicaragua/Carousel-${n}.webp`, `Hope Beyond Borders photo ${n}`)),
    participantNeed: null,
  },
];
