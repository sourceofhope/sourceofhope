/** The styleguide exists on local, CI and preview builds; production returns 404. */
export function isStyleguideEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.VERCEL_ENV !== "production";
}
