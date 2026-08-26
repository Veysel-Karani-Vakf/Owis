import { Download, Eye, FileText } from 'lucide-react';
import type { LibraryDocumentItem, LibraryLabels } from '@/data/library';
import type { Locale } from '@/i18n/content';

type DocumentViewProps = {
  item: LibraryDocumentItem;
  labels: LibraryLabels;
  locale: Locale;
  onPreview: (item: LibraryDocumentItem) => void;
};

function formatDate(locale: Locale, date: string) {
  // The date column is free text; an unparsable value shows nothing instead of "Invalid Date".
  if (!date || Number.isNaN(Date.parse(date))) return '';
  const formatterLocale = locale === 'ar' ? 'ar' : locale === 'tr' ? 'tr-TR' : 'en-US';
  return new Intl.DateTimeFormat(formatterLocale, { month: 'long', year: 'numeric' }).format(new Date(date));
}

function PdfBadge({ hasPdf, labels }: { hasPdf: boolean; labels: LibraryLabels }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
        hasPdf ? 'bg-primary-600 text-white' : 'bg-white/95 text-dark-600 shadow-sm'
      }`}
    >
      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
      {hasPdf ? labels.pdfShort : labels.noPdfShort}
    </span>
  );
}

/** Compact "book cover" card used in the grid view. */
export function LibraryDocumentTile({ item, labels, locale, onPreview }: DocumentViewProps) {
  const meta = formatDate(locale, item.date) || (item.year ? String(item.year) : '');

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[rgba(127,29,45,0.11)] bg-white text-start shadow-[0_14px_38px_rgba(40,12,18,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_22px_52px_rgba(40,12,18,0.12)]">
      <button
        type="button"
        onClick={() => item.pdfUrl && onPreview(item)}
        disabled={!item.pdfUrl}
        className="relative aspect-[4/3] overflow-hidden bg-warm text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-primary-600 disabled:cursor-default"
        aria-label={`${item.pdfUrl ? labels.preview : labels.noPdfShort}: ${item.title}`}
      >
        <img
          src={item.image}
          alt={item.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute start-3 top-3">
          <PdfBadge hasPdf={Boolean(item.pdfUrl)} labels={labels} />
        </span>
        {item.pdfUrl && (
          <span className="absolute inset-0 flex items-center justify-center bg-dark-950/0 opacity-0 transition-all duration-300 group-hover:bg-dark-950/35 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-primary-700 shadow-lg">
              <Eye className="h-4 w-4" aria-hidden="true" />
              {labels.preview}
            </span>
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-4">
        {meta && <p className="text-xs font-semibold text-primary-700">{meta}</p>}
        <h2 className="mt-1 line-clamp-2 text-base font-bold leading-snug text-dark-950 md:text-lg">{item.title}</h2>
        {item.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-dark-600">{item.excerpt}</p>}

        <div className="mt-auto flex items-center gap-2 pt-4">
          {item.pdfUrl ? (
            <>
              <button
                type="button"
                onClick={() => onPreview(item)}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full bg-primary-600 px-4 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                {labels.preview}
              </button>
              <a
                href={item.pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${labels.downloadPdf}: ${item.title}`}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-100 text-primary-700 transition-colors hover:bg-primary-50"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
              </a>
            </>
          ) : (
            <span className="inline-flex min-h-10 flex-1 cursor-default items-center justify-center gap-2 rounded-full border border-dark-100 bg-warm px-4 text-sm font-bold text-dark-400">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              {labels.noPdfShort}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/** Dense row used in the list view. */
export function LibraryDocumentRow({ item, labels, locale, onPreview }: DocumentViewProps) {
  const meta = formatDate(locale, item.date) || (item.year ? String(item.year) : '');

  return (
    <li className="group flex items-center gap-4 rounded-[20px] border border-transparent bg-white p-3 text-start transition-all hover:border-primary-200 hover:shadow-[0_12px_30px_rgba(40,12,18,0.08)]">
      <button
        type="button"
        onClick={() => item.pdfUrl && onPreview(item)}
        disabled={!item.pdfUrl}
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-warm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-default md:h-20 md:w-20"
        aria-label={`${item.pdfUrl ? labels.preview : labels.noPdfShort}: ${item.title}`}
      >
        <img src={item.image} alt={item.imageAlt} loading="lazy" className="h-full w-full object-cover" />
      </button>
      <div className="min-w-0 flex-1">
        <h2 className="line-clamp-2 text-sm font-bold leading-snug text-dark-950 md:text-base">{item.title}</h2>
        <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-dark-500">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
              item.pdfUrl ? 'bg-primary-50 text-primary-700' : 'bg-warm text-dark-500'
            }`}
          >
            <FileText className="h-3 w-3" aria-hidden="true" />
            {item.pdfUrl ? labels.pdfShort : labels.noPdfShort}
          </span>
          {meta && <span>{meta}</span>}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {item.pdfUrl ? (
          <>
            <button
              type="button"
              onClick={() => onPreview(item)}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary-600 px-3.5 text-xs font-bold text-white transition-colors hover:bg-primary-700"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{labels.preview}</span>
            </button>
            <a
              href={item.pdfUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${labels.downloadPdf}: ${item.title}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary-100 text-primary-700 transition-colors hover:bg-primary-50"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
            </a>
          </>
        ) : (
          <span className="inline-flex min-h-10 cursor-default items-center gap-2 rounded-full border border-dark-100 bg-warm px-3.5 text-xs font-bold text-dark-400">
            <span className="hidden sm:inline">{labels.noPdfShort}</span>
            <FileText className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
    </li>
  );
}

/** Large news-style card used in the news view. */
export function LibraryDocumentNewsCard({ item, labels, locale, onPreview }: DocumentViewProps) {
  const meta = formatDate(locale, item.date) || (item.year ? String(item.year) : '');

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[rgba(127,29,45,0.11)] bg-white text-start shadow-[0_14px_38px_rgba(40,12,18,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_22px_52px_rgba(40,12,18,0.12)]">
      <button
        type="button"
        onClick={() => item.pdfUrl && onPreview(item)}
        disabled={!item.pdfUrl}
        className="relative aspect-[16/9] overflow-hidden bg-warm text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-primary-600 disabled:cursor-default"
        aria-label={`${item.pdfUrl ? labels.preview : labels.noPdfShort}: ${item.title}`}
      >
        <img
          src={item.image}
          alt={item.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute start-4 top-4">
          <PdfBadge hasPdf={Boolean(item.pdfUrl)} labels={labels} />
        </span>
        {item.pdfUrl && (
          <span className="absolute inset-0 flex items-center justify-center bg-dark-950/0 opacity-0 transition-all duration-300 group-hover:bg-dark-950/35 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-primary-700 shadow-lg">
              <Eye className="h-4 w-4" aria-hidden="true" />
              {labels.preview}
            </span>
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        {meta && <p className="text-sm font-semibold text-primary-700">{meta}</p>}
        <h2 className="mt-2 line-clamp-3 text-2xl font-bold leading-snug text-dark-950 md:text-3xl">{item.title}</h2>
        {item.excerpt && <p className="mt-3 line-clamp-3 text-base leading-relaxed text-dark-600">{item.excerpt}</p>}

        <div className="mt-auto flex items-center gap-3 pt-6">
          {item.pdfUrl ? (
            <>
              <button
                type="button"
                onClick={() => onPreview(item)}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary-600 px-6 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                {labels.preview}
              </button>
              <a
                href={item.pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${labels.downloadPdf}: ${item.title}`}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary-100 text-primary-700 transition-colors hover:bg-primary-50"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
              </a>
            </>
          ) : (
            <span className="inline-flex min-h-12 w-full cursor-default items-center justify-center gap-2 rounded-full border border-dark-100 bg-warm px-6 text-sm font-bold text-dark-400">
              <FileText className="h-4 w-4" aria-hidden="true" />
              {labels.noPdfShort}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
