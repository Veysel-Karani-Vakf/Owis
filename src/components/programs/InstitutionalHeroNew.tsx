import { motion, useReducedMotion } from 'framer-motion';
import Breadcrumbs from '@/components/internal/Breadcrumbs';
import type { BreadcrumbItem } from '@/data/about';
import type { Program } from '@/data/programs';

type InstitutionalHeroNewProps = {
  program: Program;
  breadcrumbs: BreadcrumbItem[];
  /** Small line above the title; comes from the programs-page labels so every locale reads right. */
  eyebrow: string;
};

const heroEase = [0.22, 1, 0.36, 1] as const;

/**
 * Centered, typographic hero for the institutional development page. It sits
 * on the program's hero image behind a dark overlay, like every other page
 * hero, so the fixed white header stays readable on top of it.
 */
export default function InstitutionalHeroNew({ program, breadcrumbs, eyebrow }: InstitutionalHeroNewProps) {
  const shouldReduceMotion = useReducedMotion();
  const duration = shouldReduceMotion ? 0.01 : 0.7;

  return (
    <section className="relative isolate overflow-hidden bg-dark-950 pb-16 pt-28 md:pb-24 md:pt-36">
      {program.heroImage && (
        <motion.img
          src={program.heroImage}
          alt={program.heroImageAlt || ''}
          aria-hidden={program.heroImageAlt ? undefined : true}
          initial={{ scale: shouldReduceMotion ? 1 : 1.04, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 1.1, ease: heroEase }}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-dark-950/80 via-dark-950/75 to-dark-950/85" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(218,8,18,0.3),transparent_40%)]" />

      <div className="relative mx-auto max-w-4xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, ease: heroEase }}
          className="mb-8 flex justify-center"
        >
          <Breadcrumbs items={breadcrumbs} light />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: shouldReduceMotion ? 0 : 0.12, ease: heroEase }}
          className="text-center"
        >
          {eyebrow && (
            <span className="text-sm font-semibold uppercase tracking-wide text-primary-300">{eyebrow}</span>
          )}
          <h1 className="mt-4 text-balance text-4xl font-bold leading-tight text-white md:text-5xl">
            {program.title}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/75 md:text-xl">
            {program.summary}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
