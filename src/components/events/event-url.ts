/**
 * The open event lives in the URL (`/events?event=<key>`), so links are
 * shareable, the phone Back gesture closes the modal, and returning from
 * DocuSign reopens the right event. Next.js keeps `useSearchParams` in sync
 * with native history calls.
 */
export const EVENT_PARAM = "event";
export const WAIVER_STATUS_PARAM = "waiver";

// Whether this tab pushed the current `?event=` entry. If so, closing goes
// back one entry; if the visitor arrived on a deep link, closing replaces it.
let pushedEntry = false;

export function openEvent(key: string) {
  const url = new URL(window.location.href);
  url.searchParams.set(EVENT_PARAM, key);
  url.searchParams.delete(WAIVER_STATUS_PARAM);
  url.hash = "";
  window.history.pushState(null, "", url);
  pushedEntry = true;
}

export function closeEvent() {
  // The dialog also reports "close" after Back already removed the param;
  // without this check that would step back a second time and leave /events.
  if (!new URL(window.location.href).searchParams.has(EVENT_PARAM)) {
    pushedEntry = false;
    return;
  }

  if (pushedEntry) {
    pushedEntry = false;
    window.history.back();
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.delete(EVENT_PARAM);
  url.searchParams.delete(WAIVER_STATUS_PARAM);
  window.history.replaceState(null, "", url);
}
