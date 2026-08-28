import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, HandHeart, Landmark } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import FadeContent from '@/components/effects/FadeContent';
import SpotlightCard from '@/components/effects/SpotlightCard';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import { getProjectsContent, type LocalizedWaqfProject } from '@/data/projects';
import { useProjectsContent } from '@/hooks/useCmsContent';
import { useRevealMotion } from '@/hooks/useResponsiveMotion';
import { useI18n } from '@/i18n/useI18n';

type ProjectCardProps = {
  project: LocalizedWaqfProject;
  index: number;
  labels: ReturnType<typeof getProjectsContent>['labels'];
  isRtl: boolean;
};

function ProjectCard({ project, index, labels, isRtl }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const revealMotion = useRevealMotion({
    y: 22,
    scale: 0.985,
    duration: 0.62,
    delay: index * 0.09,
    amount: 0.2,
    mobileY: 14,
    mobileDuration: 0.46,
  });
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <motion.article
      data-project-index-card={project.slug}
      {...revealMotion}
      className="h-full"
    >
      <SpotlightCard
        disabled={Boolean(shouldReduceMotion)}
        spotlightColor="rgba(180, 35, 58, 0.08)"
        className="group/card flex h-full flex-col overflow-hidden rounded-[22px] border border-[rgba(127,29,45,0.11)] bg-white text-start shadow-[0_18px_48px_rgba(40,12,18,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_24px_58px_rgba(40,12,18,0.12)] motion-reduce:hover:translate-y-0"
      >
        <div className="relative aspect-square overflow-hidden bg-white">
          <img
            src={project.image}
            alt={project.imageAlt}
            width={1080}
            height={1080}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
          />
          <div className="absolute start-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-primary-700 shadow-sm">
            <Landmark className="h-4 w-4" aria-hidden="true" />
            {labels.projectBadge}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-4">
          <p className="text-xs font-semibold text-primary-700">{project.category}</p>
          <h2 className="mt-1 text-lg font-bold leading-snug text-dark-950 md:text-xl">
            {project.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-dark-600">
            {project.shortDescription}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-primary-100 bg-primary-50/45 px-3 py-2">
            <p className="text-xs font-semibold text-primary-700">{labels.contribution}</p>
            <p className="text-sm font-bold text-dark-950">{project.contributionValue}</p>
          </div>

          <div className="mt-auto flex flex-wrap gap-2 pt-3">
            <Link
              to={project.route}
              className="group/link inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-primary-600 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
            >
              {labels.details}
              <ArrowIcon
                className={`h-4 w-4 transition-transform motion-reduce:transition-none motion-reduce:group-hover/link:translate-x-0 ${
                  isRtl ? 'group-hover/link:-translate-x-1' : 'group-hover/link:translate-x-1'
                }`}
                aria-hidden="true"
              />
            </Link>

            <Link
              to={project.officialContributionUrl}
              aria-label={`${labels.contribute}: ${project.title}. ${labels.externalNotice}`}
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-primary-100 bg-white px-3.5 py-1.5 text-xs font-bold text-primary-700 transition-colors hover:border-primary-200 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
            >
              <HandHeart className="h-4 w-4" aria-hidden="true" />
              {labels.contribute}
            </Link>
          </div>
        </div>
      </SpotlightCard>
    </motion.article>
  );
}

export default function ProjectsPage() {
  const { locale, isRtl, content } = useI18n();
  const page = useProjectsContent(locale, content.projects.items);

  const itemListSchema = useMemo(() => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: page.hero.title,
      itemListElement: page.projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: project.title,
        url: `${origin}${project.route}`,
      })),
    };
  }, [page.hero.title, page.projects]);

  return (
    <>
      <PageSeo
        title={page.seo.title}
        description={page.seo.description}
        canonical={page.seo.canonical}
        image={page.hero.image}
        structuredData={itemListSchema}
      />
      <main className="bg-white">
        <PageHero
          title={page.hero.title}
          description={page.hero.description}
          image={page.hero.image}
          imageAlt={page.hero.imageAlt}
          breadcrumbs={page.breadcrumbs}
        />

        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
            <FadeContent
              blur={false}
              duration={650}
              initialOpacity={0}
              yOffset={16}
              threshold={0.18}
              once
            >
              <div className="mb-4 flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-primary-200" />
                <span className="text-sm font-semibold text-primary-700">{page.intro.eyebrow}</span>
                <span className="h-px w-8 bg-primary-200" />
              </div>
              <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">
                {page.intro.title}
              </h2>
              <div className="mx-auto mt-5 max-w-3xl space-y-3 text-base leading-relaxed text-dark-600 md:text-lg">
                {page.intro.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </FadeContent>
          </div>
        </section>

        <section className="bg-[#faf8f8] py-10 md:py-12">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <FadeContent
              blur={false}
              duration={620}
              initialOpacity={0}
              yOffset={14}
              threshold={0.18}
              once
            >
              <div className="mx-auto mb-6 max-w-3xl text-center md:mb-8">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <span className="h-px w-8 bg-primary-200" />
                  <span className="text-sm font-semibold text-primary-700">{page.grid.eyebrow}</span>
                  <span className="h-px w-8 bg-primary-200" />
                </div>
                <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">
                  {page.grid.title}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-dark-600">
                  {page.grid.description}
                </p>
              </div>
            </FadeContent>

            <div className="mx-auto grid max-w-[62rem] gap-4 md:grid-cols-2 xl:grid-cols-3">
              {page.projects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={index}
                  labels={page.labels}
                  isRtl={isRtl}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
