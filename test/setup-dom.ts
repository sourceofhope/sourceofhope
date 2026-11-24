import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

declare global {
  var __UI_SDK_STRICT__: boolean | undefined;
}
// UI SDK development warnings fail the test instead of scrolling past.
globalThis.__UI_SDK_STRICT__ = true;

// jsdom gaps the UI SDK needs filled (node_modules/@ui-sdk/core/skills/ui-sdk/
// references/testing.md#jsdom). Assigned, not `??=`: jsdom has some of these
// without the parts that matter. Placement and top-layer behavior are checked
// in Playwright instead.
HTMLElement.prototype.showPopover = function () {};
HTMLElement.prototype.hidePopover = function () {};
Element.prototype.getAnimations = () => [];
Element.prototype.scrollIntoView = function () {};
Element.prototype.checkVisibility = () => true;
Element.prototype.getClientRects = () => [] as unknown as DOMRectList;
document.elementFromPoint = () => null;
document.elementsFromPoint = () => [];
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
globalThis.CSS ??= {} as typeof CSS;
CSS.supports ??= () => false;
document.head.append(Object.assign(document.createElement("style"), { textContent: "[popover] { display: block !important }" }));

afterEach(() => cleanup());
