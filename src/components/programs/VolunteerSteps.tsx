import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, HandHeart } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import type { ProgramJourneyStep, VolunteerCopy } from '@/data/programs';
import { useI18n } from '@/i18n/useI18n';

type VolunteerStepsProps = {
  steps: ProgramJourneyStep[];
  copy: VolunteerCopy;
  volunteerRoute: string;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

/**
 * A vertical path: the rail fills as the section scrolls past, so the three steps
 * read as one continuous route rather than three separate cards.
 */
export default function VolunteerSteps({ steps, copy, volunteerRoute }: VolunteerStepsProps) {
  const { isRtl } = useI18n();
  const reduced = !!useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 75%', 'end 60%'],
  });
  const railScale = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  if (!steps.length) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8">
      <div className="max-w-2xl text-start">
        <span className="text-sm font-black text-primary-300">{copy.steps.eyebrow}</span>
        <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-white md:text-4xl">
          {copy.steps.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/65 md:text-lg">{copy.steps.description}</p>
      </div>

      <div ref={railRef} className="relative mt-12 ps-12 md:ps-16">
        {/* Rail */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 start-[1.35rem] w-px bg-white/12 md:start-[1.85rem]"
        >
          <motion.span
            style={{ scaleY: reduced ? 1 : railScale }}
            className="block h-full w-px origin-top bg-gradient-to-b from-primary-400 via-primary-500 to-primary-600"
          />
        </span>

        <ol className="grid gap-8">
          {steps.map((step, index) => (
            <motion.li
              key={step.id}
              initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: isRtl ? 24 : -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="relative text-start"
            >
              <span
                aria-hidden="true"
                className="absolute -start-12 top-1 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-dark-950 text-sm font-black tabular-nums text-white shadow-[0_0_0_6px_rgba(10,10,12,1)] md:-start-16 md:h-14 md:w-14 md:text-base"
                dir="ltr"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur md:p-7">
                <h3 className="text-xl font-bold leading-snug text-white md:text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-[15px]">{step.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55, ease: smoothEase }}
        className="mt-10 flex justify-center"
      >
        <Link
          to={volunteerRoute}
          className="group inline-flex min-h-13 items-center gap-2 rounded-full bg-primary-600 px-8 py-3.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:hover:translate-y-0"
        >
          <HandHeart className="h-4 w-4" aria-hidden="true" />
          {copy.joinCta}
          <ArrowIcon
            className={`h-4 w-4 transition-transform ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
            aria-hidden="true"
          />
        </Link>
      </motion.div>
    </div>
  );
}
