import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { useI18n } from '@/i18n/useI18n';

export default function Partners() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const { content, isRtl } = useI18n();
  const partnersContent = content.partners;
  const marqueePartners = [...partnersContent.items, ...partnersContent.items];

  return (
    <section className="overflow-hidden bg-cream py-16 md:py-20">
      <div ref={ref} className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col items-center text-center"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="h-px w-8 bg-gold-400" />
            <span className="text-sm font-medium text-gold-600">{partnersContent.eyebrow}</span>
            <span className="h-px w-8 bg-gold-400" />
          </div>
          <h2 className="font-brand text-2xl font-bold text-dark-900 md:text-3xl lg:text-4xl">
            {partnersContent.title}
          </h2>
        </motion.div>
      </div>

      <div className="group relative overflow-hidden">
        <div
          className={`flex animate-marquee gap-12 py-4 group-hover:[animation-play-state:paused] ${
            isRtl ? '' : '[animation-direction:reverse]'
          }`}
        >
          {marqueePartners.map((partner, i) => (
            <div
              key={`${partner.logo}-${i}`}
              className="flex h-20 w-32 flex-shrink-0 items-center justify-center"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                loading="lazy"
                className="max-h-20 max-w-32 object-contain opacity-40 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 80"%3E%3Crect fill="%23e2e6e3" width="128" height="80" rx="8"/%3E%3C/svg%3E';
                }}
              />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 end-0 w-24 bg-gradient-to-l from-cream to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 start-0 w-24 bg-gradient-to-r from-cream to-transparent" />
      </div>
    </section>
  );
}
