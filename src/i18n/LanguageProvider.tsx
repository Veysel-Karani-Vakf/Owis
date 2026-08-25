import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useCmsVersion } from '@/cms/CmsProvider';
import { pinnedPreviewLocale } from '@/cms/preview';
import { resolveSiteContent } from '@/cms/siteContent';
import {
  getDirection,
  isSupportedLocale,
  type Direction,
  type Locale,
  type SiteContent,
} from './content';

type I18nContextValue = {
  locale: Locale;
  direction: Direction;
  isRtl: boolean;
  content: SiteContent;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  formatNumber: (value: number) => string;
  /**
   * Increments whenever CMS content changes. Include it in the dependency list
   * of any `useMemo` that derives data from the `@/data` accessors, which read
   * the CMS snapshot outside of React.
   */
  contentVersion: number;
};

export const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'veysel-karani-locale';
// Arabic uses Latin (Western) digits per brand preference: "-u-nu-latn" forces the numbering system.
const localeTags: Record<Locale, string> = {
  ar: 'ar-EG-u-nu-latn',
  tr: 'tr-TR',
  en: 'en-US',
};

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'ar';

  // The dashboard pins a locale on its preview frame so the preview always
  // shows the language being edited, whatever the browser last stored.
  const pinned = pinnedPreviewLocale();
  if (isSupportedLocale(pinned)) return pinned;

  const savedLocale = window.localStorage.getItem(STORAGE_KEY);
  if (isSupportedLocale(savedLocale)) return savedLocale;

  const browserLocale = window.navigator.language.toLowerCase();
  if (browserLocale.startsWith('ar')) return 'ar';
  if (browserLocale.startsWith('tr')) return 'tr';
  if (browserLocale.startsWith('en')) return 'en';

  return 'ar';
}

function readPath(source: unknown, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((current, part) => {
    if (current && typeof current === 'object' && part in current) {
      return (current as Record<string, unknown>)[part];
    }
    return undefined;
  }, source);

  return typeof value === 'string' ? value : undefined;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectInitialLocale());
  const direction = getDirection(locale);
  // Subscribing here is what propagates CMS updates: every component that reads
  // site content also reads the locale, so a new context value re-renders them.
  const contentVersion = useCmsVersion();
  const content = useMemo(() => resolveSiteContent(locale), [locale, contentVersion]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = direction;
    root.dataset.locale = locale;
    window.localStorage.setItem(STORAGE_KEY, locale);

    document.title = content.meta.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', content.meta.description);
    }
  }, [content.meta.description, content.meta.title, direction, locale]);

  const value = useMemo<I18nContextValue>(() => {
    return {
      locale,
      direction,
      isRtl: direction === 'rtl',
      content,
      setLocale,
      t: (key: string) => readPath(content.ui, key) ?? key,
      formatNumber: (numberValue: number) => numberValue.toLocaleString(localeTags[locale]),
      contentVersion,
    };
  }, [content, contentVersion, direction, locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
