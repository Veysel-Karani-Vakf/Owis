import { ArrowLeft, ArrowRight, Check, HandHeart, PlayCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import FadeContent from '@/components/effects/FadeContent';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import VideoModal from '@/components/ui/VideoModal';
import {
  getOtherProjects,
  getProject,
  getProjectsContent,
  projectRoutes,
  type LocalizedWaqfProject,
} from '@/data/projects';
import { useI18n } from '@/i18n/useI18n';

const reveal = {
  blur: false,
  duration: 650,
  initialOpacity: 0,
  yOffset: 16,
  threshold: 0.18,
  once: true,
} as const;

type RelatedProjectCardProps = {
  project: LocalizedWaqfProject;
  detailsLabel: string;
  isRtl: boolean;
};

function RelatedProjectCard({ project, detailsLabel, isRtl }: RelatedProjectCardProps) {
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <article className="group overflow-hidden rounded-[22px] border border-primary-100 bg-white shadow-[0_16px_42px_rgba(40,12,18,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_20px_52px_rgba(40,12,18,0.11)] motion-reduce:hover:translate-y-0">
      <div className="aspect-square overflow-hidden bg-white">
        <img
          src={project.image}
          alt={project.imageAlt}
          width={1080}
          height={1080}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className="p-4 text-start md:p-5">
        <p className="text-sm font-semibold text-primary-700">{project.category}</p>
        <h3 className="mt-1.5 text-xl font-bold leading-snug text-dark-950 md:text-2xl">{project.title}</h3>
        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-dark-600">
          {project.shortDescription}
        </p>
        <Link
          to={project.route}
          className="group/link mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
        >
          {detailsLabel}
          <ArrowIcon
            className={`h-4 w-4 transition-transform motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0 ${
              isRtl ? 'group-hover/link:-translate-x-1' : 'group-hover/link:translate-x-1'
            }`}
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { locale, isRtl, content } = useI18n();
  const page = getProjectsContent(locale);
  const project = getProject(locale, slug);
  const [videoOpen, setVideoOpen] = useState(false);

  const detailBreadcrumbs = useMemo(() => {
    if (!project) return page.breadcrumbs;
    const homeCrumb = page.breadcrumbs[0] ?? { label: content.siteConfig.name, href: '/' };

    return [
      homeCrumb,
      { label: page.hero.title, href: projectRoutes.index },
      { label: project.title },
    ];
  }, [content.siteConfig.name, page.breadcrumbs, page.hero.title, project]);

  const articleSchema = useMemo(() => {
    if (!project) return undefined;
    const origin = typeof window === 'undefined' ? '' : window.location.origin;

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: project.title,
      description: project.shortDescription,
      image: project.image.startsWith('http') ? project.image : `${origin}${project.image}`,
      url: `${origin}${project.route}`,
      isPartOf: {
        '@type': 'WebSite',
        name: content.siteConfig.name,
      },
    };
  }, [content.siteConfig.name, project]);

  if (!project) {
    return <Navigate to={projectRoutes.index} replace />;
  }

  const relatedProjects = getOtherProjects(locale, project.slug);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <>
      <PageSeo
        title={`${project.title} | ${content.siteConfig.name}`}
        description={project.shortDescription}
        type="article"
        image={project.image}
        structuredData={articleSchema}
      />
      <main className="bg-white">
        <PageHero
          title={project.title}
          description={project.shortDescription}
          image={project.image}
          breadcrumbs={detailBreadcrumbs}
        />

        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <FadeContent {...reveal}>
              <div className="overflow-hidden rounded-[22px] border border-primary-100 bg-white shadow-[0_20px_60px_rgba(40,12,18,0.10)]">
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  width={1080}
                  height={1080}
                  loading="eager"
                  className="aspect-square w-full object-cover"
                />
              </div>
            </FadeContent>

            <FadeContent {...reveal} delay={80}>
              <div className="text-start">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-bold text-primary-700">
                  {project.category}
                </div>
                <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">
                  {page.labels.overview}
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-dark-600 md:text-lg">
                  {project.fullDescription.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {project.facts.map((fact) => (
                    <div
                      key={`${fact.label}-${fact.value}`}
                      className="rounded-2xl border border-primary-100 bg-white p-4 shadow-[0_10px_24px_rgba(40,12,18,0.05)]"
                    >
                      <p className="text-xs font-semibold text-primary-700">{fact.label}</p>
                      <p className="mt-1 text-base font-bold leading-snug text-dark-950">{fact.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to={project.officialContributionUrl}
                    aria-label={`${page.labels.contribute}: ${project.title}. ${page.labels.externalNotice}`}
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                  >
                    <HandHeart className="h-4 w-4" aria-hidden="true" />
                    {page.labels.contribute}
                    <ArrowIcon className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </FadeContent>
          </div>
        </section>

        <section className="bg-[#faf8f8] py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <FadeContent {...reveal}>
              <div className="mx-auto max-w-3xl text-center">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <span className="h-px w-8 bg-primary-200" />
                  <span className="text-sm font-semibold text-primary-700">{page.labels.returns}</span>
                  <span className="h-px w-8 bg-primary-200" />
                </div>
                <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">
                  {project.returnsTitle}
                </h2>
                {project.returnsIntro && (
                  <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-dark-600 md:text-lg">
                    {project.returnsIntro}
                  </p>
                )}
              </div>
            </FadeContent>

            {project.allocations && (
              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {project.allocations.map((allocation, index) => (
                  <FadeContent key={allocation.percent} {...reveal} delay={index * 70}>
                    <div className="h-full rounded-[22px] border border-primary-100 bg-white p-6 text-start shadow-[0_16px_44px_rgba(40,12,18,0.06)]">
                      <p className="text-4xl font-black text-primary-700">{allocation.percent}</p>
                      <h3 className="mt-4 text-xl font-bold text-dark-950">{allocation.title}</h3>
                      <p className="mt-3 leading-relaxed text-dark-600">{allocation.description}</p>
                    </div>
                  </FadeContent>
                ))}
              </div>
            )}

            <FadeContent {...reveal} delay={project.allocations ? 120 : 70}>
              <ul className="mx-auto mt-10 grid max-w-5xl gap-3 md:grid-cols-2">
                {project.returnUses.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-2xl border border-primary-100 bg-white p-4 text-start text-dark-700 shadow-[0_10px_26px_rgba(40,12,18,0.05)]"
                  >
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary-700" aria-hidden="true" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </FadeContent>
          </div>
        </section>

        {project.video && (
          <section className="bg-white py-16 md:py-24">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 md:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
              <FadeContent {...reveal}>
                <div className="text-start">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-px w-8 bg-primary-200" />
                    <span className="text-sm font-semibold text-primary-700">{page.labels.video}</span>
                  </div>
                  <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">
                    {project.video.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-dark-600 md:text-lg">
                    {project.shortDescription}
                  </p>
                  <button
                    type="button"
                    onClick={() => setVideoOpen(true)}
                    className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                  >
                    <PlayCircle className="h-5 w-5" aria-hidden="true" />
                    {project.video.buttonLabel}
                  </button>
                </div>
              </FadeContent>

              <FadeContent {...reveal} delay={80}>
                <button
                  type="button"
                  onClick={() => setVideoOpen(true)}
                  aria-label={project.video.buttonLabel}
                  className="group relative aspect-video w-full overflow-hidden rounded-[22px] border border-primary-100 bg-dark-950 shadow-[0_20px_60px_rgba(40,12,18,0.13)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                >
                  <img
                    src={project.image}
                    alt=""
                    width={1080}
                    height={1080}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-dark-950/60 via-dark-950/20 to-transparent" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary-700 shadow-xl transition-transform group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                      <PlayCircle className="h-8 w-8" aria-hidden="true" />
                    </span>
                  </span>
                </button>
              </FadeContent>
            </div>
          </section>
        )}

        <section className="bg-[#faf8f8] py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
            <FadeContent {...reveal}>
              <div className="rounded-[22px] border border-primary-100 bg-white p-7 shadow-[0_18px_48px_rgba(40,12,18,0.08)] md:p-10">
                <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">
                  {project.ctaTitle}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-dark-600">
                  {project.ctaDescription}
                </p>
                <Link
                  to={project.officialContributionUrl}
                  aria-label={`${page.labels.contribute}: ${project.title}. ${page.labels.externalNotice}`}
                  className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary-600 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                >
                  {page.labels.contribute}
                  <ArrowIcon className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </FadeContent>
          </div>
        </section>

        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <FadeContent {...reveal}>
              <div className="mb-10 flex flex-col gap-4 text-start sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="h-px w-8 bg-primary-200" />
                    <span className="text-sm font-semibold text-primary-700">{page.labels.otherProjects}</span>
                  </div>
                  <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">
                    {page.labels.otherProjects}
                  </h2>
                </div>
                <Link
                  to={projectRoutes.index}
                  className="group/link inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-100 bg-white px-5 py-2.5 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                >
                  {page.labels.backToProjects}
                  <ArrowIcon
                    className={`h-4 w-4 transition-transform motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0 ${
                      isRtl ? 'group-hover/link:-translate-x-1' : 'group-hover/link:translate-x-1'
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </FadeContent>

            <div className="grid gap-6 md:grid-cols-2">
              {relatedProjects.map((relatedProject, index) => (
                <FadeContent
                  key={relatedProject.slug}
                  blur={false}
                  duration={540}
                  initialOpacity={0}
                  yOffset={14}
                  delay={index * 60}
                  threshold={0.14}
                  once
                >
                  <RelatedProjectCard
                    project={relatedProject}
                    detailsLabel={page.labels.details}
                    isRtl={isRtl}
                  />
                </FadeContent>
              ))}
            </div>
          </div>
        </section>
      </main>

      {project.video && (
        <VideoModal
          isOpen={videoOpen}
          onClose={() => setVideoOpen(false)}
          onExitComplete={() => undefined}
          videoId={project.video.videoId}
          posterImage={project.image}
        />
      )}
    </>
  );
}
