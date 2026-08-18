import type { BreadcrumbItem } from '@/data/about';
import type { Locale } from '@/i18n/content';
import { libraryCatalog } from './catalog';

export const libraryRoutes = {
  index: '/library',
  forum: '/library/forum',
  periodicReports: '/library/periodic-reports',
  waqfBooks: '/library/waqf-books',
  waqfLiterature: '/library/waqf-literature',
  yemeniFigures: '/library/yemeni-figures',
  successStories: '/library/success-stories',
  gallery: '/library/gallery',
} as const;

export type LibraryCollectionSlug =
  | 'forum'
  | 'periodic-reports'
  | 'waqf-books'
  | 'waqf-literature'
  | 'yemeni-figures'
  | 'success-stories';

export type LibraryDocumentCollection = 'periodicReports' | 'waqfBooks' | 'waqfLiterature' | 'yemeniFigures';

export type LibraryNavItem =
  | {
      type: 'link';
      label: string;
      href: string;
    }
  | {
      type: 'group';
      label: string;
      href: string;
      items: { label: string; href: string }[];
    };

export type LibraryLabels = {
  home: string;
  library: string;
  browse: string;
  latest: string;
  all: string;
  allYears: string;
  search: string;
  searchPlaceholder: string;
  results: string;
  noResults: string;
  readArticle: string;
  readStory: string;
  openDocument: string;
  downloadPdf: string;
  officialSource: string;
  published: string;
  sourceLanguage: string;
  originalLanguageNote: string;
  directPdfAvailable: string;
  noDirectPdf: string;
  related: string;
  backToLibrary: string;
  backToCollection: string;
  openImage: string;
  closeImage: string;
  previousImage: string;
  nextImage: string;
  imageCounter: string;
};

export type LibraryCollectionInfo = {
  slug: LibraryCollectionSlug | 'gallery';
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  route: string;
  sourceUrl: string;
  kind: 'articles' | 'documents' | 'stories' | 'gallery';
  documentCollection?: LibraryDocumentCollection;
};

export type LibraryTextItem = {
  id: string;
  slug: string;
  route: string;
  title: string;
  originalTitle: string;
  sourceUrl: string;
  sourceLanguage: string;
  date: string;
  year: number | null;
  excerpt: string;
  image: string;
  imageAlt: string;
  content: readonly string[];
};

export type LibraryDocumentItem = {
  id: string;
  title: string;
  sourceUrl: string;
  pdfUrl: string | null;
  date: string;
  year: number | null;
  excerpt: string;
  image: string;
  imageAlt: string;
};

export type LibraryGalleryImage = {
  id: string;
  title: string;
  image: string;
  thumbnail: string;
  sourceUrl: string;
  imageAlt: string;
  width: number;
  height: number;
};

export type LibraryContent = {
  hero: {
    title: string;
    eyebrow: string;
    description: string;
    image: string;
  };
  nav: LibraryNavItem[];
  labels: LibraryLabels;
  collections: Record<LibraryCollectionSlug | 'gallery', LibraryCollectionInfo>;
  breadcrumbs: {
    index: BreadcrumbItem[];
  };
};

const officialPages = libraryCatalog.diagnostics.officialPages;

const languageNames: Record<Locale, Record<string, string>> = {
  ar: {
    ar: 'العربية',
    en: 'الإنجليزية',
    tr: 'التركية',
  },
  en: {
    ar: 'Arabic',
    en: 'English',
    tr: 'Turkish',
  },
  tr: {
    ar: 'Arapça',
    en: 'İngilizce',
    tr: 'Türkçe',
  },
};

const labels: Record<Locale, LibraryLabels> = {
  ar: {
    home: 'الرئيسية',
    library: 'المكتبة',
    browse: 'تصفح القسم',
    latest: 'أحدث المواد',
    all: 'الكل',
    allYears: 'كل السنوات',
    search: 'بحث',
    searchPlaceholder: 'ابحث بالعنوان أو الوصف أو السنة',
    results: 'نتيجة',
    noResults: 'لا توجد نتائج مطابقة.',
    readArticle: 'قراءة المقال',
    readStory: 'قراءة القصة',
    openDocument: 'فتح الوثيقة',
    downloadPdf: 'تحميل PDF',
    officialSource: 'المصدر الرسمي',
    published: 'تاريخ النشر',
    sourceLanguage: 'لغة المصدر',
    originalLanguageNote: 'النص الكامل معروض بلغته الرسمية كما ورد في المصدر.',
    directPdfAvailable: 'رابط PDF مباشر متاح',
    noDirectPdf: 'لا يوجد PDF مباشر موثق لهذه الصفحة',
    related: 'مواد ذات صلة',
    backToLibrary: 'العودة إلى المكتبة',
    backToCollection: 'العودة إلى القسم',
    openImage: 'فتح الصورة',
    closeImage: 'إغلاق الصورة',
    previousImage: 'الصورة السابقة',
    nextImage: 'الصورة التالية',
    imageCounter: 'صورة',
  },
  en: {
    home: 'Home',
    library: 'Library',
    browse: 'Browse Section',
    latest: 'Latest Items',
    all: 'All',
    allYears: 'All years',
    search: 'Search',
    searchPlaceholder: 'Search by title, description, or year',
    results: 'results',
    noResults: 'No matching results.',
    readArticle: 'Read Article',
    readStory: 'Read Story',
    openDocument: 'Open Document',
    downloadPdf: 'Download PDF',
    officialSource: 'Official Source',
    published: 'Published',
    sourceLanguage: 'Source Language',
    originalLanguageNote: 'The full text is shown in its official source language.',
    directPdfAvailable: 'Direct PDF available',
    noDirectPdf: 'No verified direct PDF for this page',
    related: 'Related Items',
    backToLibrary: 'Back to Library',
    backToCollection: 'Back to Section',
    openImage: 'Open image',
    closeImage: 'Close image',
    previousImage: 'Previous image',
    nextImage: 'Next image',
    imageCounter: 'Image',
  },
  tr: {
    home: 'Ana Sayfa',
    library: 'Kütüphane',
    browse: 'Bölümü Gör',
    latest: 'Son İçerikler',
    all: 'Tümü',
    allYears: 'Tüm yıllar',
    search: 'Ara',
    searchPlaceholder: 'Başlık, açıklama veya yıla göre ara',
    results: 'sonuç',
    noResults: 'Eşleşen sonuç yok.',
    readArticle: 'Makaleyi Oku',
    readStory: 'Hikayeyi Oku',
    openDocument: 'Belgeyi Aç',
    downloadPdf: "PDF'yi İndir",
    officialSource: 'Resmi Kaynak',
    published: 'Yayın tarihi',
    sourceLanguage: 'Kaynak dili',
    originalLanguageNote: 'Tam metin resmi kaynak dilinde gösterilir.',
    directPdfAvailable: 'Doğrudan PDF mevcut',
    noDirectPdf: 'Bu sayfa için doğrulanmış doğrudan PDF yok',
    related: 'İlgili İçerikler',
    backToLibrary: 'Kütüphaneye Dön',
    backToCollection: 'Bölüme Dön',
    openImage: 'Görseli aç',
    closeImage: 'Görseli kapat',
    previousImage: 'Önceki görsel',
    nextImage: 'Sonraki görsel',
    imageCounter: 'Görsel',
  },
};

const collectionText: Record<Locale, Record<LibraryCollectionSlug | 'gallery', Omit<LibraryCollectionInfo, 'slug' | 'route' | 'sourceUrl' | 'kind' | 'documentCollection'>>> = {
  ar: {
    forum: {
      title: 'المنتدى الوقفي',
      shortTitle: 'المنتدى',
      eyebrow: 'مقالات ودراسات',
      description: 'مقالات الوقف والتنمية واليمن المنشورة في المنتدى الرسمي لوقف أويس القرني.',
    },
    'periodic-reports': {
      title: 'التقارير الدورية',
      shortTitle: 'التقارير الدورية',
      eyebrow: 'أرقام ونشرات',
      description: 'إصدارات أويس في أرقام والنشرات الدورية المتاحة في أرشيف الوقف الرسمي.',
    },
    'waqf-books': {
      title: 'كتب وقفية',
      shortTitle: 'كتب وقفية',
      eyebrow: 'أدبيات الوقف',
      description: 'كتب مختارة حول الوقف، الاستثمار الوقفي، والتنمية المستدامة.',
    },
    'waqf-literature': {
      title: 'أدبيات وقفية',
      shortTitle: 'أدبيات الوقف',
      eyebrow: 'تعريفات وبروشورات',
      description: 'أدلة وبروشورات وتقارير تعريفية منشورة ضمن مكتبة الوقف.',
    },
    'yemeni-figures': {
      title: 'شخصيات يمانية',
      shortTitle: 'شخصيات يمانية',
      eyebrow: 'ذاكرة يمنية',
      description: 'مواد توثق شخصيات يمنية بارزة كما وردت في المكتبة الرسمية.',
    },
    'success-stories': {
      title: 'قصص النجاح',
      shortTitle: 'قصص نجاح',
      eyebrow: 'نماذج ملهمة',
      description: 'قصص يمنيين بارزين في الابتكار والبحث كما ظهرت في صفحة قصص النجاح الرسمية.',
    },
    gallery: {
      title: 'معرض الصور',
      shortTitle: 'معرض الصور',
      eyebrow: 'توثيق بصري',
      description: 'صور رسمية من معرض وقف أويس القرني مع عرض ضوئي مخصص داخل الموقع الجديد.',
    },
  },
  en: {
    forum: {
      title: 'Waqf Forum',
      shortTitle: 'Forum',
      eyebrow: 'Articles and Studies',
      description: 'Articles on waqf, development, and Yemen published in the official Veysel Karani Waqf forum.',
    },
    'periodic-reports': {
      title: 'Periodic Reports',
      shortTitle: 'Reports',
      eyebrow: 'Numbers and Bulletins',
      description: 'Owais in Numbers editions and periodic bulletins available in the official waqf archive.',
    },
    'waqf-books': {
      title: 'Waqf Books',
      shortTitle: 'Waqf Books',
      eyebrow: 'Waqf Literature',
      description: 'Selected books on waqf, waqf investment, and sustainable development.',
    },
    'waqf-literature': {
      title: 'Waqf Literature',
      shortTitle: 'Literature',
      eyebrow: 'Guides and Brochures',
      description: 'Guides, brochures, and introductory reports published in the waqf library.',
    },
    'yemeni-figures': {
      title: 'Yemeni Figures',
      shortTitle: 'Yemeni Figures',
      eyebrow: 'Yemeni Memory',
      description: 'Materials documenting notable Yemeni figures as listed in the official library.',
    },
    'success-stories': {
      title: 'Success Stories',
      shortTitle: 'Success Stories',
      eyebrow: 'Inspiring Models',
      description: 'Stories of Yemeni innovators and researchers shown on the official success stories page.',
    },
    gallery: {
      title: 'Photo Gallery',
      shortTitle: 'Gallery',
      eyebrow: 'Visual Documentation',
      description: 'Official photos from the Veysel Karani Waqf gallery with an in-site lightbox.',
    },
  },
  tr: {
    forum: {
      title: 'Vakıf Forumu',
      shortTitle: 'Forum',
      eyebrow: 'Makaleler ve İncelemeler',
      description: 'Veysel Karani Vakfı resmi forumunda yayımlanan vakıf, kalkınma ve Yemen yazıları.',
    },
    'periodic-reports': {
      title: 'Dönemsel Raporlar',
      shortTitle: 'Raporlar',
      eyebrow: 'Sayılar ve Bültenler',
      description: 'Resmi vakıf arşivindeki Owais in Numbers sayıları ve dönemsel bültenler.',
    },
    'waqf-books': {
      title: 'Vakıf Kitapları',
      shortTitle: 'Vakıf Kitapları',
      eyebrow: 'Vakıf Literatürü',
      description: 'Vakıf, vakıf yatırımı ve sürdürülebilir kalkınma üzerine seçilmiş kitaplar.',
    },
    'waqf-literature': {
      title: 'Vakıf Literatürü',
      shortTitle: 'Literatür',
      eyebrow: 'Kılavuzlar ve Broşürler',
      description: 'Vakıf kütüphanesinde yayımlanan kılavuzlar, broşürler ve tanıtıcı raporlar.',
    },
    'yemeni-figures': {
      title: 'Yemenli Şahsiyetler',
      shortTitle: 'Yemenli Şahsiyetler',
      eyebrow: 'Yemen Hafızası',
      description: 'Resmi kütüphanede yer alan önde gelen Yemenli şahsiyetlere dair materyaller.',
    },
    'success-stories': {
      title: 'Başarı Hikayeleri',
      shortTitle: 'Başarı Hikayeleri',
      eyebrow: 'İlham Veren Örnekler',
      description: 'Resmi başarı hikayeleri sayfasında yer alan Yemenli yenilikçi ve araştırmacıların hikayeleri.',
    },
    gallery: {
      title: 'Fotoğraf Galerisi',
      shortTitle: 'Galeri',
      eyebrow: 'Görsel Dokümantasyon',
      description: 'Veysel Karani Vakfı resmi galerisinden fotoğraflar ve site içi ışıklı galeri.',
    },
  },
};

const collectionSettings: Record<
  LibraryCollectionSlug | 'gallery',
  Pick<LibraryCollectionInfo, 'route' | 'sourceUrl' | 'kind' | 'documentCollection'>
> = {
  forum: {
    route: libraryRoutes.forum,
    sourceUrl: officialPages.forum,
    kind: 'articles',
  },
  'periodic-reports': {
    route: libraryRoutes.periodicReports,
    sourceUrl: officialPages.periodicReports,
    kind: 'documents',
    documentCollection: 'periodicReports',
  },
  'waqf-books': {
    route: libraryRoutes.waqfBooks,
    sourceUrl: officialPages.waqfBooks,
    kind: 'documents',
    documentCollection: 'waqfBooks',
  },
  'waqf-literature': {
    route: libraryRoutes.waqfLiterature,
    sourceUrl: officialPages.waqfLiterature,
    kind: 'documents',
    documentCollection: 'waqfLiterature',
  },
  'yemeni-figures': {
    route: libraryRoutes.yemeniFigures,
    sourceUrl: officialPages.yemeniFigures,
    kind: 'documents',
    documentCollection: 'yemeniFigures',
  },
  'success-stories': {
    route: libraryRoutes.successStories,
    sourceUrl: officialPages.successStories,
    kind: 'stories',
  },
  gallery: {
    route: libraryRoutes.gallery,
    sourceUrl: officialPages.gallery,
    kind: 'gallery',
  },
};

function buildCollections(locale: Locale): Record<LibraryCollectionSlug | 'gallery', LibraryCollectionInfo> {
  const text = collectionText[locale];

  return {
    forum: { slug: 'forum', ...text.forum, ...collectionSettings.forum },
    'periodic-reports': {
      slug: 'periodic-reports',
      ...text['periodic-reports'],
      ...collectionSettings['periodic-reports'],
    },
    'waqf-books': { slug: 'waqf-books', ...text['waqf-books'], ...collectionSettings['waqf-books'] },
    'waqf-literature': {
      slug: 'waqf-literature',
      ...text['waqf-literature'],
      ...collectionSettings['waqf-literature'],
    },
    'yemeni-figures': {
      slug: 'yemeni-figures',
      ...text['yemeni-figures'],
      ...collectionSettings['yemeni-figures'],
    },
    'success-stories': {
      slug: 'success-stories',
      ...text['success-stories'],
      ...collectionSettings['success-stories'],
    },
    gallery: { slug: 'gallery', ...text.gallery, ...collectionSettings.gallery },
  };
}

function navFor(locale: Locale): LibraryNavItem[] {
  const c = buildCollections(locale);
  const literatureLabel: Record<Locale, string> = {
    ar: 'أدبيات',
    en: 'Literature',
    tr: 'Literatür',
  };
  const mediaLabel: Record<Locale, string> = {
    ar: 'ميديا',
    en: 'Media',
    tr: 'Medya',
  };

  return [
    { type: 'link', label: c.forum.shortTitle, href: c.forum.route },
    {
      type: 'group',
      label: literatureLabel[locale],
      href: c['periodic-reports'].route,
      items: [
        { label: c['periodic-reports'].shortTitle, href: c['periodic-reports'].route },
        { label: c['waqf-books'].shortTitle, href: c['waqf-books'].route },
        { label: c['waqf-literature'].shortTitle, href: c['waqf-literature'].route },
        { label: c['yemeni-figures'].shortTitle, href: c['yemeni-figures'].route },
      ],
    },
    { type: 'link', label: c['success-stories'].shortTitle, href: c['success-stories'].route },
    {
      type: 'group',
      label: mediaLabel[locale],
      href: c.gallery.route,
      items: [{ label: c.gallery.shortTitle, href: c.gallery.route }],
    },
  ];
}

const heroText: Record<Locale, Omit<LibraryContent['hero'], 'image'>> = {
  ar: {
    title: 'المكتبة',
    eyebrow: 'أرشيف وقف أويس القرني',
    description: 'مركز واحد للمقالات، التقارير، الكتب، الأدبيات، قصص النجاح، والصور الرسمية المنقولة من موقع الوقف القديم.',
  },
  en: {
    title: 'Library',
    eyebrow: 'Veysel Karani Waqf Archive',
    description: 'One place for official articles, reports, books, literature, success stories, and photos migrated from the old waqf website.',
  },
  tr: {
    title: 'Kütüphane',
    eyebrow: 'Veysel Karani Vakfı Arşivi',
    description: 'Eski vakıf sitesinden taşınan resmi makaleler, raporlar, kitaplar, literatür, başarı hikayeleri ve fotoğraflar.',
  },
};

function localizeTextItem<T extends (typeof libraryCatalog.forumArticles)[number] | (typeof libraryCatalog.stories)[number]>(
  item: T,
  locale: Locale,
  section: 'forum' | 'success-stories'
): LibraryTextItem {
  return {
    id: item.id,
    slug: item.slug,
    route: `${section === 'forum' ? libraryRoutes.forum : libraryRoutes.successStories}/${item.slug}`,
    title: item.localizedTitle[locale] || item.title,
    originalTitle: item.title,
    sourceUrl: item.sourceUrl,
    sourceLanguage: item.sourceLanguage,
    date: item.date,
    year: item.year,
    excerpt: item.excerpt,
    image: item.image,
    imageAlt: item.imageAlt,
    content: item.content,
  };
}

function normalize(value: string) {
  return value.toLowerCase().normalize('NFKD');
}

export function getLibraryContent(locale: Locale): LibraryContent {
  const collections = buildCollections(locale);

  return {
    hero: {
      ...heroText[locale],
      image: libraryCatalog.forumArticles[0]?.image ?? '/library/forum/waqf-economics-part-three.jpeg',
    },
    nav: navFor(locale),
    labels: labels[locale],
    collections,
    breadcrumbs: {
      index: [{ label: labels[locale].home, href: '/' }, { label: labels[locale].library }],
    },
  };
}

export function getLibraryCollectionInfo(locale: Locale, slug: LibraryCollectionSlug | 'gallery') {
  return getLibraryContent(locale).collections[slug];
}

export function getLibraryCollectionBreadcrumbs(locale: Locale, slug: LibraryCollectionSlug | 'gallery'): BreadcrumbItem[] {
  const content = getLibraryContent(locale);
  const collection = content.collections[slug];

  return [
    { label: content.labels.home, href: '/' },
    { label: content.labels.library, href: libraryRoutes.index },
    { label: collection.title },
  ];
}

export function getLibraryTextBreadcrumbs(locale: Locale, item: LibraryTextItem, parentSlug: 'forum' | 'success-stories'): BreadcrumbItem[] {
  const content = getLibraryContent(locale);
  const parent = content.collections[parentSlug];

  return [
    { label: content.labels.home, href: '/' },
    { label: content.labels.library, href: libraryRoutes.index },
    { label: parent.shortTitle, href: parent.route },
    { label: item.title },
  ];
}

export function getForumArticles(locale: Locale): LibraryTextItem[] {
  return libraryCatalog.forumArticles.map((item) => localizeTextItem(item, locale, 'forum'));
}

export function getForumArticle(locale: Locale, slug: string | undefined): LibraryTextItem | undefined {
  if (!slug) return undefined;
  return getForumArticles(locale).find((item) => item.slug === slug);
}

export function getSuccessStories(locale: Locale): LibraryTextItem[] {
  return libraryCatalog.stories.map((item) => localizeTextItem(item, locale, 'success-stories'));
}

export function getSuccessStory(locale: Locale, slug: string | undefined): LibraryTextItem | undefined {
  if (!slug) return undefined;
  return getSuccessStories(locale).find((item) => item.slug === slug);
}

export function getDocuments(collection: LibraryDocumentCollection): LibraryDocumentItem[] {
  return libraryCatalog.documents[collection].map((item) => ({
    id: item.id,
    title: item.title,
    sourceUrl: item.sourceUrl,
    pdfUrl: item.pdfUrl,
    date: item.date,
    year: item.year,
    excerpt: item.excerpt,
    image: item.image,
    imageAlt: item.imageAlt,
  }));
}

export function getGalleryImages(): LibraryGalleryImage[] {
  return libraryCatalog.gallery.map((item) => ({ ...item }));
}

export function getLanguageName(locale: Locale, value: string) {
  return languageNames[locale][value] ?? value;
}

export function getRelatedForumArticles(locale: Locale, slug: string, limit = 3) {
  return getForumArticles(locale).filter((item) => item.slug !== slug).slice(0, limit);
}

export function getRelatedSuccessStories(locale: Locale, slug: string, limit = 3) {
  return getSuccessStories(locale).filter((item) => item.slug !== slug).slice(0, limit);
}

export function searchLibraryItems<T extends { title: string; excerpt?: string; year: number | null }>(
  items: T[],
  query: string,
  year: string
): T[] {
  const needle = normalize(query.trim());

  return items.filter((item) => {
    const matchesYear = year === 'all' || String(item.year ?? '') === year;
    const haystack = normalize(`${item.title} ${item.excerpt ?? ''} ${item.year ?? ''}`);
    return matchesYear && (!needle || haystack.includes(needle));
  });
}

export function getYears(items: { year: number | null }[]) {
  return [...new Set(items.map((item) => item.year).filter((year): year is number => Boolean(year)))].sort(
    (a, b) => b - a
  );
}

export function getLibraryDiagnostics() {
  return libraryCatalog.diagnostics;
}
