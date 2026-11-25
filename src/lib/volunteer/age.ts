/**
 * Ages from a birth year (02 §4 stores `birth_year` for minors only).
 *
 * With only a year we can't know the birthday, so every check uses the
 * youngest age the person could be on that date (as if born on Dec 31).
 * That errs on the side of safety: someone near a threshold is treated as
 * the younger age for minimum-age and accompaniment rules.
 */
export function youngestAgeOn(birthYear: number, date: Date, timeZone = "America/Chicago"): number {
  const year = Number(new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric" }).format(date));
  // Born Dec 31 of birthYear: they've had their birthday only on Dec 31.
  const isDec31 = new Intl.DateTimeFormat("en-US", { timeZone, month: "numeric", day: "numeric" }).format(date) === "12/31";
  return year - birthYear - (isDec31 ? 0 : 1);
}

/**
 * The earliest moment someone born in `birthYear` could turn 18: Jan 1 of
 * birthYear + 18, midnight Central. A minor's agreement ends then at the
 * latest (02 §5.4).
 */
export function earliestEighteenthBirthday(birthYear: number): Date {
  // Midnight Jan 1 in Central time is 06:00 UTC (CST, no DST in January).
  return new Date(Date.UTC(birthYear + 18, 0, 1, 6, 0, 0));
}
