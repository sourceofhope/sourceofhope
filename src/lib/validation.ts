/**
 * Small input-validation helpers shared by the API route handlers.
 */

export const MAX_EMAIL_LENGTH = 254;
export const MAX_NAME_LENGTH = 200;

// Stripe rejects metadata values longer than 500 characters.
const MAX_METADATA_LENGTH = 500;

const EMAIL_PATTERN =
  /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]+$/;

/**
 * Parse a JSON object body, or return null if the body is not an object.
 * Requiring a JSON content type also stops cross-site HTML form posts, which
 * cannot send one without a CORS preflight.
 */
export async function readJsonObject(
  request: Request,
): Promise<Record<string, unknown> | null> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) return null;

  try {
    const body: unknown = await request.json();
    return body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/**
 * Trimmed string value, "" when the value is absent, or null when it is not
 * a string or is longer than `maxLength`.
 */
export function readString(value: unknown, maxLength: number): string | null {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length <= maxLength ? trimmed : null;
}

export function isValidEmail(value: string): boolean {
  return value.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(value);
}

/** A finite number from a number or numeric string, otherwise null. */
export function parseAmount(value: unknown): number | null {
  const amount =
    typeof value === "string" && value.trim() !== "" ? Number(value) : value;
  return typeof amount === "number" && Number.isFinite(amount) ? amount : null;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function toMetadataValue(value: string): string {
  return value.slice(0, MAX_METADATA_LENGTH);
}
