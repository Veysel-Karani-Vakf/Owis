/**
 * The bank sends the donor back to /donate/result?oid=<reference>. That
 * reference opens the receipt (the donor's name and the amount) to whoever
 * holds it, and the Google Ads tag reads the address bar as it is. So before
 * any tag loads (main.tsx calls this first), the reference moves out of the
 * address into the state of this history entry: a reload, or coming back to
 * the page with the browser's Back button, still finds it there, and the
 * address that tags and screenshots see no longer carries it.
 */

const STATE_KEY = 'vkvDonationReference';

/** Kept for this page load too, in case the history state cannot be written. */
let fromThisLoad = '';

function isResultPath(pathname: string): boolean {
  return pathname.toLowerCase().replace(/\/+$/, '') === '/donate/result';
}

export function takeResultReferenceFromAddress(): void {
  try {
    const { pathname, search, hash } = window.location;
    if (!isResultPath(pathname)) return;
    const params = new URLSearchParams(search);
    const oid = params.get('oid');
    if (!oid) return;

    fromThisLoad = oid;
    params.delete('oid');
    const rest = params.toString();
    const current: unknown = window.history.state;
    const state = current && typeof current === 'object' ? (current as Record<string, unknown>) : {};
    window.history.replaceState({ ...state, [STATE_KEY]: oid }, '', `${pathname}${rest ? `?${rest}` : ''}${hash}`);
  } catch {
    // The address stays as it is, and the page reads the reference from it.
  }
}

/** The payment reference the bank returned to this page, or '' when there is none. */
export function resultReference(): string {
  try {
    const state: unknown = window.history.state;
    if (state && typeof state === 'object') {
      const saved = (state as Record<string, unknown>)[STATE_KEY];
      if (typeof saved === 'string' && saved) return saved;
    }
  } catch {
    // Fall back to this page load's copy.
  }
  return fromThisLoad;
}
