import { useId } from 'react';

/** Field name sent to `/api/email/send`; the route drops any submission where it is filled. */
export const HONEYPOT_NAME = 'businessName';

/**
 * Read the honeypot straight from the DOM rather than React state, so bots that
 * set `.value` without firing input events are still caught.
 */
export function readHoneypot(form: HTMLFormElement | null): string {
  const value = form ? new FormData(form).get(HONEYPOT_NAME) : null;
  return typeof value === 'string' ? value : '';
}

/**
 * Spam trap for email forms. Positioned off-screen (not `display: none`, which
 * some bots skip) and removed from the tab order and accessibility tree, so
 * people never see it while bots that fill every input will.
 */
export default function HoneypotField() {
  const id = useId();

  return (
    <div aria-hidden="true" className="absolute -left-[100vw] w-px h-px overflow-hidden">
      <label htmlFor={id}>Business Name</label>
      <input id={id} type="text" name={HONEYPOT_NAME} tabIndex={-1} autoComplete="off" />
    </div>
  );
}
