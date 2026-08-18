import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  HandHeart,
  Images,
  Layers3,
  Mail,
  Play,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import FadeContent from '@/components/effects/FadeContent';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import VideoModal from '@/components/ui/VideoModal';
import { donateRoute } from '@/data/donate';
import {
  getOtherPrograms,
  getProgram,
  getProgramBreadcrumbs,
  getProgramsContent,
  type Program,
  type ProgramCity,
  type ProgramSection,
  type ProgramVideo,
} from '@/data/programs';
import { useI18n } from '@/i18n/useI18n';

const revealEase = [0.22, 1, 0.36, 1] as const;

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
};

type ActiveVideo = {
  videoId: string;
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

  return (
    <div>
      <SectionHeading eyebrow={title} title={title} centered />
      <ol className="grid gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <motion.li
            key={item}
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 0.5,
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
}: {
  program: Program;
  labels: ReturnType<typeof getProgramsContent>['labels'];
}) {
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
    <section className="bg-[#faf8f8] py-16 md:py-20">
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
    <section className="bg-white py-16 md:py-24">
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
                    title: selectedCity.videoTitle,
                    posterImage: selectedCity.image,
                  })
                }
                className="mt-6 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                {labels.watchVideo}
              </button>
              <a
                href={selectedCity.videoSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800"
              >
                {labels.officialSource}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
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

  if (!program.imageGallery.length && !videos.length) return null;

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading eyebrow={labels.officialMedia} title={labels.officialMedia} centered />

        {program.imageGallery.length > 0 && (
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
          <a
            href={video.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800"
          >
            {labels.officialSource}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
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
  if (!program.initiatives?.length) return null;

  return (
    <section className="bg-[#faf8f8] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading eyebrow={labels.initiatives} title={labels.initiatives} centered />
        <div className="grid gap-6 md:grid-cols-2">
          {program.initiatives.map((initiative) => {
            const products = initiative.products ?? [];

            return (
              <FadeContent
                key={initiative.title}
                blur={false}
                duration={620}
                initialOpacity={0}
                yOffset={16}
                threshold={0.18}
                once
              >
                <article className="flex h-full flex-col overflow-hidden rounded-[22px] border border-primary-100 bg-white text-start shadow-[0_18px_48px_rgba(40,12,18,0.07)]">
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

                    <a
                      href={initiative.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${labels.officialSource}: ${initiative.title}. ${labels.openExternal}`}
                      className="mt-auto inline-flex min-h-11 w-fit items-center justify-center gap-2 pt-6 text-sm font-bold text-primary-700 hover:text-primary-800"
                    >
                      {labels.officialSource}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </article>
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

  return (
    <section className="bg-dark-950 py-16 text-white md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <FadeContent blur={false} duration={640} initialOpacity={0} yOffset={18} threshold={0.18} once>
          <div className="grid gap-8 rounded-[24px] border border-white/10 bg-white/[0.06] p-6 text-start shadow-[0_22px_56px_rgba(0,0,0,0.2)] backdrop-blur md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <HandHeart className="h-9 w-9 text-gold-300" aria-hidden="true" />
              <h2 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">{program.cta.title}</h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/72">{program.cta.description}</p>
            </div>
            <Link
              to={donateRoute}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold-400 px-7 py-3 text-sm font-black text-dark-950 transition-colors hover:bg-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-300"
            >
              {program.cta.button}
              <ArrowIcon
                className={`h-4 w-4 transition-transform ${
                  isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                }`}
                aria-hidden="true"
              />
            </Link>
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
          {otherPrograms.map((item) => (
            <Link
              key={item.slug}
              to={item.route}
              className="group overflow-hidden rounded-[22px] border border-primary-100 bg-white text-start shadow-[0_16px_42px_rgba(40,12,18,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_22px_52px_rgba(40,12,18,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600 motion-reduce:hover:translate-y-0"
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
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProgramPage() {
  const { slug } = useParams();
  const { locale, isRtl } = useI18n();
  const program = getProgram(locale, slug);
  const page = getProgramsContent(locale);
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null);

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
        name: 'Veysel Karani Waqf',
      },
    };
  }, [program]);

  if (!program) {
    return <Navigate to="/" replace />;
  }

  const breadcrumbs = getProgramBreadcrumbs(locale, program);
  const goals = program.goals ?? [];
  const components = program.components ?? [];

  return (
    <>
      <PageSeo
        title={program.seo.title}
        description={program.seo.description}
        canonical={program.seo.canonical}
        type="article"
        image={program.heroImage}
        structuredData={structuredData}
      />
      <main className="bg-white">
        <PageHero
          title={program.title}
          description={program.summary}
          image={program.heroImage}
          imageAlt={program.heroImageAlt}
          breadcrumbs={breadcrumbs}
        />

        <section className="bg-white py-16 md:py-24">
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
                <a
                  href={program.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-fit items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-800"
                >
                  {page.labels.officialSource}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </FadeContent>

            <div className="grid gap-5">
              {program.sections.slice(0, 1).map((section) => (
                <ProgramSectionBlock key={section.id} section={section} />
              ))}
            </div>
          </div>
        </section>

        {goals.length > 0 && (
          <section className="bg-[#faf8f8] py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <NumberedList
                title={page.labels.goals}
                items={goals}
                icon={<CheckCircle2 className="h-6 w-6" aria-hidden="true" />}
              />
            </div>
          </section>
        )}

        {components.length > 0 && (
          <section className="bg-white py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <NumberedList
                title={page.labels.components}
                items={components}
                icon={<Layers3 className="h-6 w-6" aria-hidden="true" />}
              />
            </div>
          </section>
        )}

        <StatisticsSection program={program} labels={page.labels} />
        <MediaGallery program={program} labels={page.labels} onVideoSelect={setActiveVideo} />
        <InitiativesSection program={program} labels={page.labels} />

        {program.sections.length > 1 && (
          <section className="bg-[#faf8f8] py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 md:px-8">
              <SectionHeading eyebrow={page.labels.information} title={page.labels.information} centered />
              <div className="grid gap-5">
                {program.sections.slice(1).map((section) => (
                  <ProgramSectionBlock key={section.id} section={section} />
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
        posterImage={activeVideo?.posterImage ?? program.heroImage}
        title={activeVideo?.title}
      />
    </>
  );
}
