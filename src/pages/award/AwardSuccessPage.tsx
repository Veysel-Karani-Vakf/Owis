import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, FlaskConical, Info, RotateCcw } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import PageSeo from '@/components/internal/PageSeo';
import AwardPageBanner from '@/components/award/AwardPageBanner';
import { formButton } from '@/components/award/form/formStyles';
import { awardMedia, getAwardContent } from '@/data/award/content';
import { fillTemplate, getAwardFormContent } from '@/data/award/form';
import { awardRoutes } from '@/data/award/routes';
import { useI18n } from '@/i18n/useI18n';

/**
 * /volunteer-award/success — end of the DEMO flow. It must never read as a
 * real confirmation: no reference number, and an explicit "nothing was sent".
 * The initiative name arrives in router state (never in the URL).
 */
export default function AwardSuccessPage() {
  const { locale, isRtl } = useI18n();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const form = getAwardFormContent(locale);
  const award = getAwardContent(locale);
  const text = form.success;
  const state = location.state as { initiativeName?: unknown } | null;
  const name = typeof state?.initiativeName === 'string' ? state.initiativeName.trim().slice(0, 160) : '';
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <>
      <PageSeo title={text.seoTitle} description={form.seo.description} image={awardMedia.share} />
      <main className="award-page overflow-x-clip bg-warm text-dark-900">
        <AwardPageBanner
          title={award.name}
          trophyAlt={award.hero.imageAlt}
          breadcrumbs={[
            { label: form.banner.crumbHome, href: '/' },
            { label: form.banner.crumbAward, href: awardRoutes.landing },
            { label: text.badge },
          ]}
        />

        <div className="relative z-10 mx-auto -mt-16 max-w-2xl px-4 pb-20 md:px-8 md:pb-28">
          <div className="rounded-[28px] border border-dark-100 bg-white p-6 text-center shadow-[0_30px_80px_rgba(20,0,4,0.1)] sm:p-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-[13px] font-bold text-amber-900">
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              {text.badge}
            </span>

            <div className="relative mx-auto mt-7 flex h-24 w-24 items-center justify-center" aria-hidden="true">
              {!reduceMotion && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-emerald-100"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: [0.6, 1.25, 1], opacity: [0, 0.8, 0.6] }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              )}
              <motion.span
                className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_14px_30px_rgba(5,150,105,0.35)]"
                initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-10 w-10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    initial={reduceMotion ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.45, delay: 0.35, ease: 'easeOut' }}
                  />
                </svg>
              </motion.span>
            </div>

            <h2 className="mt-6 font-brand text-2xl font-bold text-dark-900 sm:text-[1.75rem]">{text.heading}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-dark-600 sm:text-base">
              {name ? fillTemplate(text.withName, { name }) : text.withoutName}
            </p>

            <div role="note" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-start">
              <p className="flex items-start gap-2.5 text-[15px] font-bold leading-relaxed text-amber-900">
                <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                {text.notice}
              </p>
              <p className="mt-2 ps-7 text-[13px] leading-relaxed text-amber-900/80">{text.detail}</p>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <Link to={awardRoutes.apply} className={formButton.secondary}>
                <RotateCcw className="h-[18px] w-[18px]" aria-hidden="true" />
                {text.again}
              </Link>
              <Link to={awardRoutes.landing} className={formButton.primary}>
                <BackIcon className="h-[18px] w-[18px]" aria-hidden="true" />
                {text.back}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
