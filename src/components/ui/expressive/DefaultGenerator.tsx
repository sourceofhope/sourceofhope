export interface Generator {
  (interval: number): number;
}

export const LINEAR: Generator = (interval) => interval;
export const EASE_IN: Generator = (interval) => Math.pow(interval, Math.E);
export const EASE_OUT: Generator = (interval) =>
  1 - Math.pow(1 - interval, Math.E);
export const EASE_IN_OUT: Generator = (interval) =>
  interval < 0.5
    ? 0.5 * Math.pow(2 * interval, Math.E)
    : 1 - 0.5 * Math.pow(2 * (1 - interval), Math.E);
