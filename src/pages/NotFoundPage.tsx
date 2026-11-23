import { Link } from 'react-router-dom';
import PageSeo from '@/components/internal/PageSeo';
import { useI18n } from '@/i18n/useI18n';
import type { Locale } from '@/lib/types';

/**
 * An address the site does not have. The web server answers it with status
 * 404 (see deploy/hostinger/Caddyfile), after redirecting the addresses of the
 * former site that moved here; this page shows the visitor where to go next.
 */

const TEXT: Record<Locale, { title: string; description: string; home: string; projects: string; donate: string }> = {
  ar: {
    title: 'الصفحة غير موجودة',
    description: 'ربما نُقلت هذه الصفحة أو تغيّر عنوانها. يمكنك متابعة التصفح من هنا:',
    home: 'الصفحة الرئيسية',
    projects: 'المشاريع الوقفية',
    donate: 'ساهم الآن',
  },
  tr: {
    title: 'Sayfa bulunamadı',
    description: 'Bu sayfa taşınmış ya da adresi değişmiş olabilir. Buradan devam edebilirsiniz:',
    home: 'Ana sayfa',
    projects: 'Vakıf projeleri',
    donate: 'Bağış yap',
  },
  en: {
    title: 'Page not found',
    description: 'This page may have moved, or its address may have changed. You can carry on from here:',
    home: 'Home page',
    projects: 'Waqf projects',
    donate: 'Donate now',
  },
};

const primaryButtonClass =
  'inline-flex min-h-11 items-center justify-center rounded-full bg-primary-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600';
const secondaryButtonClass =
  'inline-flex min-h-11 items-center justify-center rounded-full border border-primary-200 bg-white px-6 py-2.5 text-sm font-bold text-primary-700 transition-colors hover:border-primary-400 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600';

export default function NotFoundPage() {
  const { locale } = useI18n();
  const text = TEXT[locale] ?? TEXT.ar;

  return (
    <>
      <PageSeo title={text.title} description={text.description} />
      <main className="bg-[#faf8f8]">
        <section className="flex min-h-[70vh] items-center py-20 md:py-28">
          <div className="mx-auto w-full max-w-2xl px-4 md:px-8">
            <div className="rounded-[22px] border border-primary-100 bg-white p-8 text-center shadow-[0_18px_48px_rgba(40,12,18,0.07)] md:p-10">
              <p className="text-5xl font-black text-primary-600" aria-hidden="true">
                404
              </p>
              <h1 className="mt-4 text-2xl font-bold text-dark-950 md:text-3xl">{text.title}</h1>
              <p className="mt-3 text-base leading-relaxed text-dark-600">{text.description}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link to="/" className={primaryButtonClass}>
                  {text.home}
                </Link>
                <Link to="/projects" className={secondaryButtonClass}>
                  {text.projects}
                </Link>
                <Link to="/donate" className={secondaryButtonClass}>
                  {text.donate}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
