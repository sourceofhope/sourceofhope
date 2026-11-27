/**
 * Built-in Our Story copy (today's About page, lightly edited) until the v2
 * `ourStory` document is filled in. Founders' titles are a parked content
 * task, so the page links to the team instead of naming titles.
 */
export const FALLBACK_OUR_STORY = {
  mission: "Bringing hope and healing by providing meals, education, wellness and resources that uplift and empower communities in need.",
  vision: "A world where every person has the wellness, skills and community to thrive, so cycles of hardship give way to lives of purpose.",
  story: [
    "The Source of Hope is a 501(c)(3) nonprofit that serves individuals and families across Dallas–Fort Worth. We provide nutritious meals to people experiencing hunger, support families through housing transitions, and open pathways to jobs and educational scholarships.",
    "Our work doesn't stop at short-term help. By sharing practical skills through holistic health education, outdoor survival and leadership experiences, and entrepreneurial mentorship, we help people build confidence, independence and purpose.",
  ],
  howWeWork: [
    "We meet people where they are. We don't just provide services; we walk alongside individuals and families with dignity, care and the belief that healing and renewal are possible.",
    "We are independent of government funding. Everything we do is made possible by volunteers, partners and donors who believe in this mission.",
  ],
} as const;
