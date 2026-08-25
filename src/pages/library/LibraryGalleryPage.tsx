import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import FadeContent from '@/components/effects/FadeContent';
import PageHero from '@/components/internal/PageHero';
import PageSeo from '@/components/internal/PageSeo';
import LibraryLightbox from '@/components/library/LibraryLightbox';
import { LibraryLayout } from '@/components/library/LibraryNav';
import {
  getGalleryImages,
  getLibraryCollectionBreadcrumbs,
  getLibraryCollectionInfo,
  getLibraryContent,
} from '@/data/library';
import { useI18n } from '@/i18n/useI18n';

export default function LibraryGalleryPage() {
  const { locale, isRtl, content: siteContent } = useI18n();
  const library = getLibraryContent(locale);
  const info = getLibraryCollectionInfo(locale, 'gallery');
  const images = getGalleryImages(locale);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filteredImages = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return images;
    return images.filter((image) => `${image.title} ${image.imageAlt}`.toLowerCase().includes(needle));
  }, [images, query]);

  const moveLightbox = (nextIndex: number) => {
    if (!filteredImages.length) return;
    const normalizedIndex = (nextIndex + filteredImages.length) % filteredImages.length;
    setActiveIndex(normalizedIndex);
  };

  const structuredData = useMemo(() => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;

    return {
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: info.title,
      image: images.map((image) => `${origin}${image.image}`),
    };
  }, [images, info.title]);


  const filters = (
    
    <div className="mb-8 grid gap-3 rounded-[22px] border border-primary-100 bg-white p-3 shadow-[0_18px_48px_rgba(40,12,18,0.07)] md:grid-cols-[1fr_auto] md:items-center md:p-4">
      <label className="relative block">
        <span className="sr-only">{library.labels.search}</span>
        <Search
          className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400"
          aria-hidden="true"
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={library.labels.searchPlaceholder}
          className="min-h-12 w-full rounded-2xl border border-dark-100 bg-[#faf8f8] px-11 py-3 text-sm font-medium text-dark-800 outline-none transition-colors placeholder:text-dark-400 focus:border-primary-300 focus:bg-white"
        />
      </label>
    
      <div className="flex min-h-12 items-center justify-center rounded-2xl bg-primary-50 px-4 text-sm font-bold text-primary-700">
        {filteredImages.length} {library.labels.results}
      </div>
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
          {images.length} {library.labels.photos}
        </span>
      </div>
    </FadeContent>
  );

  return (
    <>
      <PageSeo
        title={`${info.title} | ${siteContent.siteConfig.name}`}
        description={info.description}
        image={images[0]?.image}
        structuredData={structuredData}
      />
      <main className="bg-white">
        <PageHero
          title={info.title}
          description={info.description}
          image={images[0]?.image ?? library.hero.image}
          imageAlt={info.title}
          breadcrumbs={getLibraryCollectionBreadcrumbs(locale, 'gallery')}
        />

        <LibraryLayout active="gallery" heading={heading} filters={filters}>

          {filteredImages.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredImages.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="group relative aspect-square overflow-hidden rounded-[22px] border border-white bg-white text-start shadow-[0_18px_48px_rgba(40,12,18,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(40,12,18,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-600"
                  aria-label={`${library.labels.openImage}: ${image.title}`}
                >
                  <img
                    src={image.thumbnail}
                    alt={image.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-x-3 bottom-3 rounded-2xl bg-dark-950/82 px-3 py-2 text-center text-xs font-bold text-white backdrop-blur-sm">
                    {library.labels.imageCounter} {index + 1}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] border border-primary-100 bg-white p-8 text-center text-base font-semibold text-dark-600">
              {library.labels.noResults}
            </div>
          )}
        </LibraryLayout>
      </main>

      <LibraryLightbox
        images={filteredImages}
        activeIndex={activeIndex}
        labels={library.labels}
        isRtl={isRtl}
        onClose={() => setActiveIndex(null)}
        onMove={moveLightbox}
      />
    </>
  );
}
