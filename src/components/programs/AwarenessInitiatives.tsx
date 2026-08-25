import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Clapperboard,
  ExternalLink,
  HandHeart,
  MessagesSquare,
  Mic,
  PenLine,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ProgramInitiative } from '@/data/programs';
import { useI18n } from '@/i18n/useI18n';

type AwarenessInitiativesProps = {
  eyebrow: string;
  title: string;
  description: string;
  initiatives: ProgramInitiative[];
  volunteerRoute: string;
  labels: {
    initiativeLabel: string;
    products: string;
    visitInitiative: string;
    officialSource: string;
    openExternal: string;
    volunteerCta: string;
    volunteerCtaDescription: string;
  };
};

const smoothEase = [0.22, 1, 0.36, 1] as const;
const productIcons: LucideIcon[] = [Mic, Clapperboard, MessagesSquare, PenLine];

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const itemVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0.01 : 0.5, ease: smoothEase },
  },
});

function InitiativePanel({
  initiative,
  index,
  labels,
  volunteerRoute,
  reduced,
  isRtl,
}: {
  initiative: ProgramInitiative;
  index: number;
  labels: AwarenessInitiativesProps['labels'];
  volunteerRoute: string;
  reduced: boolean;
  isRtl: boolean;
}) {
  const dark = index % 2 === 1;
  const products = initiative.products ?? [];
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const number = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: smoothEase }}
      className={`relative isolate overflow-hidden rounded-[32px] text-start ${
        dark
          ? 'bg-dark-950 text-white shadow-[0_30px_80px_rgba(0,0,0,0.28)]'
          : 'border border-primary-100 bg-white text-dark-950 shadow-[0_26px_70px_rgba(40,12,18,0.08)]'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-10 select-none text-[11rem] font-black leading-none tabular-nums md:text-[15rem] ${
          dark ? 'text-white/[0.05]' : 'text-primary-600/[0.06]'
        } ${index % 2 === 0 ? 'end-4' : 'start-4'}`}
        dir="ltr"
      >
        {number}
      </span>
      {dark && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_20%,rgba(218,8,18,0.3),transparent_50%)]"
        />
      )}

      <div
        className={`grid gap-8 p-6 md:p-10 lg:items-center lg:gap-12 lg:p-12 ${
          index % 2 === 1 ? 'lg:grid-cols-[1.22fr_0.78fr]' : 'lg:grid-cols-[0.78fr_1.22fr]'
        }`}
      >
        <div className={`relative lg:px-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.94, rotate: index % 2 === 0 ? -2 : 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: smoothEase, delay: 0.1 }}
            className="relative mx-auto w-full max-w-sm"
          >
            <span
              aria-hidden="true"
              className={`absolute -inset-4 rounded-[36px] border border-dashed ${dark ? 'border-white/15' : 'border-primary-200'}`}
            />
            <span
              aria-hidden="true"
              className={`absolute -inset-10 hidden rounded-[48px] border lg:block ${dark ? 'border-white/[0.07]' : 'border-primary-100'}`}
            />
            <div className="relative overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_24px_60px_rgba(40,12,18,0.18)] ring-1 ring-black/5">
              <img
                src={initiative.image}
                alt={initiative.imageAlt}
                width={1080}
                height={1080}
                loading="lazy"
                className="aspect-square w-full rounded-[20px] object-cover"
              />
            </div>
            <span
              className={`absolute -bottom-4 start-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black shadow-lg ${
                dark ? 'bg-primary-600 text-white' : 'bg-dark-950 text-white'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              {labels.initiativeLabel} {number}
            </span>
          </motion.div>
        </div>

        <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
          <h3 className="text-3xl font-bold leading-tight md:text-4xl">{initiative.title}</h3>
          <p
            className={`mt-4 max-w-2xl text-base leading-relaxed md:text-lg ${dark ? 'text-white/75' : 'text-dark-600'}`}
          >
            {initiative.description}
          </p>

          {products.length > 0 && (
            <div className="mt-8">
              <p className={`text-sm font-bold ${dark ? 'text-primary-300' : 'text-primary-700'}`}>{labels.products}</p>
              <motion.ul
                variants={listVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="mt-4 grid gap-3 sm:grid-cols-2"
              >
                {products.map((product, productIndex) => {
                  const Icon = productIcons[productIndex] ?? Sparkles;

                  return (
                    <motion.li
                      key={product}
                      variants={itemVariants(reduced)}
                      className={`group flex items-center gap-3 rounded-2xl border p-3.5 transition-colors duration-300 ${
                        dark
                          ? 'border-white/12 bg-white/[0.05] hover:bg-white/10'
                          : 'border-primary-100 bg-primary-50/50 hover:bg-primary-50'
                      }`}
                    >
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                          dark
                            ? 'bg-white/10 text-white group-hover:bg-primary-600'
                            : 'bg-white text-primary-700 shadow-sm group-hover:bg-primary-600 group-hover:text-white'
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block text-[10px] font-black tracking-[0.2em] ${dark ? 'text-white/40' : 'text-dark-400'}`}
                        >
                          {String(productIndex + 1).padStart(2, '0')}
                        </span>
                        <span className="block text-sm font-bold leading-snug md:text-base">{product}</span>
                      </span>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>
          )}

          {products.length === 0 && (
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, ease: smoothEase, delay: 0.15 }}
              className={`mt-8 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
                dark ? 'border-white/12 bg-white/[0.05]' : 'border-primary-100 bg-primary-50/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    dark ? 'bg-primary-600 text-white' : 'bg-white text-primary-700 shadow-sm'
                  }`}
                >
                  <HandHeart className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-base font-bold">{labels.volunteerCta}</p>
                  <p className={`mt-1 text-sm leading-relaxed ${dark ? 'text-white/65' : 'text-dark-600'}`}>
                    {labels.volunteerCtaDescription}
                  </p>
                </div>
              </div>
              <Link
                to={volunteerRoute}
                className={`group/link inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:hover:translate-y-0 ${
                  dark
                    ? 'bg-white text-primary-700 hover:bg-primary-50 focus-visible:outline-white'
                    : 'bg-dark-950 text-white hover:bg-dark-800 focus-visible:outline-primary-600'
                }`}
              >
                {labels.volunteerCta}
                <ArrowIcon
                  className={`h-4 w-4 transition-transform ${isRtl ? 'group-hover/link:-translate-x-1' : 'group-hover/link:translate-x-1'}`}
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          )}

          {initiative.url && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={initiative.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${labels.visitInitiative}: ${initiative.title}. ${labels.openExternal}`}
              className={`group/visit inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-sm font-black transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:hover:translate-y-0 ${
                dark
                  ? 'bg-primary-600 text-white hover:bg-primary-500 focus-visible:outline-white'
                  : 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:outline-primary-600'
              }`}
            >
              {labels.visitInitiative}
              <ExternalLink
                className={`h-4 w-4 transition-transform group-hover/visit:-translate-y-0.5 ${
                  isRtl ? 'group-hover/visit:-translate-x-0.5' : 'group-hover/visit:translate-x-0.5'
                }`}
                aria-hidden="true"
              />
            </a>
            <span className={`text-xs font-semibold ${dark ? 'text-white/45' : 'text-dark-400'}`}>
              {labels.officialSource}
            </span>
          </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function AwarenessInitiatives({
  eyebrow,
  title,
  description,
  initiatives,
  volunteerRoute,
  labels,
}: AwarenessInitiativesProps) {
  const { isRtl } = useI18n();
  const reduced = !!useReducedMotion();

  if (!initiatives.length) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-primary-200" />
          <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>
          <span className="h-px w-8 bg-primary-200" />
        </div>
        <h2 className="text-balance text-3xl font-bold leading-[1.3] text-dark-950 md:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-dark-600 md:text-lg">{description}</p>
      </div>

      <div className="grid gap-8 md:gap-10">
        {initiatives.map((initiative, index) => (
          <InitiativePanel
            key={initiative.title}
            initiative={initiative}
            index={index}
            labels={labels}
            volunteerRoute={volunteerRoute}
            reduced={reduced}
            isRtl={isRtl}
          />
        ))}
      </div>
    </div>
  );
}
