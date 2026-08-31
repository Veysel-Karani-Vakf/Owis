import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';
import { Award, Compass, GraduationCap, Rocket, UserSearch, type LucideIcon } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ProgramJourneyStep } from '@/data/programs';
import { useI18n } from '@/i18n/useI18n';
import { resolveIcon } from '@/lib/icons';

type PioneerJourneyProps = {
  eyebrow: string;
  title: string;
  description: string;
  stepLabel: string;
  steps: ProgramJourneyStep[];
  /** One continuous canvas: soft tinted steps instead of bordered, shadowed cards. */
  seamless?: boolean;
};

const stepIcons: LucideIcon[] = [UserSearch, GraduationCap, Compass, Rocket, Award];
const smoothEase = [0.22, 1, 0.36, 1] as const;

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}

function StepHeading({
  eyebrow,
  title,
  description,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? 'max-w-2xl text-start' : 'max-w-xl text-start'}>
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-primary-600" />
        <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>
      </div>
      <h2 className="text-balance text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{title}</h2>
      <p className="mt-4 text-sm leading-relaxed text-dark-600 md:text-base">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  index,
  total,
  active,
  stepLabel,
  reduced,
  pinned,
  seamless,
}: {
  step: ProgramJourneyStep;
  index: number;
  total: number;
  active: boolean;
  stepLabel: string;
  reduced: boolean;
  pinned: boolean;
  seamless: boolean;
}) {
  // The editor's icon wins; otherwise the position-based default keeps the original look.
  const Icon = resolveIcon(step.icon, stepIcons, index);
  const isLast = index === total - 1;
  const stepTone = seamless
    ? isLast
      ? 'border-transparent bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white'
      : active
        ? 'border-transparent bg-primary-50/75'
        : 'border-transparent bg-primary-50/45'
    : isLast
      ? 'border-primary-700 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white shadow-[0_28px_70px_rgba(156,16,6,0.32)]'
      : active
        ? 'border-primary-200 bg-white shadow-[0_28px_70px_rgba(40,12,18,0.14)]'
        : 'border-primary-100 bg-white shadow-[0_18px_48px_rgba(40,12,18,0.07)]';

  return (
    <motion.article
      animate={pinned && !reduced ? { scale: active ? 1 : 0.94, opacity: active ? 1 : 0.72, y: active ? 0 : 10 } : undefined}
      transition={{ duration: 0.45, ease: smoothEase }}
      className={`relative flex h-full flex-col rounded-[28px] border p-6 text-start transition-colors duration-500 md:p-7 ${stepTone}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
            isLast ? 'bg-white/15 text-white' : seamless ? 'bg-white text-primary-700' : 'bg-primary-50 text-primary-700'
          }`}
        >
          {stepLabel}
          <span dir="ltr" className="tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
        </span>
        <span
          className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${
            isLast ? 'bg-white text-primary-700' : 'bg-primary-600 text-white shadow-[0_12px_26px_rgba(195,7,16,0.3)]'
          }`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
          {active && !reduced && (
            <span
              aria-hidden="true"
              className={`absolute inset-0 -z-10 animate-ping rounded-2xl ${isLast ? 'bg-white/40' : 'bg-primary-400/40'}`}
              style={{ animationDuration: '1.8s' }}
            />
          )}
        </span>
      </div>

      <span
        aria-hidden="true"
        className={`mt-6 block select-none text-6xl font-black leading-none tabular-nums ${
          isLast ? 'text-white/20' : seamless ? 'text-primary-200/60' : 'text-primary-50'
        }`}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className={`mt-3 text-xl font-bold md:text-2xl ${isLast ? 'text-white' : 'text-dark-950'}`}>{step.title}</h3>
      <p className={`mb-6 mt-3 text-sm leading-relaxed md:text-[15px] ${isLast ? 'text-white/85' : 'text-dark-600'}`}>
        {step.description}
      </p>

      <span
        aria-hidden="true"
        className={`mt-auto block h-1 rounded-full transition-[width] duration-700 ${
          isLast ? 'bg-white/70' : 'bg-primary-600'
        } ${active ? 'w-full' : 'w-12'}`}
      />
    </motion.article>
  );
}

function VerticalJourney({ eyebrow, title, description, stepLabel, steps, seamless = false }: PioneerJourneyProps) {
  const shouldReduceMotion = !!useReducedMotion();

  const itemVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: smoothEase } },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <StepHeading eyebrow={eyebrow} title={title} description={description} compact />
      <ol className="relative mt-10 space-y-5 ps-8">
        <span aria-hidden="true" className="absolute bottom-6 start-[0.45rem] top-6 w-px bg-primary-100" />
        {steps.map((step, index) => (
          <motion.li
            key={step.id}
            variants={itemVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            <span
              aria-hidden="true"
              className="absolute -start-8 top-7 h-4 w-4 rounded-full border-4 border-white bg-primary-600 shadow-[0_0_0_3px_rgba(255,225,228,1)]"
            />
            <StepCard
              step={step}
              index={index}
              total={steps.length}
              active
              stepLabel={stepLabel}
              reduced={shouldReduceMotion}
              pinned={false}
              seamless={seamless}
            />
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function HorizontalJourney({ eyebrow, title, description, stepLabel, steps, seamless = false }: PioneerJourneyProps) {
  const { isRtl } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [maxShift, setMaxShift] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.5 });
  const x = useTransform(progress, [0, 1], [0, isRtl ? maxShift : -maxShift]);
  const lineScale = useTransform(progress, [0, 1], [0.06, 1]);

  useLayoutEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;
      setMaxShift(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [steps.length]);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.round(value * (steps.length - 1))));
    setActiveStep((current) => (current === next ? current : next));
  });

  const sectionHeight = `${Math.max(220, steps.length * 65)}vh`;

  return (
    <div ref={sectionRef} style={{ height: sectionHeight }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <StepHeading eyebrow={eyebrow} title={title} description={description} />

            <div
              className={`min-w-[220px] rounded-2xl p-4 text-start ${
                seamless ? 'bg-primary-50/50' : 'border border-primary-100 bg-white shadow-[0_12px_30px_rgba(35,15,20,0.05)]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-dark-500">
                <span>
                  {stepLabel}{' '}
                  <span dir="ltr" className="tabular-nums">
                    {String(activeStep + 1).padStart(2, '0')}
                  </span>
                </span>
                <span dir="ltr" className="tabular-nums text-dark-400">
                  {String(activeStep + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary-50">
                <motion.div
                  className="h-full rounded-full bg-primary-600"
                  style={{ scaleX: lineScale, transformOrigin: isRtl ? 'right' : 'left' }}
                />
              </div>
              <motion.p
                key={activeStep}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: smoothEase }}
                className="mt-2.5 text-sm font-bold text-dark-900"
              >
                {steps[activeStep]?.title ?? ''}
              </motion.p>
            </div>
          </div>
        </div>

        <div ref={viewportRef} className="relative mt-10 w-full overflow-hidden">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute start-0 top-1/2 z-0 h-px w-full -translate-y-1/2 bg-primary-100"
          />
          <motion.span
            aria-hidden="true"
            style={{ scaleX: lineScale, transformOrigin: isRtl ? 'right' : 'left' }}
            className="pointer-events-none absolute start-0 top-1/2 z-0 h-px w-full -translate-y-1/2 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-300 rtl:bg-gradient-to-l"
          />
          <motion.ol
            ref={trackRef}
            style={{ x }}
            className="relative z-10 flex w-max items-stretch gap-6 px-[max(1rem,calc((100vw-80rem)/2+1rem))] py-6 md:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
          >
            {steps.map((step, index) => (
              <li key={step.id} className="w-[min(78vw,24rem)] shrink-0 md:w-[24rem]">
                <StepCard
                  step={step}
                  index={index}
                  total={steps.length}
                  active={index === activeStep}
                  stepLabel={stepLabel}
                  reduced={false}
                  pinned
                  seamless={seamless}
                />
              </li>
            ))}
            <li aria-hidden="true" className="w-[10vw] shrink-0" />
          </motion.ol>
        </div>
      </div>
    </div>
  );
}

export default function PioneerJourney(props: PioneerJourneyProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px) and (min-height: 640px)');
  const pinned = isDesktop && !shouldReduceMotion;

  if (!props.steps?.length) return null;

  return pinned ? <HorizontalJourney {...props} /> : <VerticalJourney {...props} />;
}
