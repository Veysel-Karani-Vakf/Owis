import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { awardSectionIds, type AwardContent } from '@/data/award/content';
import { awardRoutes } from '@/data/award/routes';
import { useI18n } from '@/i18n/useI18n';
import { useNarrowScreen } from '@/hooks/useResponsiveMotion';
import AwardHighlands from './AwardHighlands';
import AwardSectionHeading from './AwardSectionHeading';
import { conditionIcon } from './awardIcons';
import { awardButton, awardEase } from './awardUi';

type AwardEligibilityOverviewProps = {
  content: AwardContent;
};

/** Section D — the page's dark band: the five conditions on a white panel over a Yemeni highland at dusk. */
export default function AwardEligibilityOverview({ content }: AwardEligibilityOverviewProps) {
  const { eligibility } = content;
  const { isRtl, formatNumber } = useI18n();
  const reduceMotion = useReducedMotion();
  const isNarrow = useNarrowScreen();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  // The built-in five sit in one row on desktop; any other number (the dashboard
  // can add or remove conditions) flows in centred rows.
  const fixed = eligibility.items.length === 5;

  return (
    <section
      id={awardSectionIds.eligibility}
      tabIndex={-1}
      aria-labelledby="award-eligibility-title"
      className="relative isolate overflow-hidden bg-dark-950 py-20 focus:outline-none md:py-28"
    >
      {/* The landscape sits between the heading and the conditions panel; its edges fade into the section colour. */}
      <div className="absolute inset-x-0 top-28 -z-10 h-[440px] sm:top-24 sm:h-[480px] lg:top-6 lg:h-[560px]">
        <AwardHighlands className="h-full w-full" />
      </div>
      <div aria-hidden="true" className="geometric-pattern absolute inset-0 -z-10 opacity-20" />

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <AwardSectionHeading
          id="award-eligibility-title"
          title={eligibility.title}
          highlight={eligibility.highlight}
          description={eligibility.description}
          tone="dark"
        />

        <ol
          className={`mx-auto mt-[11rem] max-w-6xl gap-3 rounded-[30px] bg-white p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:mt-[13rem] sm:p-4 lg:mt-52 lg:p-2 ${
            fixed ? 'grid md:grid-cols-6 lg:grid-cols-5 lg:gap-0' : 'flex flex-wrap justify-center lg:gap-2'
          }`}
        >
          {eligibility.items.map((condition, index) => {
            const Icon = conditionIcon(condition.id);
            const placement = fixed
              ? [
                  'md:col-span-2 lg:col-span-1',
                  index === 3 ? 'md:col-start-2 lg:col-start-auto' : '',
                  index > 0 ? 'lg:border-s lg:border-dark-100' : '',
                ].join(' ')
              : 'basis-full md:basis-[calc(33.333%-0.5rem)] lg:basis-[calc(20%-0.4rem)]';

            return (
              <motion.li
                key={`${condition.id}-${index}`}
                className={placement}
                initial={reduceMotion ? false : { opacity: 0, y: isNarrow ? 12 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: reduceMotion ? 0 : index * 0.09, ease: awardEase }}
              >
                <div className="group flex h-full items-start gap-4 rounded-[22px] bg-warm p-4 text-start transition-colors duration-300 md:flex-col md:items-center md:bg-transparent md:p-5 md:text-center md:hover:bg-warm lg:rounded-[24px] lg:px-4 lg:py-7">
                  <span className="relative shrink-0">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-dark-800 ring-1 ring-dark-100 transition-[transform,background-color,color] duration-500 group-hover:scale-105 group-hover:bg-primary-500 group-hover:text-white group-hover:ring-primary-500 motion-reduce:transition-none md:bg-warm lg:h-16 lg:w-16">
                      <Icon className="h-6 w-6 lg:h-7 lg:w-7" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <span className="absolute -end-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 font-latin text-[11px] font-bold text-white ring-2 ring-white">
                      {formatNumber(index + 1)}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-bold leading-snug text-dark-900 md:mt-1">
                      {condition.title}
                    </span>
                    <span className="mt-1.5 block text-[13px] leading-relaxed text-dark-600 sm:text-sm">
                      {condition.description}
                    </span>
                  </span>
                </div>
              </motion.li>
            );
          })}
        </ol>

        <div className="mt-10 flex justify-center">
          <Link to={awardRoutes.apply} className={awardButton.primaryOnDark}>
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
