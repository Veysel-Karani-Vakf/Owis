import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeOff } from 'lucide-react';
import { AWARD_SETTINGS_KEY, parseAwardSettings } from '@/data/award/settings';
import { useI18n } from '@/i18n/useI18n';
import { supabase } from '@/lib/supabase';

/**
 * Shown at the top of the award hub while the award is hidden from visitors,
 * so an editor preparing its pictures knows why "view on the site" leads to the
 * home page — and where the switch is.
 */
export default function AwardVisibilityNotice() {
  const { locale } = useI18n();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let active = true;
    supabase
      .from('site_pages')
      .select('data')
      .eq('key', AWARD_SETTINGS_KEY)
      .maybeSingle()
      .then(({ data, error }) => {
        if (active && !error) setHidden(!parseAwardSettings(data?.data).visible);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!hidden) return null;
  const label = (ar: string, tr: string, en: string) => (locale === 'ar' ? ar : locale === 'tr' ? tr : en);

  return (
    <p className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <EyeOff size={16} className="shrink-0" />
      <span className="font-semibold">
        {label(
          'صفحة الجائزة مخفية حالياً عن الزوار.',
          'Ödül sayfası şu anda ziyaretçilerden gizli.',
          'The award page is currently hidden from visitors.',
        )}
      </span>
      <span>
        {label(
          'يمكنك تجهيز صورها هنا والمعاينة تعمل، وإظهارها من',
          'Görsellerini burada hazırlayabilirsiniz (önizleme çalışır); göstermek için:',
          'You can still prepare its pictures here (the preview works); show it again from',
        )}
      </span>
      <Link to="/admin/award-applications" className="font-semibold underline underline-offset-2 hover:text-amber-950">
        {label('طلبات جائزة أويس ← إعدادات الجائزة', 'Owais Ödülü başvuruları → Ödül ayarları', 'Owais Award applications → Award settings')}
      </Link>
    </p>
  );
}
