import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n/useI18n';
import type { Locale } from '@/lib/types';
import { adsConsentAvailable, adsConsentPending, setAdsConsent } from './googleAnalytics';

/**
 * Asks once whether advertising cookies may be used (Google Consent Mode:
 * ad_storage, ad_user_data, ad_personalization). Visits are measured either
 * way; until the visitor answers, the advertising tag sends cookieless pings
 * only. The answer is kept in this browser for a year, and the footer's
 * "Cookie settings" opens the banner again to change it.
 */

/** Fired by the footer link to open the banner again. */
const OPEN_EVENT = 'vkv:consent-settings';

const TEXT: Record<Locale, { body: string; accept: string; decline: string; label: string; settings: string }> = {
  ar: {
    body: 'نستخدم أدوات Google لقياس زيارات الموقع. هل توافق على ملفات تعريف الارتباط الإعلانية التي تساعدنا على قياس حملاتنا وتحسينها؟',
    accept: 'أوافق',
    decline: 'لا أوافق',
    label: 'الموافقة على ملفات تعريف الارتباط الإعلانية',
    settings: 'إعدادات ملفات تعريف الارتباط',
  },
  tr: {
    body: 'Site ziyaretlerini ölçmek için Google araçlarını kullanıyoruz. Kampanyalarımızı ölçmemize ve iyileştirmemize yardımcı olan reklam çerezlerine izin veriyor musunuz?',
    accept: 'Kabul ediyorum',
    decline: 'Kabul etmiyorum',
    label: 'Reklam çerezleri için onay',
    settings: 'Çerez ayarları',
  },
  en: {
    body: 'We use Google tools to measure visits to this site. Do you agree to advertising cookies that help us measure and improve our campaigns?',
    accept: 'I agree',
    decline: 'No, thanks',
    label: 'Consent to advertising cookies',
    settings: 'Cookie settings',
  },
};

export default function ConsentBanner() {
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(adsConsentPending());
    const reopen = () => setOpen(adsConsentAvailable());
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  if (!open) return null;
  const text = TEXT[locale] ?? TEXT.ar;

  const choose = (granted: boolean) => {
    setAdsConsent(granted ? 'granted' : 'denied');
    setOpen(false);
  };

  return (
    <div
      role="region"
      aria-label={text.label}
      className="fixed inset-x-3 bottom-3 z-[130] mx-auto max-w-3xl rounded-2xl border border-primary-100 bg-white p-4 shadow-[0_18px_48px_rgba(40,12,18,0.18)] md:flex md:items-center md:gap-5 md:p-5 print:hidden"
    >
      <p className="text-sm leading-relaxed text-dark-700 md:flex-1">{text.body}</p>
      <div className="mt-3 flex shrink-0 flex-wrap gap-2 md:mt-0">
        <button
          type="button"
          onClick={() => choose(true)}
          className="inline-flex min-h-10 items-center justify-center rounded-full bg-primary-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          {text.accept}
        </button>
        <button
          type="button"
          onClick={() => choose(false)}
          className="inline-flex min-h-10 items-center justify-center rounded-full border border-primary-200 bg-white px-5 py-2 text-sm font-bold text-primary-700 transition-colors hover:border-primary-400 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          {text.decline}
        </button>
      </div>
    </div>
  );
}

/** Footer link that opens the banner again; shown only where the tags run. */
export function ConsentSettingsLink() {
  const { locale } = useI18n();
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    setAvailable(adsConsentAvailable());
  }, []);

  if (!available) return null;
  const text = TEXT[locale] ?? TEXT.ar;

  return (
    <div className="mt-5 text-center">
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
        className="text-xs text-white/40 underline-offset-4 transition-colors hover:text-primary-400 hover:underline"
      >
        {text.settings}
      </button>
    </div>
  );
}
