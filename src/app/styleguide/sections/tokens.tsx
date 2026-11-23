import { readFileSync } from "node:fs";
import { join } from "node:path";
import { contrast, readColorTokens, REQUIRED_PAIRS } from "@/components/ui/lib/contrast";

/*
 * Styleguide only: swatches use inline `var(--color-*)` styles because they
 * display the tokens themselves. Product code never does this (ADR-0009 §3).
 */

const SEMANTIC: { name: string; use: string }[] = [
  { name: "surface", use: "Page background" },
  { name: "surface-muted", use: "Muted bands, story card, step tiles" },
  { name: "surface-inverse", use: "Footer, dark bands" },
  { name: "ink", use: "Body text" },
  { name: "ink-soft", use: "Secondary body text" },
  { name: "muted", use: "Dates, hints, metadata" },
  { name: "on-inverse", use: "Text on dark" },
  { name: "on-inverse-muted", use: "Muted text on dark" },
  { name: "line", use: "Decorative dividers, card outlines" },
  { name: "input", use: "Input, select, checkbox edges" },
  { name: "action", use: "Primary buttons, links" },
  { name: "action-hover", use: "Hover and pressed" },
  { name: "focus", use: "Focus ring" },
  { name: "success", use: "Success" },
  { name: "warning", use: "Warning" },
  { name: "danger", use: "Errors" },
  { name: "info", use: "Info" },
];

const SCALES = ["primary", "accent", "neutral"] as const;
const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"] as const;

const TYPE: { cls: string; label: string; heading?: boolean }[] = [
  { cls: "text-5xl", label: "5xl · home hero only", heading: true },
  { cls: "text-4xl", label: "4xl · h1", heading: true },
  { cls: "text-3xl", label: "3xl · h2", heading: true },
  { cls: "text-2xl", label: "2xl · h3", heading: true },
  { cls: "text-xl", label: "xl · h4, card titles", heading: true },
  { cls: "text-lg", label: "lg · body on desktop" },
  { cls: "text-base", label: "base · body on phones" },
  { cls: "text-sm", label: "sm · captions, helper text" },
  { cls: "text-xs", label: "xs · fine print, eyebrows" },
];

function Swatch({ name, use, hex }: { name: string; use?: string; hex?: string }) {
  return (
    <li className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="size-12 shrink-0 rounded-md border border-line"
        style={{ background: `var(--color-${name})` }}
      />
      <span className="flex flex-col text-sm">
        <code className="font-semibold">{name}</code>
        <span className="text-muted">
          {hex}
          {use ? ` · ${use}` : ""}
        </span>
      </span>
    </li>
  );
}

export function TokensSection() {
  const tokens = readColorTokens(readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8"));

  return (
    <div className="flex flex-col gap-12">
      <section aria-labelledby="sg-semantic" className="flex flex-col gap-4">
        <h3 id="sg-semantic" className="font-heading text-2xl font-bold">
          Semantic colors
        </h3>
        <p className="max-w-prose text-muted">Components use these names, never raw scale steps.</p>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SEMANTIC.map((t) => (
            <Swatch key={t.name} name={t.name} use={t.use} hex={tokens[t.name]} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="sg-contrast" className="flex flex-col gap-4">
        <h3 id="sg-contrast" className="font-heading text-2xl font-bold">
          Contrast (checked in CI)
        </h3>
        <div className="overflow-x-auto rounded-md border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted">
              <tr>
                <th scope="col" className="p-3">Use</th>
                <th scope="col" className="p-3">Sample</th>
                <th scope="col" className="p-3">Ratio</th>
                <th scope="col" className="p-3">Needs</th>
              </tr>
            </thead>
            <tbody>
              {REQUIRED_PAIRS.map((p) => {
                const ratio = contrast(tokens[p.fg], tokens[p.bg]);
                return (
                  <tr key={`${p.fg}-${p.bg}`} className="border-t border-line-soft">
                    <td className="p-3">{p.use}</td>
                    <td className="p-3">
                      <span
                        className="inline-block rounded-sm px-2 py-1 font-semibold"
                        style={{ color: `var(--color-${p.fg})`, background: `var(--color-${p.bg})` }}
                      >
                        {p.fg} on {p.bg}
                      </span>
                    </td>
                    <td className="p-3 font-semibold">{ratio.toFixed(2)}:1</td>
                    <td className="p-3">{p.min}:1</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="sg-scales" className="flex flex-col gap-4">
        <h3 id="sg-scales" className="font-heading text-2xl font-bold">
          Brand scales
        </h3>
        {SCALES.map((scale) => (
          <div key={scale} className="flex flex-col gap-2">
            <h4 className="font-semibold capitalize">{scale}</h4>
            <ul className="grid grid-cols-5 gap-2 sm:grid-cols-10">
              {STEPS.map((step) => (
                <li key={step} className="flex flex-col gap-1 text-xs">
                  <span
                    aria-hidden="true"
                    className="h-10 rounded-sm border border-line-soft"
                    style={{ background: `var(--color-${scale}-${step})` }}
                  />
                  <span>{step}</span>
                  <span className="text-muted">{tokens[`${scale}-${step}`]}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section aria-labelledby="sg-type" className="flex flex-col gap-4">
        <h3 id="sg-type" className="font-heading text-2xl font-bold">
          Type
        </h3>
        <ul className="flex flex-col gap-3">
          {TYPE.map((t) => (
            <li key={t.cls} className="flex flex-col gap-1 border-b border-line-soft pb-3">
              <span className="text-xs text-muted">
                <code>{t.cls}</code> · {t.label} · {t.heading ? "Urbanist (font-heading)" : "Inter (font-sans)"}
              </span>
              <span className={`${t.cls} ${t.heading ? "font-heading font-bold" : ""}`}>
                Serving and Sharing Hope
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs font-semibold uppercase tracking-wide text-info">Eyebrow · Inter 600 · uppercase</p>
      </section>

      <section aria-labelledby="sg-shape" className="flex flex-col gap-4">
        <h3 id="sg-shape" className="font-heading text-2xl font-bold">
          Radius, elevation, motion
        </h3>
        <ul className="flex flex-wrap gap-6">
          <li className="flex flex-col items-center gap-2 text-sm">
            <span aria-hidden="true" className="h-12 w-20 rounded-sm border-2 border-primary-700" />
            <code>rounded-sm</code> 4px
          </li>
          <li className="flex flex-col items-center gap-2 text-sm">
            <span aria-hidden="true" className="h-12 w-20 rounded-md border-2 border-primary-700" />
            <code>rounded-md</code> 8px
          </li>
          <li className="flex flex-col items-center gap-2 text-sm">
            <span aria-hidden="true" className="h-12 w-20 rounded-lg border-2 border-primary-700" />
            <code>rounded-lg</code> 12px
          </li>
          <li className="flex flex-col items-center gap-2 text-sm">
            <span aria-hidden="true" className="h-12 w-20 rounded-md bg-surface shadow-raised" />
            <code>shadow-raised</code>
          </li>
          <li className="flex flex-col items-center gap-2 text-sm">
            <span aria-hidden="true" className="h-12 w-20 rounded-md bg-surface shadow-overlay" />
            <code>shadow-overlay</code>
          </li>
        </ul>
        <p className="text-sm text-muted">
          Durations: <code>--duration-fast</code> 120ms · <code>--duration-base</code> 200ms · <code>--duration-slow</code>{" "}
          300ms · easing <code>ease-standard</code>. Under reduced motion: no transforms.
        </p>
      </section>
    </div>
  );
}
