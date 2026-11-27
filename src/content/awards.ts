/**
 * Awards & Recognition (spec §10.7): kept as today, restyled. Data moved
 * verbatim from the old page.
 */
export type Award = { year: string; title: string; description?: string; tag?: string; major?: boolean };
export type AwardPhoto = { src: string; alt: string; caption: string; title: string };

export const AWARDS: readonly Award[] = [
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
    description: "Grand Prairie Chamber of Commerce recognition.",
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

export const AWARD_PHOTOS: readonly AwardPhoto[] = [
  {
    src: "/v2/core/awards-2024-uplifted.webp",
    alt: "Recognized among Asian American community leaders",
    caption: "2024 · Uplifted Conference",
    title: "Recognized among Asian American community leaders",
  },
  {
    src: "/v2/core/awards-2021-humanitarian.webp",
    alt: "“You Can Live Again” - honored for humanitarian service",
    caption: "2021 · Humanitarian Award",
    title: "“You Can Live Again” - honored for humanitarian service",
  },
  {
    src: "/v2/core/awards-2020-presidential.webp",
    alt: "With the framed presidential certificate and medal",
    caption: "2020 · Presidential Volunteer Service Award",
    title: "With the framed presidential certificate and medal",
  },
  {
    src: "/v2/core/awards-2020-each-moment-1.webp",
    alt: "Quynh Chau Stone at the Each Moment Matters Award",
    caption: "2020 · Each Moment Matters Award",
    title: "Recognized with the Each Moment Matters Award",
  },
  {
    src: "/v2/core/awards-2019-spirit.webp",
    alt: "Spirit Award - for community spirit and volunteer leadership",
    caption: "2019 · Junior League of Collin County",
    title: "Spirit Award - for community spirit and volunteer leadership",
  },
  {
    src: "/v2/core/awards-2018-groundbreaker-1.webp",
    alt: "Accepting the Against The Grain Groundbreaker Award on stage",
    caption: "2018 · Against The Grain",
    title: "Groundbreaker Award - accepting on stage",
  },
  {
    src: "/v2/core/awards-2018-migrant-women.webp",
    alt: "Celebrating the book's release",
    caption: "2018 · 50 Inspiring Voices of Migrant Women",
    title: "Celebrating the book's release",
  },
  {
    src: "/v2/core/awards-2018-inspirique-1.webp",
    alt: "Quynh Chau Stone at the Inspirique Circle of Light Awards red carpet",
    caption: "2018 · Inspirique Circle of Light",
    title: "Honored in Beverly Hills, California",
  },
  {
    src: "/v2/core/awards-2017-beyond-boundaries-1.webp",
    alt: "Beyond Boundaries Award at GDAACC Annual Awards 2017 with Governor Greg Abbott",
    caption: "2017 · GDAACC Annual Awards",
    title: "Beyond Boundaries Award - presented alongside Governor Greg Abbott",
  },
  {
    src: "/v2/core/awards-2016-women-that-soar.webp",
    alt: "Accepting the Community Outreach Award on stage",
    caption: "2016 · Women That Soar",
    title: "Accepting the Community Outreach Award on stage",
  },
  {
    src: "/v2/core/awards-2014-community-leadership.webp",
    alt: "2014 TCAACC Annual Banquet - Community Leadership Award",
    caption: "2014 · Community Leadership Award",
    title: "Tarrant County Asian American Chamber of Commerce Annual Banquet",
  },
];
