import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Building2, GraduationCap, Images, Megaphone, Users } from 'lucide-react';
import LibraryLightbox from '@/components/library/LibraryLightbox';
import { getLibraryContent, type LibraryGalleryImage } from '@/data/library';
import type { LibraryProfileContent } from '@/data/library/profile';
import { useInView } from '@/hooks/useInView';
import { useI18n } from '@/i18n/useI18n';
import { Chapter, CountUpNumber, containerVariants, revealVariants, smoothEase } from './profileShared';

const groupIcons = [GraduationCap, Users, Building2, Megaphone];

type Stat = LibraryProfileContent['numbers']['capital']['stats'][number];

/** A counting tile that fires when it scrolls into view. */
function StatTile({ stat, big = false, gold = false }: { stat: Stat; big?: boolean; gold?: boolean }) {
  const { ref, inView } = useInView({ threshold: 0.4 });

  return (
    <div ref={ref} className="min-w-0">
      <CountUpNumber
        value={stat.value}
        suffix={stat.suffix}
        decimals={stat.decimals}
        start={inView}
        className={`block font-brand font-bold leading-none ${
          big ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl'
        } ${gold ? 'text-[var(--profile-gold)]' : 'text-primary-700'}`}
      />
      <p className="mt-2 text-sm font-bold text-dark-700">{stat.label}</p>
      {stat.sublabel && <p className="mt-0.5 text-xs leading-relaxed text-dark-400">{stat.sublabel}</p>}
    </div>
  );
}

/** The gigantic hero counter: counts up, then stamps a landing pulse. */
function HeroStat({ stat }: { stat: Stat }) {
  const shouldReduceMotion = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.5 });
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    if (!inView || shouldReduceMotion) return;
    const timer = window.setTimeout(() => setLanded(true), 2100);
    return () => window.clearTimeout(timer);
  }, [inView, shouldReduceMotion]);

  return (
    <div ref={ref} className="relative inline-block text-center">
      {landed && (
        <span
          aria-hidden="true"
          className="profile-pulse pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-32 w-32 -translate-y-1/2 rounded-full border-2 border-primary-300"
        />
      )}
      <CountUpNumber
        value={stat.value}
        suffix={stat.suffix}
        decimals={stat.decimals}
        start={inView}
        duration={2000}
        className="block bg-gradient-to-b from-primary-500 via-primary-600 to-primary-900 bg-clip-text font-brand text-7xl font-bold leading-none text-transparent md:text-[120px] lg:text-[150px]"
      />
      <p className="mt-4 font-brand text-xl font-bold text-dark-900 md:text-2xl">{stat.label}</p>
      {stat.sublabel && <p className="mt-1 text-sm text-dark-400">{stat.sublabel}</p>}
    </div>
  );
}

/** 51.67% as a conic ring gauge, the percent counting in sync. */
function ProfitGauge({ stat }: { stat: Stat }) {
  const { ref, inView } = useInView({ threshold: 0.45 });

  return (
    <div ref={ref} className={`flex flex-col items-center ${inView ? 'profile-inview' : ''}`}>
      <div className="relative h-44 w-44 md:h-52 md:w-52">
        <div aria-hidden="true" className="profile-gauge absolute inset-0 rounded-full" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <CountUpNumber
            value={stat.value}
            suffix={stat.suffix}
            decimals={stat.decimals}
            start={inView}
            className="font-brand text-4xl font-bold text-primary-700 md:text-5xl"
          />
        </div>
      </div>
      <p className="mt-4 text-center font-brand text-lg font-bold text-dark-900">{stat.label}</p>
      {stat.sublabel && <p className="mt-0.5 text-center text-xs text-dark-400">{stat.sublabel}</p>}
    </div>
  );
}

type Group = LibraryProfileContent['numbers']['groups'][number];

/** "المسار الأول · رواد اليمن" → ["المسار الأول", "رواد اليمن"]; a heading without the separator is all name. */
function splitHeading(heading: string): [string | null, string] {
  const [ordinal, ...rest] = heading.split(' · ');
  return rest.length ? [ordinal, rest.join(' · ')] : [null, heading];
}

/**
 * One track's page in the record: folio + ordinal and the track name on the start side,
 * the lead figure large beside them, then the remaining figures as a ruled ledger whose
 * hairlines draw in once the band itself is on screen (not with the vault frame).
 */
function TrackLedger({ group, index }: { group: Group; index: number }) {
  const shouldReduceMotion = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.25 });
  const Icon = groupIcons[index] ?? GraduationCap;
  const [ordinal, name] = splitHeading(group.heading);
  const [lead, ...rest] = group.stats;
  const folio = String(index + 1).padStart(2, '0');

  if (!lead) return null;

  return (
    <motion.article
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -6% 0px' }}
      transition={shouldReduceMotion ? { duration: 0.01 } : { duration: 0.65, ease: smoothEase }}
      className="py-9 md:py-11"
    >
      <div ref={ref} className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <header className="lg:col-span-4">
          <p className="flex items-center gap-3 text-xs font-bold tracking-wide text-dark-400">
            <span className="font-brand text-base leading-none text-[var(--profile-gold)]">{folio}</span>
            <span aria-hidden="true" className="h-px w-6 bg-[var(--profile-gold-soft)]" />
            {ordinal && <span>{ordinal}</span>}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="font-brand text-2xl font-bold leading-tight text-dark-900 md:text-[26px]">{name}</h3>
          </div>
          {group.caption && <p className="mt-4 max-w-xs text-sm leading-relaxed text-dark-500">{group.caption}</p>}
        </header>

        <div className="lg:col-span-3">
          <CountUpNumber
            value={lead.value}
            suffix={lead.suffix}
            decimals={lead.decimals}
            start={inView}
            className="block font-brand text-5xl font-bold leading-none text-primary-700 md:text-6xl"
          />
          <p className="mt-3 text-base font-bold leading-snug text-dark-800">{lead.label}</p>
          {lead.sublabel && <p className="mt-1 text-xs leading-relaxed text-dark-400">{lead.sublabel}</p>}
        </div>

        <div className={`grid content-start gap-x-8 lg:col-span-5 ${rest.length > 3 ? 'md:grid-cols-2' : ''}`}>
          {rest.map((stat, statIndex) => (
            <div
              key={stat.label}
              className={`profile-rule ${inView ? 'profile-rule--drawn' : ''} flex items-end justify-between gap-4 py-3 text-dark-900`}
              style={{ '--profile-delay': `${200 + statIndex * 110}ms` } as React.CSSProperties}
            >
              <div className="min-w-0">
                <p className="text-sm font-bold leading-snug text-dark-700">{stat.label}</p>
                {stat.sublabel && <p className="mt-0.5 text-xs leading-relaxed text-dark-400">{stat.sublabel}</p>}
              </div>
              <CountUpNumber
                value={stat.value}
                suffix={stat.suffix}
                decimals={stat.decimals}
                start={inView}
                duration={1400}
                className="shrink-0 font-brand text-2xl font-bold leading-none text-dark-900"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

/** Chapter 11 — أويس في أرقام: the vault. The December-2025 record counts itself live. */
export default function ProfileNumbersChapter({ content }: { content: LibraryProfileContent }) {
  const { locale, isRtl } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const frame = useInView({ threshold: 0.05 });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { numbers, labels } = content;
  const libraryLabels = getLibraryContent(locale).labels;
  const reveal = revealVariants(shouldReduceMotion);

  const infographicImages: LibraryGalleryImage[] = numbers.boards.map((board, index) => ({
    id: `board-${index}`,
    title: board.alt ? `${numbers.heading} · ${board.alt}` : `${numbers.heading} ${index + 1}/${numbers.boards.length}`,
    image: board.src,
    thumbnail: board.src,
    sourceUrl: '',
    imageAlt: board.alt || `${numbers.heading} — ${labels.infographicsNote}`,
    width: 720,
    height: 1280,
  }));

  return (
    <Chapter id="profile-numbers" className="profile-stage overflow-hidden py-8 md:py-12">
      <div aria-hidden="true" className="profile-stage-pattern profile-stage-pattern--drift geometric-pattern" />

      <div ref={frame.ref} className={`relative mx-2 md:mx-6 ${frame.inView ? 'profile-inview' : ''}`}>
        {/* Act 1: the vault's gold frame draws itself before the first counter fires. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span
            className="profile-track profile-gold-line absolute inset-x-0 top-0 h-px bg-[var(--profile-gold-soft)]"
            style={{ '--profile-delay': '0ms' } as React.CSSProperties}
          />
          <span
            className="profile-track--y profile-track profile-gold-line absolute inset-y-0 end-0 w-px bg-[var(--profile-gold-soft)]"
            style={{ '--profile-delay': '350ms' } as React.CSSProperties}
          />
          <span
            className="profile-track--y profile-track profile-gold-line absolute inset-y-0 start-0 w-px bg-[var(--profile-gold-soft)]"
            style={{ '--profile-delay': '350ms' } as React.CSSProperties}
          />
          <span
            className="profile-track profile-gold-line absolute inset-x-0 bottom-0 h-px bg-[var(--profile-gold-soft)]"
            style={{ '--profile-delay': '700ms' } as React.CSSProperties}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 md:px-10 md:py-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="text-center"
          >
            <motion.p
              variants={reveal}
              className="text-sm font-bold uppercase tracking-widest text-[var(--profile-gold)]"
            >
              {numbers.eyebrow}
            </motion.p>
            <motion.h2 variants={reveal} className="mt-3 font-brand text-4xl font-bold text-dark-900 md:text-6xl">
              {numbers.heading}
            </motion.h2>
            <motion.p
              variants={reveal}
              className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-dark-500 md:text-lg"
            >
              {numbers.subheading}
            </motion.p>
          </motion.div>

          {/* Cluster 1 — creating the waqf. */}
          <div className="mt-16 text-center">
            <HeroStat stat={numbers.capital.stats[0]} />
            <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 gap-6">
              {numbers.capital.stats.slice(1).map((stat) => (
                <div key={stat.label} className="profile-glass rounded-[20px] p-5 text-center">
                  <StatTile stat={stat} />
                </div>
              ))}
            </div>
          </div>

          {/* Cluster 2 — investing the waqf. */}
          <div className="mt-20 grid items-center gap-10 lg:grid-cols-2">
            <ProfitGauge stat={numbers.investment.profit} />
            <div>
              <h3 className="font-brand text-2xl font-bold text-dark-900">{numbers.investment.heading}</h3>
              <p className="mt-2 text-dark-500">{numbers.investment.lead}</p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {numbers.investment.activities.map((activity, index) => (
                  <motion.span
                    key={activity}
                    initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0.01 }
                        : { delay: index * 0.08, type: 'spring', stiffness: 260, damping: 20 }
                    }
                    className="inline-flex min-h-10 items-center rounded-full border border-primary-200 bg-white px-4 text-sm font-bold text-primary-800"
                  >
                    {activity}
                  </motion.span>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <StatTile stat={numbers.programsStat} big />
                <StatTile stat={numbers.beneficiariesStat} big gold />
              </div>
            </div>
          </div>

          {/* Clusters 3–6 — the four tracks as one ruled record sheet, a band per track. */}
          <div
            id="profile-numbers-tracks"
            className="profile-glass mt-20 divide-y divide-[rgba(184,147,63,0.3)] rounded-[28px] px-5 py-1 md:px-10 md:py-2"
          >
            {numbers.groups.map((group, groupIndex) => (
              <TrackLedger key={group.heading} group={group} index={groupIndex} />
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-dark-400">{numbers.platformsNote}</p>

          <motion.p
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-12 max-w-3xl border-s-2 border-[var(--profile-gold)] ps-5 text-start font-brand text-lg font-bold leading-relaxed text-dark-800 md:text-xl"
          >
            {numbers.closing}
          </motion.p>

          {/* Sources: the five original boards, as provenance — never the rendering. */}
          <div className="mt-14">
            <p className="text-center text-sm font-bold text-dark-500">
              {labels.openInfographics} · <span className="text-dark-400">{labels.infographicsNote}</span>
            </p>
            <div className="no-scrollbar mt-5 flex justify-start gap-4 overflow-x-auto pb-2 md:justify-center">
              {infographicImages.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="btn-border-run btn-border-run--sheen-tint group relative shrink-0 overflow-hidden rounded-2xl shadow-[0_10px_26px_rgba(40,12,18,0.12)] ring-1 ring-primary-100 transition-transform duration-300 hover:-translate-y-1"
                  aria-label={`${libraryLabels.openImage}: ${image.title}`}
                >
                  <img
                    src={image.thumbnail}
                    alt={image.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-32 w-[72px] object-cover object-top transition-transform duration-500 group-hover:scale-105 md:h-40 md:w-[90px]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="absolute bottom-1.5 start-0 end-0 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <Images className="h-4 w-4 text-primary-700" aria-hidden="true" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <LibraryLightbox
        images={infographicImages}
        activeIndex={lightboxIndex}
        labels={libraryLabels}
        isRtl={isRtl}
        onClose={() => setLightboxIndex(null)}
        onMove={(next) => {
          const total = infographicImages.length;
          setLightboxIndex(((next % total) + total) % total);
        }}
      />
    </Chapter>
  );
}
