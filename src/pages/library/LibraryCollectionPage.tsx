import { Search, X } from 'lucide-react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import FadeContent from '@/components/effects/FadeContent';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import { LibraryTextCard } from '@/components/library/LibraryCards';
import { LibraryLayout } from '@/components/library/LibraryNav';
import {
  getLibraryCollectionBreadcrumbs,
  getLibraryCollectionInfo,
  getLibraryContent,
  getTextItems,
  getYears,
  searchLibraryItems,
  type LibraryTextCollectionSlug,
} from '@/data/library';
import { useI18n } from '@/i18n/useI18n';

type LibraryCollectionPageProps = {
  collection: LibraryTextCollectionSlug;
};

const cardVariants = {
  forum: 'article',
  'success-stories': 'story',
  'yemeni-figures': 'figure',
} as const;

/**
 * Text collections (forum articles, success stories, Yemeni figures): search,
 * year chips, a featured first item, and a news-style card grid. Filters live
 * in the URL (`?q=&year=`).
 */
export default function LibraryCollectionPage({ collection }: LibraryCollectionPageProps) {
  const { locale, isRtl, content: siteContent, contentVersion } = useI18n();
  const page = getLibraryContent(locale);
  const labels = page.labels;
  const info = getLibraryCollectionInfo(locale, collection);
  const variant = cardVariants[collection];
  const items = useMemo(
    () => getTextItems(locale, collection),
    // contentVersion re-reads CMS rows after a dashboard save
    [collection, locale, contentVersion]
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const year = searchParams.get('year') ?? 'all';
  const years = useMemo(() => getYears(items), [items]);
  const filtered = useMemo(() => searchLibraryItems(items, query, year), [items, query, year]);
  const hasFilters = Boolean(query || year !== 'all');

  const updateParams = (mutate: (params: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    setSearchParams(next, { replace: true });
  };

  const itemListSchema = useMemo(() => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: info.title,
      itemListElement: filtered.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        url: `${origin}${item.route}`,
      })),
    };
  }, [filtered, info.title]);

  // Admin-set hero wins; otherwise the first item's image, then the library hero.
  const heroImage = info.image || items[0]?.image || page.hero.image;
  const featured = hasFilters ? undefined : filtered[0];
  const rest = hasFilters ? filtered : filtered.slice(1);

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
        <span className="flex min-h-12 items-center justify-center rounded-2xl bg-primary-50 px-4 text-sm font-bold text-primary-700" aria-live="polite">
          {filtered.length} {labels.results}
        </span>
      </div>
    
      {years.length > 1 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-primary-100/70 pt-3 text-xs font-bold">
          <button
            type="button"
            onClick={() => updateParams((params) => params.delete('year'))}
            aria-pressed={year === 'all'}
            className={`rounded-full border px-3 py-1.5 transition-colors ${
              year === 'all'
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-primary-100 bg-white text-primary-700 hover:border-primary-300 hover:bg-primary-50'
            }`}
          >
            {labels.allYears}
          </button>
          {years.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                updateParams((params) => {
                  if (String(option) === year) params.delete('year');
                  else params.set('year', String(option));
                })
              }
              aria-pressed={String(option) === year}
              className={`rounded-full border px-3 py-1.5 transition-colors ${
                String(option) === year
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-primary-100 bg-white text-primary-700 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              {option}
            </button>
          ))}
          {hasFilters && (
            <button
              type="button"
              onClick={() =>
                updateParams((params) => {
                  params.delete('q');
                  params.delete('year');
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
      <div className="flex flex-wrap items-end justify-between gap-4 text-start">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-px w-8 bg-primary-200" />
            <span className="text-sm font-semibold text-primary-700">{info.eyebrow}</span>
          </div>
          <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{info.shortTitle}</h2>
        </div>
        <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-primary-700 shadow-sm">
          {items.length} {labels.items}
        </span>
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

          {filtered.length > 0 ? (
            <div className="grid gap-6">
              {featured && (
                <LibraryTextCard item={featured} labels={labels} locale={locale} isRtl={isRtl} variant={variant} featured />
              )}
              {rest.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2">
                  {rest.map((item) => (
                    <LibraryTextCard key={item.slug} item={item} labels={labels} locale={locale} isRtl={isRtl} variant={variant} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-[22px] border border-primary-100 bg-white p-8 text-center text-base font-semibold text-dark-600">
              {labels.noResults}
            </div>
          )}
        </LibraryLayout>
      </main>
    </>
  );
}
