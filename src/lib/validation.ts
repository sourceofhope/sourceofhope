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
