import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, ExternalLink, FileText, Images, Newspaper, Trophy, Users } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import FadeContent from '@/components/effects/FadeContent';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import LibrarySearch from '@/components/library/LibrarySearch';
import { LibraryPillNav } from '@/components/library/LibraryNav';
import { librarySectionIcons, librarySectionOrder } from '@/components/library/librarySections';
import {
  documentCollectionSlugs,
  getDocuments,
  getForumArticles,
  getGalleryImages,
  getLatestLibraryItems,
  getLibraryContent,
  getLibraryCounts,
  getReadingMinutes,
  getSuccessStories,
  getYemeniFigures,
  type LibrarySearchHit,
} from '@/data/library';
import { useNarrowScreen } from '@/hooks/useResponsiveMotion';
import { useI18n } from '@/i18n/useI18n';
import type { Locale } from '@/i18n/content';

function formatDate(locale: Locale, date: string) {
  // The date column is free text; an unparsable value shows nothing instead of "Invalid Date".
  if (!date || Number.isNaN(Date.parse(date))) return '';
  const formatterLocale = locale === 'ar' ? 'ar' : locale === 'tr' ? 'tr-TR' : 'en-US';
  return new Intl.DateTimeFormat(formatterLocale, { month: 'short', year: 'numeric', day: 'numeric' }).format(
    new Date(date)
  );
}

const cardBase =
  'group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-[rgba(127,29,45,0.11)] bg-white text-start shadow-[0_18px_48px_rgba(40,12,18,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_24px_58px_rgba(40,12,18,0.13)]';

export default function LibraryIndexPage() {
  const { locale, isRtl, content: siteContent } = useI18n();
  const page = getLibraryContent(locale);
  const shouldReduceMotion = useReducedMotion();
  const isNarrow = useNarrowScreen();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const articles = getForumArticles(locale);
  const stories = getSuccessStories(locale);
  const figures = getYemeniFigures(locale);
  const gallery = getGalleryImages(locale);
  const counts = getLibraryCounts(locale);
  const latest = getLatestLibraryItems(locale, page.layout.latestLimit);

  const documentStats = documentCollectionSlugs.map((slug) => {
    const info = page.collections[slug];
    const items = info.documentCollection ? getDocuments(info.documentCollection, locale) : [];
    return { slug, info, total: items.length, withPdf: items.filter((item) => item.pdfUrl).length, cover: items[0]?.image };
  });

  const itemListSchema = useMemo(() => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: page.hero.title,
      description: page.hero.description,
      hasPart: librarySectionOrder.map((slug) => ({
        '@type': 'CollectionPage',
        name: page.collections[slug].title,
        url: `${origin}${page.collections[slug].route}`,
      })),
    };
  }, [page]);

  const reveal = (index: number) => ({
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: isNarrow ? 12 : 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: {
      once: true,
      amount: isNarrow ? 0.12 : 0.18,
      margin: isNarrow ? '0px 0px -8% 0px' : '0px 0px -10% 0px',
    },
    transition: {
      duration: shouldReduceMotion ? 0.01 : isNarrow ? 0.42 : 0.55,
      delay: shouldReduceMotion ? 0 : index * 0.06,
    },
  });

  const forum = page.collections.forum;
  const storiesInfo = page.collections['success-stories'];
  const figuresInfo = page.collections['yemeni-figures'];
  const galleryInfo = page.collections.gallery;
  const leadArticle = articles[0];
  const leadStory = stories[0];
  const leadFigure = figures[0];

  return (
    <>
      <PageSeo
        title={`${page.hero.title} | ${siteContent.siteConfig.name}`}
        description={page.hero.description}
        image={page.hero.image}
        structuredData={itemListSchema}
      />
      <main className="bg-white">
        <PageHero
          id="cms-library-hero"
          title={page.hero.title}
          description={page.hero.description}
          image={page.hero.image}
          imageAlt={page.hero.imageAlt || page.hero.title}
          breadcrumbs={page.breadcrumbs.index}
        />

        <LibrarySearch locale={locale} labels={page.labels} isRtl={isRtl} />

        <div className="mt-10 md:mt-14">
          <LibraryPillNav active="index" />
        </div>

        {/* Bento grid of sections */}
        <section className="bg-white py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <FadeContent blur={false} duration={620} initialOpacity={0} yOffset={16} threshold={0.18} once>
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4 text-start">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-px w-8 bg-primary-200" />
                    <span className="text-sm font-semibold text-primary-700">{page.hero.eyebrow}</span>
                  </div>
                  <h2 className="text-3xl font-bold leading-tight text-dark-950 md:text-4xl">{page.labels.allSections}</h2>
                </div>
                <p className="max-w-md text-sm leading-relaxed text-dark-500">{page.hero.description}</p>
              </div>
            </FadeContent>

            <div className="grid gap-5 lg:grid-cols-3">
              {/* Forum — large card */}
              <motion.article id="cms-library-collection-forum" {...reveal(0)} className="lg:col-span-2">
                <Link to={forum.route} className={`${cardBase} min-h-[420px]`}>
                  <div className="relative h-56 overflow-hidden bg-warm md:h-64">
                    {leadArticle && (
                      <img
                        src={leadArticle.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-dark-950/25 to-transparent" />
                    <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white">
                      <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                          <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
                          {forum.eyebrow}
                        </span>
                        <h3 className="mt-3 text-2xl font-bold leading-tight md:text-3xl">{forum.title}</h3>
                      </div>
                      <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-primary-700">
                        {counts.forum} {page.labels.items}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <p className="line-clamp-2 text-sm leading-relaxed text-dark-600">{forum.description}</p>
                    <ul className="mt-4 grid gap-2 md:grid-cols-3">
                      {articles.slice(0, 3).map((article) => (
                        <li key={article.slug} className="rounded-2xl bg-[#faf8f8] p-3">
                          <p className="line-clamp-2 text-sm font-bold leading-snug text-dark-900">{article.title}</p>
                          <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-dark-500">
                            <Clock className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
                            {getReadingMinutes(article)} {page.labels.readingTime}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-primary-700">
                      {page.labels.browse}
                      <ArrowIcon
                        className={`h-4 w-4 transition-transform ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </motion.article>

              {/* Success stories — tall card */}
              <motion.article id="cms-library-collection-success-stories" {...reveal(1)}>
                <Link to={storiesInfo.route} className={`${cardBase} min-h-[420px]`}>
                  <div className="relative h-56 overflow-hidden bg-warm md:h-64">
                    {leadStory && (
                      <img
                        src={leadStory.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/85 via-primary-950/30 to-transparent" />
                    <div className="absolute inset-x-5 bottom-5 text-white">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                        <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                        {storiesInfo.eyebrow}
                      </span>
                      <h3 className="mt-3 text-2xl font-bold leading-tight">{storiesInfo.title}</h3>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <ul className="grid gap-2">
                      {stories.slice(0, 3).map((story) => (
                        <li key={story.slug} className="flex items-center gap-3">
                          <img src={story.image} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
                          <p className="line-clamp-2 text-sm font-bold leading-snug text-dark-900">{story.title}</p>
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto inline-flex items-center justify-between gap-2 pt-5 text-sm font-bold text-primary-700">
                      <span className="inline-flex items-center gap-2">
                        {page.labels.browse}
                        <ArrowIcon
                          className={`h-4 w-4 transition-transform ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="rounded-full bg-warm px-3 py-1 text-xs text-dark-600">
                        {counts['success-stories']} {page.labels.items}
                      </span>
                    </span>
                  </div>
                </Link>
              </motion.article>

              {/* Documents hub — four compact tiles */}
              <motion.div {...reveal(2)} className="lg:col-span-3">
                <div className="rounded-[26px] border border-[rgba(127,29,45,0.11)] bg-[#faf8f8] p-4 md:p-5">
                  <div className="mb-4 flex items-center justify-between gap-3 px-1 text-start">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-dark-950">
                      <FileText className="h-5 w-5 text-primary-700" aria-hidden="true" />
                      {page.labels.documentsHub}
                    </h3>
                    <span className="text-xs font-semibold text-dark-500">
                      {documentStats.reduce((sum, stat) => sum + stat.total, 0)} {page.labels.items}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {documentStats.map((stat) => {
                      const Icon = librarySectionIcons[stat.slug];
                      return (
                        <Link
                          key={stat.slug}
                          id={`cms-library-collection-${stat.slug}`}
                          to={stat.info.route}
                          className="group/tile flex items-start gap-3 rounded-[20px] border border-white bg-white p-4 text-start shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[0_14px_34px_rgba(40,12,18,0.1)]"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-base font-bold leading-tight text-dark-950">{stat.info.shortTitle}</span>
                            <span className="mt-1 block text-xs font-semibold text-dark-500">{stat.info.eyebrow}</span>
                            <span className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] font-bold">
                              <span className="rounded-full bg-warm px-2 py-0.5 text-dark-600">
                                {stat.total} {page.labels.items}
                              </span>
                              <span className="rounded-full bg-primary-50 px-2 py-0.5 text-primary-700">
                                {stat.withPdf} {page.labels.pdfShort}
                              </span>
                            </span>
                          </span>
                          <ArrowIcon
                            className={`mt-1 h-4 w-4 shrink-0 text-primary-600 opacity-0 transition-all group-hover/tile:opacity-100 ${
                              isRtl ? 'group-hover/tile:-translate-x-0.5' : 'group-hover/tile:translate-x-0.5'
                            }`}
                            aria-hidden="true"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Yemeni figures — news-style feature card */}
              <motion.article id="cms-library-collection-yemeni-figures" {...reveal(3)} className="lg:col-span-3">
                <Link to={figuresInfo.route} className={`${cardBase} md:flex-row`}>
                  <div className="relative h-56 overflow-hidden bg-[#faf8f8] md:h-auto md:min-h-[300px] md:w-[38%] md:shrink-0">
                    {leadFigure && (
                      <img
                        src={leadFigure.image}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                      <Users className="h-3.5 w-3.5" aria-hidden="true" />
                      {figuresInfo.eyebrow}
                    </span>
                    <h3 className="mt-3 text-2xl font-bold leading-tight text-dark-950 md:text-3xl">{figuresInfo.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-dark-600">{figuresInfo.description}</p>
                    {figures.length > 0 && (
                      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                        {figures.slice(0, 4).map((figure) => (
                          <li key={figure.slug} className="flex items-center gap-3 rounded-2xl bg-[#faf8f8] p-3">
                            <img src={figure.image} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
                            <span className="min-w-0">
                              <span className="line-clamp-2 text-sm font-bold leading-snug text-dark-900">{figure.title}</span>
                              <span className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-dark-500">
                                <Clock className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
                                {getReadingMinutes(figure)} {page.labels.readingTime}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <span className="mt-auto flex items-center justify-between gap-2 pt-5 text-sm font-bold text-primary-700">
                      <span className="inline-flex items-center gap-2">
                        {page.labels.browse}
                        <ArrowIcon
                          className={`h-4 w-4 transition-transform ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="rounded-full bg-warm px-3 py-1 text-xs text-dark-600">
                        {counts['yemeni-figures']} {page.labels.items}
                      </span>
                    </span>
                  </div>
                </Link>
              </motion.article>

              {/* Gallery strip */}
              <motion.article id="cms-library-collection-gallery" {...reveal(4)} className="lg:col-span-3">
                <Link to={galleryInfo.route} className={`${cardBase} md:flex-row`}>
                  <div className="flex flex-col justify-center gap-3 p-5 md:w-72 md:shrink-0 md:p-6">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                      <Images className="h-3.5 w-3.5" aria-hidden="true" />
                      {galleryInfo.eyebrow}
                    </span>
                    <h3 className="text-2xl font-bold leading-tight text-dark-950">{galleryInfo.title}</h3>
                    <p className="text-sm text-dark-600">
                      {counts.gallery} {page.labels.photos}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-primary-700">
                      {page.labels.exploreGallery}
                      <ArrowIcon
                        className={`h-4 w-4 transition-transform ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto p-3 pt-0 md:p-4 md:pt-4">
                    {gallery.slice(0, 6).map((image, index) => (
                      <img
                        key={image.id}
                        src={image.thumbnail}
                        alt=""
                        loading="lazy"
                        className={`h-32 w-32 shrink-0 rounded-2xl object-cover transition-transform duration-500 md:h-36 md:w-36 ${
                          index % 2 === 1 ? 'md:translate-y-3' : ''
                        } group-hover:scale-[1.02]`}
                      />
                    ))}
                  </div>
                </Link>
              </motion.article>
            </div>
          </div>
        </section>

        {/* Latest across the library — hidden when nothing is dated */}
        {latest.length > 0 && (
          <section className="bg-[#faf8f8] py-14 md:py-20">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <div className="mb-6 flex items-center justify-between gap-4 text-start">
                <h2 className="text-2xl font-bold text-dark-950 md:text-3xl">{page.labels.latestAcross}</h2>
              </div>
              <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8">
                {latest.map((hit, index) => (
                  <motion.div key={`${hit.collection}-${hit.id}`} {...reveal(index % 4)} className="w-[280px] shrink-0 snap-start">
                    <LatestCard hit={hit} labels={page.labels} locale={locale} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function LatestCard({
  hit,
  labels,
  locale,
}: {
  hit: LibrarySearchHit;
  labels: ReturnType<typeof getLibraryContent>['labels'];
  locale: Locale;
}) {
  const typeLabel =
    hit.kind === 'article'
      ? labels.typeArticle
      : hit.kind === 'story'
        ? labels.typeStory
        : hit.kind === 'figure'
          ? labels.typeFigure
          : labels.typeDocument;
  const inner = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-warm">
        <img
          src={hit.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute start-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-primary-700 shadow-sm">
          {typeLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-dark-950">{hit.title}</h3>
        <p className="mt-auto flex items-center justify-between gap-2 pt-3 text-xs font-semibold text-dark-500">
          <span>{formatDate(locale, hit.date)}</span>
          {hit.external && <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}
        </p>
      </div>
    </>
  );
  const className =
    'group flex h-full flex-col overflow-hidden rounded-[22px] border border-primary-100 bg-white text-start shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_18px_40px_rgba(40,12,18,0.1)]';

  return hit.external ? (
    <a href={hit.href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link to={hit.href} className={className}>
      {inner}
    </Link>
  );
}
