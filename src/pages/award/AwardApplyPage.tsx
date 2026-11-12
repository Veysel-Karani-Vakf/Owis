import { CalendarClock, Lock } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isPreviewFrame } from '@/cms/preview';
import PageSeo from '@/components/internal/PageSeo';
import AwardPageBanner from '@/components/award/AwardPageBanner';
import ApplyWizard from '@/components/award/form/ApplyWizard';
import { formButton } from '@/components/award/form/formStyles';
import { getAwardContent } from '@/data/award/content';
import { fillTemplate, getAwardFormContent } from '@/data/award/form';
import { awardRoutes } from '@/data/award/routes';
import { awardWindow, formatAwardDeadline, getAwardSettings } from '@/data/award/settings';
import { useI18n } from '@/i18n/useI18n';

/**
 * /volunteer-award/apply — the four-step nomination form, or a "closed" notice
 * when the award team has stopped accepting applications from the dashboard.
 */
export default function AwardApplyPage() {
  const { locale } = useI18n();
  const form = getAwardFormContent(locale);
  const award = getAwardContent(locale);

  // Decided once per visit: a deadline that passes while someone is typing must
  // not swap the form away under them (the server still refuses a late send).
  const [{ settings, state }] = useState(() => {
    const current = getAwardSettings();
    // A hidden award never reaches this page (AwardGate), except in the
    // dashboard's preview frame, where the form itself is what the editor wants.
    const shown = isPreviewFrame() ? { ...current, visible: true } : current;
    return { settings: shown, state: awardWindow(shown) };
  });
  const deadline = settings.deadline ? formatAwardDeadline(settings.deadline, locale) : '';

  return (
    <>
      <PageSeo title={form.seo.title} description={form.seo.description} image={award.media.share} />
      <main className="award-page overflow-x-clip bg-warm text-dark-900">
        <AwardPageBanner
          title={form.banner.title}
          subtitle={form.banner.subtitle}
          trophySrc={award.media.trophy}
          trophyAlt={award.hero.imageAlt}
          breadcrumbs={[
            { label: form.banner.crumbHome, href: '/' },
            { label: form.banner.crumbAward, href: awardRoutes.landing },
            { label: form.banner.crumbForm },
          ]}
        />

        <div className="relative z-10 mx-auto -mt-16 max-w-4xl px-4 pb-20 md:px-8 md:pb-28">
          {state.open ? (
            <>
              {deadline && (
                <p className="mb-4 flex items-start gap-2.5 rounded-2xl border border-dark-100 bg-white px-4 py-3 text-[13px] font-bold leading-relaxed text-dark-700 shadow-sm sm:text-sm">
                  <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
                  {fillTemplate(form.banner.deadline, { date: deadline })}
                </p>
              )}
              <ApplyWizard />
            </>
          ) : (
            <div
              id="award-closed"
              className="rounded-[28px] border border-dark-100 bg-white p-6 text-center shadow-[0_30px_80px_rgba(20,0,4,0.1)] sm:p-10"
            >
              <span
                aria-hidden="true"
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-dark-50 text-dark-500 ring-1 ring-dark-100"
              >
                <Lock className="h-7 w-7" />
              </span>
              <h2 className="mt-5 font-brand text-2xl font-bold text-dark-900 sm:text-[1.75rem]">{form.closed.title}</h2>
              <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-dark-600 sm:text-base">
                {state.reason === 'deadline' && deadline
                  ? fillTemplate(form.closed.deadline, { date: deadline })
                  : form.closed.paused}
              </p>
              <div className="mt-8 flex justify-center">
                <Link to={awardRoutes.landing} className={formButton.primary}>
                  {form.closed.back}
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
