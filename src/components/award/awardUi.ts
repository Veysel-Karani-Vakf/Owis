/*
 * Shared class recipes and helpers for the Owais Volunteer Award pages.
 * Everything uses the site's own tokens (primary red, dark neutrals, warm)
 * and the site-wide btn-border-run convention: --light on dark or photo
 * surfaces, --sheen-tint on white bodies.
 */

export const awardEase = [0.22, 1, 0.36, 1] as const;

const buttonBase =
  'group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 py-3 text-[15px] font-bold leading-none transition-[background-color,border-color,color,box-shadow,transform] duration-300 motion-reduce:transition-none sm:text-base';

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600';
const focusRingOnDark =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';
const lift = 'hover:-translate-y-0.5 motion-reduce:hover:translate-y-0';

export const awardButton = {
  /** Official red on a light page; darker red on hover. */
  primary: `btn-border-run ${buttonBase} bg-primary-500 text-white shadow-[0_12px_28px_rgba(156,16,6,0.22)] hover:bg-primary-700 hover:shadow-[0_16px_32px_rgba(156,16,6,0.3)] ${lift} ${focusRing}`,
  /** Official red on a dark or photographic surface. */
  primaryOnDark: `btn-border-run btn-border-run--light ${buttonBase} bg-primary-500 text-white shadow-[0_14px_30px_rgba(0,0,0,0.3)] hover:bg-primary-700 ${lift} ${focusRingOnDark}`,
  /** White with a red border — the secondary action on light pages. */
  secondary: `btn-border-run btn-border-run--sheen-tint ${buttonBase} border border-primary-200 bg-white text-primary-700 hover:border-primary-500 hover:bg-primary-50 ${focusRing}`,
  /** Outlined glass — the secondary action over the hero photograph (as on the home hero). */
  secondaryOnDark: `btn-border-run btn-border-run--light btn-border-run--sheen-tint ${buttonBase} border border-white/70 bg-black/10 text-white backdrop-blur-[2px] hover:border-white hover:bg-white hover:text-dark-900 ${focusRingOnDark}`,
  /** White body with red text on a dark panel. */
  light: `btn-border-run btn-border-run--light btn-border-run--sheen-tint ${buttonBase} bg-white text-primary-700 shadow-[0_14px_30px_rgba(0,0,0,0.25)] hover:bg-primary-50 ${lift} ${focusRingOnDark}`,
} as const;

/** Same clearance ScrollRestoration leaves under the floating header. */
const HEADER_OFFSET = 96;

/**
 * Smoothly scrolls to an in-page section and moves keyboard focus with it
 * (sections carry tabIndex={-1}), without touching the router's URL.
 */
export function scrollToAwardSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? 'auto' : 'smooth' });
  target.focus({ preventScroll: true });
}
