import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/internal/Breadcrumbs';
import type { BreadcrumbItem } from '@/data/about';
import type { Program } from '@/data/programs';
import { useI18n } from '@/i18n/useI18n';

export type ProgramHeroAction = {
  label: string;
  /** Internal route or absolute URL; when absent, `anchor` names the element to scroll to. */
  to?: string;
  anchor?: string;
  /** Leading icon; the trailing arrow is added by the hero. */
  icon?: LucideIcon;
};

export type ProgramHeroTag = { label: string; icon?: LucideIcon };

export type ProgramHeroChip = {
  /** Large figure printed first; without it the chip carries a live dot instead. */
  value?: string;
  label: string;
};

export type ProgramHeroProps = {
  program: Program;
  breadcrumbs: BreadcrumbItem[];
  /** Small line above the title and the icon shown beside it. */
  eyebrow?: string;
  eyebrowIcon: LucideIcon;
  primary?: ProgramHeroAction;
  secondary?: ProgramHeroAction;
  /** Small pills under the summary (media formats, hashtags). */
  tags?: ProgramHeroTag[];
  /** One quiet sentence under the buttons. */
  note?: { text: string; icon?: LucideIcon };
  /** Teaser chip pinned to the plate's lower corner. */
  chip?: ProgramHeroChip;
  /** What the framed plate shows: a photo (cropped, darkened edge) or an emblem on white. */
  plate: { image: string; alt: string; tone: 'photo' | 'emblem' };
  /** Icon of the small red badge on the plate; omit to drop the badge. */
  badgeIcon?: LucideIcon;
  /** Decoration pinned to the plate's bottom edge (the platform's equalizer bars). */
  plateMotif?: ReactNode;
  /** Faint blurred photo behind the whole hero; omit for programs whose only image is a logo. */
  backdropImage?: string;
  /**
   * One continuous piece: the photo melts into the dark backdrop with faded edges instead of
   * sitting in a framed plate, and the teaser chip turns into a glass pill instead of a white card.
   */
  seamless?: boolean;
};

const heroEase = [0.22, 1, 0.36, 1] as const;

const actionClass = {
  primary:
    'group inline-flex min-h-12 items-center gap-2 rounded-full bg-primary-600 px-7 py-3 text-sm font-black text-white shadow-[0_18px_40px_rgba(218,8,18,0.35)] transition-all hover:-translate-y-0.5 hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:hover:translate-y-0',
  secondary:
    'group inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white',
} as const;

function HeroAction({
  action,
  variant,
  reduced,
  isRtl,
}: {
  action: ProgramHeroAction;
  variant: keyof typeof actionClass;
  reduced: boolean;
  isRtl: boolean;
}) {
  const Icon = action.icon;
  const leading = Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null;
  const className = actionClass[variant];

  if (action.to) {
    const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
    const trailing = (
      <ArrowIcon
        className={`h-4 w-4 transition-transform ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
        aria-hidden="true"
      />
    );
    return /^https?:\/\//.test(action.to) ? (
      <a href={action.to} target="_blank" rel="noopener noreferrer" className={className}>
        {leading}
        {action.label}
        {trailing}
      </a>
    ) : (
      <Link to={action.to} className={className}>
        {leading}
        {action.label}
        {trailing}
      </Link>
    );
  }

  const scrollToAnchor = () => {
    const el = action.anchor ? document.getElementById(action.anchor) : null;
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <button type="button" onClick={scrollToAnchor} className={className}>
      {leading}
      {action.label}
      <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
    </button>
  );
}

/**
 * The hero every program page shares: copy on the start side, the program's
 * image on the end side held in a framed plate with an offset outline and a
 * teaser chip. A faint blurred photo can sit behind everything; either way the
 * top of the page stays dark under the fixed header.
 */
export default function ProgramHero({
  program,
  breadcrumbs,
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  primary,
  secondary,
  tags = [],
  note,
  chip,
  plate,
  badgeIcon: BadgeIcon,
  plateMotif,
  backdropImage,
  seamless = false,
}: ProgramHeroProps) {
  const { isRtl } = useI18n();
  const reduced = !!useReducedMotion();
  const duration = reduced ? 0.01 : 0.7;
  const NoteIcon = note?.icon;
  const isPhoto = plate.tone === 'photo';

  const reveal = (delay: number, distance = 20) => ({
    initial: { opacity: 0, y: reduced ? 0 : distance },
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay: reduced ? 0 : delay, ease: heroEase },
  });

  return (
    // On desktop the hero fills the first screen minus the highlights strip that follows it, so the
    // strip always sits at the fold; the cap keeps very tall screens from leaving the copy adrift.
    <section className="relative isolate overflow-hidden bg-dark-950 pb-16 pt-28 text-white md:pb-20 lg:flex lg:min-h-[min(calc(100svh_-_4rem),56rem)] lg:items-center lg:pb-10">
      {backdropImage && (
        <motion.img
          src={backdropImage}
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0, scale: reduced ? 1.1 : 1.16 }}
          animate={{ opacity: 1, scale: 1.1 }}
          transition={{ duration: reduced ? 0.01 : 1.2, ease: heroEase }}
          className="absolute inset-0 -z-30 h-full w-full object-cover opacity-[0.16] blur-[6px] saturate-50"
        />
      )}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-dark-950/75 via-dark-950/80 to-dark-950" />
      {/* Red glow on the plate side; the copy side stays clean. */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_25%,rgba(218,8,18,0.34),transparent_48%)] rtl:bg-[radial-gradient(circle_at_15%_25%,rgba(218,8,18,0.34),transparent_48%)]" />
      {/* Fine hatching, fading out toward the bottom. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.05] [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.8)_0,rgba(255,255,255,0.8)_1px,transparent_1px,transparent_14px)] [mask-image:linear-gradient(to_bottom,black_20%,transparent_90%)]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-4 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div className="text-start">
          <motion.div {...reveal(0, 16)}>
            <Breadcrumbs items={breadcrumbs} light />
          </motion.div>

          {eyebrow && (
            <motion.span {...reveal(0.08, 16)} className="mt-6 inline-flex items-center gap-3 text-sm font-black text-primary-300">
              <span className="program-eyebrow-icon relative flex h-10 w-10 items-center justify-center rounded-xl border border-primary-400/40 bg-primary-600/20 text-primary-300">
                <span className="program-eyebrow-icon__ring" aria-hidden="true" />
                <span className="program-eyebrow-icon__ring program-eyebrow-icon__ring--late" aria-hidden="true" />
                <EyebrowIcon className="program-eyebrow-icon__glyph relative h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              {eyebrow}
            </motion.span>
          )}

          <motion.h1
            {...reveal(0.16, 28)}
            className="mt-5 max-w-3xl text-balance text-4xl font-bold leading-[1.18] md:text-6xl lg:text-[4rem]"
          >
            {program.title}
          </motion.h1>

          <motion.p {...reveal(0.26, 24)} className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">
            {program.summary}
          </motion.p>

          {tags.length > 0 && (
            <motion.ul {...reveal(0.32, 18)} className="mt-6 flex flex-wrap items-center gap-2">
              {tags.map((tag, index) => {
                const Icon = tag.icon;
                return (
                  <li
                    key={`${tag.label}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-[13px] font-bold text-white/80 backdrop-blur"
                  >
                    {Icon && <Icon className="h-3.5 w-3.5 text-primary-400" aria-hidden="true" />}
                    {tag.label}
                  </li>
                );
              })}
            </motion.ul>
          )}

          {(primary || secondary) && (
            <motion.div {...reveal(0.4, 20)} className="mt-7 flex flex-wrap items-center gap-3">
              {primary && <HeroAction action={primary} variant="primary" reduced={reduced} isRtl={isRtl} />}
              {secondary && <HeroAction action={secondary} variant="secondary" reduced={reduced} isRtl={isRtl} />}
            </motion.div>
          )}

          {note?.text && (
            <motion.p {...reveal(0.48, 12)} className="mt-6 flex max-w-xl items-start gap-3 text-sm leading-relaxed text-white/55">
              {NoteIcon && <NoteIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" aria-hidden="true" />}
              {note.text}
            </motion.p>
          )}
        </div>

        {seamless ? (
          /* One piece: the photo fades into the backdrop on every edge — no frame, no plate. */
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.85, delay: reduced ? 0 : 0.28, ease: heroEase }}
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -end-12 -top-12 -z-10 h-56 w-56 rounded-full bg-primary-600/30 blur-3xl"
            />

            <figure className="relative">
              <img
                src={plate.image}
                alt={plate.alt}
                width={1080}
                height={1080}
                className={`w-full [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_16%,black_84%,transparent),linear-gradient(to_bottom,transparent,black_16%,black_84%,transparent)] ${
                  isPhoto ? 'aspect-[16/11] object-cover [object-position:50%_5%]' : 'aspect-[16/11] object-contain'
                }`}
              />
              {plateMotif && (
                <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">{plateMotif}</div>
              )}
            </figure>

            {chip?.label && (
              <motion.div
                {...reveal(0.6, 16)}
                className="absolute bottom-3 start-5 flex items-center gap-4 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-start backdrop-blur md:start-8"
              >
                {chip.value ? (
                  <span dir="ltr" className="text-3xl font-black tabular-nums leading-none text-gold-300">
                    {chip.value}
                  </span>
                ) : (
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-primary-500" />
                  </span>
                )}
                <span className="max-w-[11rem] text-sm font-bold leading-snug text-white/90">{chip.label}</span>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* Framed plate */
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.85, delay: reduced ? 0 : 0.28, ease: heroEase }}
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-3 translate-x-4 translate-y-4 rounded-[36px] border border-white/15 rtl:-translate-x-4"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -end-12 -top-12 -z-10 h-56 w-56 rounded-full bg-primary-600/30 blur-3xl"
            />

            <figure
              className={`relative overflow-hidden rounded-[30px] shadow-[0_34px_80px_rgba(0,0,0,0.5)] ring-1 ring-white/20 ${
                isPhoto ? 'bg-dark-900' : 'bg-white'
              }`}
            >
              <img
                src={plate.image}
                alt={plate.alt}
                width={1080}
                height={1080}
                className={
                  isPhoto
                    ? 'aspect-[16/10] w-full object-cover [object-position:50%_5%]'
                    : 'aspect-[16/10] w-full scale-[1.45] object-contain'
                }
              />
              {isPhoto && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-dark-950/70 to-transparent"
                />
              )}
              {BadgeIcon && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-5 end-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-[0_12px_26px_rgba(218,8,18,0.45)]"
                >
                  <BadgeIcon className="h-5 w-5" />
                </span>
              )}
              {plateMotif && (
                <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center">{plateMotif}</div>
              )}
            </figure>

            {chip?.label && (
              <motion.div
                {...reveal(0.6, 16)}
                className="absolute -bottom-6 start-5 flex items-center gap-4 rounded-2xl bg-white px-5 py-3.5 text-start text-dark-950 shadow-[0_24px_50px_rgba(0,0,0,0.35)] md:start-8"
              >
                {chip.value ? (
                  <span dir="ltr" className="text-3xl font-black tabular-nums leading-none text-primary-700">
                    {chip.value}
                  </span>
                ) : (
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-primary-600" />
                  </span>
                )}
                <span className="max-w-[11rem] text-sm font-bold leading-snug text-dark-700">{chip.label}</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* One piece: the dark backdrop dissolves into the white canvas below — no bottom edge. */}
      {seamless && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-white md:h-36"
        />
      )}
    </section>
  );
}
