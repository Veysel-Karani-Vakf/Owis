import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { applySteps, fillTemplate, type AwardFormContent } from '@/data/award/form';
import { useI18n } from '@/i18n/useI18n';

type ApplyProgressProps = {
  current: number;
  content: AwardFormContent;
  onSelect: (index: number) => void;
};

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Step indicator: numbered stops on a line that fills in red (tablet/desktop),
 * a compact "step x of 4" bar on phones. Stops are buttons; moving forward
 * through them still validates the steps in between.
 */
export default function ApplyProgress({ current, content, onSelect }: ApplyProgressProps) {
  const { isRtl } = useI18n();
  const reduceMotion = useReducedMotion();
  const total = applySteps.length;
  const fill = current / (total - 1);
  const duration = reduceMotion ? 0 : 0.5;

  return (
    <nav aria-label={content.progress.navLabel}>
      {/* Phones */}
      <div className="md:hidden">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[13px] font-bold text-primary-700">
            {fillTemplate(content.progress.stepOf, { current: current + 1, total })}
          </p>
          <p className="truncate text-[13px] font-semibold text-dark-500">{content.steps[applySteps[current]].label}</p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-dark-100" aria-hidden="true">
          <motion.div
            className="h-full rounded-full bg-primary-500 ltr:origin-left rtl:origin-right"
            initial={false}
            animate={{ scaleX: (current + 1) / total }}
            transition={{ duration, ease }}
          />
        </div>
        <ol className="mt-3 flex items-center justify-between">
          {applySteps.map((step, index) => (
            <li key={step}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={index === current ? 'step' : undefined}
                aria-label={`${index + 1}. ${content.steps[step].label}${index < current ? ` (${content.progress.done})` : ''}`}
                className={`flex h-9 w-9 items-center justify-center rounded-full font-latin text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                  index < current
                    ? 'bg-primary-500 text-white'
                    : index === current
                      ? 'bg-white text-primary-700 ring-2 ring-primary-500'
                      : 'bg-warm text-dark-400 ring-1 ring-dark-100'
                }`}
              >
                {index < current ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> : index + 1}
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* Tablet and desktop */}
      <div className="relative hidden md:block">
        <div className="absolute inset-x-[12.5%] top-[22px] h-0.5 rounded-full bg-dark-100" aria-hidden="true">
          <motion.div
            className="h-full rounded-full bg-primary-500"
            style={{ originX: isRtl ? 1 : 0 }}
            initial={false}
            animate={{ scaleX: fill }}
            transition={{ duration, ease }}
          />
        </div>
        <ol className="relative grid grid-cols-4">
          {applySteps.map((step, index) => {
            const done = index < current;
            const active = index === current;
            return (
              <li key={step} className="flex flex-col items-center text-center">
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  aria-current={active ? 'step' : undefined}
                  aria-label={`${index + 1}. ${content.steps[step].label}${done ? ` (${content.progress.done})` : ''}`}
                  className="group flex flex-col items-center gap-2.5 rounded-2xl px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  <motion.span
                    aria-hidden="true"
                    className="relative flex h-11 w-11 items-center justify-center rounded-full font-latin text-base font-bold ring-[6px] ring-white"
                    initial={false}
                    animate={{
                      backgroundColor: done || active ? '#da0812' : '#f7f5f5',
                      color: done || active ? '#ffffff' : '#888888',
                      scale: active ? 1.08 : 1,
                    }}
                    transition={{ duration: reduceMotion ? 0 : 0.35, ease }}
                  >
                    {done ? <Check className="h-5 w-5" strokeWidth={3} /> : index + 1}
                    {active && !reduceMotion && (
                      <motion.span
                        className="absolute inset-0 rounded-full ring-2 ring-primary-300"
                        initial={{ opacity: 0.8, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.45 }}
                        transition={{ duration: 1.4, repeat: 2, ease: 'easeOut' }}
                      />
                    )}
                  </motion.span>
                  <span
                    className={`text-[13px] font-bold transition-colors lg:text-sm ${
                      active ? 'text-dark-900' : done ? 'text-primary-700' : 'text-dark-400 group-hover:text-dark-600'
                    }`}
                  >
                    {content.steps[step].label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
