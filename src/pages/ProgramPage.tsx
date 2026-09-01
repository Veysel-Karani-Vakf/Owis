import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  Scale,
  Target,
  Users,
  Wallet,
  Clapperboard,
  Globe2,
  GraduationCap,
  HandHeart,
  Hash,
  HeartHandshake,
  Landmark,
  Layers3,
  Mail,
  MapPin,
  MessagesSquare,
  Mic,
  PenLine,
  Play,
  Quote,
  Radio,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import FadeContent from '@/components/effects/FadeContent';
import AwarenessMedia from '@/components/programs/AwarenessMedia';
import AwarenessSpotlight from '@/components/programs/AwarenessSpotlight';
import AwarenessThemes from '@/components/programs/AwarenessThemes';
import InstitutionalBeneficiaries from '@/components/programs/InstitutionalBeneficiaries';
import InstitutionalFigures from '@/components/programs/InstitutionalFigures';
import InstitutionalMap from '@/components/programs/InstitutionalMap';
import EqualizerBars from '@/components/programs/EqualizerBars';
import ProgramHero, { type ProgramHeroAction, type ProgramHeroProps } from '@/components/programs/ProgramHero';
import PageSeo from '@/components/internal/PageSeo';
import PioneerGoals from '@/components/programs/PioneerGoals';
import PioneerHighlightsMarquee from '@/components/programs/PioneerHighlightsMarquee';
import PioneerJourney from '@/components/programs/PioneerJourney';
import PioneerOverview from '@/components/programs/PioneerOverview';
import PioneerPillars from '@/components/programs/PioneerPillars';
import PioneerStatsHex from '@/components/programs/PioneerStatsHex';
import PioneerVideoCarousel from '@/components/programs/PioneerVideoCarousel';
import VolunteerFields from '@/components/programs/VolunteerFields';
import VolunteerGoals from '@/components/programs/VolunteerGoals';
import VolunteerStatement from '@/components/programs/VolunteerStatement';
import VolunteerSteps from '@/components/programs/VolunteerSteps';
import VideoModal from '@/components/ui/VideoModal';
import { donateRoute } from '@/data/donate';
import { participateRoutes } from '@/data/participate';
import {
  getDefaultVolunteerCopy,
  getOtherPrograms,
  getProgram,
  getProgramBreadcrumbs,
  getProgramsContent,
  resolveProgramLayout,
  type Program,
  type ProgramCity,
  type ProgramSection,
  type ProgramsPageContent,
  type ProgramVideo,
  type VolunteerCopy,
} from '@/data/programs';
import { useNarrowScreen } from '@/hooks/useResponsiveMotion';
import { localizedContent, type Locale, type SiteContent } from '@/i18n/content';
import { useI18n } from '@/i18n/useI18n';
import { resolveIcon } from '@/lib/icons';
import type { ProgramLayout } from '@/lib/types';

const revealEase = [0.22, 1, 0.36, 1] as const;

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
};

type ActiveVideo = {
  videoId: string;
  videoFile?: string;
  title: string;
  posterImage: string;
};

function absoluteUrl(path: string) {
  if (path.startsWith('http')) return path;
  if (typeof window === 'undefined') return path;
  return `${window.location.origin}${path}`;
}

function applyHomePioneersHero(
  program: Program | undefined,
  homePioneers: Pick<SiteContent['yemenPioneers'], 'image' | 'title'>,
  locale: Locale,
): Program | undefined {
  const dashboardImage = homePioneers.image?.trim();
  const defaultHomeImage = localizedContent[locale].yemenPioneers.image.trim();
  if (
    !program ||
    program.slug !== 'yemen-pioneers' ||
    !dashboardImage ||
    dashboardImage === defaultHomeImage ||
    dashboardImage === program.heroImage
  ) {
    return program;
  }

  return {
    ...program,
    heroImage: dashboardImage,
    heroImageAlt: program.heroImageAlt || homePioneers.title || program.title,
    images: [dashboardImage, ...(program.images ?? []).filter((image) => image !== dashboardImage)],
  };
}

function SectionHeading({ eyebrow, title, description, centered = false }: SectionHeadingProps) {
  return (
    <div className={centered ? 'mx-auto mb-10 max-w-3xl text-center' : 'mb-8 max-w-3xl text-start'}>
      <div className={`mb-4 flex items-center gap-2 ${centered ? 'justify-center' : ''}`}>
        <span className="h-px w-8 bg-primary-200" />
        <span className="text-sm font-semibold text-primary-700">{eyebrow}</span>
        <span className="h-px w-8 bg-primary-200" />
      </div>
      <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-dark-600 md:text-lg">{description}</p>
      )}
    </div>
  );
}

function ProgramSectionBlock({ section }: { section: ProgramSection }) {
  return (
    <FadeContent blur={false} duration={620} initialOpacity={0} yOffset={14} threshold={0.18} once>
      <article className="rounded-[22px] border border-primary-100 bg-white p-6 text-start shadow-[0_18px_48px_rgba(40,12,18,0.07)] md:p-8">
        <h3 className="text-2xl font-bold text-dark-950">{section.title}</h3>
        {section.paragraphs && (
          <div className="mt-4 space-y-3 text-base leading-relaxed text-dark-600">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}

        {section.bullets && (
          <div role="list" className="mt-5 grid gap-3">
            {section.bullets.map((bullet, index) => (
              <div
                role="listitem"
                key={bullet}
                className="flex gap-3 rounded-2xl border border-primary-100 bg-primary-50/55 p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-primary-700 shadow-sm">
                  {section.ordered ? index + 1 : <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                </span>
                <p className="text-sm leading-relaxed text-dark-700 md:text-base">{bullet}</p>
              </div>
            ))}
          </div>
        )}
      </article>
    </FadeContent>
  );
}

function NumberedList({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();
  const isNarrow = useNarrowScreen();
  const revealY = isNarrow ? 12 : 18;
  const revealAmount = isNarrow ? 0.12 : 0.2;
  const revealMargin = isNarrow ? '0px 0px -8% 0px' : '0px 0px -10% 0px';

  return (
    <div>
      <SectionHeading eyebrow={title} title={title} centered />
      <ol className="grid gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <motion.li
            key={item}
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: revealY }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: revealAmount, margin: revealMargin }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : isNarrow ? 0.42 : 0.5,
              delay: shouldReduceMotion ? 0 : index * 0.06,
              ease: revealEase,
            }}
            className="flex gap-4 rounded-[22px] border border-primary-100 bg-white p-5 text-start shadow-[0_16px_42px_rgba(40,12,18,0.06)]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
              {icon}
            </span>
            <div>
              <span className="text-xs font-bold text-primary-600">{String(index + 1).padStart(2, '0')}</span>
              <p className="mt-1 text-base leading-relaxed text-dark-700">{item}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function StatisticsSection({
  program,
  labels,
  hexStats,
}: {
  program: Program;
  labels: ReturnType<typeof getProgramsContent>['labels'];
  /** True for the pioneers layout: the verified home-page indicators drawn as a hexagon diagram. */
  hexStats: boolean;
}) {
  const { content, t, formatNumber, isRtl } = useI18n();

  // The pioneers layout mirrors the verified indicators shown on the home page (CMS-aware), laid
  // out as a hexagon summary diagram instead of the plain card grid.
  if (hexStats) {
    const pioneers = content.yemenPioneers;
    return (
      <section id="cms-program-stats" className="overflow-hidden bg-[#faf8f8] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <PioneerStatsHex
            eyebrow={labels.pioneerStatsEyebrow}
            title={labels.pioneerStatsTitle}
            description={labels.pioneerStatsDescription}
            centerTitle={pioneers.title}
            centerLabel={labels.pioneerStatsCenter}
            indicators={pioneers.indicators}
            unavailableLabel={t('common.unavailable')}
            formatNumber={formatNumber}
            isRtl={isRtl}
          />
        </div>
      </section>
    );
  }

  if (!program.statistics?.length) return null;

  return (
    <section id="cms-program-stats" className="bg-[#faf8f8] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading eyebrow={labels.statistics} title={labels.statistics} centered />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {program.statistics.map((stat) => (
            <FadeContent
              key={`${stat.value}-${stat.label}`}
              blur={false}
              duration={560}
              initialOpacity={0}
              yOffset={12}
              threshold={0.18}
              once
            >
              <article className="rounded-[22px] border border-primary-100 bg-white p-6 text-center shadow-[0_16px_42px_rgba(40,12,18,0.07)]">
                <BarChart3 className="mx-auto h-7 w-7 text-primary-600" aria-hidden="true" />
                <p className="mt-4 text-4xl font-black text-dark-950 md:text-5xl">{stat.value}</p>
                <p className="mt-2 text-sm font-semibold text-dark-600">{stat.label}</p>
              </article>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
}

function CityMedia({
  cities,
  labels,
  onVideoSelect,
}: {
  cities: ProgramCity[];
  labels: ReturnType<typeof getProgramsContent>['labels'];
  onVideoSelect: (video: ActiveVideo) => void;
}) {
  const { isRtl } = useI18n();
  const reduced = !!useReducedMotion();
  const [selectedCityId, setSelectedCityId] = useState(cities[0]?.id ?? '');
  const selectedIndex = Math.max(0, cities.findIndex((city) => city.id === selectedCityId));
  const selectedCity = cities[selectedIndex];

  if (!selectedCity) return null;

  const stepCity = (offset: number) =>
    setSelectedCityId(cities[(selectedIndex + offset + cities.length) % cities.length].id);
  const NextIcon = isRtl ? ArrowLeft : ArrowRight;
  const PrevIcon = isRtl ? ArrowRight : ArrowLeft;

  const cityFacts = [
    { icon: CalendarDays, text: selectedCity.period },
    { icon: Building2, text: selectedCity.organizations },
    { icon: HeartHandshake, text: selectedCity.partner ? `${labels.partner} ${selectedCity.partner}` : undefined },
    { icon: Award, text: selectedCity.patron },
  ].filter((fact): fact is { icon: LucideIcon; text: string } => Boolean(fact.text));

  const swap = {
    initial: reduced ? { opacity: 1 } : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    exit: reduced ? { opacity: 1 } : { opacity: 0, y: -10 },
    transition: { duration: 0.3, ease: revealEase },
  } as const;

  return (
    <section id="cms-program-cities" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          eyebrow={labels.officialMedia}
          title={labels.cityMedia}
          description={labels.cityExplorerDescription}
          centered
        />

        <div
          role="tablist"
          aria-label={labels.cityMedia}
          className="mb-6 flex gap-2.5 overflow-x-auto pb-2 lg:justify-center"
        >
          {cities.map((city, index) => {
            const active = city.id === selectedCity.id;

            return (
              <button
                key={city.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCityId(city.id)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 ${
                  active
                    ? 'bg-primary-600 text-white shadow-[0_12px_28px_rgba(195,7,16,0.28)]'
                    : 'border border-primary-100 bg-white text-primary-700 hover:border-primary-200 hover:bg-primary-50'
                }`}
              >
                <span
                  dir="ltr"
                  className={`text-[11px] font-black tabular-nums ${active ? 'text-white/70' : 'text-primary-300'}`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                {city.name}
              </button>
            );
          })}
        </div>

        <FadeContent blur={false} duration={620} initialOpacity={0} yOffset={16} threshold={0.18} once>
          <article className="overflow-hidden rounded-[28px] border border-primary-100 bg-white shadow-[0_24px_64px_rgba(40,12,18,0.09)]">
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative flex flex-col justify-center p-6 text-start md:p-8">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -start-16 -top-16 h-48 w-48 rounded-full bg-primary-50 blur-2xl"
                />

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={selectedCity.id} {...swap} className="relative">
                    <p className="text-sm font-bold text-primary-600">
                      {labels.stepLabel}{' '}
                      {/* The LTR block keeps its written order on screen, so RTL needs it reversed
                          for the current stop to sit next to the label. */}
                      <span dir="ltr" className="tabular-nums">
                        {isRtl
                          ? `${String(cities.length).padStart(2, '0')} / ${String(selectedIndex + 1).padStart(2, '0')}`
                          : `${String(selectedIndex + 1).padStart(2, '0')} / ${String(cities.length).padStart(2, '0')}`}
                      </span>
                    </p>
                    <h3 className="mt-1.5 text-2xl font-bold leading-tight text-dark-950">{selectedCity.name}</h3>

                    {cityFacts.length > 0 && (
                      <div role="list" className="mt-4 divide-y divide-primary-100 border-y border-primary-100">
                        {cityFacts.map(({ icon: Icon, text }) => (
                          <div role="listitem" key={text} className="flex items-center gap-3 py-2.5">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-primary-100">
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <p className="text-sm leading-relaxed text-dark-700">{text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="relative mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      onVideoSelect({
                        videoId: selectedCity.videoId,
                        videoFile: selectedCity.videoFile,
                        title: selectedCity.videoTitle,
                        posterImage: selectedCity.image,
                      })
                    }
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                  >
                    <Play className="h-4 w-4" aria-hidden="true" />
                    {labels.watchVideo}
                  </button>

                  <div className="ms-auto flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={labels.previous}
                      onClick={() => stepCity(-1)}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-100 bg-white text-primary-700 transition-colors hover:border-primary-200 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                    >
                      <PrevIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label={labels.next}
                      onClick={() => stepCity(1)}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-100 bg-white text-primary-700 transition-colors hover:border-primary-200 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                    >
                      <NextIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-center bg-[#faf8f8] p-4 md:p-6">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-20 -end-20 h-64 w-64 rounded-full bg-primary-100/50 blur-3xl"
                />
                <AnimatePresence mode="wait" initial={false}>
                  <motion.figure
                    key={selectedCity.id}
                    initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.3, ease: revealEase }}
                    className="relative m-0"
                  >
                    <img
                      src={selectedCity.image}
                      alt={selectedCity.imageAlt}
                      width={1080}
                      height={1350}
                      className="max-h-[24rem] w-full rounded-2xl border border-primary-100 bg-white object-contain shadow-[0_18px_48px_rgba(40,12,18,0.12)]"
                    />
                  </motion.figure>
                </AnimatePresence>
              </div>
            </div>
          </article>
        </FadeContent>
      </div>
    </section>
  );
}

function MediaGallery({
  program,
  labels,
  onVideoSelect,
}: {
  program: Program;
  labels: ReturnType<typeof getProgramsContent>['labels'];
  onVideoSelect: (video: ActiveVideo) => void;
}) {
  if (program.cities?.length) {
    return (
      <CityMedia
        cities={program.cities}
        labels={labels}
        onVideoSelect={onVideoSelect}
      />
    );
  }

  const videos = program.videos ?? [];
  // A single gallery image that merely repeats the hero adds nothing next to a video carousel.
  const showImages =
    program.slug !== 'yemen-pioneers' &&
    program.imageGallery.length > 0 &&
    (videos.length < 2 || program.imageGallery.some((image) => image.src !== program.heroImage));
  const useCarousel = videos.length >= 2;

  if (!showImages && !videos.length) return null;

  if (useCarousel) {
    return (
      <section className="overflow-hidden bg-white py-16 md:py-24">
        <PioneerVideoCarousel
          eyebrow={labels.officialMedia}
          title={labels.videoGallery}
          description={labels.videoGalleryDescription}
          videos={videos}
          labels={labels}
          onVideoSelect={onVideoSelect}
        />
        {showImages && (
          <div className="mx-auto mt-12 grid max-w-7xl gap-5 px-4 md:grid-cols-2 md:px-8">
            {program.imageGallery.map((image) => (
              <FadeContent key={image.src} blur={false} duration={620} initialOpacity={0} yOffset={14} threshold={0.18} once>
                <figure className="overflow-hidden rounded-[22px] border border-primary-100 bg-white shadow-[0_18px_48px_rgba(40,12,18,0.07)]">
                  <img
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                  />
                  {image.caption && (
                    <figcaption className="px-5 py-4 text-sm font-semibold text-dark-600">{image.caption}</figcaption>
                  )}
                </figure>
              </FadeContent>
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading eyebrow={labels.officialMedia} title={labels.officialMedia} centered />

        {showImages && (
          <div className="grid gap-5 md:grid-cols-2">
            {program.imageGallery.map((image) => (
              <FadeContent
                key={image.src}
                blur={false}
                duration={620}
                initialOpacity={0}
                yOffset={14}
                threshold={0.18}
                once
              >
                <figure className="overflow-hidden rounded-[22px] border border-primary-100 bg-white shadow-[0_18px_48px_rgba(40,12,18,0.07)]">
                  <img
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                  />
                  {image.caption && (
                    <figcaption className="px-5 py-4 text-sm font-semibold text-dark-600">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              </FadeContent>
            ))}
          </div>
        )}

        {videos.length > 0 && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                labels={labels}
                onVideoSelect={onVideoSelect}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function VideoCard({
  video,
  labels,
  onVideoSelect,
}: {
  video: ProgramVideo;
  labels: ReturnType<typeof getProgramsContent>['labels'];
  onVideoSelect: (video: ActiveVideo) => void;
}) {
  return (
    <FadeContent blur={false} duration={560} initialOpacity={0} yOffset={14} threshold={0.18} once>
      <article className="overflow-hidden rounded-[22px] border border-primary-100 bg-white text-start shadow-[0_16px_42px_rgba(40,12,18,0.07)]">
        <button
          type="button"
          onClick={() =>
            onVideoSelect({
              videoId: video.videoId,
              videoFile: video.videoFile,
              title: video.title,
              posterImage: video.posterImage,
            })
          }
          className="group relative block aspect-video w-full overflow-hidden bg-dark-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
          aria-label={`${labels.watchVideo}: ${video.title}`}
        >
          <img
            src={video.posterImage}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-dark-950/28" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary-700 shadow-xl transition-transform group-hover:scale-105">
              <Play className="h-6 w-6 fill-current" aria-hidden="true" />
            </span>
          </span>
        </button>
        <div className="p-5">
          <h3 className="text-lg font-bold text-dark-950">{video.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-dark-600">{video.description}</p>
        </div>
      </article>
    </FadeContent>
  );
}

function InitiativesSection({
  program,
  labels,
}: {
  program: Program;
  labels: ReturnType<typeof getProgramsContent>['labels'];
}) {
  const { isRtl } = useI18n();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  if (!program.initiatives?.length) return null;

  return (
    <section className="bg-[#faf8f8] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading eyebrow={labels.initiatives} title={labels.initiatives} centered />
        <div className="grid gap-6 md:grid-cols-2">
          {program.initiatives.map((initiative, index) => {
            const products = initiative.products ?? [];
            const url = initiative.url?.trim();
            const isExternal = !!url && /^https?:\/\//.test(url);
            const cardClass =
              'flex h-full flex-col overflow-hidden rounded-[22px] border border-primary-100 bg-white text-start shadow-[0_18px_48px_rgba(40,12,18,0.07)]';
            const linkClass = `${cardClass} group transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_22px_52px_rgba(40,12,18,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 motion-reduce:hover:translate-y-0`;

            const body = (
              <>
                {initiative.image && (
                  <div className="aspect-[16/10] overflow-hidden bg-primary-50">
                    <img
                      src={initiative.image}
                      alt={initiative.imageAlt}
                      width={1080}
                      height={1080}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-2xl font-bold text-dark-950">{initiative.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-dark-600">{initiative.description}</p>

                  {products.length > 0 && (
                    <div className="mt-5">
                      <p className="text-sm font-bold text-primary-700">{labels.products}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {products.map((product) => (
                          <span
                            key={product}
                            className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {url && (
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-700">
                      {labels.details}
                      <ArrowIcon
                        className={`h-4 w-4 transition-transform ${
                          isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  )}
                </div>
              </>
            );

            return (
              <FadeContent
                key={`${initiative.title}-${index}`}
                blur={false}
                duration={620}
                initialOpacity={0}
                yOffset={16}
                threshold={0.18}
                once
              >
                {/* An initiative with a destination becomes one big link; without one it stays a plain card. */}
                {url ? (
                  isExternal ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {body}
                    </a>
                  ) : (
                    <Link to={url} className={linkClass}>
                      {body}
                    </Link>
                  )
                ) : (
                  <article className={cardClass}>{body}</article>
                )}
              </FadeContent>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DonateCta({
  program,
  isRtl,
}: {
  program: Program;
  isRtl: boolean;
}) {
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const cta = program.cta;

  // The admin may blank the whole block; then the band disappears instead of showing an empty card.
  if (!cta || (!cta.title && !cta.description && !cta.button)) return null;

  const to = cta.url?.trim() || donateRoute;
  const isExternal = /^https?:\/\//.test(to);
  const buttonClass =
    'group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold-400 px-7 py-3 text-sm font-black text-dark-950 transition-colors hover:bg-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300';
  const arrow = (
    <ArrowIcon
      className={`h-4 w-4 transition-transform ${
        isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
      }`}
      aria-hidden="true"
    />
  );

  return (
    <section className="bg-dark-950 py-16 text-white md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <FadeContent blur={false} duration={640} initialOpacity={0} yOffset={18} threshold={0.18} once>
          <div className="grid gap-8 rounded-[24px] border border-white/10 bg-white/[0.06] p-6 text-start shadow-[0_22px_56px_rgba(0,0,0,0.2)] backdrop-blur md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <HandHeart className="h-9 w-9 text-gold-300" aria-hidden="true" />
              <h2 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">{cta.title}</h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/72">{cta.description}</p>
            </div>
            {cta.button &&
              (isExternal ? (
                <a href={to} target="_blank" rel="noopener noreferrer" className={buttonClass}>
                  {cta.button}
                  {arrow}
                </a>
              ) : (
                <Link to={to} className={buttonClass}>
                  {cta.button}
                  {arrow}
                </Link>
              ))}
          </div>
        </FadeContent>
      </div>
    </section>
  );
}

function OtherPrograms({
  program,
  labels,
  isRtl,
}: {
  program: Program;
  labels: ReturnType<typeof getProgramsContent>['labels'];
  isRtl: boolean;
}) {
  const { locale } = useI18n();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const otherPrograms = getOtherPrograms(locale, program.slug);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading eyebrow={labels.programs} title={labels.otherPrograms} centered />
        <div className="grid gap-5 md:grid-cols-3">
          {otherPrograms.map((item, index) => (
            <FadeContent
              key={item.slug}
              blur={false}
              duration={540}
              initialOpacity={0}
              yOffset={14}
              delay={index * 55}
              threshold={0.14}
              once
            >
              <Link
                to={item.route}
                className="group block overflow-hidden rounded-[22px] border border-primary-100 bg-white text-start shadow-[0_16px_42px_rgba(40,12,18,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_22px_52px_rgba(40,12,18,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 motion-reduce:hover:translate-y-0"
              >
                <img
                  src={item.heroImage}
                  alt={item.heroImageAlt}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold text-dark-950">{item.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-dark-600">{item.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-700">
                    {labels.details}
                    <ArrowIcon
                      className={`h-4 w-4 transition-transform ${
                        isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                      }`}
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
}

const institutionalShowcaseAnchor = 'institutional-showcase';

/**
 * The institutional track: its verified figures drawn as seals, the institutions it
 * serves, then its development areas mapped as a hub with animated branches.
 */
function InstitutionalShowcase({
  program,
  labels,
}: {
  program: Program;
  labels: ReturnType<typeof getProgramsContent>['labels'];
}) {
  const audiences = program.audiences ?? [];
  const statistics = program.statistics ?? [];
  // The intro section's bullets are the track's development areas; the map draws them.
  const intro = (program.sections ?? []).find((section) => section.id === 'intro');

  return (
    <div id={institutionalShowcaseAnchor} className="scroll-mt-24">
      {statistics.length > 0 ? (
        <section className="bg-[#faf8f8] py-16 md:py-24">
          <InstitutionalFigures
            statistics={statistics}
            eyebrow={labels.statsEyebrow}
            title={labels.statistics}
          />
        </section>
      ) : null}

      {audiences.length > 0 && (
        <section className="overflow-hidden bg-white py-16 md:py-24">
          <InstitutionalBeneficiaries
            audiences={audiences}
            title={labels.audiences}
            description={labels.audiencesDescription}
          />
        </section>
      )}

      {(intro?.bullets?.length ?? 0) > 0 && (
        <section className="overflow-hidden bg-[#faf8f8] py-16 md:py-24">
          <InstitutionalMap
            eyebrow={labels.manifestoEyebrow}
            title={labels.focusAreas}
            description={labels.focusAreasDescription}
            areaLabel={labels.areaLabel}
            hubTitle={program.title}
            hubSubtitle={program.summary}
            items={intro?.bullets ?? []}
          />
        </section>
      )}
    </div>
  );
}

const trainingAxisIcons: LucideIcon[] = [Target, Wallet, Scale, Users];

/** Anchor targets of the two-program overview cards on the institutional track. */
const yemenProgramAnchor = 'program-yemen';
const sphereProgramAnchor = 'program-sphere';

/** Registration marks in the corners of the two program-dossier cards. */
function CornerTicks({ className = 'border-primary-200' }: { className?: string }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-2.5">
      <span className={`absolute start-0 top-0 h-3 w-3 border-s-2 border-t-2 ${className}`} />
      <span className={`absolute end-0 top-0 h-3 w-3 border-e-2 border-t-2 ${className}`} />
      <span className={`absolute bottom-0 start-0 h-3 w-3 border-b-2 border-s-2 ${className}`} />
      <span className={`absolute bottom-0 end-0 h-3 w-3 border-b-2 border-e-2 ${className}`} />
    </span>
  );
}

/**
 * The institutional track's field record. It opens with the track's two programs side by
 * side — the Yemen capacity raising program and the Sphere program held in Istanbul —
 * then walks through program one (the phase panel beside the official statement, the
 * city documentation, the training areas as an icon grid, the recommendations as a
 * numbered roadmap), presents the Sphere program as its own movement, and closes with
 * the national forum as a gradient showpiece. Sections with ids this design does not
 * know still render as plain blocks, so dashboard-authored sections never disappear.
 */
function InstitutionalDossier({
  program,
  labels,
  onVideoSelect,
}: {
  program: Program;
  labels: ReturnType<typeof getProgramsContent>['labels'];
  onVideoSelect: (video: ActiveVideo) => void;
}) {
  const { isRtl } = useI18n();
  const reduced = !!useReducedMotion();
  const sections = program.sections ?? [];
  const byId = new Map(sections.map((section) => [section.id, section]));
  const capacityIntro = byId.get('capacity-intro');
  const axes = byId.get('training-axes');
  const statement = byId.get('closing-statement');
  const recommendations = byId.get('recommendations');
  const sphere = byId.get('sphere');
  const forum = byId.get('forum');
  // The intro section feeds the development-areas map above.
  const bespokeIds = new Set(['intro', 'capacity-intro', 'training-axes', 'closing-statement', 'recommendations', 'sphere', 'forum']);
  const genericSections = sections.filter((section) => !bespokeIds.has(section.id));
  const phase = program.phase;
  const hasRecord = Boolean(phase || statement || capacityIntro);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  // The statement reads as an official communiqué: an emphasised lead, the body,
  // and — when more than one paragraph exists — the closing formula set apart.
  const statementParagraphs = statement?.paragraphs ?? [];
  const statementClosing =
    statementParagraphs.length > 1 ? statementParagraphs[statementParagraphs.length - 1] : undefined;
  const statementBody = statementClosing ? statementParagraphs.slice(0, -1) : statementParagraphs;

  // Choreography of the first-phase record: each card staggers its children in,
  // the plate's headline slides from the reading direction, badges spring, and
  // the communiqué's rule draws itself. Everything collapses under reduced motion.
  const instant = { duration: 0.01 };
  const recordGroup = (delay: number) => ({
    hidden: {},
    show: { transition: reduced ? undefined : { staggerChildren: 0.11, delayChildren: delay } },
  });
  const recordItem = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: reduced ? instant : { duration: 0.55, ease: revealEase } },
  };
  const recordSlide = {
    hidden: reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: isRtl ? -26 : 26 },
    show: { opacity: 1, x: 0, transition: reduced ? instant : { duration: 0.6, ease: revealEase } },
  };
  const recordPop = {
    hidden: reduced ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.5, rotate: -10 },
    show: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: reduced ? instant : { type: 'spring' as const, stiffness: 320, damping: 18 },
    },
  };
  const recordRule = {
    hidden: reduced ? { scaleX: 1 } : { scaleX: 0 },
    show: { scaleX: 1, transition: reduced ? instant : { duration: 0.7, ease: revealEase } },
  };

  // The two programs of the track, presented up front so neither gets lost in the record.
  const programCards = [
    hasRecord
      ? {
          id: yemenProgramAnchor,
          label: labels.programOneLabel,
          icon: MapPin,
          title: capacityIntro?.title ?? labels.information,
          meta: phase ? `${phase.label} · ${phase.period}` : undefined,
          description: capacityIntro?.paragraphs?.[0] ?? phase?.description,
        }
      : null,
    sphere
      ? {
          id: sphereProgramAnchor,
          label: labels.programTwoLabel,
          icon: Globe2,
          title: sphere.title,
          meta: undefined,
          description: sphere.paragraphs?.[0],
        }
      : null,
  ].filter((card): card is NonNullable<typeof card> & { icon: LucideIcon } => Boolean(card));

  if (!hasRecord && !axes && !recommendations && !sphere && !forum && !genericSections.length) return null;

  return (
    <>
      {programCards.length > 0 && (
        <section className="relative overflow-hidden bg-white py-16 md:py-24">
          {/* A faint drafting grid marks the track's own two-program overview. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(40,12,18,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(40,12,18,0.03)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_75%_75%_at_50%_40%,black,transparent)]"
          />
          <div className="relative mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading
              eyebrow={labels.trackProgramsEyebrow}
              title={labels.trackPrograms}
              description={labels.trackProgramsDescription}
              centered
            />
            <div className={`grid gap-x-6 gap-y-10 ${programCards.length > 1 ? 'lg:grid-cols-2' : 'mx-auto max-w-3xl'}`}>
              {programCards.map((card, index) => (
                <FadeContent
                  key={card.id}
                  blur={false}
                  duration={620}
                  initialOpacity={0}
                  yOffset={16}
                  delay={index * 90}
                  threshold={0.16}
                  once
                >
                  {/* A dossier folder: the program label rides a tab fused to the card below it. */}
                  <div className="group flex h-full flex-col transition-transform duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0">
                    <span className="relative z-10 -mb-px inline-flex items-center gap-2.5 self-start rounded-t-2xl border border-b-0 border-primary-100 bg-[#faf8f8] px-5 py-3 text-xs font-black text-primary-700 transition-colors duration-300 group-hover:border-primary-200">
                      <span aria-hidden="true" className="h-2 w-2 bg-primary-600" />
                      {card.label}
                      <span aria-hidden="true" className="absolute inset-x-px -bottom-px h-px bg-[#faf8f8]" />
                    </span>
                    <article className="relative flex flex-1 flex-col overflow-hidden rounded-[26px] rounded-ss-none border border-primary-100 bg-[#faf8f8] p-7 text-start shadow-[0_18px_48px_rgba(40,12,18,0.07)] transition-all duration-300 group-hover:border-primary-200 group-hover:shadow-[0_26px_60px_rgba(40,12,18,0.11)] md:p-9">
                      <CornerTicks />
                      <span
                        aria-hidden="true"
                        dir="ltr"
                        className="pointer-events-none absolute -bottom-7 end-4 select-none text-[7rem] font-black leading-none tabular-nums text-primary-600/[0.05]"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="relative flex items-start justify-between gap-4">
                        <h3 className="text-2xl font-bold leading-tight text-dark-950">{card.title}</h3>
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary-100 bg-white text-primary-700">
                          <card.icon className="h-6 w-6" aria-hidden="true" />
                        </span>
                      </div>
                      {card.meta && (
                        <p className="relative mt-4 inline-flex items-center gap-2 self-start border border-primary-100 bg-white px-4 py-1.5 text-sm font-bold text-primary-700">
                          <CalendarDays className="h-4 w-4" aria-hidden="true" />
                          {card.meta}
                        </p>
                      )}
                      {card.description && (
                        <p className="relative mt-4 text-base leading-relaxed text-dark-600">{card.description}</p>
                      )}
                      <a
                        href={`#${card.id}`}
                        className="relative mt-auto inline-flex items-center gap-3 self-start pt-6 text-sm font-black text-primary-700"
                      >
                        {labels.details}
                        <span className="flex h-9 w-9 items-center justify-center border border-primary-200 bg-white transition-colors duration-300 group-hover:border-primary-600 group-hover:bg-primary-600 group-hover:text-white">
                          <ArrowIcon className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </a>
                    </article>
                  </div>
                </FadeContent>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasRecord && (
        <section id={yemenProgramAnchor} className="relative scroll-mt-24 overflow-hidden bg-[#faf8f8] py-16 md:py-24">
          {/* The same drafting grid as the two-program overview: program one's record belongs to the dossier. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(40,12,18,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(40,12,18,0.035)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_75%_75%_at_50%_40%,black,transparent)]"
          />
          <div className="relative mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading
              eyebrow={`${labels.programOneLabel} — ${labels.phaseEyebrow}`}
              title={capacityIntro?.title ?? labels.information}
              description={capacityIntro?.paragraphs?.[0]}
              centered
            />
            <div
              className={
                phase && statement
                  ? 'grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start'
                  : 'mx-auto grid max-w-3xl gap-6'
              }
            >
              {phase && (
                <motion.aside
                  variants={recordGroup(0.05)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary-800 via-primary-700 to-primary-950 p-7 text-start text-white shadow-[0_24px_60px_rgba(125,7,12,0.3)] md:p-8 lg:sticky lg:top-28"
                >
                  {/* The phase plate: the record's official cover, dark like the forum showpiece. */}
                  <CornerTicks className="border-white/25" />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -end-14 -top-14 h-48 w-48 rounded-full bg-white/10 blur-2xl"
                  />
                  {!reduced && (
                    <motion.svg
                      aria-hidden="true"
                      viewBox="0 0 200 200"
                      initial={false}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
                      className="pointer-events-none absolute -bottom-16 -start-16 h-56 w-56 text-white/15"
                    >
                      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 10" />
                    </motion.svg>
                  )}
                  {!reduced && (
                    <motion.span
                      aria-hidden="true"
                      initial={{ x: '-130%' }}
                      whileInView={{ x: '130%' }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.55 }}
                      className="pointer-events-none absolute inset-y-0 start-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.09] to-transparent"
                    />
                  )}
                  <motion.span
                    variants={recordPop}
                    className="relative flex h-12 w-12 items-center justify-center border border-white/25 bg-white/10"
                  >
                    {!reduced && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 animate-ping bg-white/20"
                        style={{ animationDuration: '3s' }}
                      />
                    )}
                    <CalendarDays className="relative h-6 w-6" aria-hidden="true" />
                  </motion.span>
                  <motion.p
                    variants={recordItem}
                    className="relative mt-5 flex items-center gap-2.5 text-sm font-black text-white/80"
                  >
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-white" />
                    {phase.label}
                  </motion.p>
                  <motion.p variants={recordSlide} className="relative mt-1.5 text-3xl font-bold leading-tight md:text-4xl">
                    {phase.period}
                  </motion.p>
                  <motion.p variants={recordItem} className="relative mt-4 text-base leading-relaxed text-white/85">
                    {phase.description}
                  </motion.p>
                  {capacityIntro?.paragraphs?.[1] && (
                    <motion.p
                      variants={recordItem}
                      className="relative mt-5 rounded-2xl bg-white/10 p-4 text-sm leading-relaxed text-white/90 ring-1 ring-white/15"
                    >
                      {capacityIntro.paragraphs[1]}
                    </motion.p>
                  )}
                </motion.aside>
              )}
              {statement && (
                <motion.article
                  variants={recordGroup(0.18)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  className="relative overflow-hidden rounded-[24px] border border-primary-100 bg-white p-7 text-start shadow-[0_20px_56px_rgba(40,12,18,0.08)] md:p-10"
                >
                  {/* The communiqué: a lead line, the body, and the closing formula set apart. */}
                  <CornerTicks />
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={reduced ? undefined : { y: [0, 10, 0], rotate: [6, 9, 6] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    className="pointer-events-none absolute -end-6 -top-6 rotate-6"
                  >
                    <Quote className="h-36 w-36 text-primary-600/[0.05]" aria-hidden="true" />
                  </motion.span>
                  <motion.div variants={recordItem} className="relative flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-bold leading-tight text-dark-950 md:text-3xl">{statement.title}</h3>
                    <motion.span
                      variants={recordPop}
                      className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary-100 bg-primary-50 text-primary-600"
                    >
                      <Quote className="h-5 w-5" aria-hidden="true" />
                    </motion.span>
                  </motion.div>
                  <motion.div variants={recordItem} className="relative mt-4 flex items-center gap-2.5" aria-hidden="true">
                    <span className="h-2 w-2 bg-primary-600" />
                    <motion.span
                      variants={recordRule}
                      style={{ transformOrigin: isRtl ? 'right center' : 'left center' }}
                      className="h-px flex-1 bg-primary-100"
                    />
                  </motion.div>
                  <div className="relative mt-6 space-y-5 text-base leading-relaxed text-dark-600">
                    {statementBody.map((paragraph, index) => (
                      <motion.p
                        variants={recordItem}
                        key={paragraph}
                        className={index === 0 ? 'font-semibold text-dark-800' : undefined}
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </div>
                  {statementClosing && (
                    <motion.p
                      variants={recordItem}
                      className="relative mt-6 border-t border-dashed border-primary-200 pt-5 text-base leading-relaxed text-dark-500"
                    >
                      {statementClosing}
                    </motion.p>
                  )}
                </motion.article>
              )}
            </div>
          </div>
        </section>
      )}

      {/* City documentation belongs to program one, so it renders inside its flow. */}
      <MediaGallery program={program} labels={labels} onVideoSelect={onVideoSelect} />

      {axes && (axes.bullets?.length ?? 0) > 0 && (
        <section className="bg-[#faf8f8] py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading
              eyebrow={labels.phaseEyebrow}
              title={axes.title}
              description={axes.paragraphs?.[0]}
              centered
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(axes.bullets ?? []).map((bullet, index) => {
                const Icon = trainingAxisIcons[index % trainingAxisIcons.length];
                return (
                  <FadeContent
                    key={bullet}
                    blur={false}
                    duration={560}
                    initialOpacity={0}
                    yOffset={16}
                    delay={index * 70}
                    threshold={0.16}
                    once
                  >
                    <article className="group h-full rounded-[22px] border border-primary-100 bg-white p-6 text-start shadow-[0_14px_36px_rgba(40,12,18,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_22px_52px_rgba(40,12,18,0.1)] motion-reduce:hover:translate-y-0">
                      <div className="flex items-center justify-between">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-primary-100 transition-colors duration-300 group-hover:bg-primary-600 group-hover:text-white">
                          <Icon className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <span
                          dir="ltr"
                          className="text-2xl font-black text-primary-100 transition-colors duration-300 group-hover:text-primary-200"
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="mt-5 text-base font-semibold leading-relaxed text-dark-700">{bullet}</p>
                    </article>
                  </FadeContent>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {recommendations && (recommendations.bullets?.length ?? 0) > 0 && (
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading
              eyebrow={labels.recommendationsEyebrow}
              title={recommendations.title}
              description={labels.recommendationsDescription}
              centered
            />
            <div role="list" className="relative mx-auto grid max-w-3xl gap-5">
              <span aria-hidden="true" className="absolute bottom-8 start-6 top-8 w-px bg-primary-100" />
              {(recommendations.bullets ?? []).map((bullet, index) => (
                <FadeContent
                  key={bullet}
                  blur={false}
                  duration={560}
                  initialOpacity={0}
                  yOffset={14}
                  delay={index * 80}
                  threshold={0.16}
                  once
                >
                  <div role="listitem" className="relative flex items-start gap-4 md:gap-5">
                    <span className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary-200 bg-white text-base font-bold text-primary-700 shadow-[0_10px_24px_rgba(195,7,16,0.14)]">
                      {index + 1}
                    </span>
                    <p className="flex-1 rounded-[18px] border border-primary-100 bg-[#faf8f8] p-5 text-start text-base leading-relaxed text-dark-700">
                      {bullet}
                    </p>
                  </div>
                </FadeContent>
              ))}
            </div>
          </div>
        </section>
      )}

      {sphere && (
        <section id={sphereProgramAnchor} className="scroll-mt-24 bg-[#faf8f8] py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeading
              eyebrow={labels.programTwoLabel}
              title={sphere.title}
              description={sphere.paragraphs?.[0]}
              centered
            />
            <FadeContent blur={false} duration={650} initialOpacity={0} yOffset={18} threshold={0.16} once>
              <article className="relative overflow-hidden rounded-[28px] border border-primary-100 bg-white p-7 text-start shadow-[0_24px_64px_rgba(40,12,18,0.09)] md:p-12">
                <CornerTicks />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-20 -start-16 h-64 w-64 rounded-full bg-primary-100/40 blur-3xl"
                />
                {/* A travel-stamp for the Istanbul program; the brand name stays Latin in every locale. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-10 -end-10 grid h-40 w-40 rotate-12 place-items-center rounded-full border-2 border-dashed border-primary-200/80 text-primary-300 md:-end-8 md:bottom-auto md:-top-8"
                >
                  <span dir="ltr" className="grid place-items-center gap-1 text-center">
                    <Globe2 className="h-6 w-6" aria-hidden="true" />
                    <span className="text-[10px] font-black tracking-[0.28em]">SPHERE</span>
                    <span className="text-[10px] font-black tracking-[0.28em]">2024</span>
                  </span>
                </span>
                <div className="relative max-w-3xl space-y-4 text-base leading-relaxed text-dark-600">
                  {(sphere.paragraphs ?? []).slice(1).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {(sphere.bullets?.length ?? 0) > 0 && (
                  <div role="list" className="relative mt-8 grid gap-3 md:grid-cols-3">
                    {(sphere.bullets ?? []).map((bullet) => (
                      <div
                        role="listitem"
                        key={bullet}
                        className="flex items-start gap-3 rounded-2xl bg-[#faf8f8] p-4 ring-1 ring-primary-100"
                      >
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" aria-hidden="true" />
                        <p className="text-sm leading-relaxed text-dark-700">{bullet}</p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </FadeContent>
          </div>
        </section>
      )}

      {forum && (
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <FadeContent blur={false} duration={650} initialOpacity={0} yOffset={18} threshold={0.16} once>
              <article className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary-800 via-primary-700 to-primary-950 p-7 text-start text-white shadow-[0_28px_70px_rgba(125,7,12,0.35)] md:p-12">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -end-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-24 -start-16 h-72 w-72 rounded-full bg-primary-500/25 blur-3xl"
                />
                <div className="relative max-w-3xl">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold ring-1 ring-white/25">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    {labels.forumEyebrow}
                  </span>
                  <h3 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">{forum.title}</h3>
                  <div className="mt-5 space-y-3 text-base leading-relaxed text-white/85">
                    {(forum.paragraphs ?? []).map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
                {(forum.bullets?.length ?? 0) > 0 && (
                  <div className="relative mt-9">
                    <p className="text-sm font-bold text-white/75">{labels.forumObjectives}</p>
                    <div role="list" className="mt-4 grid gap-3 md:grid-cols-2">
                      {(forum.bullets ?? []).map((bullet, index) => (
                        <div
                          role="listitem"
                          key={bullet}
                          className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-primary-700">
                            {index + 1}
                          </span>
                          <p className="text-sm leading-relaxed text-white/90">{bullet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </FadeContent>
          </div>
        </section>
      )}

      {genericSections.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 md:px-8">
            <div className="grid gap-5">
              {genericSections.map((section, index) => (
                <ProgramSectionBlock key={section.id || index} section={section} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

const volunteerStatementAnchor = 'volunteer-statement';

/** The volunteer unit ships its own sections end to end; nothing here is shared with another program. */
function VolunteerShowcase({
  program,
  copy,
}: {
  program: Program;
  copy: NonNullable<Program['volunteer']>;
}) {
  const fields = program.pillars ?? [];
  const goals = program.goals ?? [];
  const steps = program.journey ?? [];

  return (
    <>
      <section id={volunteerStatementAnchor} className="scroll-mt-24 bg-white py-16 md:py-24">
        <VolunteerStatement program={program} copy={copy} />
      </section>

      {fields.length > 0 && (
        <section className="overflow-hidden bg-white pb-16 md:pb-24">
          <VolunteerFields fields={fields} copy={copy} />
        </section>
      )}

      {goals.length > 0 && (
        <section className="bg-[#faf8f8] py-16 md:py-24">
          <VolunteerGoals goals={goals} copy={copy} />
        </section>
      )}

      {steps.length > 0 && (
        <section className="relative isolate overflow-hidden bg-dark-950 py-16 md:py-24">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(218,8,18,0.3),transparent_50%)]"
          />
          <VolunteerSteps
            steps={steps}
            copy={copy}
            volunteerRoute={participateRoutes.volunteer}
            contactEmail={program.contactEmail}
            contactPhone={program.contactPhone}
          />
        </section>
      )}
    </>
  );
}

const awarenessMediaAnchor = 'awareness-media';

function AwarenessShowcase({
  program,
  labels,
}: {
  program: Program;
  labels: ReturnType<typeof getProgramsContent>['labels'];
}) {
  const themes = program.themes ?? [];
  const mediaProducts = program.mediaProducts ?? [];

  return (
    <>
      {themes.length > 0 && (
        <section className="bg-white py-12 md:py-16">
          <AwarenessThemes
            eyebrow={labels.awarenessEyebrow}
            title={labels.awarenessThemes}
            description={labels.awarenessThemesDescription}
            themeLabel={labels.themeLabel}
            hubTitle={labels.awarenessEyebrow}
            themes={themes}
          />
        </section>
      )}

      {mediaProducts.length > 0 && (
        <section id={awarenessMediaAnchor} className="scroll-mt-24 overflow-hidden bg-[#faf8f8] py-16 md:py-24">
          <AwarenessMedia
            eyebrow={labels.awarenessInitiativesEyebrow}
            title={labels.awarenessInitiatives}
            description={labels.awarenessInitiativesDescription}
            products={mediaProducts}
          />
        </section>
      )}

      {program.spotlight && (program.spotlight.title || program.spotlight.description) && (
        <section className="overflow-hidden bg-white py-16 md:py-24">
          <AwarenessSpotlight spotlight={program.spotlight} />
        </section>
      )}

    </>
  );
}

const programOverviewAnchor = 'program-overview';

// Defaults keyed by the seeded Owais product ids; an editor-chosen icon name wins over them.
const productIcons: Record<string, LucideIcon> = {
  podcast: Mic,
  visuals: Clapperboard,
  diwaniya: MessagesSquare,
  blog: PenLine,
};

type HeroSlotsInput = {
  program: Program;
  layout: ProgramLayout;
  volunteerCopy?: VolunteerCopy;
  labels: ProgramsPageContent['labels'];
  /** The verified home-page indicators; the pioneers hero teases the first one that has a value. */
  pioneerIndicators: { label: string; value: number | null }[];
  formatNumber: (value: number) => string;
};

/**
 * Every program shares one hero; this decides what each layout puts in its slots:
 * the line above the title, where the two buttons go, the pills and note, the
 * teaser chip on the plate, and whether the plate holds a photo or an emblem.
 */
function heroSlots({
  program,
  layout,
  volunteerCopy,
  labels,
  pioneerIndicators,
  formatNumber,
}: HeroSlotsInput): Omit<ProgramHeroProps, 'program' | 'breadcrumbs'> {
  const donateTo = program.cta?.url?.trim() || donateRoute;
  const donateAction: ProgramHeroAction | undefined = labels.donate ? { label: labels.donate, to: donateTo } : undefined;
  const firstStat = program.statistics?.find((stat) => stat.value || stat.label);
  const statChip = firstStat ? { value: firstStat.value, label: firstStat.label } : undefined;
  const photoPlate = { image: program.heroImage, alt: program.heroImageAlt, tone: 'photo' as const };

  if (volunteerCopy) {
    const hashtags = (volunteerCopy.hashtags ?? []).filter(Boolean);
    return {
      eyebrow: volunteerCopy.eyebrow,
      eyebrowIcon: HeartHandshake,
      primary: volunteerCopy.joinCta
        ? { label: volunteerCopy.joinCta, to: volunteerCopy.joinUrl || participateRoutes.volunteer, icon: HandHeart }
        : undefined,
      secondary: volunteerCopy.exploreCta
        ? { label: volunteerCopy.exploreCta, anchor: volunteerStatementAnchor }
        : undefined,
      tags: hashtags.slice(1).map((label) => ({ label, icon: Hash })),
      note: volunteerCopy.slogan ? { text: volunteerCopy.slogan, icon: Quote } : undefined,
      chip: hashtags[0] ? { label: hashtags[0] } : statChip,
      // The unit's badge sits on the plate; the photo stays behind as the backdrop.
      plate: {
        image: program.overviewImage ?? program.heroImage,
        alt: program.overviewImageAlt || program.heroImageAlt,
        tone: 'emblem',
      },
      badgeIcon: HeartHandshake,
      backdropImage: program.heroImage,
    };
  }

  if (layout === 'awareness') {
    const products = program.mediaProducts ?? [];
    return {
      eyebrow: labels.awarenessEyebrow,
      eyebrowIcon: Radio,
      primary: donateAction,
      secondary: labels.exploreInitiatives
        ? { label: labels.exploreInitiatives, anchor: awarenessMediaAnchor }
        : undefined,
      tags: products.map((product, index) => ({
        label: product.title,
        icon: resolveIcon(product.icon, [productIcons[product.id] ?? Sparkles], index),
      })),
      note: labels.awarenessHeroNote ? { text: labels.awarenessHeroNote, icon: Radio } : undefined,
      chip: labels.onAirLabel ? { label: labels.onAirLabel } : statChip,
      plate: { image: program.heroImage, alt: program.heroImageAlt, tone: 'emblem' },
      badgeIcon: Mic,
      plateMotif: <EqualizerBars />,
      // The platform's own image is a logo; a real event photo makes the better faint backdrop.
      backdropImage: program.spotlight?.images?.find((image) => image?.src)?.src,
    };
  }

  if (layout === 'institutional') {
    return {
      eyebrow: labels.manifestoEyebrow,
      eyebrowIcon: Landmark,
      primary: donateAction,
      secondary: labels.exploreTrack ? { label: labels.exploreTrack, anchor: institutionalShowcaseAnchor } : undefined,
      chip: statChip,
      plate: photoPlate,
      badgeIcon: Landmark,
      backdropImage: program.heroImage,
    };
  }

  const isPioneers = layout === 'pioneers';
  const indicator = isPioneers ? pioneerIndicators.find((item) => typeof item.value === 'number') : undefined;
  const indicatorChip =
    indicator && typeof indicator.value === 'number'
      ? { value: formatNumber(indicator.value), label: indicator.label }
      : undefined;

  return {
    eyebrow: isPioneers ? labels.pioneersEyebrow : labels.programs,
    eyebrowIcon: isPioneers ? GraduationCap : Layers3,
    primary: donateAction,
    secondary: labels.exploreProgram ? { label: labels.exploreProgram, anchor: programOverviewAnchor } : undefined,
    chip: statChip ?? indicatorChip,
    plate: photoPlate,
    badgeIcon: isPioneers ? GraduationCap : Layers3,
    backdropImage: program.heroImage,
  };
}

export default function ProgramPage() {
  const { slug } = useParams();
  const { locale, isRtl, content, formatNumber } = useI18n();
  const sourceProgram = getProgram(locale, slug);
  const program = applyHomePioneersHero(sourceProgram, content.yemenPioneers, locale);
  const page = getProgramsContent(locale);
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null);
  const siteName = content.siteConfig.name;

  const structuredData = useMemo(() => {
    if (!program) return undefined;

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: program.title,
      description: program.summary,
      image: [absoluteUrl(program.heroImage)],
      mainEntityOfPage: absoluteUrl(program.route),
      publisher: {
        '@type': 'Organization',
        name: siteName,
      },
    };
  }, [program, siteName]);

  if (!program) {
    return <Navigate to="/" replace />;
  }

  const breadcrumbs = getProgramBreadcrumbs(locale, program);
  const goals = program.goals ?? [];
  const components = program.components ?? [];
  const journey = program.journey ?? [];
  const pillars = program.pillars ?? [];
  const highlights = program.highlights ?? [];
  const sections = program.sections ?? [];
  // The admin picks the page design; slug conventions only fill in when it left the choice open.
  const layout = resolveProgramLayout(program);
  const isPioneers = layout === 'pioneers';
  const isAwareness = layout === 'awareness';
  const isInstitutional = layout === 'institutional';
  const isVolunteer = layout === 'volunteer';
  // Programs that ship journey/pillar content get the richer, animated showcase layout;
  // the pioneers layout always does, so its hex statistics and overview stay in place.
  const isShowcase = isPioneers || journey.length > 0 || pillars.length > 0;
  // A program switched to the volunteer layout without its own copy still renders, using the
  // static volunteer copy of this locale until the editor fills the volunteer fields.
  const volunteerCopy = isVolunteer ? (program.volunteer ?? getDefaultVolunteerCopy(locale)) : undefined;
  const hasCustomLayout = isAwareness || isInstitutional || isVolunteer;
  const hero = heroSlots({
    program,
    layout,
    volunteerCopy,
    labels: page.labels,
    pioneerIndicators: content.yemenPioneers.indicators,
    formatNumber,
  });

  return (
    <>
      <PageSeo
        title={program.seo?.title ?? program.title}
        description={program.seo?.description ?? program.summary}
        canonical={program.seo?.canonical || program.route}
        type="article"
        image={program.heroImage}
        structuredData={structuredData}
      />
      <main className="bg-white">
        <ProgramHero program={program} breadcrumbs={breadcrumbs} {...hero} />

        {highlights.length > 0 && (
          <PioneerHighlightsMarquee label={page.labels.highlights} items={highlights} />
        )}

        {volunteerCopy ? (
          <VolunteerShowcase program={program} copy={volunteerCopy} />
        ) : isAwareness ? (
          <AwarenessShowcase program={program} labels={page.labels} />
        ) : isInstitutional ? (
          <InstitutionalShowcase program={program} labels={page.labels} />
        ) : isShowcase ? (
          <section id={programOverviewAnchor} className="scroll-mt-24 overflow-hidden bg-white py-14 md:py-20">
            <PioneerOverview program={program} labels={page.labels} />
          </section>
        ) : (
          <section id={programOverviewAnchor} className="scroll-mt-24 bg-white py-16 md:py-24">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <FadeContent blur={false} duration={650} initialOpacity={0} yOffset={16} threshold={0.18} once>
              <div className="sticky top-28 rounded-[24px] border border-primary-100 bg-[#faf8f8] p-6 text-start md:p-8">
                <Layers3 className="h-9 w-9 text-primary-600" aria-hidden="true" />
                <h2 className="mt-4 text-3xl font-bold leading-tight text-dark-950">{page.labels.overview}</h2>
                <p className="mt-4 text-base leading-relaxed text-dark-600">{program.summary}</p>
                {program.contactEmail && (
                  <Link
                    to={participateRoutes.contact}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {page.labels.contact}: {program.contactEmail}
                  </Link>
                )}
              </div>
            </FadeContent>

            <div className="grid gap-5">
              {sections.slice(0, 1).map((section, index) => (
                <ProgramSectionBlock key={section.id || index} section={section} />
              ))}
            </div>
            </div>
          </section>
        )}

        {!hasCustomLayout && goals.length > 0 && (
          <section className="bg-[#faf8f8] py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              {isShowcase ? (
                <PioneerGoals eyebrow={page.labels.goals} title={page.labels.goals} items={goals} />
              ) : (
                <NumberedList
                  title={page.labels.goals}
                  items={goals}
                  icon={<CheckCircle2 className="h-6 w-6" aria-hidden="true" />}
                />
              )}
            </div>
          </section>
        )}

        {hasCustomLayout ? null : journey.length > 0 ? (
          <section id="cms-program-journey" className="relative bg-white py-10 md:py-14 lg:py-0">
            <PioneerJourney
              eyebrow={page.labels.journeyEyebrow}
              title={page.labels.journey}
              description={page.labels.journeyDescription}
              stepLabel={page.labels.stepLabel}
              steps={journey}
            />
          </section>
        ) : (
          components.length > 0 && (
            <section className="bg-white py-16 md:py-24">
              <div className="mx-auto max-w-7xl px-4 md:px-8">
                <NumberedList
                  title={page.labels.components}
                  items={components}
                  icon={<Layers3 className="h-6 w-6" aria-hidden="true" />}
                />
              </div>
            </section>
          )
        )}

        {!hasCustomLayout && pillars.length > 0 && (
          <section id="cms-program-pillars" className="bg-[#faf8f8] py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <PioneerPillars
                eyebrow={page.labels.pillarsEyebrow}
                title={page.labels.pillars}
                description={page.labels.pillarsDescription}
                pillars={pillars}
              />
            </div>
          </section>
        )}

        {isInstitutional && (
          <InstitutionalDossier program={program} labels={page.labels} onVideoSelect={setActiveVideo} />
        )}

        {!hasCustomLayout && (
          <>
            <StatisticsSection program={program} labels={page.labels} hexStats={isPioneers} />
            <MediaGallery program={program} labels={page.labels} onVideoSelect={setActiveVideo} />
          </>
        )}
        <InitiativesSection program={program} labels={page.labels} />

        {!hasCustomLayout && sections.length > 1 && (
          <section className="bg-[#faf8f8] py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 md:px-8">
              <SectionHeading eyebrow={page.labels.information} title={page.labels.information} centered />
              <div className="grid gap-5">
                {sections.slice(1).map((section, index) => (
                  <ProgramSectionBlock key={section.id || index} section={section} />
                ))}
              </div>
            </div>
          </section>
        )}

        <DonateCta program={program} isRtl={isRtl} />
        <OtherPrograms program={program} labels={page.labels} isRtl={isRtl} />
      </main>

      <VideoModal
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        onExitComplete={() => undefined}
        videoId={activeVideo?.videoId ?? ''}
        videoFile={activeVideo?.videoFile}
        posterImage={activeVideo?.posterImage ?? program.heroImage}
        title={activeVideo?.title}
      />
    </>
  );
}
