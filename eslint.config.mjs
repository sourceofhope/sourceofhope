import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tsoh from "./eslint/tsoh-plugin.mjs";

/*
 * Design-system guardrails (ADR-0009), on all of src/ since slice 3.9
 * deleted the legacy code.
 */
const UI = "src/components/ui/**";
const LAYOUT = "src/components/layout/**";
const FEATURES = "src/features/**";
const ROUTES = ["src/app/**"];
const ALL_CODE = ["src/**"];
// Product code that renders user-facing text: words come from messages or
// Sanity. The styleguide is a dev tool; emails are rendered server-side text.
const PRODUCT_UI = [UI, LAYOUT, FEATURES, "src/app/\[locale\]/**", "src/app/(staff)/**"];

const ban = {
  legacy: { group: ["@/components/legacy", "@/components/legacy/*"], message: "New code never imports legacy components (ADR-0009 §1)." },
  library: {
    group: ["@ui-sdk/*", "tailwind-variants", "tailwind-variants/*", "tailwind-merge"],
    message: "Only src/components/ui may use the component library or variant tooling. Import our wrapper from @/components/ui/<name> (ADR-0009 §1).",
  },
  layout: { group: ["@/components/layout", "@/components/layout/*"], message: "ui primitives can't depend on layout (layers flow down, ADR-0009 §1)." },
  features: { group: ["@/features", "@/features/*"], message: "This layer can't depend on features (ADR-0009 §1)." },
  app: { group: ["@/app/*"], message: "Components never import from routes (ADR-0009 §1)." },
  nextLink: {
    group: ["next/link"],
    message: "Use the locale-aware Link from @/i18n/navigation (or TextLink/LinkButton), so Spanish visitors stay on Spanish pages.",
  },
};
const restrict = (...patterns) => ["error", { patterns }];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // ── Layers, one direction (ADR-0009 §1) ───────────────────────────────────
  { files: ["src/**"], rules: { "no-restricted-imports": restrict(ban.library) } },
  { files: [UI], rules: { "no-restricted-imports": restrict(ban.legacy, ban.layout, ban.features, ban.app, ban.nextLink) } },
  { files: [LAYOUT], rules: { "no-restricted-imports": restrict(ban.legacy, ban.library, ban.features, ban.app, ban.nextLink) } },
  { files: [FEATURES], rules: { "no-restricted-imports": restrict(ban.legacy, ban.library, ban.app, ban.nextLink) } },
  { files: ROUTES, rules: { "no-restricted-imports": restrict(ban.legacy, ban.library, ban.nextLink) } },
  { files: ["src/context/**", "src/lib/**"], rules: { "no-restricted-imports": restrict(ban.legacy, ban.library, ban.nextLink) } },

  // ── Tokens, buttons, links (ADR-0009 §3, §5) ──────────────────────────────
  {
    files: ALL_CODE,
    plugins: { tsoh },
    rules: {
      "tsoh/design-tokens": "error",
      "react/button-has-type": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name='a'] > JSXAttribute[name.name='href'] > Literal[value=/^\\//]",
          message: "Internal links use the Link wrapper (TextLink, LinkButton), never a raw <a href=\"/…\"> (ADR-0009 §5).",
        },
      ],
    },
  },
  // The styleguide's tokens page displays raw scale steps on purpose.
  { files: ["src/app/styleguide/sections/tokens.tsx"], rules: { "tsoh/design-tokens": ["error", { allowScales: true }] } },

  // ── No hard-coded user-facing text (ADR-0009 §6) ──────────────────────────
  {
    files: PRODUCT_UI.map((g) => g.replace(/\*\*$/, "**/*.tsx")),
    ignores: ["**/*.test.tsx"],
    rules: {
      "react/jsx-no-literals": [
        "error",
        {
          noStrings: true,
          ignoreProps: true,
          allowedStrings: ["·", "→", "↗", "×", "|", "/", ":", "(", ")", ",", "–", "—", "-", "*", "&nbsp;"],
        },
      ],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build output (e.g. the local Sanity Studio build) and test reports.
    "**/dist/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
