// postMessage protocol shared by the dashboard and the previewed site frame.

import type { CmsSnapshot } from './store';

export const PREVIEW_FLAG = 'cmsPreview';
export const ADMIN_SOURCE = 'vkv-admin';
export const PREVIEW_SOURCE = 'vkv-preview';

/** Sent by the dashboard into the preview frame. */
export type AdminMessage =
  | { source: typeof ADMIN_SOURCE; type: 'draft'; snapshot: CmsSnapshot | null }
  | { source: typeof ADMIN_SOURCE; type: 'locale'; locale: string }
  | { source: typeof ADMIN_SOURCE; type: 'navigate'; path: string }
  | { source: typeof ADMIN_SOURCE; type: 'highlight'; selector: string | null };

/** Sent by the preview frame back to the dashboard. */
export type PreviewMessage =
  | { source: typeof PREVIEW_SOURCE; type: 'ready' }
  | { source: typeof PREVIEW_SOURCE; type: 'navigated'; path: string };

/** True when this document is running inside the dashboard's preview frame. */
export function isPreviewFrame(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return new URLSearchParams(window.location.search).get(PREVIEW_FLAG) === '1';
  } catch {
    return false;
  }
}

export const PREVIEW_LOCALE = 'cmsLocale';

/** Appends the preview flag (and pinned locale) to a site path. */
export function previewUrl(path: string, locale?: string): string {
  const [pathname, query = ''] = path.split('?');
  const params = new URLSearchParams(query);
  params.set(PREVIEW_FLAG, '1');
  if (locale) params.set(PREVIEW_LOCALE, locale);
  return `${pathname}?${params.toString()}`;
}

/** Locale the dashboard pinned for this preview, if any. */
export function pinnedPreviewLocale(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return new URLSearchParams(window.location.search).get(PREVIEW_LOCALE);
  } catch {
    return null;
  }
}
