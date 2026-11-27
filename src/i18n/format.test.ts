import { describe, expect, it } from "vitest";
import { formatDate, formatEventDate, formatMoney, formatNumber, formatTime, formatTimeRange } from "./format";

// Tests run in UTC (vitest.config.mts), so a missing time zone would fail.
const christmasNineAm = new Date("2026-12-25T15:00:00Z"); // 9:00 a.m. CST

describe("format (Central time, locale-aware)", () => {
  it("formats dates in Central time for each locale", () => {
    expect(formatDate(christmasNineAm, "en-US")).toBe("Friday, December 25, 2026");
    expect(formatDate(christmasNineAm, "es-US")).toBe("viernes, 25 de diciembre de 2026");
    expect(formatDate(new Date("2026-10-26T03:00:00Z"), "en-US")).toBe("Sunday, October 25, 2026");
  });

  it("formats times with US conventions in Spanish (es-US, not es)", () => {
    expect(formatTime(christmasNineAm, "en-US")).toBe("9:00 AM");
    expect(formatTime(christmasNineAm, "es-US")).toBe("9:00 a.m.");
  });

  it("formats money as US dollars in both languages", () => {
    expect(formatMoney(100, "en-US")).toBe("$100");
    expect(formatMoney(1234.5, "en-US")).toBe("$1,234.50");
    expect(formatMoney(1234.5, "es-US")).toBe("$1,234.50");
    expect(formatMoney(25, "en-US", { cents: true })).toBe("$25.00");
  });

  it("formats the pseudo-locale like US English", () => {
    expect(formatNumber(353000, "en-XA")).toBe("353,000");
  });
});

describe("event date and time (spec §13.2)", () => {
  const now = new Date("2026-12-01T12:00:00Z");
  it("formats short dates, adding the year only when it isn't this year", () => {
    expect(formatEventDate(new Date("2026-12-25T15:00:00Z"), "en-US", now)).toBe("Fri, Dec 25");
    expect(formatEventDate(new Date("2027-01-08T15:00:00Z"), "en-US", now)).toBe("Fri, Jan 8, 2027");
  });
  it("formats Central time ranges with a.m./p.m. and CT", () => {
    expect(formatTimeRange(new Date("2026-12-25T15:00:00Z"), new Date("2026-12-25T17:30:00Z"), "en-US")).toBe("9:00–11:30 a.m. CT");
    expect(formatTimeRange(new Date("2026-12-25T17:00:00Z"), new Date("2026-12-25T20:00:00Z"), "en-US")).toBe("11:00 a.m.–2:00 p.m. CT");
  });
});
