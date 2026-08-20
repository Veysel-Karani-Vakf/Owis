import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Languages,
  Link2,
  ListTree,
  Printer,
  Share2,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import FadeContent from '@/components/effects/FadeContent';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import LibraryArticleBody from '@/components/library/LibraryArticleBody';
import { LibraryLayout } from '@/components/library/LibraryNav';
import { getArticleHeadings, parseArticleContent } from '@/components/library/articleContent';
import {
  getAdjacentTextItems,
  getArticleSeries,
  getForumArticle,
  getLanguageName,
  getLibraryContent,
  getLibraryTextBreadcrumbs,
  getReadingMinutes,
  getRelatedForumArticles,
  getRelatedSuccessStories,
  getSuccessStory,
  type LibraryTextItem,
} from '@/data/library';
import { useI18n } from '@/i18n/useI18n';
import type { Locale } from '@/i18n/content';

type LibraryTextPageProps = {
  type: 'forum' | 'success-stories';
};

function formatDate(locale: Locale, date: string) {
  if (!date) return '';
  const formatterLocale = locale === 'ar' ? 'ar' : locale === 'tr' ? 'tr-TR' : 'en-US';
  return new Intl.DateTimeFormat(formatterLocale, { month: 'long', year: 'numeric', day: 'numeric' }).format(
    new Date(date)
  );
}

/** Progress (0–100) of the reader through a given element. */
function useReadingProgress(ref: RefObject<HTMLElement | null>) {
  // -1 = not meaningful (content shorter than the viewport)
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const onScroll = () => {
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      const total = rect.height - viewport * 0.6;
      const passed = viewport * 0.4 - rect.top;
      if (total <= 0) {
        setProgress(-1);
        return;
      }
      setProgress(Math.min(100, Math.max(0, (passed / total) * 100)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);
  return progress;
}

/** Tracks which heading is currently in the reading zone. */
function useActiveHeading(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);
  useEffect(() => {
    if (!ids.length) return;
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids]);
  return activeId;
}

export default function LibraryTextPage({ type }: LibraryTextPageProps) {
  const { slug } = useParams();
  const { locale, isRtl, content: siteContent } = useI18n();
  const library = getLibraryContent(locale);
  const labels = library.labels;
  const item = type === 'forum' ? getForumArticle(locale, slug) : getSuccessStory(locale, slug);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const related = item
    ? type === 'forum'
      ? getRelatedForumArticles(locale, item.slug, 4)
      : getRelatedSuccessStories(locale, item.slug, 4)
    : [];
  const series = item && type === 'forum' ? getArticleSeries(locale, item.slug) : null;
  const adjacent = item ? getAdjacentTextItems(locale, type, item.slug) : { previous: undefined, next: undefined };

  const blocks = useMemo(() => (item ? parseArticleContent(item.content, item.slug) : []), [item]);
  const headings = useMemo(() => getArticleHeadings(blocks), [blocks]);
  const headingIds = useMemo(() => headings.map((heading) => heading.id), [headings]);
  const activeHeading = useActiveHeading(headingIds);
  const articleRef = useRef<HTMLDivElement>(null);
  const progress = useReadingProgress(articleRef);
  const [copied, setCopied] = useState(false);

  const structuredData = useMemo(() => {
    if (!item) return undefined;
    const origin = typeof window === 'undefined' ? '' : window.location.origin;
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: item.title,
      datePublished: item.date,
      image: item.image.startsWith('http') ? item.image : `${origin}${item.image}`,
      mainEntityOfPage: `${origin}${item.route}`,
      publisher: { '@type': 'Organization', name: siteContent.siteConfig.name, logo: siteContent.siteConfig.logo },
    };
  }, [item, siteContent.siteConfig.logo, siteContent.siteConfig.name]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }, []);

  const share = useCallback(async () => {
    if (!item) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text: item.excerpt, url: window.location.href });
        return;
      } catch {
        /* user cancelled */
      }
    }
    void copyLink();
  }, [copyLink, item]);

  if (!item) {
    return <Navigate to={type === 'forum' ? '/library/forum' : '/library/success-stories'} replace />;
  }

  const parent = library.collections[type];
  const date = formatDate(locale, item.date);
  const minutes = getReadingMinutes(item);
  const showToc = headings.length >= 2;

  const tools = (
    <div className="grid gap-4 text-start">
      {/* Progress + actions */}
      <div className="rounded-[22px] border border-primary-100 bg-white p-4 shadow-[0_14px_36px_rgba(40,12,18,0.06)]">
        {progress >= 0 && (
          <>
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-dark-600">
              <span>{labels.readingProgress}</span>
              <span className="text-primary-700">{Math.round(progress)}%</span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-primary-50"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-700 transition-[width] duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}
        <div className={`grid grid-cols-3 gap-2 text-[11px] font-bold ${progress >= 0 ? 'mt-4' : ''}`}>
          <button
            type="button"
            onClick={share}
            className="inline-flex min-h-10 flex-col items-center justify-center gap-1 rounded-2xl bg-[#faf8f8] px-2 text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            {labels.share}
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex min-h-10 flex-col items-center justify-center gap-1 rounded-2xl bg-[#faf8f8] px-2 text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
            aria-live="polite"
          >
            {copied ? (
              <Check className="h-4 w-4 text-primary-600" aria-hidden="true" />
            ) : (
              <Link2 className="h-4 w-4" aria-hidden="true" />
            )}
            {copied ? labels.linkCopied : labels.copyLink}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-10 flex-col items-center justify-center gap-1 rounded-2xl bg-[#faf8f8] px-2 text-dark-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            {labels.print}
          </button>
        </div>
      </div>

      {/* Table of contents */}
      {showToc && (
        <nav
          aria-label={labels.tableOfContents}
          className="rounded-[22px] border border-primary-100 bg-white p-4 shadow-[0_14px_36px_rgba(40,12,18,0.06)]"
        >
          <p className="mb-3 flex items-center gap-2 text-sm font-bold text-dark-950">
            <ListTree className="h-4 w-4 text-primary-700" aria-hidden="true" />
            {labels.tableOfContents}
          </p>
          <ol className="grid gap-0.5 border-s-2 border-primary-100">
            {headings.map((heading) => {
              const isActive = heading.id === activeHeading;
              return (
                <li key={heading.id} className="-ms-0.5">
                  <a
                    href={`#${heading.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      window.history.replaceState(null, '', `#${heading.id}`);
                    }}
                    aria-current={isActive ? 'location' : undefined}
                    className={`block border-s-2 py-1.5 ps-3 text-sm leading-snug transition-colors ${
                      isActive
                        ? 'border-primary-600 font-bold text-primary-700'
                        : 'border-transparent font-medium text-dark-600 hover:text-primary-700'
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </div>
  );

  return (
    <>
      <PageSeo
        title={`${item.title} | ${siteContent.siteConfig.name}`}
        description={item.excerpt}
        type="article"
        image={item.image}
        structuredData={structuredData}
      />
      <main className="bg-white">
        <PageHero
          title={item.title}
          description={item.excerpt}
          image={item.image}
          imageAlt={item.imageAlt}
          breadcrumbs={getLibraryTextBreadcrumbs(locale, item, type)}
        />

        <LibraryLayout active={type} filters={tools} background="bg-white">
          <article className="min-w-0">
            <FadeContent blur={false} duration={620} initialOpacity={0} yOffset={18} threshold={0.14} once>
              <div className="mx-auto max-w-3xl text-start">
                {/* Meta chips */}
                <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-semibold text-dark-600">
                  {date && <span className="rounded-full bg-primary-50 px-4 py-2 text-primary-700">{date}</span>}
                  <span className="inline-flex items-center gap-2 rounded-full bg-warm px-4 py-2">
                    <Clock className="h-4 w-4 text-primary-700" aria-hidden="true" />
                    {minutes} {labels.readingTime}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-warm px-4 py-2">
                    <Languages className="h-4 w-4 text-primary-700" aria-hidden="true" />
                    {getLanguageName(locale, item.sourceLanguage)}
                  </span>
                </div>

                {/* Series bar */}
                {series && (
                  <nav
                    aria-label={labels.series}
                    className="mb-8 rounded-[22px] border border-primary-100 bg-gradient-to-br from-primary-50/80 to-white p-4 md:p-5"
                  >
                    <p className="text-xs font-bold text-primary-700">{labels.partOfSeries}</p>
                    <p className="mt-1 text-lg font-bold leading-tight text-dark-950">{series.title}</p>
                    <ol className="mt-3 flex flex-wrap gap-2">
                      {series.parts.map((part, index) => {
                        const isCurrent = index === series.currentIndex;
                        return (
                          <li key={part.slug}>
                            <Link
                              to={part.route}
                              aria-current={isCurrent ? 'page' : undefined}
                              className={`inline-flex min-h-9 items-center gap-2 rounded-full px-3.5 text-xs font-bold transition-colors ${
                                isCurrent
                                  ? 'bg-primary-600 text-white'
                                  : 'border border-primary-100 bg-white text-primary-700 hover:border-primary-300 hover:bg-primary-50'
                              }`}
                            >
                              <span
                                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                                  isCurrent ? 'bg-white/20' : 'bg-primary-50'
                                }`}
                              >
                                {index + 1}
                              </span>
                              {labels.partLabel} {index + 1}
                            </Link>
                          </li>
                        );
                      })}
                    </ol>
                  </nav>
                )}

                {item.title !== item.originalTitle && (
                  <div className="mb-8 rounded-[22px] border border-primary-100 bg-primary-50/45 p-5">
                    <p className="text-sm font-bold text-primary-700">{labels.officialSource}</p>
                    <p className="mt-2 text-lg font-bold leading-tight text-dark-950">{item.originalTitle}</p>
                  </div>
                )}

                <div ref={articleRef}>
                  <LibraryArticleBody
                    blocks={blocks}
                    labels={labels}
                    isRtl={isRtl}
                    hideNotes={Boolean(series)}
                    lang={item.sourceLanguage}
                  />
                </div>

                <p className="mt-10 rounded-[22px] border border-dark-100 bg-[#faf8f8] p-5 text-sm font-medium leading-relaxed text-dark-600">
                  {labels.originalLanguageNote}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to={parent.route}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                  >
                    <BackIcon className="h-4 w-4" aria-hidden="true" />
                    {labels.backToCollection}
                  </Link>
                </div>

                {/* Previous / next */}
                {(adjacent.previous || adjacent.next) && (
                  <nav
                    aria-label={`${labels.previousItem} / ${labels.nextItem}`}
                    className="mt-12 grid gap-4 border-t border-primary-100 pt-8 sm:grid-cols-2"
                  >
                    {adjacent.previous ? (
                      <AdjacentCard
                        item={adjacent.previous}
                        label={labels.previousItem}
                        direction="previous"
                        isRtl={isRtl}
                      />
                    ) : (
                      <span />
                    )}
                    {adjacent.next && (
                      <AdjacentCard item={adjacent.next} label={labels.nextItem} direction="next" isRtl={isRtl} />
                    )}
                  </nav>
                )}

                {related.length > 0 && (
                  <section className="mt-12 border-t border-primary-100 pt-8">
                    <h2 className="mb-4 text-xl font-bold text-dark-950">{labels.related}</h2>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {related.map((relatedItem) => (
                        <li key={relatedItem.slug}>
                          <Link
                            to={relatedItem.route}
                            className="group flex h-full items-center gap-3 rounded-[20px] border border-primary-100 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[0_14px_34px_rgba(40,12,18,0.1)]"
                          >
                            <img
                              src={relatedItem.image}
                              alt=""
                              loading="lazy"
                              className="h-14 w-14 shrink-0 rounded-xl object-cover"
                            />
                            <span className="min-w-0">
                              <span className="line-clamp-2 text-sm font-bold leading-snug text-dark-900 group-hover:text-primary-700">
                                {relatedItem.title}
                              </span>
                              <span className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-dark-500">
                                <Clock className="h-3 w-3" aria-hidden="true" />
                                {getReadingMinutes(relatedItem)} {labels.readingTime}
                              </span>
                            </span>
                            <ArrowIcon
                              className="ms-auto h-4 w-4 shrink-0 text-primary-600 opacity-0 transition-opacity group-hover:opacity-100"
                              aria-hidden="true"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </FadeContent>
          </article>
        </LibraryLayout>
      </main>
    </>
  );
}

function AdjacentCard({
  item,
  label,
  direction,
  isRtl,
}: {
  item: LibraryTextItem;
  label: string;
  direction: 'previous' | 'next';
  isRtl: boolean;
}) {
  const pointsForward = direction === 'next';
  const Icon = pointsForward ? (isRtl ? ArrowLeft : ArrowRight) : isRtl ? ArrowRight : ArrowLeft;
  return (
    <Link
      to={item.route}
      className={`group flex items-center gap-4 rounded-[22px] border border-primary-100 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[0_16px_36px_rgba(40,12,18,0.1)] ${
        pointsForward ? 'sm:flex-row-reverse sm:text-end' : ''
      }`}
    >
      <img src={item.image} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-primary-700">
          {!pointsForward && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
          {label}
          {pointsForward && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
        </span>
        <span className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-dark-950 group-hover:text-primary-700">
          {item.title}
        </span>
      </span>
    </Link>
  );
}
