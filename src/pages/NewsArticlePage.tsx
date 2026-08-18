import { ArrowLeft, ArrowRight, Calendar, ExternalLink, Languages } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import LibraryLightbox from '@/components/library/LibraryLightbox';
import NewsCard from '@/components/news/NewsCard';
import NewsShareActions from '@/components/news/NewsShareActions';
import {
  formatNewsDate,
  getNewsArticle,
  getNewsBreadcrumbs,
  getRelatedNewsArticles,
  newsLabels,
  newsRoutes,
} from '@/data/news';
import { getLibraryContent } from '@/data/library';
import { useI18n } from '@/i18n/useI18n';

export default function NewsArticlePage() {
  const { slug } = useParams();
  const { locale, isRtl, content: siteContent } = useI18n();
  const labels = newsLabels[locale];
  const libraryLabels = getLibraryContent(locale).labels;
  const article = getNewsArticle(locale, slug);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const structuredData = useMemo(() => {
    if (!article) return undefined;
    const origin = typeof window === 'undefined' ? '' : window.location.origin;

    return {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      description: article.excerpt,
      datePublished: article.publishedAt,
      image: [`${origin}${article.image}`],
      mainEntityOfPage: `${origin}${article.route}`,
      publisher: {
        '@type': 'Organization',
        name: siteContent.siteConfig.name,
        logo: {
          '@type': 'ImageObject',
          url: siteContent.siteConfig.logo,
        },
      },
    };
  }, [article, siteContent.siteConfig.logo, siteContent.siteConfig.name]);

  if (!article) return <Navigate to={newsRoutes.index} replace />;

  const related = getRelatedNewsArticles(locale, article.slug, 3);
  const date = formatNewsDate(locale, article.publishedAt);

  return (
    <>
      <PageSeo
        title={`${article.title} | ${siteContent.siteConfig.name}`}
        description={article.excerpt}
        type="article"
        image={article.image}
        structuredData={structuredData}
      />
      <main className="bg-white">
        <PageHero
          title={article.title}
          description={article.excerpt}
          image={article.image}
          imageAlt={article.imageAlt}
          breadcrumbs={getNewsBreadcrumbs(locale, article)}
        />

        <article className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 md:px-8">
            <div className="mx-auto max-w-[820px] text-start">
              <div className="mb-8 flex flex-wrap gap-3 text-sm font-bold text-dark-600">
                <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary-50 px-4 text-primary-700">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={article.publishedAt}>{date}</time>
                </span>
                <span className="inline-flex min-h-10 items-center rounded-full bg-warm px-4 text-dark-700">
                  {article.category}
                </span>
                <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-warm px-4 text-dark-700">
                  <Languages className="h-4 w-4 text-primary-700" aria-hidden="true" />
                  {labels.sourceLanguage}: العربية
                </span>
              </div>

              <figure className="mb-10 overflow-hidden rounded-[20px] border border-primary-100 bg-warm shadow-[0_18px_48px_rgba(35,12,18,0.08)]">
                <img
                  src={article.image}
                  alt={article.imageAlt}
                  className="aspect-[16/10] w-full object-cover"
                />
              </figure>

              {locale !== 'ar' && (
                <p className="mb-8 rounded-[20px] border border-primary-100 bg-primary-50 px-5 py-4 text-sm font-semibold leading-relaxed text-primary-800">
                  {labels.originalLanguageNote}
                </p>
              )}

              <div className="space-y-6 text-lg leading-9 text-dark-800">
                {article.content.map((paragraph, index) => (
                  <p key={`${article.id}-${index}`}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary-100 bg-white px-5 py-2.5 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                >
                  {labels.officialSource}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {article.gallery.length > 0 && (
              <section className="mx-auto mt-14 max-w-[920px]">
                <div className="mb-6 flex items-center gap-2 text-start">
                  <span className="h-px w-8 bg-primary-200" />
                  <h2 className="text-2xl font-bold text-dark-950">{labels.gallery}</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {article.gallery.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className="group relative aspect-[16/10] overflow-hidden rounded-[20px] border border-white bg-warm text-start shadow-[0_16px_42px_rgba(35,12,18,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(35,12,18,0.11)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                      aria-label={`${libraryLabels.openImage}: ${image.title}`}
                    >
                      <img
                        src={image.thumbnail}
                        alt={image.imageAlt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                      />
                      <span className="absolute inset-x-3 bottom-3 rounded-full bg-dark-950/82 px-3 py-2 text-center text-xs font-bold text-white backdrop-blur-sm">
                        {libraryLabels.imageCounter} {index + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <div className="mx-auto mt-12 max-w-[820px]">
              <NewsShareActions labels={labels} title={article.title} />

              <Link
                to={newsRoutes.index}
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
              >
                <ArrowIcon className="h-4 w-4" aria-hidden="true" />
                {labels.backToNews}
              </Link>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="bg-[#faf8f8] py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <div className="mb-10 max-w-3xl text-start">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-px w-8 bg-primary-200" />
                  <span className="text-sm font-semibold text-primary-700">{labels.eyebrow}</span>
                </div>
                <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{labels.related}</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {related.map((item) => (
                  <NewsCard
                    key={item.id}
                    article={item}
                    labels={labels}
                    locale={locale}
                    isRtl={isRtl}
                    compact
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <LibraryLightbox
        images={article.gallery}
        activeIndex={activeImageIndex}
        labels={libraryLabels}
        isRtl={isRtl}
        onClose={() => setActiveImageIndex(null)}
        onMove={(nextIndex) => {
          if (!article.gallery.length) return;
          setActiveImageIndex((nextIndex + article.gallery.length) % article.gallery.length);
        }}
      />
    </>
  );
}
