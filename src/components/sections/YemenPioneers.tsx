import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, GraduationCap, MapPin, Building2, BookOpen } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useI18n } from '@/i18n/useI18n';

const icons = [GraduationCap, MapPin, Building2, BookOpen];

export default function YemenPioneers() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.08 });
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
          <div className="pioneers-copy text-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-4 flex items-center gap-2"
            >
              <span className="pioneers-accent-line h-px w-8" />
              <span className="pioneers-accent-text text-sm font-medium">
                {yemenPioneersContent.eyebrow}
              </span>
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
              className="pioneers-description mb-8 max-w-xl text-base leading-relaxed md:text-lg"
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
            <div className="relative grid grid-cols-2 gap-4">
              {yemenPioneersContent.indicators.map((indicator, i) => {
                const Icon = icons[i];
                return (
                <motion.div
                  key={indicator.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className="h-full"
                >
                  <div className="pioneers-stat-card group h-full rounded-2xl p-6 text-start">
                    <div className="pioneers-stat-icon mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="mb-1 text-3xl font-bold text-white">
                      {indicator.value !== null ? formatNumber(indicator.value) : t('common.unavailable')}
                    </div>
                    <p className="pioneers-stat-label text-sm">{indicator.label}</p>
                  </div>
                </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
