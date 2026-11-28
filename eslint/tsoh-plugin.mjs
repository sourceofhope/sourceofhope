/**
 * Local ESLint plugin: design-system guardrails (ADR-0009 §3, spec §3–§5).
 *
 * `tsoh/design-tokens` reads every string in a file (JSX className values,
 * tailwind-variants recipes, template literals) as space-separated classes and
 * rejects anything outside the approved token vocabulary.
 */

const DEFAULT_PALETTE =
  "slate|gray|zinc|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white";
const SCALES = "primary|accent|neutral";
const COLOR_UTILITIES =
  "bg|text|border(?:-[trblxyse])?|ring|ring-offset|outline|fill|stroke|from|via|to|decoration|divide|placeholder|caret|accent|shadow|inset-shadow|inset-ring";

const RE_DEFAULT_PALETTE = new RegExp(`^(?:${COLOR_UTILITIES})-(?:${DEFAULT_PALETTE})(?:-\\d{2,3})?(?:\\/\\d+)?$`);
const RE_SCALE_STEP = new RegExp(`^(?:${COLOR_UTILITIES})-(?:${SCALES})-\\d{2,3}(?:\\/\\d+)?$`);
const RE_BIG_RADIUS = /^rounded(?:-(?:t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee))?-(?:xl|2xl|3xl|4xl)$/;
const RE_DEPRECATED = /^(?:text-(?:md|xlg|xxlg|xxxlg|xxxxlg)|font-(?:urbanist|inter|montserrat)|(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|scroll-mt)-(?:15|35))$/;
// Tailwind v4 CSS-variable shorthand, e.g. duration-(--duration-base), z-(--z-header).
const RE_VAR_SHORTHAND = /^[a-z-]+-\(--[a-z0-9-]+\)$/;

/** Strip variants (`md:`, `data-open:`, `[&>svg]:`), importance and negation. */
export function baseClass(token) {
  let depth = 0;
  let cut = -1;
  for (let i = 0; i < token.length; i++) {
    const c = token[i];
    if (c === "[" || c === "(") depth++;
    else if (c === "]" || c === ")") depth--;
    else if (c === ":" && depth === 0) cut = i;
  }
  return token.slice(cut + 1).replace(/^!/, "").replace(/!$/, "").replace(/^-/, "");
}

/** Returns a message for a forbidden class, or null when it is allowed. */
export function checkClass(token, { allowScales = false } = {}) {
  const cls = baseClass(token);
  if (!cls) return null;
  if (RE_DEPRECATED.test(cls)) return `"${cls}" is a deprecated legacy token. Use the spec §5 scale (text-base…text-5xl, font-sans, font-heading, spacing scale).`;
  if (RE_DEFAULT_PALETTE.test(cls)) return `"${cls}" uses Tailwind's default palette. Use a semantic token (ink, muted, surface, action, line, input, success, danger, tone-*).`;
  if (!allowScales && RE_SCALE_STEP.test(cls)) return `"${cls}" uses a raw scale step. Use a semantic token instead (spec §5.1).`;
  if (RE_BIG_RADIUS.test(cls)) return `"${cls}" is not an approved radius. Use rounded-sm, rounded-md, rounded-lg or rounded-full (spec §5.4).`;
  if (cls.includes("[") && !RE_VAR_SHORTHAND.test(cls)) return `"${cls}" is an arbitrary value. Add a token to globals.css or use the scale (spec §5.3).`;
  return null;
}

/** Only strings that look like class lists are checked (no sentences, URLs, paths). */
function looksLikeClassList(value) {
  if (!value || value.length > 2000) return false;
  if (/^(?:https?:|\/|\.\/|#|@|[A-Z])/.test(value)) return false;
  if (/[.?!]\s|[{}"<>]/.test(value)) return false;
  return /[a-z0-9]-|:/.test(value);
}

const designTokens = {
  meta: {
    type: "problem",
    docs: { description: "Only approved design tokens in class strings (ADR-0009)." },
    schema: [{ type: "object", properties: { allowScales: { type: "boolean" } }, additionalProperties: false }],
  },
  create(context) {
    const options = context.options[0] ?? {};
    const check = (node, value) => {
      if (!looksLikeClassList(value)) return;
      for (const token of value.split(/\s+/)) {
        const message = checkClass(token, options);
        if (message) context.report({ node, message });
      }
    };
    return {
      Literal(node) {
        if (typeof node.value === "string") check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value.cooked ?? "");
      },
    };
  },
};

const tsohPlugin = { meta: { name: "tsoh" }, rules: { "design-tokens": designTokens } };

export default tsohPlugin;
