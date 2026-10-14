import { isCmsSettled } from '@/cms/store';
import { useI18n } from '@/i18n/useI18n';

/** Shown only when the pioneers table is unavailable. */
export default function PioneersLoadStatus() {
  const { locale } = useI18n();
  const loading = !isCmsSettled();
  const message = loading
    ? { ar: 'جارٍ تحميل الرواد…', tr: 'Öncüler yükleniyor…', en: 'Loading pioneers…' }
    : {
        ar: 'تعذر تحميل الرواد حالياً. يرجى إعادة المحاولة لاحقاً.',
        tr: 'Öncüler şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.',
        en: 'Pioneers could not be loaded. Please try again later.',
      };

  return (
    <div role="status" aria-busy={loading} className="px-4 py-16 text-center text-dark-500">
      {message[locale]}
    </div>
  );
}
