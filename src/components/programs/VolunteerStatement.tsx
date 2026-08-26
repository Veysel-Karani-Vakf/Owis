import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Mail, Phone, Quote } from 'lucide-react';
import type { Program, VolunteerCopy } from '@/data/programs';

type VolunteerStatementProps = {
  program: Program;
  copy: VolunteerCopy;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

const revealVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: smoothEase } },
});

/**
 * One dark panel carries the unit's belief next to its badge, with the contact
 * details on a strip below. Every block sizes to its own content, so a short
 * intro shortens the panel instead of leaving a hole in a fixed grid.
 */
export default function VolunteerStatement({ program, copy }: VolunteerStatementProps) {
  const reduced = !!useReducedMotion();

  const paragraphs = (program.sections?.[0]?.paragraphs ?? []).filter(Boolean);
  // The closing paragraph is the belief; anything before it sets it up.
  const headline = paragraphs.length > 1 ? paragraphs[paragraphs.length - 1] : paragraphs[0];
  const intro = paragraphs.length > 1 ? paragraphs.slice(0, -1) : [];
  const badge = program.overviewImage ?? program.heroImage;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="max-w-3xl text-start">
        <span className="text-sm font-black text-primary-700">{copy.statement.eyebrow}</span>
        <h2 className="mt-3 text-balance text-3xl font-bold leading-tight text-dark-950 md:text-4xl lg:text-[2.7rem]">
          {copy.statement.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-dark-600 md:text-lg">{copy.statement.description}</p>
      </div>

      <motion.div
        variants={revealVariants(reduced)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative isolate mt-10 overflow-hidden rounded-[32px] bg-dark-950 text-white shadow-[0_34px_80px_rgba(0,0,0,0.26)]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_88%_10%,rgba(218,8,18,0.42),transparent_58%)] rtl:bg-[radial-gradient(circle_at_12%_10%,rgba(218,8,18,0.42),transparent_58%)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 end-6 -z-10 select-none text-[18rem] font-black leading-none text-white/[0.035]"
        >
          ”
        </span>

        <div className="grid gap-10 p-7 md:p-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-14 lg:p-14">
          {/* Badge plate */}
          <div className="relative mx-auto w-full max-w-[15rem] shrink-0 lg:mx-0">
            <span
              aria-hidden="true"
              className="absolute -inset-4 rounded-[34px] border border-dashed border-white/20"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-primary-600/25 blur-3xl"
            />
            <motion.div
              initial={reduced ? { opacity: 1, rotate: -2 } : { opacity: 0, scale: 0.92, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -2 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: reduced ? 0.01 : 0.85, ease: smoothEase, delay: 0.1 }}
              className="relative overflow-hidden rounded-[26px] bg-white p-3 shadow-[0_26px_60px_rgba(0,0,0,0.4)]"
            >
              <img
                src={badge}
                alt={program.overviewImageAlt ?? program.heroImageAlt}
                width={1080}
                height={1080}
                loading="lazy"
                className="aspect-square w-full scale-[1.18] object-contain"
              />
            </motion.div>
          </div>

          {/* Belief */}
          <div className="text-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-black">
              <Quote className="h-3.5 w-3.5 text-primary-300" aria-hidden="true" />
              {copy.quoteLabel}
            </span>

            {headline && (
              <p className="mt-6 text-balance text-xl font-bold leading-relaxed md:text-2xl lg:text-[1.75rem]">
                {headline}
              </p>
            )}

            {intro.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-base leading-relaxed text-white/65 md:text-[17px]">
                {paragraph}
              </p>
            ))}

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-white/10 pt-6">
              <span className="text-sm font-bold text-white/70">{copy.slogan}</span>
              <span aria-hidden="true" className="hidden h-4 w-px bg-white/20 sm:block" />
              <ul className="flex flex-wrap gap-2">
                {(copy.hashtags ?? []).map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-primary-600/90 px-3.5 py-1.5 text-sm font-black text-white"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact strip */}
      {(program.contactEmail || program.contactPhone) && (
        <motion.div
          variants={revealVariants(reduced)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-4 flex flex-col gap-5 rounded-[26px] border border-primary-100 bg-[#faf8f8] p-6 text-start md:flex-row md:items-center md:justify-between md:p-7"
        >
          <p className="text-lg font-bold text-dark-950">{copy.contactTitle}</p>

          <div className="flex flex-wrap gap-3">
            {program.contactEmail && (
              <a
                href={`mailto:${program.contactEmail}`}
                className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-dark-800 ring-1 ring-primary-100 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                <Mail className="h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />
                <span dir="ltr">{program.contactEmail}</span>
              </a>
            )}
            {program.contactPhone && (
              <a
                href={`tel:${program.contactPhone.replace(/\s+/g, '')}`}
                className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-dark-800 ring-1 ring-primary-100 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                <Phone className="h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />
                <span dir="ltr">{program.contactPhone}</span>
              </a>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
