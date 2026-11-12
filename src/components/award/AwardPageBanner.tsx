import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import Breadcrumbs from '@/components/internal/Breadcrumbs';
import type { BreadcrumbItem } from '@/data/about';
import { awardImageAttrs } from '@/data/award/content';
import { awardEase } from './awardUi';

type AwardPageBannerProps = {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  /** Small pill under the title (e.g. "preview"). */
  badge?: ReactNode;
  /** The award trophy picture (editable from the dashboard). */
  trophySrc: string;
  trophyAlt: string;
};

/**
 * Compact award banner for the inner pages (form, preview result): the poster's
 * deep-red glow, the trophy on the far side and room for the floating header.
 */
export default function AwardPageBanner({
  title,
  subtitle,
  breadcrumbs,
  badge,
  trophySrc,
  trophyAlt,
}: AwardPageBannerProps) {
  const reduceMotion = useReducedMotion();
  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: awardEase },
        };

  return (
    <section className="relative isolate overflow-hidden bg-dark-950">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_0%,#9c1006_0%,#4d0306_45%,#1a0102_85%)] lg:ltr:bg-[radial-gradient(circle_at_80%_60%,#b4121c_0%,#7d070c_25%,#3a0204_55%,#140102_90%)] lg:rtl:bg-[radial-gradient(circle_at_20%_60%,#b4121c_0%,#7d070c_25%,#3a0204_55%,#140102_90%)]"
      />
      <div aria-hidden="true" className="geometric-pattern absolute inset-0 -z-10 opacity-10" />

      <div className="relative mx-auto flex max-w-7xl items-end gap-8 px-4 pb-28 pt-28 md:px-8 md:pb-32 md:pt-32">
        <div className="min-w-0 flex-1 text-start">
          <motion.div {...rise(0)} className="mb-4">
            <Breadcrumbs items={breadcrumbs} light />
          </motion.div>
          <motion.h1
            {...rise(0.08)}
            className="font-brand text-[1.9rem] font-bold leading-tight text-white sm:text-4xl lg:text-5xl"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p {...rise(0.16)} className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/75 sm:text-lg">
              {subtitle}
            </motion.p>
          )}
          {badge && (
            <motion.div {...rise(0.22)} className="mt-5">
              {badge}
            </motion.div>
          )}
        </div>

        <div aria-hidden="true" className="relative hidden h-64 w-56 shrink-0 items-end justify-center lg:flex xl:h-72">
          <span className="absolute bottom-6 aspect-square w-64 rounded-full border border-white/10" />
          <span className="absolute bottom-10 aspect-square w-44 rounded-full bg-[radial-gradient(circle,rgba(255,206,140,0.25),transparent_65%)]" />
          <motion.img
            src={trophySrc}
            alt={trophyAlt}
            {...awardImageAttrs('trophy', trophySrc)}
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.9, ease: awardEase }}
            className="relative h-full w-auto max-w-full object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>
    </section>
  );
}
