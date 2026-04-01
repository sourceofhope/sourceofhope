export const DefaultGenerator = {
  LINEAR: (interval) => interval,
  EASE_IN: (interval) => Math.pow(interval, Math.E),
  EASE_OUT: (interval) => 1 - Math.pow(1 - interval, Math.E),
  EASE_IN_OUT: (interval) =>
    interval < 0.5
      ? 0.5 * Math.pow(2 * interval, Math.E)
      : 1 - 0.5 * Math.pow(2 * (1 - interval), Math.E),
};
