import "server-only";
import { ENV_SCHEMA, withoutEmpty, type Env } from "./env";

/**
 * Server-side configuration, validated once (02 §10). Import `env` and read
 * fields; never read `process.env` directly in new code.
 */
let cached: Env | undefined;

export function env(): Env {
  cached ??= ENV_SCHEMA.parse(withoutEmpty(process.env));
  return cached;
}

/** Read a variable that a feature can't work without, with a clear error if it's missing. */
export function requireEnv<K extends keyof Env>(key: K): NonNullable<Env[K]> {
  const value = env()[key];
  if (value === undefined || value === null || value === "") throw new Error(`Missing environment variable ${String(key)}`);
  return value as NonNullable<Env[K]>;
}
