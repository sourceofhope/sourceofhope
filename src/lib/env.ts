import { z } from "zod";

/**
 * Environment variables (02 §10): one zod schema, checked at build and at
 * boot. Kept free of `server-only` so next.config.ts can run the build
 * check; app code reads values through `src/lib/env.server.ts`.
 */

/** Any map of variable names to values (process.env, or a test fixture). */
export type EnvSource = Record<string, string | undefined>;

const url = z.url();
const nonEmpty = z.string().trim().min(1);

/**
 * Required wherever the v2 site is deployed (preview and production). Local
 * development and CI builds don't need them: they run without accounts.
 */
export const DEPLOYED_SCHEMA = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: nonEmpty,
  NEXT_PUBLIC_SANITY_DATASET: nonEmpty,
  NEXT_PUBLIC_SITE_URL: url,
  NEXT_PUBLIC_SUPABASE_URL: url,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: nonEmpty,
  SUPABASE_SERVICE_ROLE_KEY: nonEmpty,
  SUPABASE_AUTH_HOOK_SECRET: nonEmpty,
  RESEND_API_KEY: nonEmpty,
  EMAIL_FROM: nonEmpty,
  CRON_SECRET: nonEmpty,
});

/**
 * Used once their Phase 4–6 integrations land. Optional until then; each
 * moves into DEPLOYED_SCHEMA with its integration.
 */
export const LATER_SCHEMA = z.object({
  NEXT_PUBLIC_SANITY_API_VERSION: nonEmpty.optional(),
  SANITY_API_READ_TOKEN: nonEmpty.optional(),
  SANITY_API_WRITE_TOKEN: nonEmpty.optional(),
  STRIPE_SECRET_KEY: nonEmpty.optional(),
  STRIPE_WEBHOOK_SECRET: nonEmpty.optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: nonEmpty.optional(),
  PAYPAL_CLIENT_SECRET: nonEmpty.optional(),
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: nonEmpty.optional(),
  DOCUSIGN_CONNECT_HMAC_KEY: nonEmpty.optional(),
  EVENTBRITE_TOKEN: nonEmpty.optional(),
  CONSTANT_CONTACT_API_KEY: nonEmpty.optional(),
  STAFF_EMAIL_INQUIRIES: z.email().optional(),
  DATABASE_URL: nonEmpty.optional(),
  /** Local only: the Supabase CLI's Mailpit inbox, used when there is no Resend key in development. */
  MAILPIT_URL: url.optional(),
});

export const ENV_SCHEMA = DEPLOYED_SCHEMA.partial().extend(LATER_SCHEMA.shape);
export type Env = z.infer<typeof ENV_SCHEMA>;

/**
 * Is this a deployed v2 build? The new Vercel project (slice 0.1) sets
 * REQUIRE_ENV=1 in preview and production. It isn't keyed on VERCEL_ENV,
 * because the current site's project may still build this branch.
 */
export function isDeployed(env: EnvSource = process.env): boolean {
  return env.REQUIRE_ENV === "1";
}

/** Empty strings (common in .env files) count as unset. */
export function withoutEmpty(env: EnvSource): Record<string, string> {
  return Object.fromEntries(Object.entries(env).filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].trim() !== ""));
}

/**
 * Readable problems with the environment, or an empty list. Only deployed
 * builds are checked. Variable values are never included in the messages.
 */
export function envProblems(env: EnvSource = process.env): string[] {
  if (!isDeployed(env)) return [];
  const result = DEPLOYED_SCHEMA.extend(LATER_SCHEMA.shape).safeParse(withoutEmpty(env));
  return result.success ? [] : result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.code === "invalid_type" ? "missing" : issue.message}`);
}

/** Throw with every problem at once. Called from next.config.ts, so a bad deploy fails the build. */
export function assertEnv(env: EnvSource = process.env): void {
  const problems = envProblems(env);
  if (problems.length > 0) throw new Error(`Environment is not valid:\n  ${problems.join("\n  ")}`);
}
