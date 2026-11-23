import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Legacy files that the relaunch replaces entirely (deleted in slice 3.9 of
 * docs/plan/03_IMPLEMENTATION_PLAN.md). Their existing errors are downgraded
 * to warnings so CI can be strict for all new code. Do not add files here.
 */
const LEGACY_FILES = [
  "src/app/api/checkout/create-membership-payment-intent/route.tsx",
  "src/app/store/success/page.tsx",
  "src/components/connect/ConnectMapSection.tsx",
  "src/components/members/**",
  "src/components/store/checkout/SelfCheckoutSection.tsx",
  "src/components/ui/HookInput.tsx",
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: LEGACY_FILES,
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "warn",
      "react-hooks/set-state-in-effect": "warn",
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
