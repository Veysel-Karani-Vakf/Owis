import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion';
import { Globe2, Layers, Sparkles, Target, Users2, type LucideIcon } from 'lucide-react';
import { useRef } from 'react';
import type { ProgramSection } from '@/data/programs';

type CapacityForumProps = {
  eyebrow: string;
  objectivesLabel: string;
  section: ProgramSection;
  image: string;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;
const objectiveIcons: LucideIcon[] = [Users2, Layers, Globe2];

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
};

const itemVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: smoothEase } },
});

export default function CapacityForum({ eyebrow, objectivesLabel, section, image }: CapacityForumProps) {
  const reduced = !!useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-10%', '10%']);

  const paragraphs = section.paragraphs ?? [];
  const objectives = section.bullets ?? [];

  return (
    <div ref={sectionRef} className="relative isolate overflow-hidden bg-dark-950 text-white">
      <motion.img
        src={image}
        alt=""
        aria-hidden="true"
        style={{ y: imageY }}
        className="absolute inset-0 -z-20 h-[120%] w-full object-cover opacity-25"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-950/95 via-dark-950/92 to-dark-950/96" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_30%,rgba(218,8,18,0.32),transparent_40%)]"
      />

      {!reduced && (
        <>
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 400 400"
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            className="pointer-events-none absolute -bottom-24 -end-24 -z-10 h-80 w-80 text-white/10 md:h-[28rem] md:w-[28rem]"
          >
            <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 12" />
            <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 9" />
          </motion.svg>
          {[0, 1, 2, 3, 4].map((dot) => (
            <motion.span
              key={dot}
              aria-hidden="true"
              animate={{ y: [0, -18, 0], opacity: [0.25, 0.7, 0.25] }}
              transition={{ duration: 5 + dot, repeat: Infinity, ease: 'easeInOut', delay: dot * 0.8 }}
              className="pointer-events-none absolute -z-10 h-2 w-2 rounded-full bg-primary-300"
              style={{ top: `${18 + dot * 14}%`, left: `${8 + dot * 19}%` }}
            />
          ))}
        </>
      )}

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <motion.div
          variants={{
            hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
            show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: smoothEase } },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-start"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary-200" aria-hidden="true" />
            {eyebrow}
          </div>
          <h2 className="text-balance text-3xl font-bold leading-tight md:text-4xl lg:text-[2.6rem]">{section.title}</h2>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-5 max-w-2xl text-base leading-relaxed text-white/78 md:text-lg">
              {paragraph}
            </p>
          ))}

          <motion.span
            aria-hidden="true"
            variants={{
              hidden: reduced ? { scaleX: 1 } : { scaleX: 0 },
              show: { scaleX: 1, transition: { duration: 1, ease: smoothEase, delay: 0.3 } },
            }}
            className="mt-8 block h-1 w-28 origin-left rounded-full bg-gradient-to-r from-primary-400 to-primary-200 rtl:origin-right"
          />
        </motion.div>

        <div className="text-start">
          <div className="mb-5 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary-300" aria-hidden="true" />
            <span className="text-sm font-bold text-white/85">{objectivesLabel}</span>
          </div>
          <motion.ol
            variants={listVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid gap-4"
          >
            {objectives.map((objective, index) => {
              const Icon = objectiveIcons[index % objectiveIcons.length];
              return (
                <motion.li
                  key={objective}
                  variants={itemVariants(reduced)}
                  whileHover={reduced ? undefined : { x: 0, y: -4 }}
                  className="group relative flex gap-4 overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition-colors duration-300 hover:border-primary-300/40 hover:bg-white/10 md:p-6"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -end-2 -top-5 select-none text-[5.5rem] font-black leading-none text-white/[0.06]"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-[0_12px_26px_rgba(195,7,16,0.4)] transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="relative">
                    <span dir="ltr" className="text-xs font-bold tabular-nums text-primary-200">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="mt-1 text-[15px] font-semibold leading-relaxed text-white md:text-base">{objective}</p>
                  </div>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </div>
    </div>
  );
}
