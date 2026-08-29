import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion';
import {
  Compass,
  GraduationCap,
  HeartHandshake,
  Mail,
  Phone,
  Quote,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useRef } from 'react';
import type { Program } from '@/data/programs';
import { useI18n } from '@/i18n/useI18n';
import { resolveIcon } from '@/lib/icons';

type PioneerOverviewProps = {
  program: Program;
  labels: {
    overview: string;
    contact: string;
  };
};

const pillarIcons: LucideIcon[] = [GraduationCap, Compass, HeartHandshake];
const smoothEase = [0.22, 1, 0.36, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const itemVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: smoothEase } },
});

const chipVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
});

export default function PioneerOverview({ program, labels }: PioneerOverviewProps) {
  const { isRtl } = useI18n();
  const reduced = !!useReducedMotion();
  const visualRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: visualRef, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-8%', '8%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], reduced ? [1, 1, 1] : [1.08, 1.02, 1.08]);

  const intro = program.sections?.[0];
  const paragraphs = intro?.paragraphs ?? [];
  const lead = paragraphs[0];
  const quote = paragraphs.slice(1).join(' ');
  const pillars = program.pillars ?? [];
  const phone = program.contactPhone?.trim();

  return (
    <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
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
          className="text-balance text-3xl font-bold leading-tight text-dark-950 md:text-4xl"
        >
          {intro?.title ?? program.title}
        </motion.h2>

        {lead && (
          <motion.p variants={itemVariants(reduced)} className="mt-5 text-base leading-relaxed text-dark-700 md:text-[17px]">
            {lead}
          </motion.p>
        )}

        {quote && (
          <motion.blockquote
            variants={itemVariants(reduced)}
            className="relative mt-5 overflow-hidden rounded-[20px] border border-primary-100 bg-[#faf8f8] p-5 ps-6 md:ps-7"
          >
            <motion.span
              aria-hidden="true"
              initial={reduced ? { scaleY: 1 } : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: smoothEase, delay: 0.2 }}
              className="absolute inset-y-0 start-0 w-1.5 origin-top bg-gradient-to-b from-primary-600 to-primary-300"
            />
            <Quote
              aria-hidden="true"
              className={`absolute -top-3 end-3 h-14 w-14 text-primary-100/70 ${isRtl ? '' : '-scale-x-100'}`}
            />
            <p className="relative text-[15px] font-semibold leading-relaxed text-dark-800 md:text-base">{quote}</p>
          </motion.blockquote>
        )}

        {pillars.length > 0 && (
          <motion.ul variants={containerVariants} className="mt-5 flex flex-wrap gap-2">
            {pillars.map((pillar, index) => {
              const Icon = resolveIcon(pillar.icon, pillarIcons, index);
              return (
                <motion.li
                  key={pillar.id}
                  variants={chipVariants(reduced)}
                  whileHover={reduced ? undefined : { y: -3 }}
                  className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-3.5 py-1.5 text-[13px] font-bold text-dark-800 shadow-sm transition-colors hover:border-primary-200 hover:bg-primary-50"
                >
                  <Icon className="h-4 w-4 text-primary-600" aria-hidden="true" />
                  {pillar.title}
                </motion.li>
              );
            })}
          </motion.ul>
        )}

        <motion.div variants={itemVariants(reduced)} className="mt-6 flex flex-wrap items-center gap-3">
          {program.contactEmail && (
            <a
              href={`mailto:${program.contactEmail}`}
              className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(195,7,16,0.28)] transition-all hover:-translate-y-0.5 hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
            >
              <Mail className="h-4 w-4 transition-transform group-hover:-rotate-6" aria-hidden="true" />
              {labels.contact}
              <span dir="ltr" className="hidden font-semibold text-white/85 sm:inline">
                {program.contactEmail}
              </span>
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone.replace(/[^+\d]/g, '')}`}
              className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-100 bg-white px-5 py-2.5 text-sm font-bold text-primary-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
            >
              <Phone className="h-4 w-4 transition-transform group-hover:-rotate-6" aria-hidden="true" />
              <span dir="ltr" className="font-semibold">
                {phone}
              </span>
            </a>
          )}
        </motion.div>
      </motion.div>

      <div ref={visualRef} className="relative mx-auto w-full max-w-[30rem] lg:max-w-none">
        {!reduced && (
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 400 400"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="pointer-events-none absolute -end-8 -top-8 h-44 w-44 text-primary-200 md:-end-12 md:-top-12 md:h-56 md:w-56"
          >
            <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 14" />
          </motion.svg>
        )}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 -start-8 h-40 w-40 rounded-full bg-primary-100/70 blur-3xl"
        />

        <motion.figure
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 30, rotate: isRtl ? 1.5 : -1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="relative isolate aspect-[4/3] overflow-hidden rounded-[28px] border border-primary-100 bg-dark-950 shadow-[0_30px_70px_rgba(40,12,18,0.2)]"
        >
          <motion.img
            src={program.overviewImage ?? program.heroImage}
            alt={program.overviewImageAlt ?? program.heroImageAlt}
            style={{ y: imageY, scale: imageScale }}
            className="h-full w-full object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-dark-950/85 via-dark-950/20 to-dark-950/10"
          />

          <div className="absolute start-5 top-5 flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary-200" aria-hidden="true" />
            {program.title}
          </div>

          <figcaption className="absolute inset-x-0 bottom-0 p-5 text-start text-white md:p-6">
            <motion.p
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: smoothEase, delay: 0.25 }}
              className="line-clamp-2 text-sm leading-relaxed text-white/90"
            >
              {program.summary}
            </motion.p>
          </figcaption>
        </motion.figure>

      </div>
    </div>
  );
}
