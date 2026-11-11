/*
 * Class recipes for the award form controls (same language as the site's
 * participate forms: rounded white fields, light-grey borders, red focus ring).
 * Errors add a darker red border, a light tint and an icon + message, so they
 * stay distinct from the focus state.
 */

export const controlBase =
  'min-h-12 w-full rounded-2xl border bg-white px-4 py-3 text-[15px] font-medium text-dark-900 shadow-sm outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:font-normal placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 disabled:cursor-not-allowed disabled:bg-warm disabled:text-dark-400 motion-reduce:transition-none';

export function controlClass(error?: string, extra = '') {
  return `${controlBase} ${error ? 'border-primary-700 bg-primary-50/40' : 'border-dark-200 hover:border-dark-300'} ${extra}`;
}

/** aria-describedby value for a field with optional hint / error. */
export function describedBy(id: string, hint?: string, error?: string) {
  return [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
}

export const formButton = {
  primary:
    'btn-border-run group inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary-500 px-7 py-3 text-[15px] font-bold text-white shadow-[0_12px_28px_rgba(156,16,6,0.22)] transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 disabled:cursor-wait disabled:bg-primary-400 disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
  secondary:
    'btn-border-run btn-border-run--sheen-tint group inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-dark-200 bg-white px-6 py-3 text-[15px] font-bold text-dark-700 transition-colors duration-300 hover:border-primary-300 hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 disabled:opacity-50',
  ghost:
    'inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
};
