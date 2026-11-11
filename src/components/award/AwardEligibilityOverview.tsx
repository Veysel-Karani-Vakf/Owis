import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { awardSectionIds, type AwardContent } from '@/data/award/content';
import { awardRoutes } from '@/data/award/routes';
import { useI18n } from '@/i18n/useI18n';
import { useNarrowScreen } from '@/hooks/useResponsiveMotion';
import AwardHighlands from './AwardHighlands';
import AwardSectionHeading from './AwardSectionHeading';
import { conditionIcons } from './awardIcons';
import { awardButton, awardEase } from './awardUi';

type AwardEligibilityOverviewProps = {
  content: AwardContent;
};

/** Section D — the five participation conditions over an illustrated Yemeni highland. */
export default function AwardEligibilityOverview({ content }: AwardEligibilityOverviewProps) {
  const { eligibility } = content;
  const { isRtl, formatNumber } = useI18n();
  const reduceMotion = useReducedMotion();
  const isNarrow = useNarrowScreen();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section
      id={awardSectionIds.eligibility}
      tabIndex={-1}
      aria-labelledby="award-eligibility-title"
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#f6f0e6] from-60% to-award-cream-50 py-20 focus:outline-none md:py-28"
    >
      {/* The landscape sits between the heading and the conditions panel; its edges fade into the section colour. */}
      <div className="absolute inset-x-0 top-28 -z-10 h-[440px] sm:top-24 sm:h-[480px] lg:top-6 lg:h-[560px]">
        <AwardHighlands className="h-full w-full" />
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <AwardSectionHeading
          id="award-eligibility-title"
          title={eligibility.title}
          description={eligibility.description}
        />

        <ol className="mx-auto mt-[11rem] grid max-w-6xl gap-3 rounded-[30px] border border-white/80 bg-white/75 p-3 shadow-[0_30px_70px_rgba(15,56,60,0.1)] backdrop-blur-md sm:mt-[13rem] sm:p-4 md:grid-cols-6 lg:mt-52 lg:grid-cols-5 lg:gap-0 lg:p-2">
          {eligibility.items.map((condition, index) => {
            const Icon = conditionIcons[condition.id];
            const placement = [
              'md:col-span-2 lg:col-span-1',
              index === 3 ? 'md:col-start-2 lg:col-start-auto' : '',
              index > 0 ? 'lg:border-s lg:border-award-line/80' : '',
            ].join(' ');

            return (
              <motion.li
                key={condition.id}
                className={placement}
                initial={reduceMotion ? false : { opacity: 0, y: isNarrow ? 12 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: reduceMotion ? 0 : index * 0.09, ease: awardEase }}
              >
                <div className="group flex h-full items-start gap-4 rounded-[22px] bg-white/70 p-4 text-start transition-colors duration-300 hover:bg-white md:flex-col md:items-center md:bg-transparent md:p-5 md:text-center lg:rounded-[24px] lg:px-4 lg:py-7">
                  <span className="relative shrink-0">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-award-gold-100 text-award-gold-700 ring-[5px] ring-white transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none lg:h-16 lg:w-16">
                      <Icon className="h-6 w-6 lg:h-7 lg:w-7" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <span className="absolute -end-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-award-green-700 font-latin text-[11px] font-bold text-white ring-2 ring-white">
                      {formatNumber(index + 1)}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-bold leading-snug text-award-ink md:mt-1">
                      {condition.title}
                    </span>
                    <span className="mt-1.5 block text-[13px] leading-relaxed text-award-body sm:text-sm">
                      {condition.description}
                    </span>
                  </span>
                </div>
              </motion.li>
            );
          })}
        </ol>

        <div className="mt-10 flex justify-center">
          <Link to={awardRoutes.eligibility} className={`group ${awardButton.primary}`}>
            {eligibility.cta}
            <ArrowIcon
              className={`h-[18px] w-[18px] transition-transform duration-300 ${
                isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
              }`}
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
