/*
 * Shared class recipes and helpers for the Owais Volunteer Award pages.
 * Buttons follow the site-wide btn-border-run convention; the award palette
 * for the running light is set in index.css under `.award-page`.
 */

export const awardEase = [0.22, 1, 0.36, 1] as const;

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-award-green-600';

const buttonBase =
  'inline-flex min-h-12 items-center justify-center gap-2.5 rounded-2xl px-6 py-3 text-[15px] font-bold leading-none transition-[background-color,border-color,box-shadow,transform] duration-300 motion-reduce:transition-none sm:text-base';

export const awardButton = {
  /** Solid forest green — the main call to action on light surfaces. */
  primary: `btn-border-run ${buttonBase} bg-award-green-700 text-white shadow-[0_12px_28px_rgba(4,92,75,0.26)] hover:-translate-y-0.5 hover:bg-award-green-800 hover:shadow-[0_16px_34px_rgba(4,92,75,0.32)] motion-reduce:hover:translate-y-0 ${focusRing}`,
  /** Outlined, near-white body — the secondary action on light surfaces. */
  secondary: `btn-border-run btn-border-run--sheen-tint ${buttonBase} border border-award-green-700/25 bg-white/75 text-award-green-800 backdrop-blur-sm hover:border-award-green-700/50 hover:bg-white ${focusRing}`,
  /** White body on a dark green surface. */
  light: `btn-border-run btn-border-run--light btn-border-run--sheen-tint ${buttonBase} bg-white text-award-green-800 shadow-[0_14px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:bg-award-cream-100 motion-reduce:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`,
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
