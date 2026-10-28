import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Languages } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import FadeContent from '@/components/effects/FadeContent';
import Breadcrumbs from '@/components/internal/Breadcrumbs';
import PageSeo from '@/components/internal/PageSeo';
import LibraryLightbox from '@/components/library/LibraryLightbox';
import NewsCard from '@/components/news/NewsCard';
import NewsShareActions from '@/components/news/NewsShareActions';
import {
  absoluteUrl,
  formatNewsDate,
  getNewsArticle,
  getNewsBreadcrumbs,
  getRelatedNewsArticles,
  getNewsLabels,
  getSourceLanguageName,
  newsRoutes,
} from '@/data/news';
import { cmsNewsRow } from '@/cms/adapters';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { NewsRow } from '@/lib/types';
import { getLibraryContent } from '@/data/library';
import { useI18n } from '@/i18n/useI18n';

const heroEase = [0.22, 1, 0.36, 1] as const;

// Full rows (body + gallery) of the stories opened this session. The boot
// snapshot carries the list columns only (see `NewsBootRow`), so each article
// page fetches its own row once; `null` records a story the database does not
// publish.
const fullRows = new Map<string, NewsRow | null>();

type FullState = { slug: string; row: NewsRow | null };

export default function NewsArticlePage() {
  const { slug } = useParams();
  const { locale, isRtl, content: siteContent, contentVersion } = useI18n();
  const labels = getNewsLabels(locale);
  const libraryLabels = getLibraryContent(locale).labels;
  // Header fields (title, date, image) come from the snapshot at once.
  const storeArticle = useMemo(
    () => getNewsArticle(locale, slug),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale, slug, contentVersion],
  );
  // The dashboard preview streams the row under edit with its body; show that
  // draft rather than the saved copy.
  const storeHasBody = Boolean(storeArticle && storeArticle.content.length > 0);
  const [fullState, setFullState] = useState<FullState | null>(() =>
    slug && fullRows.has(slug) ? { slug, row: fullRows.get(slug) ?? null } : null,
  );

  useEffect(() => {
    if (!slug || storeHasBody) return undefined;
    const known = fullRows.get(slug);
    if (known !== undefined) {
      setFullState({ slug, row: known });
      return undefined;
    }
    if (!isSupabaseConfigured) {
      setFullState({ slug, row: null });
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .maybeSingle();
        const row = error ? null : ((data as NewsRow | null) ?? null);
        // Only a definite answer is remembered; a failed request is retried next time.
        if (!error) fullRows.set(slug, row);
        if (!cancelled) setFullState({ slug, row });
      } catch {
        if (!cancelled) setFullState({ slug, row: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, storeHasBody]);

  const fullArticle = useMemo(() => {
    if (!slug || fullState?.slug !== slug || !fullState.row) return undefined;
    return cmsNewsRow(fullState.row, locale);
  }, [fullState, locale, slug]);
  const fullDone = storeHasBody || Boolean(slug && fullState?.slug === slug);

  const article = storeHasBody ? storeArticle : (fullArticle ?? storeArticle);
  const bodyPending = Boolean(article) && !storeHasBody && !fullArticle && !fullDone;
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const shouldReduceMotion = useReducedMotion();
  const heroDuration = shouldReduceMotion ? 0.01 : 0.6;

  const structuredData = useMemo(() => {
    if (!article) return undefined;
    const origin = typeof window === 'undefined' ? '' : window.location.origin;

    return {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      description: article.excerpt,
      datePublished: article.publishedAt,
      image: [absoluteUrl(origin, article.image)],
      mainEntityOfPage: absoluteUrl(origin, article.route),
      publisher: {
        '@type': 'Organization',
        name: siteContent.siteConfig.name,
        logo: {
          '@type': 'ImageObject',
          url: siteContent.siteConfig.logo,
        },
      },
    };
  }, [article, siteContent.siteConfig.logo, siteContent.siteConfig.name]);

  if (!article) {
    if (!fullDone) {
      return (
        <main className="min-h-screen bg-white">
          <header className="relative isolate overflow-hidden bg-dark-950 pt-28 md:pt-32">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-950/90 via-dark-950 to-dark-950" />
            <div className="mx-auto w-full max-w-5xl px-4 pb-32 text-start md:px-8 md:pb-40">
              <div className="mb-6">
                <Breadcrumbs items={getNewsBreadcrumbs(locale)} light />
              </div>
              <div className="mb-5 flex flex-wrap gap-2.5">
                <div className="h-10 w-36 animate-pulse rounded-full bg-white/10" />
                <div className="h-10 w-24 animate-pulse rounded-full bg-white/10" />
              </div>
              <div className="max-w-3xl space-y-3">
                <div className="h-9 w-full animate-pulse rounded-xl bg-white/15" />
                <div className="h-9 w-3/4 animate-pulse rounded-xl bg-white/10" />
              </div>
            </div>
          </header>
          <div className="mx-auto max-w-5xl px-4 pb-24 md:px-8">
            <div className="relative z-10 -mt-24 mb-12 aspect-[16/10] w-full animate-pulse rounded-[20px] border border-white/60 bg-warm shadow-[0_28px_72px_rgba(35,12,18,0.22)] md:-mt-28 md:mb-14" />
            <div className="mx-auto max-w-[820px] space-y-4">
              <div className="h-5 w-full animate-pulse rounded-lg bg-dark-100" />
              <div className="h-5 w-11/12 animate-pulse rounded-lg bg-dark-100" />
              <div className="h-5 w-4/5 animate-pulse rounded-lg bg-dark-100" />
            </div>
          </div>
        </main>
      );
    }
    return <Navigate to={newsRoutes.index} replace />;
  }

  const related = getRelatedNewsArticles(locale, article.slug, labels.layout.relatedCount);
  const date = formatNewsDate(locale, article.publishedAt);
  const crumbTitle = article.title.length > 60 ? `${article.title.slice(0, 60).trim()}…` : article.title;
  // getNewsBreadcrumbs already reads labels.home / labels.news from the CMS page.
  const breadcrumbs = getNewsBreadcrumbs(locale, article).map((crumb, index, list) =>
    index === list.length - 1 ? { ...crumb, label: crumbTitle } : crumb
  );
  const sourceLanguageName = getSourceLanguageName(locale, article.sourceLanguage);
  const showOriginalLanguageNote = Boolean(article.sourceLanguage) && article.sourceLanguage !== locale;

  return (
    <>
      <PageSeo
        title={`${article.title} | ${siteContent.siteConfig.name}`}
        description={article.excerpt}
        type="article"
        image={article.image}
        structuredData={structuredData}
      />
      <main className="bg-white">
        <header className="relative isolate overflow-hidden bg-dark-950 pt-28 md:pt-32">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-950/90 via-dark-950 to-dark-950" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(218,8,18,0.24),transparent_38%)]" />

          <div className="mx-auto w-full max-w-5xl px-4 pb-32 text-start md:px-8 md:pb-40">
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: heroDuration, ease: heroEase }}
              className="mb-6"
            >
              <Breadcrumbs items={breadcrumbs} light />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: heroDuration, delay: shouldReduceMotion ? 0 : 0.1, ease: heroEase }}
            >
              <div className="mb-5 flex flex-wrap gap-2.5 text-sm font-bold">
                <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-white backdrop-blur-sm">
                  <Calendar className="h-4 w-4 text-primary-300" aria-hidden="true" />
                  <time dateTime={article.publishedAt}>{date}</time>
                </span>
                {article.category && (
                  <span className="inline-flex min-h-10 items-center rounded-full bg-white/10 px-4 text-white backdrop-blur-sm">
                    {article.category}
                  </span>
                )}
                {sourceLanguageName && (
                  <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-white backdrop-blur-sm">
                    <Languages className="h-4 w-4 text-primary-300" aria-hidden="true" />
                    {labels.sourceLanguage}: {sourceLanguageName}
                  </span>
                )}
              </div>

              <h1 className="max-w-4xl text-balance text-2xl font-bold leading-snug text-white md:text-3xl md:leading-snug lg:text-4xl lg:leading-tight">
                {article.title}
              </h1>
            </motion.div>
          </div>
        </header>

        <article className="bg-white pb-16 md:pb-24">
          <div className="mx-auto max-w-5xl px-4 md:px-8">
            <motion.figure
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: heroDuration, delay: shouldReduceMotion ? 0 : 0.18, ease: heroEase }}
              className="relative z-10 -mt-24 mb-12 overflow-hidden rounded-[20px] border border-white/60 bg-warm shadow-[0_28px_72px_rgba(35,12,18,0.22)] md:-mt-28 md:mb-14"
            >
              <img
                src={article.image}
                alt={article.imageAlt}
                className="mx-auto max-h-[80vh] w-auto max-w-full object-contain"
              />
            </motion.figure>

            <div className="mx-auto max-w-[820px] text-start">
              {showOriginalLanguageNote && labels.originalLanguageNote && (
                <p className="mb-8 rounded-[20px] border border-primary-100 bg-primary-50 px-5 py-4 text-sm font-semibold leading-relaxed text-primary-800">
                  {labels.originalLanguageNote}
                </p>
              )}

              <div className="space-y-6 text-lg leading-9 text-dark-800" aria-busy={bodyPending}>
                {bodyPending ? (
                  <>
                    <div className="h-5 w-full animate-pulse rounded-lg bg-dark-100" />
                    <div className="h-5 w-11/12 animate-pulse rounded-lg bg-dark-100" />
                    <div className="h-5 w-4/5 animate-pulse rounded-lg bg-dark-100" />
                    <div className="h-5 w-full animate-pulse rounded-lg bg-dark-100" />
                    <div className="h-5 w-3/5 animate-pulse rounded-lg bg-dark-100" />
                  </>
                ) : (
                  article.content.map((paragraph, index) => (
                    <p key={`${article.id}-${index}`} dir="auto">
                      {paragraph}
                    </p>
                  ))
                )}
              </div>

            </div>

            {article.gallery.length > 0 && (
              <section className="mx-auto mt-14 max-w-[920px]">
                <div className="mb-6 flex items-center gap-2 text-start">
                  <span className="h-px w-8 bg-primary-200" />
                  <h2 className="text-2xl font-bold text-dark-950">{labels.gallery}</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {article.gallery.map((image, index) => (
                    <FadeContent
                      key={image.id || `${article.id}-${index}`}
                      blur={false}
                      duration={520}
                      initialOpacity={0}
                      yOffset={12}
                      delay={index * 45}
                      threshold={0.12}
                      once
                    >
                      <button
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className="group relative aspect-[16/10] w-full overflow-hidden rounded-[20px] border border-white bg-warm text-start shadow-[0_16px_42px_rgba(35,12,18,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(35,12,18,0.11)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                        aria-label={`${libraryLabels.openImage}: ${image.title}`}
                      >
                        <img
                          src={image.thumbnail || image.image}
                          alt={image.imageAlt}
                          loading="lazy"
                          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.035]"
                        />
                        <span className="absolute inset-x-3 bottom-3 rounded-full bg-dark-950/82 px-3 py-2 text-center text-xs font-bold text-white backdrop-blur-sm">
                          {libraryLabels.imageCounter} {index + 1}
                        </span>
                      </button>
                    </FadeContent>
                  ))}
                </div>
              </section>
            )}

            <div className="mx-auto mt-12 max-w-[820px]">
              <NewsShareActions labels={labels} title={article.title} />

              <Link
                to={newsRoutes.index}
                className="btn-border-run mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
              >
                <ArrowIcon className="h-4 w-4" aria-hidden="true" />
                {labels.backToNews}
              </Link>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="bg-[#faf8f8] py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <div className="mb-10 max-w-3xl text-start">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-px w-8 bg-primary-200" />
                  <span className="text-sm font-semibold text-primary-700">{labels.eyebrow}</span>
                </div>
                <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{labels.related}</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {related.map((item, index) => (
                  <FadeContent
                    key={item.id}
                    blur={false}
                    duration={540}
                    initialOpacity={0}
                    yOffset={14}
                    delay={index * 55}
                    threshold={0.14}
                    once
                  >
                    <NewsCard
                      article={item}
                      labels={labels}
                      locale={locale}
                      isRtl={isRtl}
                      compact
                    />
                  </FadeContent>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <LibraryLightbox
        images={article.gallery}
        activeIndex={activeImageIndex}
        labels={libraryLabels}
        isRtl={isRtl}
        onClose={() => setActiveImageIndex(null)}
        onMove={(nextIndex) => {
          if (!article.gallery.length) return;
          setActiveImageIndex((nextIndex + article.gallery.length) % article.gallery.length);
        }}
      />
    </>
  );
}
