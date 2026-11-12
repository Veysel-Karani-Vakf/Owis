import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Copy, Info, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { isPreviewFrame } from '@/cms/preview';
import PageSeo from '@/components/internal/PageSeo';
import AwardPageBanner from '@/components/award/AwardPageBanner';
import { formButton } from '@/components/award/form/formStyles';
import { getAwardContent } from '@/data/award/content';
import { fillTemplate, getAwardFormContent } from '@/data/award/form';
import { awardRoutes } from '@/data/award/routes';
import { useI18n } from '@/i18n/useI18n';

/**
 * /volunteer-award/success — confirmation of a nomination the server accepted.
 * The reference number and the initiative name arrive in router state (never
 * in the URL); without a reference there is nothing to confirm, so the page
 * sends the visitor back to the award instead of showing a false receipt. The
 * dashboard's preview frame is the exception: it shows a sample number so the
 * texts can be edited in place.
 */
export default function AwardSuccessPage() {
  const { locale, isRtl } = useI18n();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const form = getAwardFormContent(locale);
  const award = getAwardContent(locale);
  const text = form.success;
  const state = location.state as { initiativeName?: unknown; reference?: unknown } | null;
  const name = typeof state?.initiativeName === 'string' ? state.initiativeName.trim().slice(0, 160) : '';
  const reference =
    typeof state?.reference === 'string' ? state.reference.trim().slice(0, 40) : isPreviewFrame() ? 'OWA-2026-0001' : '';
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  if (!reference) return <Navigate to={awardRoutes.landing} replace />;

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
    } catch {
      // Clipboard unavailable (old browser, insecure origin): the number stays selectable on screen.
    }
  };

  return (
    <>
      <PageSeo title={text.seoTitle} description={form.seo.description} image={award.media.share} />
      <main className="award-page overflow-x-clip bg-warm text-dark-900">
        <AwardPageBanner
          title={award.name}
          trophySrc={award.media.trophy}
          trophyAlt={award.hero.imageAlt}
          breadcrumbs={[
            { label: form.banner.crumbHome, href: '/' },
            { label: form.banner.crumbAward, href: awardRoutes.landing },
            { label: text.badge },
          ]}
        />

        <div className="relative z-10 mx-auto -mt-16 max-w-2xl px-4 pb-20 md:px-8 md:pb-28">
          <div
            id="award-success"
            className="rounded-[28px] border border-dark-100 bg-white p-6 text-center shadow-[0_30px_80px_rgba(20,0,4,0.1)] sm:p-10"
          >
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center" aria-hidden="true">
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

            <div className="mt-6 rounded-2xl border border-dark-100 bg-warm/60 p-4 sm:p-5">
              <p className="text-[13px] font-bold text-dark-500">{text.referenceLabel}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <span
                  dir="ltr"
                  className="select-all font-mono text-2xl font-bold tracking-wider text-dark-900 sm:text-[1.75rem]"
                >
                  {reference}
                </span>
                <button
                  type="button"
                  onClick={() => void copyReference()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-dark-200 bg-white px-3.5 py-1.5 text-[13px] font-bold text-dark-700 transition hover:border-primary-300 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span aria-live="polite">{copied ? text.copied : text.copy}</span>
                </button>
              </div>
              <p className="mt-3 flex items-start justify-center gap-2 text-[13px] leading-relaxed text-dark-600">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-dark-400" aria-hidden="true" />
                {text.referenceHint}
              </p>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <Link to={awardRoutes.apply} className={formButton.secondary}>
                <Plus className="h-[18px] w-[18px]" aria-hidden="true" />
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
