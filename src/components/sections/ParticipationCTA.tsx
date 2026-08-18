import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, HandHeart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { participateRoutes } from '@/data/participate';
import { useInView } from '@/hooks/useInView';
import { useI18n } from '@/i18n/useI18n';

type ParticipationCTAProps = {
  standalone?: boolean;
};

export default function ParticipationCTA({ standalone = false }: ParticipationCTAProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const { content, isRtl } = useI18n();
  const participationContent = content.participation;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const arrowHoverClass = isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1';
  const sectionClassName = standalone
    ? 'relative flex min-h-[100svh] items-center overflow-hidden bg-dark-900 py-24 md:py-28'
    : 'relative overflow-hidden bg-dark-900 py-20 md:py-28';

  return (
    <section
      id="participate"
      className={sectionClassName}
    >
      <div className="absolute inset-0">
        <img
          src={participationContent.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover opacity-25"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-primary-900/70 to-dark-950/80" />
      </div>

      <div className="geometric-pattern absolute inset-0 opacity-20" />

      <div ref={ref} className="relative mx-auto w-full max-w-4xl px-4 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-400/20 text-gold-300"
        >
          <HandHeart className="h-8 w-8" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-5 font-brand text-3xl font-bold text-white text-balance md:text-4xl lg:text-5xl"
        >
          {participationContent.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg"
        >
          {participationContent.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            to="/donate"
            className="group flex items-center gap-2 rounded-full bg-gold-400 px-8 py-3.5 text-sm font-semibold text-dark-900 shadow-xl transition-all duration-300 hover:bg-gold-300 hover:shadow-2xl"
          >
            {participationContent.primaryButton}
            <ArrowIcon className={`h-4 w-4 transition-transform ${arrowHoverClass}`} />
          </Link>

          <Link
            to={participateRoutes.volunteer}
            className="group flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10"
          >
            {participationContent.secondaryButton}
            <ArrowIcon className={`h-4 w-4 transition-transform ${arrowHoverClass}`} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
