import { motion } from 'framer-motion';
import { TrendingUp, Users, HeartHandshake, Briefcase } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
import { useI18n } from '@/i18n/useI18n';

const icons = [TrendingUp, Users, HeartHandshake, Briefcase];

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  index,
  inView,
  isRtl,
  unavailableLabel,
  formatNumber,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: number | null;
  suffix: string;
  index: number;
  inView: boolean;
  isRtl: boolean;
  unavailableLabel: string;
  formatNumber: (value: number) => string;
}) {
  const animatedValue = useCountUp(value ?? 0, 2000, inView && value !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl border border-primary-100 bg-white p-6 text-center shadow-sm transition-all hover:shadow-lg md:p-8"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
        <Icon className="h-7 w-7" />
      </div>

      <div className="mb-2 text-4xl font-bold text-dark-900 md:text-5xl">
        {value !== null ? (
          <>
            {formatNumber(animatedValue)}
            {suffix}
          </>
        ) : (
          unavailableLabel
        )}
      </div>

      <p className="text-sm text-dark-500 md:text-base">{label}</p>

      <div
        className={`absolute inset-x-0 bottom-0 h-1 scale-x-0 bg-gradient-to-l from-primary-400 to-gold-400 transition-transform duration-500 group-hover:scale-x-100 ${
          isRtl ? 'origin-right' : 'origin-left'
        }`}
      />
    </motion.div>
  );
}

export default function Statistics() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const { content, t, isRtl, formatNumber } = useI18n();
  const statisticsContent = content.statistics;

  return (
    <section className="relative overflow-hidden bg-cream py-20 md:py-28">
      <div ref={ref} className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="h-px w-8 bg-gold-400" />
            <span className="text-sm font-medium text-gold-600">
              {statisticsContent.eyebrow}
            </span>
            <span className="h-px w-8 bg-gold-400" />
          </div>
          <h2 className="mb-4 font-brand text-3xl font-bold text-dark-900 md:text-4xl lg:text-5xl">
            {statisticsContent.title}
          </h2>
          <p className="max-w-xl text-sm text-dark-400 md:text-base">
            {statisticsContent.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {statisticsContent.indicators.map((stat, i) => (
            <StatCard
              key={stat.label}
              icon={icons[i]}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              index={i}
              inView={inView}
              isRtl={isRtl}
              unavailableLabel={t('common.unavailable')}
              formatNumber={formatNumber}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
