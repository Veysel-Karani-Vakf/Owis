import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react';

/** Horizontal room `bar` needs to lay out its children side by side (padding and margins included). */
function requiredWidth(bar: HTMLElement) {
  const style = getComputedStyle(bar);
  return Array.from(bar.children).reduce(
    (sum, child) => {
      const childStyle = getComputedStyle(child);
      if (childStyle.display === 'none') return sum;
      return (
        sum +
        child.getBoundingClientRect().width +
        parseFloat(childStyle.marginLeft) +
        parseFloat(childStyle.marginRight)
      );
    },
    parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
  );
}

/**
 * Whether the full desktop menu fits inside the header bar. Long menus (the
 * Turkish labels between 1280 and ~1400 px) would otherwise push the actions
 * past the bar's edge; the header falls back to its hamburger menu then.
 *
 * The width is measured while the menu is shown and remembered, so the menu
 * comes back as soon as the bar is wide enough again. `menuKey` changes when
 * the labels change (language, CMS edit), which triggers a fresh measurement.
 */
export function useNavFits(barRef: RefObject<HTMLElement>, menuKey: string) {
  const [fits, setFits] = useState(true);
  const fullWidth = useRef(0);

  const measure = useCallback(() => {
    const bar = barRef.current;
    if (!bar) return;
    const nav = bar.querySelector('nav');
    if (nav && getComputedStyle(nav).display !== 'none') {
      fullWidth.current = requiredWidth(bar);
    }
    // Below xl the menu is hidden by CSS anyway, and an unmeasured menu is assumed to fit.
    setFits(fullWidth.current === 0 || fullWidth.current <= bar.clientWidth + 0.5);
  }, [barRef]);

  // New labels: show the full menu again so it can be measured.
  useLayoutEffect(() => {
    fullWidth.current = 0;
    setFits(true);
  }, [menuKey]);

  // Measure after each render (before paint, so an overflowing menu never flashes)
  // and whenever the bar is resized.
  useLayoutEffect(() => {
    measure();
  });

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(() => measure());
    observer.observe(bar);
    return () => observer.disconnect();
  }, [barRef, measure]);

  return fits;
}
