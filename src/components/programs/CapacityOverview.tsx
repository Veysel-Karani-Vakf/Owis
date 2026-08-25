import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from 'framer-motion';
import { Building2, CalendarRange, ExternalLink, Landmark, MapPin, Users, type LucideIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { Program, ProgramSection, ProgramStatistic } from '@/data/programs';
import { useI18n } from '@/i18n/useI18n';

type CapacityOverviewProps = {
  program: Program;
  /** Section that opens the capacity story; falls back to the program's first section. */
  intro?: ProgramSection;
  labels: {
    overview: string;
    statsEyebrow: string;
    officialSource: string;
    phaseEyebrow: string;
  };
};

const smoothEase = [0.22, 1, 0.36, 1] as const;
const statIcons: LucideIcon[] = [Users, Building2, MapPin, Landmark];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const itemVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: smoothEase } },
});

const statGridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const growX = (reduced: boolean, delay = 0): Variants => ({
  hidden: reduced ? { scaleX: 1 } : { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: reduced ? 0.01 : 1.1, ease: smoothEase, delay: reduced ? 0 : delay } },
});

const growY = (reduced: boolean): Variants => ({
  hidden: reduced ? { scaleY: 1 } : { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: reduced ? 0.01 : 0.8, ease: smoothEase, delay: reduced ? 0 : 0.2 } },
});

const statVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 34, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: reduced ? { duration: 0.01 } : { type: 'spring', stiffness: 230, damping: 24, mass: 0.9 },
  },
});

function parseStatValue(value: string) {
  const match = value.match(/\d+/);
  if (!match) return null;
  const index = match.index ?? 0;
  return {
    number: Number(match[0]),
    prefix: value.slice(0, index),
    suffix: value.slice(index + match[0].length),
  };
}

function CountUp({ value, reduced }: { value: string; reduced: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const parsed = parseStatValue(value);
  const motionValue = useMotionValue(reduced || !parsed ? parsed?.number ?? 0 : 0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest).toLocaleString('en-US'));

  useEffect(() => {
    if (!inView || !parsed || reduced) return;
    const controls = animate(motionValue, parsed.number, { duration: 1.6, ease: smoothEase, delay: 0.2 });
    return () => controls.stop();
  }, [inView, parsed, reduced, motionValue]);

  if (!parsed) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref} dir="ltr" className="inline-flex items-baseline tabular-nums">
      {parsed.prefix}
      <motion.span>{rounded}</motion.span>
      {parsed.suffix}
    </span>
  );
}

function StatCell({ stat, index, reduced }: { stat: ProgramStatistic; index: number; reduced: boolean }) {
  const Icon = statIcons[index % statIcons.length];

  return (
    <motion.li
      variants={statVariants(reduced)}
      className="group relative flex flex-col justify-between gap-6 border-primary-100 p-6 text-start transition-colors duration-300 first:border-t-0 hover:bg-primary-50/50 md:p-7 [&:nth-child(n+2)]:border-t sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(odd)]:border-e"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-primary-100 transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-[0_12px_26px_rgba(195,7,16,0.3)]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span dir="ltr" className="text-xs font-bold tabular-nums text-primary-300">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div>
        <p className="text-4xl font-black leading-none text-dark-950 md:text-[2.75rem]">
          <CountUp value={stat.value} reduced={reduced} />
        </p>
        <p className="mt-2.5 text-sm font-bold text-dark-600">{stat.label}</p>
        <span aria-hidden="true" className="mt-4 block h-1 w-full overflow-hidden rounded-full bg-primary-50">
          <motion.span
            variants={growX(reduced, 0.25 + index * 0.1)}
            className="block h-full w-1/2 origin-left rounded-full bg-gradient-to-r from-primary-600 to-primary-400 transition-[width] duration-500 group-hover:w-full rtl:origin-right"
          />
        </span>
      </div>
    </motion.li>
  );
}

export default function CapacityOverview({ program, intro: introProp, labels }: CapacityOverviewProps) {
  const { isRtl } = useI18n();
  const reduced = !!useReducedMotion();
  const intro = introProp ?? program.sections[0];
  const lead = intro?.paragraphs?.[0];
  const stats = program.statistics ?? [];
  const phase = program.phase;

  return (
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="text-start"
      >
        <motion.div variants={itemVariants(reduced)} className="mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary-600" />
          <span className="text-sm font-semibold text-primary-700">{labels.overview}</span>
        </motion.div>

        <motion.h2
          variants={itemVariants(reduced)}
          className="text-balance text-3xl font-bold leading-tight text-dark-950 md:text-4xl lg:text-[2.6rem]"
        >
          {intro?.title ?? program.title}
        </motion.h2>

        {lead && (
          <motion.p
            variants={itemVariants(reduced)}
            className="mt-5 text-base leading-relaxed text-dark-700 md:text-lg"
          >
            {lead}
          </motion.p>
        )}

        {phase && (
          <motion.div
            variants={itemVariants(reduced)}
            className="relative mt-7 overflow-hidden rounded-[22px] border border-primary-100 bg-[#faf8f8] p-5 md:p-6"
          >
            <motion.span
              aria-hidden="true"
              variants={growY(reduced)}
              className="absolute inset-y-0 start-0 w-1.5 origin-top bg-gradient-to-b from-primary-600 to-primary-300"
            />
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_10px_22px_rgba(195,7,16,0.28)]">
                <span className="relative flex h-2 w-2">
                  {!reduced && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
                  )}
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                {phase.label}
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-dark-800">
                <CalendarRange className="h-4 w-4 text-primary-600" aria-hidden="true" />
                <span>{phase.period}</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-dark-600 md:text-[15px]">{phase.description}</p>
          </motion.div>
        )}

        <motion.div variants={itemVariants(reduced)} className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={program.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-200 bg-white px-5 py-2.5 text-sm font-bold text-primary-700 transition-all hover:-translate-y-0.5 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
          >
            {labels.officialSource}
            <ExternalLink
              className={`h-4 w-4 transition-transform ${isRtl ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'} group-hover:-translate-y-0.5`}
              aria-hidden="true"
            />
          </a>
        </motion.div>
      </motion.div>

      {stats.length > 0 && (
        <div className="relative">
          {!reduced && (
            <motion.svg
              aria-hidden="true"
              viewBox="0 0 400 400"
              animate={{ rotate: 360 }}
              transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
              className="pointer-events-none absolute -end-12 -top-12 -z-10 h-48 w-48 text-primary-100 md:-end-16 md:-top-16 md:h-64 md:w-64"
            >
              <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 14" />
            </motion.svg>
          )}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -start-10 -z-10 h-44 w-44 rounded-full bg-primary-100/60 blur-3xl"
          />

          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: smoothEase }}
            className="relative overflow-hidden rounded-[28px] border border-primary-100 bg-white shadow-[0_24px_60px_rgba(40,12,18,0.1)]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-primary-100 bg-[#faf8f8] px-6 py-4 text-start md:px-7">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  {!reduced && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400/70" />}
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-600" />
                </span>
                <span className="text-sm font-bold text-dark-900">{labels.statsEyebrow}</span>
              </div>
              {phase && (
                <span className="hidden text-xs font-bold text-dark-500 sm:inline">{phase.period}</span>
              )}
            </div>

            <motion.ul
              variants={statGridVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2"
            >
              {stats.map((stat, index) => (
                <StatCell key={`${stat.value}-${stat.label}`} stat={stat} index={index} reduced={reduced} />
              ))}
            </motion.ul>
          </motion.div>
        </div>
      )}
    </div>
  );
}
