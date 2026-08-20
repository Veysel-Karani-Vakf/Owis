import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getReadingMinutes, type LibraryLabels, type LibraryTextItem } from '@/data/library';
import type { Locale } from '@/i18n/content';

type TextCardProps = {
  item: LibraryTextItem;
  labels: LibraryLabels;
  locale: Locale;
  isRtl: boolean;
  variant: 'article' | 'story';
  /** Larger card used for the first item in a collection. */
  featured?: boolean;
};

function formatDate(locale: Locale, date: string) {
  if (!date) return '';
  const formatterLocale = locale === 'ar' ? 'ar' : locale === 'tr' ? 'tr-TR' : 'en-US';
  return new Intl.DateTimeFormat(formatterLocale, { month: 'long', year: 'numeric', day: 'numeric' }).format(
    new Date(date)
  );
}

export function LibraryTextCard({ item, labels, locale, isRtl, variant, featured = false }: TextCardProps) {
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const date = formatDate(locale, item.date);
  const minutes = getReadingMinutes(item);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-[22px] border border-[rgba(127,29,45,0.11)] bg-white text-start shadow-[0_14px_38px_rgba(40,12,18,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_22px_52px_rgba(40,12,18,0.12)] ${
        featured ? 'md:flex-row' : ''
      }`}
    >
      <Link
        to={item.route}
        className={`relative overflow-hidden bg-warm ${featured ? 'aspect-[16/10] md:aspect-auto md:w-[46%] md:shrink-0' : 'aspect-[16/10]'}`}
        aria-label={item.title}
      >
        <img
          src={item.image}
          alt={item.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
        />
        {date && (
          <span className="absolute start-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-primary-700 shadow-sm">
            {date}
          </span>
        )}
      </Link>

      <div className={`flex flex-1 flex-col p-5 ${featured ? 'md:p-7' : ''}`}>
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-dark-500">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
            {minutes} {labels.readingTime}
          </span>
          <span className="text-primary-700">{variant === 'story' ? labels.typeStory : labels.typeArticle}</span>
        </div>
        <h2 className={`font-bold leading-snug text-dark-950 ${featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
          <Link to={item.route} className="transition-colors hover:text-primary-700">
            {item.title}
          </Link>
        </h2>
        <p className={`mt-3 text-sm leading-relaxed text-dark-600 ${featured ? 'line-clamp-4 md:text-base' : 'line-clamp-3'}`}>
          {item.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <Link
            to={item.route}
            className="group/link inline-flex items-center gap-2 text-sm font-bold text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
          >
            {variant === 'story' ? labels.readStory : labels.readArticle}
            <ArrowIcon
              className={`h-4 w-4 transition-transform ${isRtl ? 'group-hover/link:-translate-x-1' : 'group-hover/link:translate-x-1'}`}
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
