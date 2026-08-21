import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import FadeContent from '@/components/effects/FadeContent';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import NewsCard from '@/components/news/NewsCard';
import NewsSearchControls from '@/components/news/NewsSearchControls';
import {
  formatNewsDate,
  getFeaturedNews,
  getNewsArticles,
  getNewsBreadcrumbs,
  getNewsYears,
  newsLabels,
  searchNewsArticles,
  type LocalizedNewsArticle,
  type NewsLabels,
} from '@/data/news';
import { useNarrowScreen } from '@/hooks/useResponsiveMotion';
import { useI18n } from '@/i18n/useI18n';
import type { Locale } from '@/i18n/content';

const pageSize = 9;

type NewsMiniCardProps = {
  article: LocalizedNewsArticle;
  labels: NewsLabels;
  locale: Locale;
};

function NewsMiniCard({ article, labels, locale }: NewsMiniCardProps) {
  return (
    <article className="group flex flex-1 overflow-hidden rounded-[20px] border border-[rgba(127,29,45,0.10)] bg-white text-start shadow-[0_16px_42px_rgba(35,12,18,0.07)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[0_22px_52px_rgba(35,12,18,0.11)]">
      <Link to={article.route} className="relative w-32 shrink-0 overflow-hidden bg-warm sm:w-40">
        <img
          src={article.image}
          alt={article.imageAlt}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-dark-500">
          <Calendar className="h-3.5 w-3.5 text-primary-700" aria-hidden="true" />
          <time dateTime={article.publishedAt}>{formatNewsDate(locale, article.publishedAt)}</time>
        </div>
        <h3 className="text-base font-bold leading-snug text-dark-950">
          <Link to={article.route} className="line-clamp-3 transition-colors hover:text-primary-700">
            {article.title}
          </Link>
        </h3>
        <span className="sr-only">{labels.readArticle}</span>
      </div>
    </article>
  );
}

export default function NewsIndexPage() {
  const { locale, isRtl, content: siteContent } = useI18n();
  const labels = newsLabels[locale];
  const shouldReduceMotion = useReducedMotion();
  const isNarrow = useNarrowScreen();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const [page, setPage] = useState(1);

  const articles = getNewsArticles(locale);
  const featured = getFeaturedNews(locale);
  const years = getNewsYears();
  const filtered = useMemo(() => searchNewsArticles(articles, query, year), [articles, query, year]);
  const hasActiveFilter = query.trim() !== '' || year !== 'all';

  const spotlight = hasActiveFilter ? undefined : filtered[0];
  const sideArticles = hasActiveFilter ? [] : filtered.slice(1, 3);
  const gridArticles = hasActiveFilter ? filtered : filtered.slice(3);
  const pageCount = Math.max(1, Math.ceil(gridArticles.length / pageSize));
  const visibleArticles = gridArticles.slice((page - 1) * pageSize, page * pageSize);

  const structuredData = useMemo(() => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;

    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: labels.news,
      description: labels.heroDescription,
      hasPart: articles.map((article) => ({
        '@type': 'NewsArticle',
        headline: article.title,
        datePublished: article.publishedAt,
        url: `${origin}${article.route}`,
        image: `${origin}${article.image}`,
      })),
    };
  }, [articles, labels.heroDescription, labels.news]);

  const updateQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const updateYear = (value: string) => {
    setYear(value);
    setPage(1);
  };

  return (
    <>
      <PageSeo
        title={`${labels.news} | ${siteContent.siteConfig.name}`}
        description={labels.heroDescription}
        image={featured.image}
        structuredData={structuredData}
      />
      <main className="bg-white">
        <PageHero
          title={labels.news}
          description={labels.heroDescription}
          image={featured.image}
          imageAlt={featured.imageAlt}
          breadcrumbs={getNewsBreadcrumbs(locale)}
        />

        <section className="bg-[#faf8f8] py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <FadeContent blur={false} duration={620} initialOpacity={0} yOffset={16} threshold={0.18} once>
              <div className="mb-6 max-w-3xl text-start">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-px w-8 bg-primary-200" />
                  <span className="text-sm font-semibold text-primary-700">{labels.eyebrow}</span>
                </div>
                <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{labels.latest}</h2>
              </div>
            </FadeContent>

            <NewsSearchControls
              labels={labels}
              query={query}
              year={year}
              years={years}
              resultCount={filtered.length}
              onQueryChange={updateQuery}
              onYearChange={updateYear}
              onClear={() => {
                setQuery('');
                setYear('all');
                setPage(1);
              }}
            />

            {spotlight && (
              <div className="mb-5 grid gap-5 lg:grid-cols-3">
                <motion.article
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 0.62 }}
                  className="group grid overflow-hidden rounded-[20px] border border-[rgba(127,29,45,0.10)] bg-white text-start shadow-[0_20px_56px_rgba(35,12,18,0.09)] lg:col-span-2 lg:grid-cols-2"
                >
                  <Link to={spotlight.route} className="relative min-h-[240px] overflow-hidden bg-warm lg:min-h-0">
                    <img
                      src={spotlight.image}
                      alt={spotlight.imageAlt}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                    <span className="absolute start-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-primary-700 shadow-sm">
                      {labels.featured}
                    </span>
                  </Link>
                  <div className="flex flex-col justify-center p-6 md:p-7">
                    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-dark-500">
                      <Calendar className="h-4 w-4 text-primary-700" aria-hidden="true" />
                      <time dateTime={spotlight.publishedAt}>{formatNewsDate(locale, spotlight.publishedAt)}</time>
                    </div>
                    <h2 className="text-xl font-bold leading-snug text-dark-950 md:text-2xl">
                      <Link to={spotlight.route} className="line-clamp-3 transition-colors hover:text-primary-700">
                        {spotlight.title}
                      </Link>
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-dark-600 md:text-base">
                      {spotlight.excerpt}
                    </p>
                    <Link
                      to={spotlight.route}
                      className="mt-5 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                    >
                      {labels.readArticle}
                      <ArrowIcon
                        className={`h-4 w-4 transition-transform ${
                          isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                        }`}
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </motion.article>

                {sideArticles.length > 0 && (
                  <div className="flex flex-col gap-5">
                    {sideArticles.map((article, index) => (
                      <motion.div
                        key={article.id}
                        className="flex flex-1"
                        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: shouldReduceMotion ? 0.01 : 0.55, delay: index * 0.08 }}
                      >
                        <NewsMiniCard article={article} labels={labels} locale={locale} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {visibleArticles.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {visibleArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isNarrow ? 12 : 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{
                      once: true,
                      amount: isNarrow ? 0.1 : 0.16,
                      margin: isNarrow ? '0px 0px -8% 0px' : '0px 0px -10% 0px',
                    }}
                    transition={{
                      duration: shouldReduceMotion ? 0.01 : isNarrow ? 0.42 : 0.55,
                      delay: shouldReduceMotion ? 0 : index * 0.07,
                    }}
                  >
                    <NewsCard article={article} labels={labels} locale={locale} isRtl={isRtl} compact />
                  </motion.div>
                ))}
              </div>
            ) : (
              !spotlight && (
                <div className="rounded-[20px] border border-primary-100 bg-white p-8 text-center text-base font-semibold text-dark-600">
                  {labels.noResults}
                </div>
              )
            )}

            {pageCount > 1 && (
              <nav aria-label={labels.loadPage} className="mt-10 flex flex-wrap justify-center gap-2">
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPage(item)}
                    aria-current={item === page ? 'page' : undefined}
                    className={`flex h-11 min-w-11 items-center justify-center rounded-full px-4 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
                      item === page
                        ? 'bg-primary-600 text-white'
                        : 'border border-primary-100 bg-white text-primary-700 hover:bg-primary-50'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </nav>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
