/**
 * WCAG 2.x contrast helpers. Used by the token contrast test and the
 * styleguide's tokens page; never needed at runtime by components.
 */

/** Parse #rgb / #rrggbb to [r, g, b] in 0–255. */
export function parseHex(hex: string): [number, number, number] {
  const h = hex.trim().replace(/^#/, "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`Not a hex color: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

/** Relative luminance (WCAG 2.x). */
export function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two opaque colors, 1–21. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Read `--color-*` tokens from a CSS source and resolve `var()` references
 * to final hex values. Non-hex values (rgb() with alpha) are skipped.
 */
export function readColorTokens(css: string): Record<string, string> {
  const raw: Record<string, string> = {};
  for (const m of css.matchAll(/--color-([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    raw[m[1]] = m[2].trim();
  }
  const resolved: Record<string, string> = {};
  const resolve = (name: string, seen = new Set<string>()): string | undefined => {
    if (resolved[name]) return resolved[name];
    const value = raw[name];
    if (!value || seen.has(name)) return undefined;
    seen.add(name);
    const ref = value.match(/^var\(--color-([a-z0-9-]+)\)$/);
    const out = ref ? resolve(ref[1], seen) : /^#[0-9a-fA-F]{3,6}$/.test(value) ? value.toLowerCase() : undefined;
    if (out) resolved[name] = out;
    return out;
  };
  for (const name of Object.keys(raw)) resolve(name);
  return resolved;
}

/** Text/background pairs the design system uses, with the WCAG bar each must meet. */
export const REQUIRED_PAIRS: { fg: string; bg: string; min: number; use: string }[] = [
  { fg: "ink", bg: "surface", min: 4.5, use: "Body text" },
  { fg: "ink", bg: "surface-muted", min: 4.5, use: "Text on muted bands" },
  { fg: "ink-soft", bg: "surface", min: 4.5, use: "Secondary body text" },
  { fg: "muted", bg: "surface", min: 4.5, use: "Muted text, dates, hints" },
  { fg: "muted", bg: "surface-muted", min: 4.5, use: "Muted text on bands" },
  { fg: "on-inverse", bg: "surface-inverse", min: 4.5, use: "Footer text" },
  { fg: "on-inverse-muted", bg: "surface-inverse", min: 4.5, use: "Footer muted text" },
  { fg: "on-inverse", bg: "action", min: 4.5, use: "Primary button label" },
  { fg: "on-inverse", bg: "action-hover", min: 4.5, use: "Primary button hover" },
  { fg: "action", bg: "surface", min: 4.5, use: "Links, secondary button label" },
  { fg: "action-hover", bg: "surface", min: 4.5, use: "Link hover" },
  { fg: "input", bg: "surface", min: 3, use: "Input borders (WCAG 1.4.11)" },
  { fg: "focus", bg: "surface", min: 3, use: "Focus ring" },
  { fg: "focus-inverse", bg: "surface-inverse", min: 3, use: "Focus ring on dark" },
  { fg: "success", bg: "surface", min: 4.5, use: "Success text" },
  { fg: "warning", bg: "surface", min: 4.5, use: "Warning text" },
  { fg: "danger", bg: "surface", min: 4.5, use: "Error text" },
  { fg: "info", bg: "surface", min: 4.5, use: "Info text" },
  { fg: "success", bg: "success-subtle", min: 4.5, use: "Success alert" },
  { fg: "warning", bg: "warning-subtle", min: 4.5, use: "Warning alert" },
  { fg: "danger", bg: "danger-subtle", min: 4.5, use: "Error alert" },
  { fg: "info", bg: "info-subtle", min: 4.5, use: "Info alert" },
  { fg: "tone-public-ink", bg: "tone-public", min: 4.5, use: "Badge: open to the public" },
  { fg: "tone-volunteer-ink", bg: "tone-volunteer", min: 4.5, use: "Badge: volunteers needed" },
  { fg: "tone-neutral-ink", bg: "tone-neutral", min: 4.5, use: "Badge: neutral" },
  { fg: "tone-danger-ink", bg: "tone-danger", min: 4.5, use: "Badge: full" },
];
