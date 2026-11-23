import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

/** WCAG 2.0–2.2 A and AA rules, as one list of readable violations. */
export async function axeViolations(page: Page, include?: string): Promise<string[]> {
  let builder = new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);
  if (include) builder = builder.include(include);
  const result = await builder.analyze();
  return result.violations.map(
    (v) => `${v.id} (${v.nodes.length}): ${v.help} → ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`,
  );
}
