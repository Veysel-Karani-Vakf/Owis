import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  FileText,
  Images,
  Library,
  Newspaper,
  ScrollText,
  Trophy,
  Users,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import FadeContent from '@/components/effects/FadeContent';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import {
  getDocuments,
  getForumArticles,
  getGalleryImages,
  getLibraryContent,
  getSuccessStories,
} from '@/data/library';
import { useI18n } from '@/i18n/useI18n';

const collectionOrder = [
  'forum',
  'periodic-reports',
  'waqf-books',
  'waqf-literature',
  'yemeni-figures',
  'success-stories',
  'gallery',
] as const;

const collectionIcons = {
  forum: Newspaper,
  'periodic-reports': FileText,
  'waqf-books': BookOpen,
  'waqf-literature': ScrollText,
  'yemeni-figures': Users,
  'success-stories': Trophy,
  gallery: Images,
} as const;

export default function LibraryIndexPage() {
  const { locale, isRtl, content: siteContent } = useI18n();
  const page = getLibraryContent(locale);
  const shouldReduceMotion = useReducedMotion();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const latestArticles = getForumArticles(locale).slice(0, 3);
  const latestDocuments = getDocuments('periodicReports').slice(0, 3);
  const storyCount = getSuccessStories(locale).length;
  const galleryCount = getGalleryImages().length;

  const counts: Record<(typeof collectionOrder)[number], number> = {
    forum: getForumArticles(locale).length,
    'periodic-reports': getDocuments('periodicReports').length,
    'waqf-books': getDocuments('waqfBooks').length,
    'waqf-literature': getDocuments('waqfLiterature').length,
    'yemeni-figures': getDocuments('yemeniFigures').length,
    'success-stories': storyCount,
    gallery: galleryCount,
  };

  const itemListSchema = useMemo(() => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;

    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: page.hero.title,
      description: page.hero.description,
      hasPart: collectionOrder.map((slug) => ({
        '@type': 'CollectionPage',
        name: page.collections[slug].title,
        url: `${origin}${page.collections[slug].route}`,
      })),
    };
  }, [page]);

  return (
    <>
      <PageSeo
        title={`${page.hero.title} | ${siteContent.siteConfig.name}`}
        description={page.hero.description}
        image={page.hero.image}
        structuredData={itemListSchema}
      />
      <main className="bg-white">
        <PageHero
          title={page.hero.title}
          description={page.hero.description}
          image={page.hero.image}
          imageAlt={page.hero.title}
          breadcrumbs={page.breadcrumbs.index}
        />

        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <FadeContent blur={false} duration={620} initialOpacity={0} yOffset={16} threshold={0.18} once>
              <div className="mb-10 max-w-3xl text-start">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-px w-8 bg-primary-200" />
                  <span className="text-sm font-semibold text-primary-700">{page.hero.eyebrow}</span>
                </div>
                <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">
                  {page.labels.library}
                </h2>
              </div>
            </FadeContent>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {collectionOrder.map((slug, index) => {
                const collection = page.collections[slug];
                const Icon = collectionIcons[slug];

                return (
                  <motion.article
                    key={slug}
                    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.22 }}
                    transition={{ duration: shouldReduceMotion ? 0.01 : 0.55, delay: index * 0.06 }}
                    className="group h-full"
                  >
                    <Link
                      to={collection.route}
                      className="flex h-full flex-col rounded-[22px] border border-[rgba(127,29,45,0.11)] bg-white p-5 text-start shadow-[0_18px_48px_rgba(40,12,18,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_24px_58px_rgba(40,12,18,0.12)] md:p-6"
                    >
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                          <Icon className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <span className="rounded-full bg-warm px-3 py-1.5 text-xs font-bold text-dark-600">
                          {counts[slug]} {page.labels.results}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-primary-700">{collection.eyebrow}</p>
                      <h3 className="mt-2 text-2xl font-bold leading-tight text-dark-950">{collection.title}</h3>
                      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-dark-600">
                        {collection.description}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-primary-700">
                        {page.labels.browse}
                        <ArrowIcon
                          className={`h-4 w-4 transition-transform ${
                            isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                          }`}
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#faf8f8] py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 md:px-8 xl:grid-cols-2">
            <div className="text-start">
              <div className="mb-6 flex items-center gap-3">
                <Library className="h-5 w-5 text-primary-700" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-dark-950">{page.labels.latest}</h2>
              </div>
              <div className="grid gap-4">
                {latestArticles.map((article) => (
                  <Link
                    key={article.slug}
                    to={article.route}
                    className="grid gap-4 rounded-[22px] border border-primary-100 bg-white p-4 text-start shadow-sm transition-colors hover:border-primary-200 md:grid-cols-[112px_1fr]"
                  >
                    <img
                      src={article.image}
                      alt={article.imageAlt}
                      loading="lazy"
                      className="aspect-[4/3] w-full rounded-2xl object-cover md:h-24"
                    />
                    <div>
                      <h3 className="line-clamp-2 text-lg font-bold leading-tight text-dark-950">{article.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-dark-600">{article.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="text-start">
              <div className="mb-6 flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary-700" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-dark-950">
                  {page.collections['periodic-reports'].title}
                </h2>
              </div>
              <div className="grid gap-4">
                {latestDocuments.map((document) => (
                  <a
                    key={document.id}
                    href={document.pdfUrl ?? document.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid gap-4 rounded-[22px] border border-primary-100 bg-white p-4 text-start shadow-sm transition-colors hover:border-primary-200 md:grid-cols-[112px_1fr]"
                  >
                    <img
                      src={document.image}
                      alt={document.imageAlt}
                      loading="lazy"
                      className="aspect-[4/3] w-full rounded-2xl object-cover md:h-24"
                    />
                    <div>
                      <h3 className="line-clamp-2 text-lg font-bold leading-tight text-dark-950">{document.title}</h3>
                      <p className="mt-2 text-sm font-semibold text-primary-700">
                        {document.pdfUrl ? page.labels.directPdfAvailable : page.labels.noDirectPdf}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
