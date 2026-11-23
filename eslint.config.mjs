import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tsoh from "./eslint/tsoh-plugin.mjs";

/**
 * Legacy files that the relaunch replaces entirely (deleted in slice 3.9 of
 * docs/plan/03_IMPLEMENTATION_PLAN.md). Their existing errors are downgraded
 * to warnings so CI can be strict for all new code. Do not add files here.
 */
const LEGACY_FILES = [
  "src/app/api/checkout/create-membership-payment-intent/route.tsx",
  "src/app/store/success/page.tsx",
  "src/components/connect/ConnectMapSection.tsx",
  "src/components/donate/DonateFormSection.tsx",
  "src/components/members/**",
  "src/components/store/checkout/SelfCheckoutSection.tsx",
  "src/components/legacy/ui/HookInput.tsx",
];

/*
 * Design-system guardrails (ADR-0009). They apply to NEW code only; legacy
 * code is deleted in slice 3.9, when these globs widen to all of src/.
 */
const UI = "src/components/ui/**";
const LAYOUT = "src/components/layout/**";
const FEATURES = "src/features/**";
const NEW_ROUTES = ["src/app/\\[locale\\]/**", "src/app/(staff)/**"];
const STYLEGUIDE = "src/app/styleguide/**";
const NEW_CODE = [UI, LAYOUT, FEATURES, ...NEW_ROUTES, STYLEGUIDE];
// Product code that renders user-facing text (styleguide is a dev tool).
const PRODUCT_UI = [UI, LAYOUT, FEATURES, ...NEW_ROUTES];

const ban = {
  legacy: { group: ["@/components/legacy", "@/components/legacy/*"], message: "New code never imports legacy components (ADR-0009 §1)." },
  library: {
    group: ["@ui-sdk/*", "tailwind-variants", "tailwind-variants/*", "tailwind-merge"],
    message: "Only src/components/ui may use the component library or variant tooling. Import our wrapper from @/components/ui/<name> (ADR-0009 §1).",
  },
  layout: { group: ["@/components/layout", "@/components/layout/*"], message: "ui primitives can't depend on layout (layers flow down, ADR-0009 §1)." },
  features: { group: ["@/features", "@/features/*"], message: "This layer can't depend on features (ADR-0009 §1)." },
  app: { group: ["@/app/*"], message: "Components never import from routes (ADR-0009 §1)." },
};
const restrict = (...patterns) => ["error", { patterns }];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: LEGACY_FILES,
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
    },
  },

  // ── Layers, one direction (ADR-0009 §1) ───────────────────────────────────
  { files: ["src/**"], rules: { "no-restricted-imports": restrict(ban.library) } },
  { files: [UI], rules: { "no-restricted-imports": restrict(ban.legacy, ban.layout, ban.features, ban.app) } },
  { files: [LAYOUT], rules: { "no-restricted-imports": restrict(ban.legacy, ban.library, ban.features, ban.app) } },
  { files: [FEATURES], rules: { "no-restricted-imports": restrict(ban.legacy, ban.library, ban.app) } },
  { files: [...NEW_ROUTES, STYLEGUIDE], rules: { "no-restricted-imports": restrict(ban.legacy, ban.library) } },

  // ── Tokens, buttons, links (ADR-0009 §3, §5) ──────────────────────────────
  {
    files: NEW_CODE,
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
