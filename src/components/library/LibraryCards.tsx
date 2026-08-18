import { ArrowLeft, ArrowRight, Download, ExternalLink, FileText, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLanguageName, type LibraryDocumentItem, type LibraryLabels, type LibraryTextItem } from '@/data/library';
import type { Locale } from '@/i18n/content';

type TextCardProps = {
  item: LibraryTextItem;
  labels: LibraryLabels;
  locale: Locale;
  isRtl: boolean;
  variant: 'article' | 'story';
};

type DocumentCardProps = {
  item: LibraryDocumentItem;
  labels: LibraryLabels;
  locale: Locale;
};

function formatDate(locale: Locale, date: string) {
  if (!date) return '';
  const formatterLocale = locale === 'ar' ? 'ar' : locale === 'tr' ? 'tr-TR' : 'en-US';
  return new Intl.DateTimeFormat(formatterLocale, {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  }).format(new Date(date));
}

export function LibraryTextCard({ item, labels, locale, isRtl, variant }: TextCardProps) {
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const date = formatDate(locale, item.date);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[rgba(127,29,45,0.11)] bg-white text-start shadow-[0_18px_48px_rgba(40,12,18,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_24px_58px_rgba(40,12,18,0.12)]">
      <Link to={item.route} className="relative aspect-[16/10] overflow-hidden bg-warm">
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

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold text-primary-700">
          <Languages className="h-4 w-4" aria-hidden="true" />
          <span>
            {labels.sourceLanguage}: {getLanguageName(locale, item.sourceLanguage)}
          </span>
        </div>
        <h2 className="text-xl font-bold leading-tight text-dark-950 md:text-2xl">
          <Link to={item.route} className="transition-colors hover:text-primary-700">
            {item.title}
          </Link>
        </h2>
        {item.title !== item.originalTitle && (
          <p className="mt-2 text-sm font-medium leading-relaxed text-dark-500">{item.originalTitle}</p>
        )}
        <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-dark-600">{item.excerpt}</p>

        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          <Link
            to={item.route}
            className="group/link inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
          >
            {variant === 'story' ? labels.readStory : labels.readArticle}
            <ArrowIcon
              className={`h-4 w-4 transition-transform ${
                isRtl ? 'group-hover/link:-translate-x-1' : 'group-hover/link:translate-x-1'
              }`}
              aria-hidden="true"
            />
          </Link>

          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary-100 bg-white px-5 py-2.5 text-sm font-bold text-primary-700 transition-colors hover:border-primary-200 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
          >
            {labels.officialSource}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function LibraryDocumentCard({ item, labels, locale }: DocumentCardProps) {
  const date = formatDate(locale, item.date);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[rgba(127,29,45,0.11)] bg-white text-start shadow-[0_18px_48px_rgba(40,12,18,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_24px_58px_rgba(40,12,18,0.12)]">
      <a
        href={item.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative aspect-[4/3] overflow-hidden bg-warm"
      >
        <img
          src={item.image}
          alt={item.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
        />
        <span className="absolute start-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-primary-700 shadow-sm">
          <FileText className="h-4 w-4" aria-hidden="true" />
          {item.pdfUrl ? labels.directPdfAvailable : labels.noDirectPdf}
        </span>
      </a>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        {(date || item.year) && (
          <p className="text-sm font-semibold text-primary-700">{date || item.year}</p>
        )}
        <h2 className="mt-2 text-xl font-bold leading-tight text-dark-950 md:text-2xl">{item.title}</h2>
        {item.excerpt && <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-dark-600">{item.excerpt}</p>}

        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
          >
            {labels.openDocument}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>

          {item.pdfUrl && (
            <a
              href={item.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary-100 bg-white px-5 py-2.5 text-sm font-bold text-primary-700 transition-colors hover:border-primary-200 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {labels.downloadPdf}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
