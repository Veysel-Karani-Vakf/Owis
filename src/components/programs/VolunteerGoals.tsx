import { motion, useReducedMotion } from 'framer-motion';
import type { VolunteerCopy } from '@/data/programs';

type VolunteerGoalsProps = {
  goals: string[];
  copy: VolunteerCopy;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

/**
 * Editorial rows rather than cards: an oversized index, the goal, and a rail that
 * draws itself in as the row enters the viewport.
 */
export default function VolunteerGoals({ goals, copy }: VolunteerGoalsProps) {
  const reduced = !!useReducedMotion();

  if (!goals.length) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="text-start lg:sticky lg:top-28 lg:self-start">
          <span className="text-sm font-black text-primary-700">{copy.goals.eyebrow}</span>
          <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-dark-950 md:text-4xl">
            {copy.goals.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-dark-600">{copy.goals.description}</p>
        </div>

        <ul className="grid">
          {goals.map((goal, index) => (
            <motion.li
              key={goal}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.55, ease: smoothEase }}
              className="group relative py-7 text-start first:pt-0"
            >
              <div className="flex items-start gap-5 md:gap-7">
                <span
                  dir="ltr"
                  className="shrink-0 text-4xl font-black leading-none tabular-nums text-primary-200 transition-colors duration-500 group-hover:text-primary-500 md:text-5xl"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-balance pt-1 text-lg font-bold leading-relaxed text-dark-900 md:text-xl">{goal}</p>
              </div>

              <span aria-hidden="true" className="mt-6 block h-px w-full bg-primary-100">
                <motion.span
                  initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: reduced ? 0.01 : 1, ease: smoothEase, delay: 0.15 }}
                  className="block h-px w-full origin-left bg-gradient-to-r from-primary-600 to-primary-300 rtl:origin-right"
                />
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
