import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  formatNewsDate,
  type LocalizedNewsArticle,
  type NewsLabels,
} from '@/data/news';
import type { Locale } from '@/i18n/content';

type NewsCardProps = {
  article: LocalizedNewsArticle;
  labels: NewsLabels;
  locale: Locale;
  isRtl: boolean;
  compact?: boolean;
};

export default function NewsCard({ article, labels, locale, isRtl, compact = false }: NewsCardProps) {
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[rgba(127,29,45,0.10)] bg-white text-start shadow-[0_16px_42px_rgba(35,12,18,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_22px_52px_rgba(35,12,18,0.11)]">
      <Link to={article.route} className="relative aspect-[16/10] overflow-hidden bg-warm">
        <img
          src={article.image}
          alt={article.imageAlt}
          loading="lazy"
          className="h-full w-full object-contain"
        />
        <span className="absolute start-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-primary-700 shadow-sm">
          {article.category}
        </span>
      </Link>

      <div className={compact ? 'flex flex-1 flex-col p-5' : 'flex flex-1 flex-col p-5 md:p-6'}>
        <div className="mb-3 flex items-center gap-2 text-xs font-bold text-dark-500">
          <Calendar className="h-4 w-4 text-primary-700" aria-hidden="true" />
          <time dateTime={article.publishedAt}>{formatNewsDate(locale, article.publishedAt)}</time>
        </div>

        <h2 className={compact ? 'text-lg font-bold leading-tight text-dark-950' : 'text-xl font-bold leading-tight text-dark-950 md:text-2xl'}>
          <Link to={article.route} className="transition-colors hover:text-primary-700">
            {article.title}
          </Link>
        </h2>

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-dark-600">{article.excerpt}</p>

        <Link
          to={article.route}
          className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-sm font-bold text-primary-700 transition-colors hover:text-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
        >
          {labels.readMore}
          <ArrowIcon
            className={`h-4 w-4 transition-transform ${
              isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
            }`}
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
