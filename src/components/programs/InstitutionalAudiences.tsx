import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Landmark, Users, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { donateRoute } from '@/data/donate';
import type { ProgramAudience } from '@/data/programs';
import { useI18n } from '@/i18n/useI18n';

type InstitutionalAudiencesProps = {
  eyebrow: string;
  title: string;
  description: string;
  audiences: ProgramAudience[];
  areas: string[];
  image: string;
  donateLabel: string;
};

const smoothEase = [0.22, 1, 0.36, 1] as const;
const audienceIcons: LucideIcon[] = [Landmark, Users];

export default function InstitutionalAudiences({
  eyebrow,
  title,
  description,
  audiences,
  areas,
  image,
  donateLabel,
}: InstitutionalAudiencesProps) {
  const { isRtl } = useI18n();
  const reduced = !!useReducedMotion();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  if (!audiences.length) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-primary-200" />
          <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>
          <span className="h-px w-8 bg-primary-200" />
        </div>
        <h2 className="text-balance text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{title}</h2>
        <p className="mt-4 text-base leading-relaxed text-dark-600 md:text-lg">{description}</p>
      </div>

      <div className="flex flex-col gap-4 md:h-[30rem] md:flex-row lg:h-[34rem]">
        {audiences.map((audience, index) => {
          const Icon = audienceIcons[index % audienceIcons.length];
          const tint = index === 0 ? 'from-primary-950/95 via-primary-900/80' : 'from-dark-950/95 via-dark-900/75';

          return (
            <motion.article
              key={audience.id}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, ease: smoothEase, delay: index * 0.12 }}
              className="group relative isolate flex min-h-[22rem] flex-1 flex-col justify-end overflow-hidden rounded-[28px] bg-dark-950 text-start text-white shadow-[0_26px_64px_rgba(40,12,18,0.16)] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:min-h-0 md:hover:flex-[1.7] md:focus-within:flex-[1.7] motion-reduce:transition-none"
            >
              <img
                src={image}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 -z-20 h-full w-full object-cover opacity-60 transition-transform duration-[1200ms] ease-out group-hover:scale-105 motion-reduce:transition-none"
              />
              <span aria-hidden="true" className={`absolute inset-0 -z-10 bg-gradient-to-t ${tint} to-dark-950/30`} />
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(218,8,18,0.28),transparent_45%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />

              <span
                dir="ltr"
                aria-hidden="true"
                className="absolute end-6 top-6 select-none text-6xl font-black leading-none tabular-nums text-white/10 md:text-7xl"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="relative p-6 md:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur transition-colors duration-500 group-hover:bg-white group-hover:text-primary-700">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-2xl font-bold md:text-3xl">{audience.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80 md:text-[15px]">{audience.description}</p>

                <ul className="mt-5 flex flex-wrap gap-2 md:max-h-0 md:overflow-hidden md:opacity-0 md:transition-all md:duration-700 md:ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:max-h-40 md:group-hover:opacity-100 md:group-focus-within:max-h-40 md:group-focus-within:opacity-100">
                  {areas.map((area) => (
                    <li
                      key={area}
                      className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur"
                    >
                      {area}
                    </li>
                  ))}
                </ul>

                <Link
                  to={donateRoute}
                  className="btn-border-run btn-border-run--light btn-border-run--sheen-tint group/link mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-primary-700 shadow-[0_14px_30px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-0.5 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {donateLabel}
                  <ArrowIcon
                    className={`h-4 w-4 transition-transform ${isRtl ? 'group-hover/link:-translate-x-1' : 'group-hover/link:translate-x-1'}`}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
