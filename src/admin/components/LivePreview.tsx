import { useCallback, useEffect, useRef, useState } from 'react';
import { ExternalLink, Monitor, RotateCw, Smartphone, Tablet, X } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { ADMIN_SOURCE, PREVIEW_SOURCE, previewUrl, type AdminMessage } from '@/cms/preview';
import type { CmsSnapshot } from '@/cms/store';
import type { Locale } from '@/lib/types';

type Device = 'desktop' | 'tablet' | 'mobile';

/** `Omit` applied to each member of a union rather than to the union itself. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

const DEVICE_WIDTH: Record<Device, string> = {
  desktop: '100%',
  tablet: '820px',
  mobile: '390px',
};

const DEVICE_ICON: Record<Device, typeof Monitor> = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
};

export type LivePreviewProps = {
  /** Public route to render, e.g. `/about/waqf`. */
  route: string;
  /** Unsaved edits pushed into the frame so the preview matches the form. */
  draft: CmsSnapshot | null;
  /** Language of the content being edited — the frame is pinned to it. */
  contentLocale: Locale;
  /** Section anchor to scroll to and outline. */
  highlight?: string | null;
  /** Show ONLY the highlighted section, hiding the rest of the page. */
  isolate?: boolean;
  /** Shows a close button in the toolbar when provided. */
  onClose?: () => void;
};

/**
 * Renders the real site in an iframe and streams unsaved edits into it, so the
 * preview is the site itself rather than an approximation of it.
 */
export default function LivePreview({ route, draft, contentLocale, highlight, isolate, onClose }: LivePreviewProps) {
  const { locale } = useI18n();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<Device>('desktop');
  const [ready, setReady] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const post = useCallback((message: DistributiveOmit<AdminMessage, 'source'>) => {
    const frame = frameRef.current?.contentWindow;
    if (!frame) return;
    frame.postMessage({ ...message, source: ADMIN_SOURCE }, window.location.origin);
  }, []);

  // The frame announces itself once its CmsProvider is listening.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const message = event.data as { source?: string; type?: string } | undefined;
      if (message?.source === PREVIEW_SOURCE && message.type === 'ready') setReady(true);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    setReady(false);
  }, [route, contentLocale, reloadKey]);

  // Stream the draft, coalescing keystrokes into one message per frame.
  useEffect(() => {
    if (!ready) return undefined;
    const timer = window.setTimeout(() => post({ type: 'draft', snapshot: draft }), 120);
    return () => window.clearTimeout(timer);
  }, [draft, ready, post]);

  useEffect(() => {
    if (!ready) return;
    post({ type: 'highlight', selector: highlight ?? null, isolate: Boolean(isolate && highlight) });
  }, [highlight, isolate, ready, post]);

  const label = (ar: string, tr: string, en: string) =>
    locale === 'ar' ? ar : locale === 'tr' ? tr : en;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-2">
        <span className="truncate text-xs text-slate-400" dir="ltr">
          {route}
        </span>
        <div className="flex-1" />

        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          {(Object.keys(DEVICE_WIDTH) as Device[]).map((option) => {
            const Icon = DEVICE_ICON[option];
            return (
              <button
                key={option}
                type="button"
                onClick={() => setDevice(option)}
                title={option}
                className={
                  'rounded-md p-1.5 transition ' +
                  (device === option ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600')
                }
              >
                <Icon size={15} />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          title={label('إعادة التحميل', 'Yenile', 'Reload')}
          className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <RotateCw size={15} />
        </button>
        <a
          href={route}
          target="_blank"
          rel="noreferrer"
          title={label('فتح في تبويب جديد', 'Yeni sekmede aç', 'Open in new tab')}
          className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <ExternalLink size={15} />
        </a>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            title={label('إغلاق المعاينة', 'Önizlemeyi kapat', 'Close preview')}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="flex flex-1 justify-center overflow-auto p-3">
        <iframe
          key={`${route}-${contentLocale}-${reloadKey}`}
          ref={frameRef}
          src={previewUrl(route, contentLocale)}
          title={label('معاينة الموقع', 'Site önizlemesi', 'Site preview')}
          className="h-full rounded-lg border border-slate-200 bg-white shadow-sm transition-[width]"
          style={{ width: DEVICE_WIDTH[device], minHeight: '100%' }}
        />
      </div>
    </div>
  );
}
