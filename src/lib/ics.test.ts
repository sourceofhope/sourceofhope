import { describe, expect, it } from "vitest";
import { buildIcs, escapeText } from "./ics";

describe("buildIcs", () => {
  const ics = buildIcs(
    {
      uid: "serving-hope@thesourceofhope.org",
      title: "Serving Hope; meal, service",
      description: "Hot meals.\nAll welcome.",
      startsAt: "2026-12-25T15:00:00.000Z",
      endsAt: "2026-12-25T17:30:00.000Z",
      location: "1108 W Parker Rd, Plano",
      url: "https://thesourceofhope.org/events?event=serving-hope",
    },
    new Date("2026-11-27T12:00:00Z"),
  );

  it("writes one VEVENT in UTC with CRLF line endings", () => {
    expect(ics).toContain("DTSTART:20261225T150000Z\r\n");
    expect(ics).toContain("DTEND:20261225T173000Z\r\n");
    expect(ics).toContain("DTSTAMP:20261127T120000Z\r\n");
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(1);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });

  it("escapes text values", () => {
    expect(ics).toContain("SUMMARY:Serving Hope\\; meal\\, service");
    expect(escapeText("a\\b\nc")).toBe("a\\\\b\\nc");
  });

  it("folds long lines at 75 characters", () => {
    for (const line of ics.split("\r\n")) expect(line.length).toBeLessThanOrEqual(75);
  });
});
