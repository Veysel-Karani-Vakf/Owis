import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { BookOpenText, ClipboardCheck, Network, Repeat, Scale, type LucideIcon } from 'lucide-react';
import type { ProgramSection } from '@/data/programs';
import { useI18n } from '@/i18n/useI18n';

type CapacityRecommendationsProps = {
  eyebrow: string;
  description: string;
  section: ProgramSection;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;
const icons: LucideIcon[] = [BookOpenText, Scale, Network, Repeat];

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const rowVariants = (reduced: boolean, isRtl: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: isRtl ? 48 : -48 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: smoothEase } },
});

const checkVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 0.7, ease: smoothEase, delay: 0.35 } },
});

const ringVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { pathLength: 1 } : { pathLength: 0 },
  show: { pathLength: 1, transition: { duration: 0.9, ease: smoothEase, delay: 0.15 } },
});

export default function CapacityRecommendations({ eyebrow, description, section }: CapacityRecommendationsProps) {
  const { isRtl } = useI18n();
  const reduced = !!useReducedMotion();
  const items = section.bullets ?? [];

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      {/* Sticky heading column */}
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: smoothEase }}
        className="text-start lg:sticky lg:top-28 lg:self-start"
      >
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary-600" />
          <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>
        </div>
        <h2 className="text-balance text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{section.title}</h2>
        <p className="mt-4 text-base leading-relaxed text-dark-600 md:text-lg">{description}</p>

        <div className="mt-8 inline-flex items-center gap-4 rounded-[22px] border border-primary-100 bg-white p-4 pe-6 shadow-[0_16px_40px_rgba(40,12,18,0.06)]">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-[0_12px_26px_rgba(195,7,16,0.3)]">
            <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p dir="ltr" className="text-3xl font-black leading-none tabular-nums text-dark-950">
              {String(items.length).padStart(2, '0')}
            </p>
            <p className="mt-1 text-xs font-bold text-dark-500">{section.title}</p>
          </div>
        </div>
      </motion.div>

      {/* Rows */}
      <motion.ol
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative overflow-hidden rounded-[28px] border border-primary-100 bg-white shadow-[0_24px_60px_rgba(40,12,18,0.08)]"
      >
        {items.map((item, index) => {
          const Icon = icons[index % icons.length];
          const isLast = index === items.length - 1;

          return (
            <motion.li
              key={item}
              variants={rowVariants(reduced, isRtl)}
              className={`group relative isolate flex items-center gap-5 p-5 text-start md:gap-7 md:p-7 ${
                isLast ? '' : 'border-b border-primary-100'
              }`}
            >
              {/* Hover sweep */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 origin-left scale-x-0 bg-gradient-to-r from-primary-50 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100 rtl:origin-right rtl:bg-gradient-to-l motion-reduce:transition-none"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-4 start-0 w-1 -translate-x-full rounded-e-full bg-primary-600 transition-transform duration-300 group-hover:translate-x-0 rtl:translate-x-full rtl:group-hover:translate-x-0 motion-reduce:transition-none"
              />

              {/* Number */}
              <span
                dir="ltr"
                aria-hidden="true"
                className="hidden w-16 shrink-0 select-none text-5xl font-black leading-none tabular-nums text-primary-100 transition-colors duration-300 group-hover:text-primary-300 sm:block md:w-20 md:text-6xl"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Icon */}
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-primary-100 transition-all duration-300 group-hover:-rotate-6 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-[0_12px_26px_rgba(195,7,16,0.3)] md:h-14 md:w-14">
                <Icon className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
              </span>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-primary-600 sm:hidden">
                  <span dir="ltr" className="tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </span>
                <p className="text-base font-semibold leading-relaxed text-dark-800 md:text-[17px]">{item}</p>
              </div>

              {/* Drawn check */}
              <span className="relative hidden h-11 w-11 shrink-0 items-center justify-center sm:flex">
                <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <circle cx="22" cy="22" r="20" className="fill-none stroke-primary-100" strokeWidth="1.5" />
                  <motion.circle
                    cx="22"
                    cy="22"
                    r="20"
                    variants={ringVariants(reduced)}
                    className="fill-none stroke-primary-600"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ rotate: -90, transformOrigin: '50% 50%' }}
                  />
                  <motion.path
                    d="M14 22.5l5.5 5.5L30 17"
                    variants={checkVariants(reduced)}
                    className="fill-none stroke-primary-600"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </motion.li>
          );
        })}
      </motion.ol>
    </div>
  );
}
