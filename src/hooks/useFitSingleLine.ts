import { useLayoutEffect, useRef, useState } from 'react';

type FitSingleLineOptions = {
  /** Largest allowed font size in px. */
  maxPx: number;
  /** Smallest font size (px) at which the text is still kept on a single line. */
  minPx?: number;
  /** Font size (px) used when even `minPx` can't fit on one line and the text is allowed to wrap. */
  fallbackPx?: number;
};

type FitState = {
  fontSize: number;
  singleLine: boolean;
};

// Text width does not scale perfectly linearly with font size (hinting/rounding), keep a small margin.
const SAFETY = 0.98;
// Ignore sub-quarter-pixel differences so re-measurements after a resize don't cause render loops.
const EPSILON = 0.25;
// After applying a size, re-measure on the next frames until the result is stable (bounded).
const MAX_SETTLE_PASSES = 4;

/**
 * Keeps an element's text on a single line by shrinking its font size (never above `maxPx`)
 * until the full text fits inside its parent element. When it can't fit even at `minPx`,
 * `singleLine` turns false and `fontSize` becomes `fallbackPx` so the caller can let it wrap.
 *
 * The text width is measured at the *current* size and scaled proportionally, so the hook never
 * writes a temporary font size (that would be unreliable while CSS transitions are active).
 * Re-measures when `text` changes, when the parent resizes, whenever web fonts finish loading, and when
 * the document's `lang`/`dir` change (the brand fonts are selected per language), then settles over
 * a few frames so it never sticks to a measurement taken before fonts or styles were final.
 * Apply the returned `fontSize` as an inline style and `whitespace-nowrap` while `singleLine` is true.
 * The element (and its descendants) must not transition `font-size` — give it the `no-transitions` class —
 * or a measurement may pair the new size with text still laid out at the previous one.
 */
export function useFitSingleLine<T extends HTMLElement = HTMLElement>(
  text: string,
  { maxPx, minPx = 12, fallbackPx = minPx }: FitSingleLineOptions,
) {
  const ref = useRef<T>(null);
  const [state, setState] = useState<FitState>({ fontSize: maxPx, singleLine: true });
  const lastFitted = useRef(maxPx);

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    let frame = 0;
    let settlePasses = 0;

    const fit = () => {
      const available = parent.clientWidth;
      const currentPx = parseFloat(getComputedStyle(el).fontSize);
      if (available <= 0 || !currentPx) return;

      // Measure the natural single-line width (white-space is not animatable, so this write is safe).
      const previousWhiteSpace = el.style.whiteSpace;
      el.style.whiteSpace = 'nowrap';
      const range = document.createRange();
      range.selectNodeContents(el);
      const textWidth = range.getBoundingClientRect().width;
      range.detach();
      el.style.whiteSpace = previousWhiteSpace;
      if (textWidth <= 0) return;

      const widthPerPx = textWidth / currentPx;
      const fitted = Math.min(maxPx, (available / widthPerPx) * SAFETY);
      if (Math.abs(fitted - lastFitted.current) < EPSILON) return;
      lastFitted.current = fitted;

      if (fitted >= minPx) {
        setState({ fontSize: Math.floor(fitted * 100) / 100, singleLine: true });
      } else {
        setState({ fontSize: fallbackPx, singleLine: false });
      }

      // Verify against the real layout once the new size is applied.
      if (settlePasses < MAX_SETTLE_PASSES) {
        settlePasses += 1;
        scheduleFit();
      }
    };

    const scheduleFit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };

    const refit = () => {
      settlePasses = 0;
      scheduleFit();
    };

    fit();

    const resizeObserver = new ResizeObserver(refit);
    resizeObserver.observe(parent);

    // Font families are chosen per language via html[lang]/[dir]; re-measure when they change.
    const rootObserver = new MutationObserver(refit);
    rootObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir', 'class'] });

    const fonts = document.fonts;
    fonts?.ready.then(refit).catch(() => undefined);
    fonts?.addEventListener('loadingdone', refit);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      rootObserver.disconnect();
      fonts?.removeEventListener('loadingdone', refit);
    };
  }, [text, maxPx, minPx, fallbackPx]);

  return { ref, fontSize: state.fontSize, singleLine: state.singleLine };
}
