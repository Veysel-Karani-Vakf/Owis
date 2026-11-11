import { FlaskConical } from 'lucide-react';
import PageSeo from '@/components/internal/PageSeo';
import AwardPageBanner from '@/components/award/AwardPageBanner';
import ApplyWizard from '@/components/award/form/ApplyWizard';
import { awardMedia, getAwardContent } from '@/data/award/content';
import { getAwardFormContent } from '@/data/award/form';
import { awardRoutes } from '@/data/award/routes';
import { useI18n } from '@/i18n/useI18n';

/** /volunteer-award/apply — the four-step nomination form (frontend preview, nothing is sent). */
export default function AwardApplyPage() {
  const { locale } = useI18n();
  const form = getAwardFormContent(locale);
  const award = getAwardContent(locale);

  return (
    <>
      <PageSeo title={form.seo.title} description={form.seo.description} image={awardMedia.share} />
      <main className="award-page overflow-x-clip bg-warm text-dark-900">
        <AwardPageBanner
          title={form.banner.title}
          subtitle={form.banner.subtitle}
          trophyAlt={award.hero.imageAlt}
          breadcrumbs={[
            { label: form.banner.crumbHome, href: '/' },
            { label: form.banner.crumbAward, href: awardRoutes.landing },
            { label: form.banner.crumbForm },
          ]}
          badge={
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[13px] font-bold text-white backdrop-blur-sm">
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              {form.banner.demoBadge}
            </span>
          }
        />

        <div className="relative z-10 mx-auto -mt-16 max-w-4xl px-4 pb-20 md:px-8 md:pb-28">
          <p className="mb-4 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold leading-relaxed text-amber-900 shadow-sm sm:text-sm">
            <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {form.banner.demoNotice}
          </p>
          <ApplyWizard />
        </div>
      </main>
    </>
  );
}
