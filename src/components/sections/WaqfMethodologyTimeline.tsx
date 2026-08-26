import { motion, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from 'framer-motion';
import { Handshake, PieChart, TrendingUp, UserCheck, Users, type LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { resolveIcon } from '@/lib/icons';

type WaqfMethodologyTimelineProps = {
  eyebrow: string;
  title: string;
  description: string;
  stepLabel: string;
  itemTitles: string[];
  items: string[];
};

// Position-based defaults, cycled when the editor adds more steps than there are icons.
const stepIcons: LucideIcon[] = [Users, UserCheck, TrendingUp, PieChart, Handshake];
const smoothEase = [0.22, 1, 0.36, 1] as const;

const cardVariants = (fromStart: boolean, reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: fromStart ? -28 : 28, y: 12 },
  show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: smoothEase } },
});

const nodeVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 320, damping: 22, delay: 0.08 } },
});

export default function WaqfMethodologyTimeline({
  eyebrow,
  title,
  description,
  stepLabel,
  itemTitles,
  items,
}: WaqfMethodologyTimelineProps) {
  const { isRtl } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  // Titles and descriptions are two parallel lists edited separately; zip them
  // by the longer length so a mismatch shows a partial step instead of dropping it.
  const steps = useMemo(() => {
    const titles = itemTitles ?? [];
    const bodies = items ?? [];
    const length = Math.max(titles.length, bodies.length);
    return Array.from({ length }, (_, index) => ({
      title: titles[index] ?? '',
      body: bodies[index] ?? '',
    }));
  }, [itemTitles, items]);
  const stepCount = steps.length;

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 0.85', 'end 0.6'],
  });
  const lineProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const lineScale = useTransform(lineProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      const next = Math.min(stepCount - 1, Math.max(0, Math.round(value * (stepCount - 1))));
      setActiveStep(next);
    });
    return () => unsubscribe();
  }, [scrollYProgress, stepCount]);

  const progressPercent = stepCount > 1 ? (activeStep / (stepCount - 1)) * 100 : 100;

  return (
    <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
      <div className="lg:sticky lg:top-36 lg:self-start lg:pt-2">
        <div className="text-start">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary-600" />
            <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>
          </div>
          <h2 className="text-balance text-3xl font-bold leading-tight text-dark-900 md:text-4xl">{title}</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-dark-500 md:text-base">{description}</p>
        </div>

        <div className="mt-6 hidden rounded-2xl border border-primary-100 bg-white p-4 shadow-[0_12px_30px_rgba(35,15,20,0.05)] lg:block">
          <div className="flex items-center justify-between text-xs font-semibold text-dark-500">
            <span>
              {stepLabel} <span dir="ltr">{String(activeStep + 1).padStart(2, '0')}</span>
            </span>
            <span dir="ltr" className="tabular-nums text-dark-400">
              {String(activeStep + 1).padStart(2, '0')} / {String(stepCount).padStart(2, '0')}
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary-50">
            <motion.div
              className="h-full rounded-full bg-primary-600"
              initial={false}
              animate={{ width: `${progressPercent}%` }}
              transition={shouldReduceMotion ? { duration: 0.01 } : { duration: 0.45, ease: smoothEase }}
            />
          </div>
          <motion.p
            key={activeStep}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: smoothEase }}
            className="mt-2.5 text-sm font-bold text-dark-900"
          >
            {steps[activeStep]?.title ?? ''}
          </motion.p>
        </div>
      </div>

      <ol ref={listRef} className="relative space-y-3 ps-11 md:ps-14">
        <div
          aria-hidden="true"
          className="absolute bottom-4 top-4 start-[1.1rem] w-px bg-primary-100 md:start-[1.35rem]"
        />
        <motion.div
          aria-hidden="true"
          style={{ scaleY: shouldReduceMotion ? 1 : lineScale, transformOrigin: 'top' }}
          className="absolute bottom-4 top-4 start-[1.1rem] w-px bg-gradient-to-b from-primary-600 via-primary-500 to-primary-300 md:start-[1.35rem]"
        />

        {steps.map((step, index) => {
          const Icon = resolveIcon(undefined, stepIcons, index);
          const isActive = index === activeStep;

          return (
            <motion.li
              key={`${step.title}-${index}`}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              className="relative"
            >
              <motion.span
                variants={nodeVariants(!!shouldReduceMotion)}
                className={`absolute -start-11 top-4 flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors duration-300 md:-start-14 md:h-11 md:w-11 md:text-sm ${
                  isActive
                    ? 'border-primary-600 bg-primary-600 text-white shadow-[0_10px_26px_rgba(156,16,6,0.32)]'
                    : 'border-primary-100 bg-white text-primary-700'
                }`}
              >
                {String(index + 1).padStart(2, '0')}
                {isActive && !shouldReduceMotion && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary-400/40"
                    style={{ animationDuration: '1.8s' }}
                  />
                )}
              </motion.span>

              <motion.article
                variants={cardVariants(!isRtl, !!shouldReduceMotion)}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.3, ease: smoothEase }}
                className={`group relative overflow-hidden rounded-2xl border bg-white p-4 text-start shadow-[0_12px_30px_rgba(35,15,20,0.05)] transition-[border-color,box-shadow] duration-300 md:px-5 md:py-4 ${
                  isActive
                    ? 'border-primary-200 shadow-[0_22px_48px_rgba(35,15,20,0.1)]'
                    : 'border-primary-100 hover:border-primary-200'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 start-0 w-1 bg-primary-600 transition-transform duration-500 ${
                    isActive ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'
                  }`}
                  style={{ transformOrigin: 'top' }}
                />
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700 transition-colors duration-300 group-hover:bg-primary-100">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-dark-900">{step.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-dark-600 md:text-sm">{step.body}</p>
                  </div>
                </div>
              </motion.article>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
