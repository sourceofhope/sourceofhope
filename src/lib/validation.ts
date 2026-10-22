/** Basic email shape check used by the public form endpoints. */
export const EMAIL_PATTERN = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,255}\.[^\s@<>"]+$/;

/** Escape user input before placing it in an HTML email body. */
export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
  );
}

/**
 * Trim a string field, collapse line breaks, and cap its length. Returns
 * undefined for anything that isn't a non-empty string.
 */
export function cleanString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.replace(/[\r\n\t]+/g, " ").trim();
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

/**
 * Parse a JSON object request body, or return null if the request does not
 * declare a JSON content type or the body is not a JSON object.
 *
 * Requiring `application/json` also stops cross-site HTML form posts, which
 * cannot send that content type without a CORS preflight.
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
