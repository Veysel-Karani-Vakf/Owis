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
} from '@/data/news';
import { useI18n } from '@/i18n/useI18n';

const pageSize = 9;

export default function NewsIndexPage() {
  const { locale, isRtl, content: siteContent } = useI18n();
  const labels = newsLabels[locale];
  const shouldReduceMotion = useReducedMotion();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const [page, setPage] = useState(1);

  const articles = getNewsArticles(locale);
  const featured = getFeaturedNews(locale);
  const years = getNewsYears();
  const filtered = useMemo(() => searchNewsArticles(articles, query, year), [articles, query, year]);
  const hasActiveFilter = query.trim() !== '' || year !== 'all';
  const gridArticles = hasActiveFilter ? filtered : filtered.filter((article) => article.id !== featured.id);
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

        {!hasActiveFilter && (
          <section className="bg-white py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <FadeContent blur={false} duration={620} initialOpacity={0} yOffset={16} threshold={0.18} once>
                <div className="mb-8 flex items-center gap-2 text-start">
                  <span className="h-px w-8 bg-primary-200" />
                  <span className="text-sm font-semibold text-primary-700">{labels.featured}</span>
                </div>
              </FadeContent>

              <motion.article
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.62 }}
                className="grid overflow-hidden rounded-[20px] border border-[rgba(127,29,45,0.10)] bg-white text-start shadow-[0_20px_56px_rgba(35,12,18,0.09)] lg:grid-cols-[1.06fr_0.94fr]"
              >
                <Link to={featured.route} className="relative min-h-[280px] overflow-hidden bg-warm">
                  <img
                    src={featured.image}
                    alt={featured.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.035]"
                  />
                </Link>
                <div className="flex flex-col p-6 md:p-8 lg:p-10">
                  <span className="mb-5 w-fit rounded-full bg-primary-50 px-4 py-2 text-xs font-bold text-primary-700">
                    {labels.featured}
                  </span>
                  <div className="mb-4 flex items-center gap-2 text-sm font-bold text-dark-500">
                    <Calendar className="h-4 w-4 text-primary-700" aria-hidden="true" />
                    <time dateTime={featured.publishedAt}>{formatNewsDate(locale, featured.publishedAt)}</time>
                  </div>
                  <h2 className="text-2xl font-bold leading-tight text-dark-950 md:text-4xl">
                    <Link to={featured.route} className="transition-colors hover:text-primary-700">
                      {featured.title}
                    </Link>
                  </h2>
                  <p className="mt-5 text-base leading-relaxed text-dark-600">{featured.excerpt}</p>
                  <Link
                    to={featured.route}
                    className="mt-7 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
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
            </div>
          </section>
        )}

        <section className="bg-[#faf8f8] py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <FadeContent blur={false} duration={620} initialOpacity={0} yOffset={16} threshold={0.18} once>
              <div className="mb-10 max-w-3xl text-start">
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

            {visibleArticles.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {visibleArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.16 }}
                    transition={{ duration: shouldReduceMotion ? 0.01 : 0.55, delay: index * 0.07 }}
                  >
                    <NewsCard article={article} labels={labels} locale={locale} isRtl={isRtl} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-[20px] border border-primary-100 bg-white p-8 text-center text-base font-semibold text-dark-600">
                {labels.noResults}
              </div>
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
