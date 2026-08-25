import { motion, useReducedMotion } from 'framer-motion';
import { Briefcase, HeartHandshake, TrendingUp, Users, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { useI18n } from '@/i18n/useI18n';

const icons: LucideIcon[] = [TrendingUp, Users, HeartHandshake, Briefcase];
const smoothEase = [0.22, 1, 0.36, 1] as const;
const AUTO_FLIP_MS = 3600;

type Indicator = { label: string; value: number | null; suffix: string; detail: string };

function FlipCard({
  indicator,
  index,
  flipped,
  inView,
  reduced,
  isRtl,
  unavailableLabel,
  formatNumber,
  onFlip,
  onUnflip,
}: {
  indicator: Indicator;
  index: number;
  flipped: boolean;
  inView: boolean;
  reduced: boolean;
  isRtl: boolean;
  unavailableLabel: string;
  formatNumber: (value: number) => string;
  onFlip: () => void;
  onUnflip: () => void;
}) {
  const Icon = icons[index % icons.length];
  const animated = useCountUp(indicator.value ?? 0, 2000, inView && indicator.value !== null);
  const valueText =
    indicator.value !== null ? `${formatNumber(animated)}${indicator.suffix}` : unavailableLabel;
  // Flip away from the reading direction so the motion feels natural in RTL too.
  const angle = isRtl ? -180 : 180;

  return (
    <motion.div
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: smoothEase, delay: index * 0.1 }}
      className="[perspective:1400px]"
    >
      <button
        type="button"
        aria-pressed={flipped}
        onPointerEnter={onFlip}
        onPointerLeave={onUnflip}
        onFocus={onFlip}
        onBlur={onUnflip}
        onClick={onFlip}
        className={`relative block h-full min-h-[15rem] w-full rounded-2xl text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 md:min-h-[16rem] ${
          reduced ? '' : 'transition-transform duration-700 [transform-style:preserve-3d]'
        }`}
        style={reduced ? undefined : { transform: flipped ? `rotateY(${angle}deg)` : 'rotateY(0deg)' }}
      >
        {/* Front */}
        <span
          className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-primary-100 bg-white p-5 shadow-sm [backface-visibility:hidden] md:p-6 ${
            reduced ? `transition-opacity duration-300 ${flipped ? 'opacity-0' : ''}` : ''
          }`}
        >
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            <Icon className="h-7 w-7" aria-hidden="true" />
          </span>
          <span className="mb-2 block text-3xl font-bold tabular-nums text-dark-900 md:text-4xl lg:text-5xl">
            {valueText}
          </span>
          <span className="block text-sm text-dark-500 md:text-base">{indicator.label}</span>
          <span
            aria-hidden="true"
            className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-l from-primary-400 to-gold-400 transition-transform duration-500 ${
              flipped ? 'scale-x-100' : 'scale-x-0'
            } ${isRtl ? 'origin-right' : 'origin-left'}`}
          />
          {/* Corner flip hint */}
          <span aria-hidden="true" className="absolute end-3 top-3 h-2 w-2 rounded-full bg-primary-200" />
        </span>

        {/* Back */}
        <span
          className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-primary-700 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 p-5 text-white shadow-[0_20px_50px_rgba(156,16,6,0.28)] [backface-visibility:hidden] md:p-6 ${
            reduced ? `transition-opacity duration-300 ${flipped ? '' : 'opacity-0'}` : ''
          }`}
          style={reduced ? undefined : { transform: `rotateY(${angle}deg)` }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -end-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-xl"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -start-10 h-32 w-32 rounded-full border border-dashed border-white/25"
          />
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary-700 shadow-lg">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="block text-xl font-bold tabular-nums md:text-2xl">{valueText}</span>
          <span className="mt-1 block text-sm font-bold leading-snug">{indicator.label}</span>
          <span className="mt-3 block max-w-[16rem] text-xs leading-relaxed text-white/85 md:text-sm">
            {indicator.detail}
          </span>
        </span>
      </button>
    </motion.div>
  );
}

export default function Statistics() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const { content, t, isRtl, formatNumber } = useI18n();
  const statisticsContent = content.statistics;
  const indicators = statisticsContent.indicators;
  const reduced = !!useReducedMotion();

  // Which card is flipped: auto-cycles one at a time; hover/focus takes over.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  const rotating = !reduced && !paused && inView && indicators.length > 1;

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(
      () => setActiveIndex((current) => ((current ?? -1) + 1) % indicators.length),
      activeIndex === null ? 1600 : AUTO_FLIP_MS
    );
    return () => window.clearTimeout(timer);
  }, [rotating, activeIndex, indicators.length]);

  return (
    <section id="statistics" className="relative overflow-hidden bg-cream py-20 md:py-28">
      <div ref={ref} className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="h-px w-8 bg-gold-400" />
            <span className="text-sm font-medium text-gold-600">{statisticsContent.eyebrow}</span>
            <span className="h-px w-8 bg-gold-400" />
          </div>
          <h2 className="mb-4 font-brand text-3xl font-bold text-dark-900 md:text-4xl lg:text-5xl">
            {statisticsContent.title}
          </h2>
          <p className="max-w-xl text-sm text-dark-400 md:text-base">{statisticsContent.description}</p>
        </motion.div>

        <div
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4"
        >
          {indicators.map((indicator, i) => (
            <FlipCard
              key={indicator.label}
              indicator={indicator}
              index={i}
              flipped={activeIndex === i}
              inView={inView}
              reduced={reduced}
              isRtl={isRtl}
              unavailableLabel={t('common.unavailable')}
              formatNumber={formatNumber}
              onFlip={() => setActiveIndex(i)}
              onUnflip={() => setActiveIndex((current) => (current === i ? null : current))}
            />
          ))}
        </div>

        <motion.a
          href={statisticsContent.source.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 block text-center text-xs text-dark-400 underline-offset-4 transition-colors hover:text-primary-600 hover:underline md:text-sm"
        >
          {statisticsContent.source.label}
        </motion.a>
      </div>
    </section>
  );
}
