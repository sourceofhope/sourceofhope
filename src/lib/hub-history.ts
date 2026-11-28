import { hubSearch, type HubState } from "./hub-url";

/*
 * Hub history rules (spec §9.3), on the browser's own history so Back and
 * Forward work as people expect:
 *  - opening from a page pushes an entry, so Back closes the Hub;
 *  - each step pushes an entry, so Back returns to the previous step;
 *  - completion replaces the flow's entries with one, so Back closes the Hub
 *    instead of returning into a finished form;
 *  - closing goes back past every Hub entry, or, when the Hub was opened by
 *    a URL (nothing to go back to), replaces the entry without Hub params.
 *
 * Each Hub entry records how many Hub entries sit at or below it
 * (`tsohHubDepth`). Next.js keeps custom history state and updates
 * useSearchParams on native pushState and replaceState.
 */

const DEPTH_KEY = "tsohHubDepth";

/** How many Hub entries are at or below the current one (0 = opened by URL, or closed). */
export function hubDepth(): number {
  const state = window.history.state as Record<string, unknown> | null;
  const depth = Number(state?.[DEPTH_KEY]);
  return Number.isFinite(depth) && depth > 0 ? depth : 0;
}

function urlFor(state: HubState | null): string {
  return `${window.location.pathname}${hubSearch(state, window.location.search)}`;
}

let opener: HTMLElement | null = null;

/** The element that opened the Hub, so focus can return to it on close. */
export function takeOpener(): HTMLElement | null {
  const element = opener;
  opener = null;
  return element?.isConnected ? element : null;
}

/** Open the Hub or move to a new step: a new history entry. */
export function pushHub(state: HubState) {
  window.history.pushState({ [DEPTH_KEY]: hubDepth() + 1 }, "", urlFor(state));
}

/** Change the Hub state without a new entry (door switches, normalization). */
export function replaceHub(state: HubState) {
  window.history.replaceState({ [DEPTH_KEY]: hubDepth() }, "", urlFor(state));
}

function go(delta: number): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      window.removeEventListener("popstate", done);
      resolve();
    };
    window.addEventListener("popstate", done);
    window.history.go(delta);
    // Some browsers skip popstate for a same-document traversal that changes nothing.
    window.setTimeout(done, 1000);
  });
}

/** Finish a flow: collapse its entries into one completion entry. */
export async function completeHub(state: HubState) {
  const depth = hubDepth();
  if (depth > 1) await go(-(depth - 1));
  window.history.replaceState({ [DEPTH_KEY]: Math.min(depth, 1) }, "", urlFor(state));
}

/** Close the Hub, keeping UTMs and every other non-Hub parameter. */
export function closeHub() {
  const depth = hubDepth();
  if (depth > 0) window.history.go(-depth);
  else window.history.replaceState({ [DEPTH_KEY]: 0 }, "", urlFor(null));
}

/**
 * A Hub link's click: open the Hub in place, keeping the page's UTMs and
 * remembering the opener for focus. Modifier clicks and new tabs fall
 * through to the real link, which works on its own.
 */
export function handleHubLinkClick(event: MouseEvent | React.MouseEvent<HTMLElement>, state: HubState) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = event.currentTarget as HTMLElement | null;
  if (target?.getAttribute("target") === "_blank") return;
  event.preventDefault();
  opener = target;
  pushHub(state);
}
