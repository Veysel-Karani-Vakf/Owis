import { ArrowLeft, ArrowRight, ExternalLink, Languages } from 'lucide-react';
import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import FadeContent from '@/components/effects/FadeContent';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import { LibraryTextCard } from '@/components/library/LibraryCards';
import {
  getForumArticle,
  getLanguageName,
  getLibraryContent,
  getLibraryTextBreadcrumbs,
  getRelatedForumArticles,
  getRelatedSuccessStories,
  getSuccessStory,
} from '@/data/library';
import { useI18n } from '@/i18n/useI18n';
import type { Locale } from '@/i18n/content';

type LibraryTextPageProps = {
  type: 'forum' | 'success-stories';
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

export default function LibraryTextPage({ type }: LibraryTextPageProps) {
  const { slug } = useParams();
  const { locale, isRtl, content: siteContent } = useI18n();
  const library = getLibraryContent(locale);
  const item = type === 'forum' ? getForumArticle(locale, slug) : getSuccessStory(locale, slug);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const related = item
    ? type === 'forum'
      ? getRelatedForumArticles(locale, item.slug)
      : getRelatedSuccessStories(locale, item.slug)
    : [];

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
      publisher: {
        '@type': 'Organization',
        name: siteContent.siteConfig.name,
        logo: siteContent.siteConfig.logo,
      },
    };
  }, [item, siteContent.siteConfig.logo, siteContent.siteConfig.name]);

  if (!item) {
    return <Navigate to={type === 'forum' ? '/library/forum' : '/library/success-stories'} replace />;
  }

  const parentSlug = type;
  const parent = library.collections[parentSlug];
  const date = formatDate(locale, item.date);

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
          breadcrumbs={getLibraryTextBreadcrumbs(locale, item, parentSlug)}
        />

        <article className="bg-white py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 xl:grid-cols-[minmax(0,1fr)_320px]">
            <FadeContent blur={false} duration={620} initialOpacity={0} yOffset={18} threshold={0.14} once>
              <div className="max-w-4xl text-start">
                <div className="mb-8 flex flex-wrap gap-3 text-sm font-semibold text-dark-600">
                  {date && (
                    <span className="rounded-full bg-primary-50 px-4 py-2 text-primary-700">
                      {library.labels.published}: {date}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2 rounded-full bg-warm px-4 py-2">
                    <Languages className="h-4 w-4 text-primary-700" aria-hidden="true" />
                    {library.labels.sourceLanguage}: {getLanguageName(locale, item.sourceLanguage)}
                  </span>
                </div>

                {item.title !== item.originalTitle && (
                  <div className="mb-8 rounded-[22px] border border-primary-100 bg-primary-50/45 p-5">
                    <p className="text-sm font-bold text-primary-700">{library.labels.officialSource}</p>
                    <p className="mt-2 text-lg font-bold leading-tight text-dark-950">{item.originalTitle}</p>
                  </div>
                )}

                <div className="mb-8 rounded-[22px] border border-dark-100 bg-[#faf8f8] p-5 text-sm font-medium leading-relaxed text-dark-600">
                  {library.labels.originalLanguageNote}
                </div>

                <div className="space-y-5 text-lg leading-9 text-dark-700">
                  {item.content.map((paragraph, index) => (
                    <p key={`${item.slug}-${index}`}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  <Link
                    to={parent.route}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                  >
                    <ArrowIcon className="h-4 w-4" aria-hidden="true" />
                    {library.labels.backToCollection}
                  </Link>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary-100 bg-white px-5 py-2.5 text-sm font-bold text-primary-700 transition-colors hover:border-primary-200 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                  >
                    {library.labels.officialSource}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </FadeContent>

            <aside className="text-start">
              <h2 className="mb-5 text-xl font-bold text-dark-950">{library.labels.related}</h2>
              <div className="grid gap-5">
                {related.map((relatedItem) => (
                  <LibraryTextCard
                    key={relatedItem.slug}
                    item={relatedItem}
                    labels={library.labels}
                    locale={locale}
                    isRtl={isRtl}
                    variant={type === 'forum' ? 'article' : 'story'}
                  />
                ))}
              </div>
            </aside>
          </div>
        </article>
      </main>
    </>
  );
}
