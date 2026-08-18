import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatNewsDate, getLatestNews, newsLabels, newsRoutes } from '@/data/news';
import { useInView } from '@/hooks/useInView';
import { useI18n } from '@/i18n/useI18n';

export default function News() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const { content, t, isRtl, locale } = useI18n();
  const newsContent = content.news;
  const labels = newsLabels[locale];
  const news = getLatestNews(locale, 3);
  const featured = news[0];
  const others = news.slice(1, 3);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const arrowHoverClass = isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1';

  return (
    <section id="news" className="relative overflow-hidden bg-white py-20 md:py-28">
      <div ref={ref} className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="h-px w-8 bg-gold-400" />
            <span className="text-sm font-medium text-gold-600">{newsContent.eyebrow}</span>
            <span className="h-px w-8 bg-gold-400" />
          </div>
          <h2 className="mb-4 font-brand text-3xl font-bold text-dark-900 md:text-4xl lg:text-5xl">
            {newsContent.title}
          </h2>
          <Link
            to={newsRoutes.index}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary-100 bg-white px-5 py-2.5 text-sm font-bold text-primary-700 shadow-sm transition-colors hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
          >
            {labels.allNews}
            <ArrowIcon className={`h-4 w-4 transition-transform ${arrowHoverClass}`} aria-hidden="true" />
          </Link>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-cream text-start shadow-lg"
          >
            <Link to={featured.route} className="relative aspect-[16/10] overflow-hidden">
              <img
                src={featured.image}
                alt={featured.imageAlt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"%3E%3Crect fill="%232c6147" width="400" height="250"/%3E%3C/svg%3E';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 to-transparent" />
              <span className="absolute start-4 top-4 rounded-full bg-primary-600 px-3 py-1.5 text-xs font-medium text-white shadow-md">
                {featured.category}
              </span>
            </Link>

            <div className="flex flex-1 flex-col p-6 md:p-7">
              <div className="mb-3 flex items-center gap-2 text-xs text-dark-400">
                <Calendar className="h-4 w-4" />
                <time dateTime={featured.publishedAt}>{formatNewsDate(locale, featured.publishedAt)}</time>
              </div>
              <h3 className="mb-3 text-lg font-bold leading-snug text-dark-900 md:text-xl">
                <Link to={featured.route} className="transition-colors hover:text-primary-700">
                  {featured.title}
                </Link>
              </h3>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-dark-500">
                {featured.excerpt}
              </p>
              <Link
                to={featured.route}
                className="flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors group-hover:text-primary-700"
              >
                {t('common.readMore')}
                <ArrowIcon className={`h-4 w-4 transition-transform ${arrowHoverClass}`} />
              </Link>
            </div>
          </motion.article>

          <div className="flex flex-col gap-6 lg:gap-8">
            {others.map((item, i) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className="group flex flex-1 flex-col overflow-hidden rounded-2xl bg-cream text-start shadow-md transition-shadow hover:shadow-lg sm:flex-row"
              >
                <Link to={item.route} className="relative aspect-[16/10] overflow-hidden sm:w-2/5 sm:flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"%3E%3Crect fill="%232c6147" width="400" height="250"/%3E%3C/svg%3E';
                    }}
                  />
                  <span className="absolute start-3 top-3 rounded-full bg-primary-600/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {item.category}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-center gap-2 text-xs text-dark-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <time dateTime={item.publishedAt}>{formatNewsDate(locale, item.publishedAt)}</time>
                  </div>
                  <h3 className="mb-2 text-sm font-bold leading-snug text-dark-900 md:text-base">
                    <Link to={item.route} className="transition-colors hover:text-primary-700">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mb-3 flex-1 text-xs leading-relaxed text-dark-500 line-clamp-2 md:text-sm">
                    {item.excerpt}
                  </p>
                  <Link to={item.route} className="flex items-center gap-1.5 text-xs font-semibold text-primary-600">
                    {t('common.readMore')}
                    <ArrowIcon className={`h-3.5 w-3.5 transition-transform ${arrowHoverClass}`} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
