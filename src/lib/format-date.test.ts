import { describe, expect, it } from "vitest";
import {
  formatLongDate,
  formatShortDate,
  formatTimeRange,
  getDateParts,
} from "@/lib/format-date";

describe("format-date (always Central time)", () => {
  it("formats a long date in Central time, not UTC", () => {
    // 03:00 UTC on Oct 26 is still Oct 25 in Dallas (CDT, UTC-5).
    expect(formatLongDate("2026-10-26T03:00:00Z")).toBe("Sunday, October 25, 2026");
  });

  it("formats a short date", () => {
    expect(formatShortDate("2026-12-25T15:00:00Z")).toBe("Fri, Dec 25, 2026");
  });

  it("returns undefined for missing or invalid input", () => {
    expect(formatLongDate()).toBeUndefined();
    expect(formatShortDate("not a date")).toBeUndefined();
    expect(formatTimeRange(undefined, "2026-12-25T17:00:00Z")).toBeUndefined();
    expect(getDateParts("")).toBeUndefined();
  });

  it("formats a same-day range across the daylight-saving change", () => {
    // Nov 1, 2026: clocks fall back at 2:00 a.m. CDT → 1:00 a.m. CST.
    expect(formatTimeRange("2026-11-01T15:00:00Z", "2026-11-01T19:30:00Z")).toBe(
      "9:00 AM – 1:30 PM",
    );
  });

  it("formats a single time when there is no end", () => {
    expect(formatTimeRange("2026-07-04T14:00:00Z")).toBe("9:00 AM");
  });

  it("includes the end date when an event spans days", () => {
    expect(formatTimeRange("2026-10-25T14:00:00Z", "2026-10-26T18:00:00Z")).toBe(
      "9:00 AM – Mon, Oct 26, 2026, 1:00 PM",
    );
  });

  it("splits calendar-badge parts", () => {
    expect(getDateParts("2026-10-25T14:00:00Z")).toEqual({
      month: "OCT",
      day: "25",
      year: "2026",
      weekday: "Sun",
    });
  });
});
