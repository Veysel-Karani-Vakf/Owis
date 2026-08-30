import { motion, useReducedMotion } from 'framer-motion';
import { Landmark, Users, type LucideIcon } from 'lucide-react';
import type { ProgramAudience } from '@/data/programs';
import { resolveIcon } from '@/lib/icons';

type InstitutionalBeneficiariesProps = {
  audiences: ProgramAudience[];
  /** Section heading and subtitle, from the programs-page labels. */
  title: string;
  description?: string;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;
// Positional defaults: a public institution, then a civil one.
const audienceIcons: LucideIcon[] = [Landmark, Users];

/**
 * The institutions the track serves, each standing in an arch-shaped panel:
 * the icon sits in the crown of the arch, the copy fills the body, and an inner
 * dashed outline follows the shape like a frame.
 */
export default function InstitutionalBeneficiaries({
  audiences,
  title,
  description,
}: InstitutionalBeneficiariesProps) {
  const reduced = !!useReducedMotion();

  if (!audiences.length) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{title}</h2>
        {description && (
          <p className="mt-4 text-base leading-relaxed text-dark-600 md:text-lg">{description}</p>
        )}
      </div>

      <ul className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2 md:gap-8">
        {audiences.map((audience, index) => {
          const Icon = resolveIcon(audience.icon, audienceIcons, index);
          const number = String(index + 1).padStart(2, '0');

          return (
            <motion.li
              key={audience.id || `${audience.title}-${index}`}
              initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: reduced ? 0.01 : 0.65, ease: smoothEase, delay: reduced ? 0 : index * 0.12 }}
              className="group relative isolate flex flex-col items-center overflow-hidden rounded-b-[32px] rounded-t-[999px] border border-primary-100 bg-[#faf8f8] px-7 pb-10 pt-14 text-center transition-colors duration-500 hover:bg-primary-50/70 md:px-10 md:pb-12 md:pt-16"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 rounded-b-[24px] rounded-t-[999px] border border-dashed border-primary-200/90"
              />
              <span
                aria-hidden="true"
                dir="ltr"
                className="pointer-events-none absolute -bottom-3 end-6 select-none text-[6.5rem] font-black leading-none tabular-nums text-primary-600/[0.06]"
              >
                {number}
              </span>

              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-primary-700 shadow-[0_14px_30px_rgba(40,12,18,0.1)] ring-1 ring-primary-100 transition-colors duration-500 group-hover:bg-primary-600 group-hover:text-white">
                <Icon className="h-8 w-8" aria-hidden="true" />
              </span>

              <span className="relative mt-6 inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-black text-primary-700 ring-1 ring-primary-100">
                <span dir="ltr" className="tabular-nums">
                  {number}
                </span>
              </span>

              <h3 className="relative mt-4 text-balance text-2xl font-bold leading-snug text-dark-950 md:text-3xl">
                {audience.title}
              </h3>
              <p className="relative mt-3 max-w-sm text-sm leading-relaxed text-dark-600 md:text-base">
                {audience.description}
              </p>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
