import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Globe2,
  GraduationCap,
  Users,
} from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { useI18n } from '@/i18n/useI18n';

const icons = [GraduationCap, BookOpen, Users, Globe2];

function PioneersStatCard({
  icon: Icon,
  label,
  value,
  index,
  inView,
  isRtl,
  reduceMotion,
  unavailableLabel,
  formatNumber,
}: {
  icon: typeof GraduationCap;
  label: string;
  value: number | null;
  index: number;
  inView: boolean;
  isRtl: boolean;
  reduceMotion: boolean;
  unavailableLabel: string;
  formatNumber: (value: number) => string;
}) {
  const hasValue = value !== null;
  const animatedValue = useCountUp(value ?? 0, 2000, inView && hasValue);
  const delay = reduceMotion ? 0 : index * 0.15;

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 36, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={
        reduceMotion
          ? { duration: 0.4 }
          : { type: 'spring', stiffness: 260, damping: 22, mass: 0.8, delay }
      }
      className="h-full"
    >
      <div className="pioneers-stat-card group relative flex h-full flex-col items-center overflow-hidden rounded-2xl p-6 text-center">
        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, rotate: -12, scale: 0.7 }}
          animate={inView ? { opacity: 1, rotate: 0, scale: 1 } : {}}
          transition={
            reduceMotion
              ? { duration: 0.01 }
              : { type: 'spring', stiffness: 300, damping: 18, delay: delay + 0.15 }
          }
          className="pioneers-stat-icon mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
        >
          <Icon className="h-6 w-6" />
        </motion.div>
        <div className="mb-1 text-3xl font-bold tabular-nums text-white">
          {hasValue ? formatNumber(animatedValue) : unavailableLabel}
        </div>
        <p className="pioneers-stat-label text-sm">{label}</p>
        <span
          aria-hidden="true"
          className={`pioneers-stat-glow absolute inset-x-0 bottom-0 h-0.5 scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${
            isRtl ? 'origin-right' : 'origin-left'
          }`}
        />
      </div>
    </motion.div>
  );
}

export default function YemenPioneers() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.08 });
  const { ref: statsRef, inView: statsInView } = useInView<HTMLDivElement>({ threshold: 0.35 });
  const shouldReduceMotion = useReducedMotion();
  const { content, t, isRtl, formatNumber } = useI18n();
  const yemenPioneersContent = content.yemenPioneers;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section
      ref={ref}
      id="yemen-pioneers"
      className="pioneers-section relative overflow-hidden py-20 text-white md:py-28"
    >
      <motion.div
        initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-[1]"
      >
        <img
          src={yemenPioneersContent.image}
          alt=""
          loading="lazy"
          className="pioneers-background-image h-full w-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </motion.div>

      <div className="pioneers-top-separator pointer-events-none absolute inset-x-0 top-0 z-[3] h-16" />
      <div className="geometric-pattern absolute inset-0 z-[3] opacity-10" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="pioneers-copy flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-4 flex items-center justify-center gap-2"
            >
              <span className="pioneers-accent-line h-px w-8" />
              <span className="pioneers-accent-text text-sm font-medium">
                {yemenPioneersContent.eyebrow}
              </span>
              <span className="pioneers-accent-line h-px w-8" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 font-brand text-3xl font-bold text-white md:text-4xl lg:text-5xl"
            >
              {yemenPioneersContent.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="pioneers-description mx-auto mb-8 max-w-xl text-base leading-relaxed md:text-lg"
            >
              {yemenPioneersContent.description}
            </motion.p>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pioneers-button group flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300"
            >
              {yemenPioneersContent.button}
              <ArrowIcon
                className={`h-4 w-4 transition-transform ${
                  isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                }`}
              />
            </motion.button>
          </div>

          <div className="relative">
            <div className="pioneers-card-halo pointer-events-none absolute -inset-8 rounded-[2rem]" />
            <div ref={statsRef} className="relative grid grid-cols-2 gap-4">
              {yemenPioneersContent.indicators.map((indicator, i) => (
                <PioneersStatCard
                  key={indicator.label}
                  icon={icons[i]}
                  label={indicator.label}
                  value={indicator.value}
                  index={i}
                  inView={statsInView}
                  isRtl={isRtl}
                  reduceMotion={Boolean(shouldReduceMotion)}
                  unavailableLabel={t('common.unavailable')}
                  formatNumber={formatNumber}
                />
              ))}
            </div>
            <a
              href={yemenPioneersContent.statisticsSource.url}
              target="_blank"
              rel="noreferrer"
              className="mx-auto mt-4 flex w-fit items-center gap-1.5 text-xs text-white/65 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
            >
              {yemenPioneersContent.statisticsSource.label}
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
