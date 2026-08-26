import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LayoutGrid, List, Search, Newspaper, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import FadeContent from '@/components/effects/FadeContent';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import { LibraryDocumentRow, LibraryDocumentTile, LibraryDocumentNewsCard } from '@/components/library/LibraryDocumentViews';
import LibraryPdfViewer from '@/components/library/LibraryPdfViewer';
import { LibraryLayout } from '@/components/library/LibraryNav';
import {
  filterDocuments,
  getDocumentSeries,
  getDocuments,
  getLibraryCollectionBreadcrumbs,
  getLibraryContent,
  type LibraryDocumentCollectionSlug,
  type LibraryDocumentItem,
} from '@/data/library';
import { useI18n } from '@/i18n/useI18n';

type LibraryDocumentsPageProps = {
  collection: LibraryDocumentCollectionSlug;
};

type ViewMode = 'grid' | 'list' | 'news';
const viewStorageKey = 'library:documents:view';

function readStoredView(): ViewMode {
  if (typeof window === 'undefined') return 'grid';
  const stored = window.localStorage.getItem(viewStorageKey);
  return stored === 'list' || stored === 'news' ? stored : 'grid';
}

/**
 * Document collections (reports, books, literature) share this page:
 * tabs switch between them, a toolbar handles search / PDF filter / series
 * chips / view mode, and PDFs preview in-site.
 */
export default function LibraryDocumentsPage({ collection }: LibraryDocumentsPageProps) {
  const { locale, content: siteContent, contentVersion } = useI18n();
  const page = getLibraryContent(locale);
  const info = page.collections[collection];
  const labels = page.labels;
  const shouldReduceMotion = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();

  const items = useMemo(
    () => (info.documentCollection ? getDocuments(info.documentCollection, locale) : []),
    [info.documentCollection, locale, contentVersion]
  );
  const series = useMemo(() => getDocumentSeries(items), [items]);

  const query = searchParams.get('q') ?? '';
  const pdfOnly = searchParams.get('pdf') === '1';
  const activeSeries = searchParams.get('series');
  const [view, setView] = useState<ViewMode>(() => {
    const fromUrl = searchParams.get('view');
    if (fromUrl === 'list' || fromUrl === 'grid' || fromUrl === 'news') return fromUrl;
    return readStoredView();
  });
  const [previewItem, setPreviewItem] = useState<LibraryDocumentItem | null>(null);

  const updateParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams);
      mutate(next);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const changeView = (next: ViewMode) => {
    setView(next);
    window.localStorage.setItem(viewStorageKey, next);
    updateParams((params) => {
      if (next === 'grid') params.delete('view');
      else params.set('view', next);
    });
  };

  // Drop a series filter that doesn't exist in this collection (e.g. after switching tabs).
  useEffect(() => {
    if (activeSeries && !series.some((entry) => entry.key === activeSeries)) {
      updateParams((params) => params.delete('series'));
    }
  }, [activeSeries, series, updateParams]);

  const filtered = useMemo(
    () => filterDocuments(items, { query, pdfOnly, series: activeSeries }),
    [activeSeries, items, pdfOnly, query]
  );
  const hasFilters = Boolean(query || pdfOnly || activeSeries);
  const pdfCount = items.filter((item) => item.pdfUrl).length;

  const itemListSchema = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: info.title,
      itemListElement: filtered.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        ...(item.pdfUrl ? { url: item.pdfUrl } : {}),
      })),
    };
  }, [filtered, info.title]);

  const closePreview = useCallback(() => setPreviewItem(null), []);
  // Admin-set hero wins; otherwise the first document's cover, then the library hero.
  const heroImage = info.image || items[0]?.image || page.hero.image;

  const filters = (
    <div className="rounded-[22px] border border-primary-100 bg-white p-3 shadow-[0_18px_48px_rgba(40,12,18,0.06)] md:p-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative block min-w-[200px] flex-1">
          <span className="sr-only">{labels.search}</span>
          <Search
            className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) =>
              updateParams((params) => {
                const value = event.target.value;
                if (value) params.set('q', value);
                else params.delete('q');
              })
            }
            placeholder={labels.searchPlaceholder}
            className="min-h-12 w-full rounded-2xl border border-dark-100 bg-[#faf8f8] py-3 pe-4 text-sm font-medium text-dark-800 outline-none transition-colors placeholder:text-dark-400 focus:border-primary-300 focus:bg-white [&::-webkit-search-cancel-button]:hidden"
            style={{ paddingInlineStart: '2.75rem' }}
          />
        </label>

        <span className="flex min-h-12 items-center rounded-2xl bg-primary-50 px-4 text-sm font-bold text-primary-700" aria-live="polite">
          {filtered.length} / {items.length} {labels.results}
        </span>
        <div role="group" aria-label={labels.viewGrid} className="ms-auto flex rounded-2xl bg-[#faf8f8] p-1">
          <button
            type="button"
            onClick={() => changeView('grid')}
            aria-pressed={view === 'grid'}
            aria-label={labels.viewGrid}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
              view === 'grid' ? 'bg-white text-primary-700 shadow-sm' : 'text-dark-500 hover:text-primary-700'
            }`}
            title={labels.viewGrid}
          >
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => changeView('news')}
            aria-pressed={view === 'news'}
            aria-label={labels.viewNews}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
              view === 'news' ? 'bg-white text-primary-700 shadow-sm' : 'text-dark-500 hover:text-primary-700'
            }`}
            title={labels.viewNews}
          >
            <Newspaper className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => changeView('list')}
            aria-pressed={view === 'list'}
            aria-label={labels.viewList}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
              view === 'list' ? 'bg-white text-primary-700 shadow-sm' : 'text-dark-500 hover:text-primary-700'
            }`}
            title={labels.viewList}
          >
            <List className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {(pdfCount < items.length || series.length > 0 || hasFilters) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-primary-100/70 pt-3 text-xs font-bold">
          <span className="me-1 text-dark-500">{labels.filters}:</span>
          {pdfCount < items.length && (
            <FilterChip
              active={pdfOnly}
              onClick={() =>
                updateParams((params) => {
                  if (pdfOnly) params.delete('pdf');
                  else params.set('pdf', '1');
                })
              }
            >
              {labels.pdfOnly}
              <span className="opacity-70">({pdfCount})</span>
            </FilterChip>
          )}
          {series.map((entry) => (
            <FilterChip
              key={entry.key}
              active={activeSeries === entry.key}
              onClick={() =>
                updateParams((params) => {
                  if (activeSeries === entry.key) params.delete('series');
                  else params.set('series', entry.key);
                })
              }
            >
              {labels.series}: {entry.label}
              <span className="opacity-70">({entry.count})</span>
            </FilterChip>
          ))}
          {hasFilters && (
            <button
              type="button"
              onClick={() =>
                updateParams((params) => {
                  params.delete('q');
                  params.delete('pdf');
                  params.delete('series');
                })
              }
              className="ms-auto inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-dark-500 transition-colors hover:bg-warm hover:text-primary-700"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              {labels.clearFilters}
            </button>
          )}
        </div>
      )}
    </div>
  );

  const heading = (
    <FadeContent blur={false} duration={620} initialOpacity={0} yOffset={16} threshold={0.18} once>
      <div className="text-start">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-px w-8 bg-primary-200" />
            <span className="text-sm font-semibold text-primary-700">{info.eyebrow || labels.documentsHub}</span>
          </div>
          <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{info.shortTitle}</h2>
        </div>
      </div>
    </FadeContent>
  );

  return (
    <>
      <PageSeo
        title={`${info.title} | ${siteContent.siteConfig.name}`}
        description={info.description}
        image={heroImage}
        structuredData={itemListSchema}
      />
      <main className="bg-white">
        <PageHero
          title={info.title}
          description={info.description}
          image={heroImage}
          imageAlt={info.imageAlt || info.title}
          breadcrumbs={getLibraryCollectionBreadcrumbs(locale, collection)}
        />

        <LibraryLayout active={collection} heading={heading} filters={filters}>

          {/* Results */}
          <AnimatePresence mode="wait" initial={false}>
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-[22px] border border-primary-100 bg-white p-8 text-center text-base font-semibold text-dark-600"
              >
                {labels.noResults}
              </motion.div>
            ) : view === 'grid' ? (
              <motion.div
                key="grid"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map((item) => (
                  <LibraryDocumentTile key={item.id} item={item} labels={labels} locale={locale} onPreview={setPreviewItem} />
                ))}
              </motion.div>
            ) : view === 'news' ? (
              <motion.div
                key="news"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid gap-6 lg:grid-cols-2"
              >
                {filtered.map((item) => (
                  <LibraryDocumentNewsCard key={item.id} item={item} labels={labels} locale={locale} onPreview={setPreviewItem} />
                ))}
              </motion.div>
            ) : (
              <motion.ul
                key="list"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid gap-2 rounded-[22px] border border-primary-100 bg-[#fdfbfb] p-2"
              >
                {filtered.map((item) => (
                  <LibraryDocumentRow key={item.id} item={item} labels={labels} locale={locale} onPreview={setPreviewItem} />
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </LibraryLayout>
      </main>

      <LibraryPdfViewer item={previewItem} labels={labels} onClose={closePreview} />
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors ${
        active
          ? 'border-primary-600 bg-primary-600 text-white'
          : 'border-primary-100 bg-white text-primary-700 hover:border-primary-300 hover:bg-primary-50'
      }`}
    >
      {children}
    </button>
  );
}
