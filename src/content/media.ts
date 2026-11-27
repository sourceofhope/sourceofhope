/**
 * Press videos and audio for News & Media (spec §10.7), moved from today's
 * Press and Podcast pages. Titles are the real ones; videos load only when
 * played (YouTubeEmbed), and audio links out.
 */
export const PRESS_VIDEOS = [
  { id: "6iUccVeIxWw", title: "NBC5 - The Source of Hope" },
  { id: "lypvdQjpe1w", title: "Interview (Part 1)" },
  { id: "n6WTGDCinVY", title: "Interview (Part 2)" },
  { id: "13Pf9LVQQ1U", title: "Anniversary Celebration" },
  { id: "oRHcHLkQkDM", title: "Fielder Interview" },
] as const;

export const PODCAST = {
  name: "The QC Show",
  description:
    "Stories of hope, updates on our monthly and quarterly work, and conversations about wellness, service and community care across Dallas–Fort Worth.",
  spotify: "https://open.spotify.com/show/4o2EoOQx3dyY6BAFrorBql",
} as const;

/** A weekly Vietnamese-language radio program. The Vietnamese lines are marked lang="vi" on the page. */
export const RADIO = {
  name: "Radio Saigon Dallas",
  description: "Our founder hosts a weekly Vietnamese radio program on wellness, culture and practical guidance for healthier living. It is in Vietnamese, without English captions.",
  vietnamese: ["Thứ Bảy hàng tuần, lúc 10 giờ sáng", "Chương trình phát sóng bằng tiếng Việt"],
  playlist: "https://www.youtube.com/playlist?list=PLBMzNCNIF_VE0Wy2oMSEhQJINlek1FMvi",
} as const;
