import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef, type CSSProperties } from 'react';
import { awardSectionIds, type AwardContent } from '@/data/award/content';
import { useI18n } from '@/i18n/useI18n';
import AwardSectionHeading from './AwardSectionHeading';
import { stepIcon } from './awardIcons';
import { awardEase } from './awardUi';

type AwardStepsProps = {
  content: AwardContent;
};

/** Seconds between two steps lighting up as the timeline plays. */
const STEP_GAP = 0.55;

// Step circle colours: neutral (warm / dark-400) until lit, then the official red.
const IDLE = { backgroundColor: '#f7f5f5', color: '#888888' };
const LIT = { backgroundColor: '#da0812', color: '#ffffff' };

/**
 * Section E — four connected steps. When the timeline scrolls into view the
 * steps light up one after another in red and the connector fills towards the
 * next one (horizontal on tablets/desktop, vertical on phones).
 */
export default function AwardSteps({ content }: AwardStepsProps) {
  const { steps } = content;
  const { formatNumber, isRtl } = useI18n();
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const inView = useInView(listRef, { once: true, amount: 0.35 });
  const lit = Boolean(reduceMotion) || inView;
  const delayFor = (index: number) => (reduceMotion ? 0 : index * STEP_GAP);

  return (
    <section
      id={awardSectionIds.steps}
      tabIndex={-1}
      aria-labelledby="award-steps-title"
      className="relative bg-white py-20 focus:outline-none md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <AwardSectionHeading
          id="award-steps-title"
          title={steps.title}
          highlight={steps.highlight}
          description={steps.description}
        />

        {/* One column per step from md up; the dashboard decides how many steps there are. */}
        <ol
          ref={listRef}
          className="mt-14 grid gap-0 md:mt-16 md:grid-cols-[repeat(var(--award-steps),minmax(0,1fr))]"
          style={{ '--award-steps': String(Math.max(steps.items.length, 1)) } as CSSProperties}
        >
          {steps.items.map((step, index) => {
            const Icon = stepIcon(step.id);
            const isLast = index === steps.items.length - 1;

            return (
              <li
                key={`${step.id}-${index}`}
                className="relative flex gap-5 pb-10 last:pb-0 md:flex-col md:items-center md:gap-0 md:px-3 md:pb-0 md:text-center"
              >
                {/* Connector to the next step: vertical on phones, horizontal from md. */}
                {!isLast && (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1 start-[27px] top-[3.75rem] w-0.5 rounded-full bg-dark-100 md:hidden"
                    >
                      <motion.span
                        className="absolute inset-0 rounded-full bg-gradient-to-b from-primary-500 to-primary-300"
                        style={{ originY: 0 }}
                        initial={reduceMotion ? false : { scaleY: 0 }}
                        animate={lit ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ duration: 0.5, delay: delayFor(index) + 0.2, ease: awardEase }}
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute top-[27px] hidden h-0.5 rounded-full bg-dark-100 md:block md:start-[calc(50%+2.25rem)] md:end-[calc(2.25rem-50%)]"
                    >
                      <motion.span
                        className="absolute inset-0 rounded-full from-primary-500 to-primary-300 ltr:bg-gradient-to-r rtl:bg-gradient-to-l"
                        style={{ originX: isRtl ? 1 : 0 }}
                        initial={reduceMotion ? false : { scaleX: 0 }}
                        animate={lit ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 0.5, delay: delayFor(index) + 0.2, ease: awardEase }}
                      />
                    </span>
                  </>
                )}

                <motion.span
                  aria-hidden="true"
                  className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-latin text-lg font-bold ring-[6px] ring-white"
                  initial={reduceMotion ? false : { scale: 0.7, ...IDLE }}
                  animate={lit ? { scale: 1, ...LIT } : { scale: 0.7, ...IDLE }}
                  transition={{ duration: 0.5, delay: delayFor(index), ease: awardEase }}
                >
                  {formatNumber(index + 1)}
                </motion.span>

                <motion.div
                  className="min-w-0 pt-1.5 md:mt-5 md:pt-0"
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={lit ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                  transition={{ duration: 0.55, delay: delayFor(index) + 0.1, ease: awardEase }}
                >
                  <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary-700 ring-1 ring-primary-100">
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                    {steps.stepLabel} {formatNumber(index + 1)}
                  </span>
                  <h3 className="text-base font-bold leading-snug text-dark-900 sm:text-[17px]">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-dark-600 md:mx-auto md:max-w-[15rem]">
                    {step.description}
                  </p>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
