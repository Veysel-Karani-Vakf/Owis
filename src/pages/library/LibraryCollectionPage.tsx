import { useMemo, useState } from 'react';
import FadeContent from '@/components/effects/FadeContent';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import { LibraryDocumentCard, LibraryTextCard } from '@/components/library/LibraryCards';
import LibrarySearchControls from '@/components/library/LibrarySearchControls';
import {
  getDocuments,
  getForumArticles,
  getLibraryCollectionBreadcrumbs,
  getLibraryCollectionInfo,
  getLibraryContent,
  getSuccessStories,
  getYears,
  searchLibraryItems,
  type LibraryCollectionSlug,
  type LibraryDocumentItem,
  type LibraryTextItem,
} from '@/data/library';
import { useI18n } from '@/i18n/useI18n';

type LibraryCollectionPageProps = {
  collection: LibraryCollectionSlug;
};

function useCollectionItems(collection: LibraryCollectionSlug, locale: ReturnType<typeof useI18n>['locale']) {
  const info = getLibraryCollectionInfo(locale, collection);

  if (info.kind === 'articles') {
    return { info, textItems: getForumArticles(locale), documentItems: [] as LibraryDocumentItem[], variant: 'article' as const };
  }

  if (info.kind === 'stories') {
    return { info, textItems: getSuccessStories(locale), documentItems: [] as LibraryDocumentItem[], variant: 'story' as const };
  }

  const documentItems = info.documentCollection ? getDocuments(info.documentCollection) : [];
  return { info, textItems: [] as LibraryTextItem[], documentItems, variant: 'document' as const };
}

export default function LibraryCollectionPage({ collection }: LibraryCollectionPageProps) {
  const { locale, isRtl, content: siteContent } = useI18n();
  const page = getLibraryContent(locale);
  const { info, textItems, documentItems, variant } = useCollectionItems(collection, locale);
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('all');
  const years = useMemo(
    () => getYears(variant === 'document' ? documentItems : textItems),
    [documentItems, textItems, variant]
  );
  const filteredTextItems = useMemo(
    () => (variant === 'document' ? [] : searchLibraryItems(textItems, query, year)),
    [query, textItems, variant, year]
  );
  const filteredDocumentItems = useMemo(
    () => (variant === 'document' ? searchLibraryItems(documentItems, query, year) : []),
    [documentItems, query, variant, year]
  );
  const resultCount = variant === 'document' ? filteredDocumentItems.length : filteredTextItems.length;

  const itemListSchema = useMemo(() => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: info.title,
      itemListElement: (variant === 'document' ? filteredDocumentItems : filteredTextItems).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        url: 'route' in item ? `${origin}${item.route}` : item.sourceUrl,
      })),
    };
  }, [filteredDocumentItems, filteredTextItems, info.title, variant]);

  return (
    <>
      <PageSeo
        title={`${info.title} | ${siteContent.siteConfig.name}`}
        description={info.description}
        image={(variant === 'document' ? documentItems : textItems)[0]?.image}
        structuredData={itemListSchema}
      />
      <main className="bg-white">
        <PageHero
          title={info.title}
          description={info.description}
          image={(variant === 'document' ? documentItems : textItems)[0]?.image ?? page.hero.image}
          imageAlt={info.title}
          breadcrumbs={getLibraryCollectionBreadcrumbs(locale, collection)}
        />

        <section className="bg-[#faf8f8] py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <FadeContent blur={false} duration={620} initialOpacity={0} yOffset={16} threshold={0.18} once>
              <div className="mb-10 max-w-3xl text-start">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-px w-8 bg-primary-200" />
                  <span className="text-sm font-semibold text-primary-700">{info.eyebrow}</span>
                </div>
                <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">
                  {info.shortTitle}
                </h2>
              </div>
            </FadeContent>

            <LibrarySearchControls
              labels={page.labels}
              query={query}
              onQueryChange={setQuery}
              year={year}
              onYearChange={setYear}
              years={years}
              resultCount={resultCount}
            />

            {resultCount > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {variant === 'document'
                  ? filteredDocumentItems.map((item) => (
                      <LibraryDocumentCard key={item.id} item={item} labels={page.labels} locale={locale} />
                    ))
                  : filteredTextItems.map((item) => (
                      <LibraryTextCard
                        key={item.slug}
                        item={item}
                        labels={page.labels}
                        locale={locale}
                        isRtl={isRtl}
                        variant={variant}
                      />
                    ))}
              </div>
            ) : (
              <div className="rounded-[22px] border border-primary-100 bg-white p-8 text-center text-base font-semibold text-dark-600">
                {page.labels.noResults}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
