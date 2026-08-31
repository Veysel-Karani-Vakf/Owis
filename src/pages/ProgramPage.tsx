import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clapperboard,
  GraduationCap,
  HandHeart,
  Hash,
  HeartHandshake,
  Images,
  Landmark,
  Layers3,
  Mail,
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
  seamless = false,
}: {
  program: Program;
  labels: ReturnType<typeof getProgramsContent>['labels'];
  /** True for the pioneers layout: the verified home-page indicators drawn as a hexagon diagram. */
  hexStats: boolean;
  /** One continuous canvas: no band background of its own. */
  seamless?: boolean;
}) {
  const { content, t, formatNumber, isRtl } = useI18n();

  // The pioneers layout mirrors the verified indicators shown on the home page (CMS-aware), laid
  // out as a hexagon summary diagram instead of the plain card grid.
  if (hexStats) {
    const pioneers = content.yemenPioneers;
    return (
      <section
        id="cms-program-stats"
        className={seamless ? 'overflow-hidden py-12 md:py-16' : 'overflow-hidden bg-[#faf8f8] py-16 md:py-24'}
      >
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

  if (!program.statistics?.length) {
    return program.mediaNote ? (
      <section className="bg-[#faf8f8] py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="rounded-[22px] border border-primary-100 bg-white p-5 text-start text-sm leading-relaxed text-dark-600 shadow-[0_14px_36px_rgba(40,12,18,0.06)]">
            <span className="font-bold text-primary-700">{labels.noVerifiedStats}</span>
            <p className="mt-2">{program.mediaNote}</p>
          </div>
        </div>
      </section>
    ) : null;
  }

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
  const [selectedCityId, setSelectedCityId] = useState(cities[0]?.id ?? '');
  const selectedCity = cities.find((city) => city.id === selectedCityId) ?? cities[0];

  if (!selectedCity) return null;

  return (
    <section id="cms-program-cities" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading eyebrow={labels.officialMedia} title={labels.cityMedia} centered />

        <div
          role="tablist"
          aria-label={labels.cityMedia}
          className="mb-6 flex gap-2 overflow-x-auto pb-2"
        >
          {cities.map((city) => {
            const active = city.id === selectedCity.id;

            return (
              <button
                key={city.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCityId(city.id)}
                className={`min-h-11 shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 ${
                  active
                    ? 'bg-primary-600 text-white'
                    : 'border border-primary-100 bg-white text-primary-700 hover:bg-primary-50'
                }`}
              >
                {city.name}
              </button>
            );
          })}
        </div>

        <FadeContent blur={false} duration={620} initialOpacity={0} yOffset={16} threshold={0.18} once>
          <article className="grid overflow-hidden rounded-[24px] border border-primary-100 bg-[#faf8f8] shadow-[0_20px_56px_rgba(40,12,18,0.08)] lg:grid-cols-[1fr_0.72fr]">
            <div className="relative min-h-[22rem] overflow-hidden bg-dark-950 lg:min-h-[30rem]">
              <img
                src={selectedCity.image}
                alt={selectedCity.imageAlt}
                width={1080}
                height={1350}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-950/80 to-transparent p-5 text-white">
                <p className="text-xl font-bold">{selectedCity.name}</p>
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 text-start md:p-8">
              <Images className="h-9 w-9 text-primary-600" aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-bold text-dark-950">{selectedCity.name}</h3>
              <p className="mt-3 text-base leading-relaxed text-dark-600">{selectedCity.videoTitle}</p>
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
                className="mt-6 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                {labels.watchVideo}
              </button>
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
  seamless = false,
}: {
  program: Program;
  labels: ReturnType<typeof getProgramsContent>['labels'];
  onVideoSelect: (video: ActiveVideo) => void;
  /** One continuous canvas: transparent section, uncarded videos. */
  seamless?: boolean;
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
    program.imageGallery.length > 0 &&
    (videos.length < 2 || program.imageGallery.some((image) => image.src !== program.heroImage));
  const useCarousel = videos.length >= 2;

  if (!showImages && !videos.length) return null;

  if (useCarousel) {
    return (
      <section className={seamless ? 'overflow-hidden py-12 md:py-16' : 'overflow-hidden bg-white py-16 md:py-24'}>
        <PioneerVideoCarousel
          eyebrow={labels.officialMedia}
          title={labels.videoGallery}
          description={labels.videoGalleryDescription}
          videos={videos}
          labels={labels}
          onVideoSelect={onVideoSelect}
          seamless={seamless}
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
  seamless = false,
}: {
  program: Program;
  isRtl: boolean;
  /** One continuous canvas: a centered call on the page itself instead of the dark band. */
  seamless?: boolean;
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

  if (seamless) {
    const button = cta.button && (
      isExternal ? (
        <a href={to} target="_blank" rel="noopener noreferrer" className={`${buttonClass} mt-8`}>
          {cta.button}
          {arrow}
        </a>
      ) : (
        <Link to={to} className={`${buttonClass} mt-8`}>
          {cta.button}
          {arrow}
        </Link>
      )
    );

    return (
      <section id="program-donate" className="relative overflow-hidden py-16 md:py-24">
        {/* A glow that dies out before the edges keeps the canvas unbroken. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_75%_at_50%_45%,rgba(218,8,18,0.07),transparent_75%)]"
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center md:px-8">
          <FadeContent blur={false} duration={640} initialOpacity={0} yOffset={18} threshold={0.18} once>
            <div className="flex flex-col items-center">
              <HandHeart className="h-10 w-10 text-primary-600" aria-hidden="true" />
              <h2 className="mt-5 text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{cta.title}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-dark-600 md:text-lg">
                {cta.description}
              </p>
              {button}
            </div>
          </FadeContent>
        </div>
      </section>
    );
  }

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
  seamless = false,
}: {
  program: Program;
  labels: ReturnType<typeof getProgramsContent>['labels'];
  isRtl: boolean;
  /** One continuous canvas: pictures and text on the page instead of boxed cards. */
  seamless?: boolean;
}) {
  const { locale } = useI18n();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const otherPrograms = getOtherPrograms(locale, program.slug);

  return (
    <section className={seamless ? 'py-12 md:py-20' : 'bg-white py-16 md:py-24'}>
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
                className={
                  seamless
                    ? 'group block text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600'
                    : 'group block overflow-hidden rounded-[22px] border border-primary-100 bg-white text-start shadow-[0_16px_42px_rgba(40,12,18,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_22px_52px_rgba(40,12,18,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 motion-reduce:hover:translate-y-0'
                }
              >
                {seamless ? (
                  <span className="block overflow-hidden rounded-[22px]">
                    <img
                      src={item.heroImage}
                      alt={item.heroImageAlt}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                    />
                  </span>
                ) : (
                  <img
                    src={item.heroImage}
                    alt={item.heroImageAlt}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                  />
                )}
                <div className={seamless ? 'pt-5' : 'p-5'}>
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

/** The institutional track: its verified figures drawn as seals, then the institutions it serves. */
function InstitutionalShowcase({
  program,
  labels,
}: {
  program: Program;
  labels: ReturnType<typeof getProgramsContent>['labels'];
}) {
  const audiences = program.audiences ?? [];
  const statistics = program.statistics ?? [];

  return (
    <div id={institutionalShowcaseAnchor} className="scroll-mt-24">
      {statistics.length > 0 ? (
        <section className="bg-[#faf8f8] py-16 md:py-24">
          <InstitutionalFigures
            statistics={statistics}
            eyebrow={labels.statsEyebrow}
            title={labels.statistics}
            note={program.mediaNote}
            noteLabel={labels.noVerifiedStats}
          />
        </section>
      ) : (
        program.mediaNote && (
          <section className="bg-[#faf8f8] py-10 md:py-12">
            <div className="mx-auto max-w-4xl px-4 md:px-8">
              <div className="rounded-[22px] border border-primary-100 bg-white p-5 text-start text-sm leading-relaxed text-dark-600 shadow-[0_14px_36px_rgba(40,12,18,0.06)]">
                <span className="font-bold text-primary-700">{labels.noVerifiedStats}</span>
                <p className="mt-2">{program.mediaNote}</p>
              </div>
            </div>
          </section>
        )
      )}

      {audiences.length > 0 && (
        <section className="overflow-hidden bg-white py-16 md:py-24">
          <InstitutionalBeneficiaries
            audiences={audiences}
            title={labels.audiences}
            description={labels.audiencesDescription}
          />
        </section>
      )}
    </div>
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

      {program.mediaNote && (
        <section className="bg-white py-10 md:py-12">
          <div className="mx-auto max-w-4xl px-4 md:px-8">
            <div className="rounded-[22px] border border-primary-100 bg-[#faf8f8] p-5 text-start text-sm leading-relaxed text-dark-600">
              <span className="font-bold text-primary-700">{labels.noVerifiedStats}</span>
              <p className="mt-2">{program.mediaNote}</p>
            </div>
          </div>
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
  const program = getProgram(locale, slug);
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
  // The pioneers page reads as one continuous piece: a single light canvas with no
  // alternating band backgrounds and no boxed cards between the hero and the footer.
  const seamless = isPioneers;
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
        <ProgramHero program={program} breadcrumbs={breadcrumbs} {...hero} seamless={seamless} />

        {highlights.length > 0 && (
          <PioneerHighlightsMarquee label={page.labels.highlights} items={highlights} seamless={seamless} />
        )}

        {volunteerCopy ? (
          <VolunteerShowcase program={program} copy={volunteerCopy} />
        ) : isAwareness ? (
          <AwarenessShowcase program={program} labels={page.labels} />
        ) : isInstitutional ? (
          <InstitutionalShowcase program={program} labels={page.labels} />
        ) : isShowcase ? (
          <section
            id={programOverviewAnchor}
            className={
              seamless ? 'scroll-mt-24 overflow-hidden py-12 md:py-16' : 'scroll-mt-24 overflow-hidden bg-white py-14 md:py-20'
            }
          >
            <PioneerOverview program={program} labels={page.labels} seamless={seamless} />
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
                  <a
                    href={`mailto:${program.contactEmail}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {page.labels.contact}: {program.contactEmail}
                  </a>
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
          <section className={seamless ? 'py-12 md:py-16' : 'bg-[#faf8f8] py-16 md:py-24'}>
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              {isShowcase ? (
                <PioneerGoals eyebrow={page.labels.goals} title={page.labels.goals} items={goals} seamless={seamless} />
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
          <section
            id="cms-program-journey"
            className={seamless ? 'relative py-8 md:py-10 lg:py-0' : 'relative bg-white py-10 md:py-14 lg:py-0'}
          >
            <PioneerJourney
              eyebrow={page.labels.journeyEyebrow}
              title={page.labels.journey}
              description={page.labels.journeyDescription}
              stepLabel={page.labels.stepLabel}
              steps={journey}
              seamless={seamless}
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
          <section id="cms-program-pillars" className={seamless ? 'py-12 md:py-16' : 'bg-[#faf8f8] py-16 md:py-24'}>
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <PioneerPillars
                eyebrow={page.labels.pillarsEyebrow}
                title={page.labels.pillars}
                description={page.labels.pillarsDescription}
                pillars={pillars}
                seamless={seamless}
              />
            </div>
          </section>
        )}

        {!hasCustomLayout && (
          <>
            <StatisticsSection program={program} labels={page.labels} hexStats={isPioneers} seamless={seamless} />
            <MediaGallery program={program} labels={page.labels} onVideoSelect={setActiveVideo} seamless={seamless} />
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

        <DonateCta program={program} isRtl={isRtl} seamless={seamless} />
        <OtherPrograms program={program} labels={page.labels} isRtl={isRtl} seamless={seamless} />
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
