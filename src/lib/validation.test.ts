import { describe, expect, it } from "vitest";
import { readJsonObject } from "@/lib/validation";

const post = (body: string, contentType = "application/json") =>
  new Request("https://example.test/api", {
    method: "POST",
    headers: { "content-type": contentType },
    body,
  });

describe("readJsonObject", () => {
  it("returns the parsed object for a JSON object body", async () => {
    await expect(readJsonObject(post('{"name":"Ana"}'))).resolves.toEqual({ name: "Ana" });
  });

  it("accepts a content type with a charset", async () => {
    await expect(
      readJsonObject(post('{"a":1}', "application/json; charset=utf-8")),
    ).resolves.toEqual({ a: 1 });
  });

  it("rejects non-JSON content types (blocks cross-site form posts)", async () => {
    await expect(readJsonObject(post("name=Ana", "application/x-www-form-urlencoded"))).resolves.toBeNull();
    await expect(readJsonObject(post('{"a":1}', "text/plain"))).resolves.toBeNull();
  });

  it("rejects arrays, primitives, null and malformed JSON", async () => {
    await expect(readJsonObject(post("[1,2]"))).resolves.toBeNull();
    await expect(readJsonObject(post("42"))).resolves.toBeNull();
    await expect(readJsonObject(post("null"))).resolves.toBeNull();
    await expect(readJsonObject(post("{not json"))).resolves.toBeNull();
  });
});
