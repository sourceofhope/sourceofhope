import type { Rule } from "eslint";

export function baseClass(token: string): string;
export function checkClass(token: string, options?: { allowScales?: boolean }): string | null;

declare const plugin: { meta: { name: string }; rules: Record<string, Rule.RuleModule> };
export default plugin;
