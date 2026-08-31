import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { CheckCircle2, Compass, GraduationCap, HeartHandshake, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ProgramPillar } from '@/data/programs';
import { resolveIcon } from '@/lib/icons';

type PioneerPillarsProps = {
  eyebrow: string;
  title: string;
  description: string;
  pillars: ProgramPillar[];
  autoRotateMs?: number;
  /** One continuous canvas: the panel and tabs sit on the page instead of boxed cards. */
  seamless?: boolean;
};

const pillarIcons: LucideIcon[] = [GraduationCap, Compass, HeartHandshake];
const smoothEase = [0.22, 1, 0.36, 1] as const;

const panelVariants: Variants = {
  hidden: (direction: number) => ({ opacity: 0, x: 24 * direction, filter: 'blur(6px)' }),
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: smoothEase } },
  exit: (direction: number) => ({
    opacity: 0,
    x: -18 * direction,
    filter: 'blur(4px)',
    transition: { duration: 0.22, ease: smoothEase },
  }),
};

const listVariants: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.12, staggerChildren: 0.08 } },
};

const pointVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: smoothEase } },
};

export default function PioneerPillars({
  eyebrow,
  title,
  description,
  pillars,
  autoRotateMs = 6500,
  seamless = false,
}: PioneerPillarsProps) {
  const shouldReduceMotion = !!useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [cycle, setCycle] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const active = pillars[activeIndex] ?? pillars[0];
  const ActiveIcon = resolveIcon(active?.icon, pillarIcons, activeIndex);
  const rotating = !shouldReduceMotion && !paused && inView && autoRotateMs > 0 && pillars.length > 1;

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => {
      setDirection(1);
      setActiveIndex((current) => (current + 1) % pillars.length);
      setCycle((value) => value + 1);
    }, autoRotateMs);
    return () => window.clearTimeout(timer);
  }, [rotating, activeIndex, autoRotateMs, pillars.length, cycle]);

  const goTo = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setCycle((value) => value + 1);
  };

  if (!pillars.length || !active) return null;

  return (
    <div
      ref={sectionRef}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14"
    >
      <div className="text-start">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary-600" />
          <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>
        </div>
        <h2 className="text-balance text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{title}</h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-dark-600 md:text-base">{description}</p>

        <div role="tablist" aria-orientation="vertical" aria-label={title} className="mt-8 grid gap-3">
          {pillars.map((pillar, index) => {
            const Icon = resolveIcon(pillar.icon, pillarIcons, index);
            const isActive = index === activeIndex;

            return (
              <button
                key={pillar.id}
                type="button"
                role="tab"
                id={`pillar-tab-${pillar.id}`}
                aria-selected={isActive}
                aria-controls={`pillar-panel-${pillar.id}`}
                onClick={() => goTo(index)}
                className={`group relative isolate flex min-h-[4.25rem] w-full items-center gap-4 overflow-hidden rounded-2xl border px-4 py-3 text-start transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 ${
                  seamless
                    ? isActive
                      ? 'border-transparent text-dark-950'
                      : 'border-transparent bg-primary-50/40 text-dark-700 hover:bg-primary-50'
                    : isActive
                      ? 'border-primary-200 text-dark-950'
                      : 'border-primary-100 bg-white text-dark-700 hover:border-primary-200'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="pioneer-pillar-active"
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-2xl bg-primary-50"
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                )}
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                    isActive ? 'bg-primary-600 text-white shadow-[0_10px_22px_rgba(195,7,16,0.3)]' : 'bg-primary-50 text-primary-700 group-hover:bg-primary-100'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold">{pillar.title}</span>
                  <span className="mt-0.5 hidden text-xs text-dark-500 sm:line-clamp-1">{pillar.body}</span>
                </span>
                <span dir="ltr" className="text-xs font-bold tabular-nums text-primary-600">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {isActive && rotating && (
                  <motion.span
                    key={`progress-${cycle}`}
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: autoRotateMs / 1000, ease: 'linear' }}
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary-500 rtl:origin-right"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative min-h-[24rem]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={active.id}
            id={`pillar-panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`pillar-tab-${active.id}`}
            custom={direction}
            variants={shouldReduceMotion ? undefined : panelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className={
              seamless
                ? 'relative isolate flex h-full flex-col overflow-hidden rounded-[28px] p-2 text-start md:p-4'
                : 'relative isolate flex h-full flex-col overflow-hidden rounded-[28px] border border-primary-100 bg-white p-7 text-start shadow-[0_24px_64px_rgba(40,12,18,0.1)] md:p-9'
            }
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full bg-primary-50 blur-2xl"
            />

            <div className="relative flex items-center gap-5">
              <span className="relative flex h-20 w-20 items-center justify-center">
                {!shouldReduceMotion && (
                  <>
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-primary-200"
                      animate={{ scale: [1, 1.35], opacity: [0.7, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
                    />
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-primary-200"
                      animate={{ scale: [1, 1.35], opacity: [0.7, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
                    />
                  </>
                )}
                <motion.span
                  animate={shouldReduceMotion ? undefined : { y: [0, -5, 0], rotate: [0, -3, 0, 3, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-[0_16px_34px_rgba(156,16,6,0.32)]"
                >
                  <ActiveIcon className="h-7 w-7" aria-hidden="true" />
                </motion.span>
              </span>
              <div>
                <span dir="ltr" className="text-xs font-bold tabular-nums text-primary-600">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(pillars.length).padStart(2, '0')}
                </span>
                <h3 className="mt-1 text-2xl font-bold text-dark-950 md:text-3xl">{active.title}</h3>
              </div>
            </div>

            <p className="relative mt-6 text-base leading-relaxed text-dark-600 md:text-lg">{active.body}</p>

            <motion.ul
              variants={shouldReduceMotion ? undefined : listVariants}
              initial="hidden"
              animate="show"
              className="relative mt-6 grid gap-3"
            >
              {(active.points ?? []).map((point) => (
                <motion.li
                  key={point}
                  variants={shouldReduceMotion ? undefined : pointVariants}
                  className={`flex items-start gap-3 rounded-2xl bg-primary-50/60 px-4 py-3 ${
                    seamless ? '' : 'border border-primary-100'
                  }`}
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden="true" />
                  <span className="text-sm font-semibold leading-relaxed text-dark-700 md:text-[15px]">{point}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
