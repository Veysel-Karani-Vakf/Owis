import { cmsGallery, cmsLibraryArticles, cmsLibraryDocuments, cmsPageContent } from '@/cms/adapters';
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
  searchAll: string;
  searchAllPlaceholder: string;
  searchHint: string;
  suggestions: string;
  seeAllIn: string;
  sectionsNav: string;
  allSections: string;
  latestAcross: string;
  documentsHub: string;
  items: string;
  viewGrid: string;
  viewList: string;
  pdfOnly: string;
  pdfShort: string;
  noPdfShort: string;
  preview: string;
  openInNewTab: string;
  closePreview: string;
  previewUnavailable: string;
  readingTime: string;
  tableOfContents: string;
  readingProgress: string;
  share: string;
  copyLink: string;
  linkCopied: string;
  print: string;
  previousItem: string;
  nextItem: string;
  author: string;
  series: string;
  partOfSeries: string;
  partLabel: string;
  donateCta: string;
  clearFilters: string;
  filters: string;
  exploreGallery: string;
  photos: string;
  typeArticle: string;
  typeDocument: string;
  typeStory: string;
  typeImage: string;
  showMore: string;
  showLess: string;
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
    searchAll: 'ابحث في المكتبة كلها',
    searchAllPlaceholder: 'ابحث عن مقال، كتاب، تقرير، أو قصة نجاح…',
    searchHint: 'يبحث في المقالات والتقارير والكتب والأدبيات وقصص النجاح دفعة واحدة.',
    suggestions: 'جرّب البحث عن',
    seeAllIn: 'كل النتائج في',
    sectionsNav: 'أقسام المكتبة',
    allSections: 'أقسام المكتبة',
    latestAcross: 'أحدث ما أُضيف',
    documentsHub: 'الوثائق والإصدارات',
    items: 'مادة',
    viewGrid: 'عرض شبكي',
    viewList: 'عرض قائمة',
    pdfOnly: 'متاح PDF فقط',
    pdfShort: 'PDF',
    noPdfShort: 'بدون PDF',
    preview: 'معاينة',
    openInNewTab: 'فتح في تبويب جديد',
    closePreview: 'إغلاق المعاينة',
    previewUnavailable: 'إذا لم تظهر المعاينة هنا، افتح الملف في تبويب جديد.',
    readingTime: 'دقائق قراءة',
    tableOfContents: 'محتويات المقال',
    readingProgress: 'تقدم القراءة',
    share: 'مشاركة',
    copyLink: 'نسخ الرابط',
    linkCopied: 'تم نسخ الرابط',
    print: 'طباعة',
    previousItem: 'السابق',
    nextItem: 'التالي',
    author: 'الكاتب',
    series: 'سلسلة',
    partOfSeries: 'هذا المقال جزء من سلسلة',
    partLabel: 'الجزء',
    donateCta: 'ساهم الآن في الوقف',
    clearFilters: 'مسح الفلاتر',
    filters: 'تصفية',
    exploreGallery: 'استعرض المعرض',
    photos: 'صورة',
    typeArticle: 'مقال',
    typeDocument: 'وثيقة',
    typeStory: 'قصة نجاح',
    typeImage: 'صورة',
    showMore: 'عرض المزيد',
    showLess: 'عرض أقل',
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
    searchAll: 'Search the whole library',
    searchAllPlaceholder: 'Search for an article, book, report, or success story…',
    searchHint: 'Searches articles, reports, books, literature, and success stories at once.',
    suggestions: 'Try searching for',
    seeAllIn: 'All results in',
    sectionsNav: 'Library sections',
    allSections: 'Library sections',
    latestAcross: 'Recently added',
    documentsHub: 'Documents & publications',
    items: 'items',
    viewGrid: 'Grid view',
    viewList: 'List view',
    pdfOnly: 'PDF available only',
    pdfShort: 'PDF',
    noPdfShort: 'No PDF',
    preview: 'Preview',
    openInNewTab: 'Open in new tab',
    closePreview: 'Close preview',
    previewUnavailable: 'If the preview does not load here, open the file in a new tab.',
    readingTime: 'min read',
    tableOfContents: 'In this article',
    readingProgress: 'Reading progress',
    share: 'Share',
    copyLink: 'Copy link',
    linkCopied: 'Link copied',
    print: 'Print',
    previousItem: 'Previous',
    nextItem: 'Next',
    author: 'Author',
    series: 'Series',
    partOfSeries: 'This article is part of a series',
    partLabel: 'Part',
    donateCta: 'Contribute to the waqf',
    clearFilters: 'Clear filters',
    filters: 'Filters',
    exploreGallery: 'Explore the gallery',
    photos: 'photos',
    typeArticle: 'Article',
    typeDocument: 'Document',
    typeStory: 'Success story',
    typeImage: 'Photo',
    showMore: 'Show more',
    showLess: 'Show less',
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
    searchAll: 'Tüm kütüphanede ara',
    searchAllPlaceholder: 'Makale, kitap, rapor veya başarı hikayesi ara…',
    searchHint: 'Makaleler, raporlar, kitaplar, literatür ve başarı hikayelerinde aynı anda arar.',
    suggestions: 'Şunları aramayı deneyin',
    seeAllIn: 'Tüm sonuçlar:',
    sectionsNav: 'Kütüphane bölümleri',
    allSections: 'Kütüphane bölümleri',
    latestAcross: 'Son eklenenler',
    documentsHub: 'Belgeler ve yayınlar',
    items: 'içerik',
    viewGrid: 'Izgara görünümü',
    viewList: 'Liste görünümü',
    pdfOnly: 'Yalnızca PDF olanlar',
    pdfShort: 'PDF',
    noPdfShort: 'PDF yok',
    preview: 'Önizleme',
    openInNewTab: 'Yeni sekmede aç',
    closePreview: 'Önizlemeyi kapat',
    previewUnavailable: 'Önizleme burada yüklenmezse dosyayı yeni sekmede açın.',
    readingTime: 'dk okuma',
    tableOfContents: 'Bu makalede',
    readingProgress: 'Okuma ilerlemesi',
    share: 'Paylaş',
    copyLink: 'Bağlantıyı kopyala',
    linkCopied: 'Bağlantı kopyalandı',
    print: 'Yazdır',
    previousItem: 'Önceki',
    nextItem: 'Sonraki',
    author: 'Yazar',
    series: 'Seri',
    partOfSeries: 'Bu makale bir serinin parçasıdır',
    partLabel: 'Bölüm',
    donateCta: 'Vakfa katkıda bulun',
    clearFilters: 'Filtreleri temizle',
    filters: 'Filtrele',
    exploreGallery: 'Galeriyi keşfet',
    photos: 'fotoğraf',
    typeArticle: 'Makale',
    typeDocument: 'Belge',
    typeStory: 'Başarı hikayesi',
    typeImage: 'Fotoğraf',
    showMore: 'Daha fazla göster',
    showLess: 'Daha az göster',
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
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[̀-ͯ]/g, '');
}

export function getLibraryContent(locale: Locale): LibraryContent {
  const collections = buildCollections(locale);

  return cmsPageContent('library-page', locale, {
    hero: {
      ...heroText[locale],
      image: libraryCatalog.forumArticles[0]?.image ?? '/library/forum/waqf-economics-part-three.jpeg',
    },
    labels: labels[locale],
    collections,
    breadcrumbs: {
      index: [{ label: labels[locale].home, href: '/' }, { label: labels[locale].library }],
    },
  });
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
  return cmsLibraryArticles(
    'forum',
    locale,
    libraryCatalog.forumArticles.map((item) => localizeTextItem(item, locale, 'forum')),
  );
}

export function getForumArticle(locale: Locale, slug: string | undefined): LibraryTextItem | undefined {
  if (!slug) return undefined;
  return getForumArticles(locale).find((item) => item.slug === slug);
}

export function getSuccessStories(locale: Locale): LibraryTextItem[] {
  return cmsLibraryArticles(
    'success-stories',
    locale,
    libraryCatalog.stories.map((item) => localizeTextItem(item, locale, 'success-stories')),
  );
}

export function getSuccessStory(locale: Locale, slug: string | undefined): LibraryTextItem | undefined {
  if (!slug) return undefined;
  return getSuccessStories(locale).find((item) => item.slug === slug);
}

/** Runtime collection keys mapped to the slugs stored in `library_documents`. */
const documentCollectionSlugByKey: Record<LibraryDocumentCollection, string> = {
  periodicReports: 'periodic-reports',
  waqfBooks: 'waqf-books',
  waqfLiterature: 'waqf-literature',
  yemeniFigures: 'yemeni-figures',
};

export function getDocuments(
  collection: LibraryDocumentCollection,
  locale: Locale = 'ar',
): LibraryDocumentItem[] {
  const fallback = libraryCatalog.documents[collection].map((item) => ({
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
  return cmsLibraryDocuments(documentCollectionSlugByKey[collection], locale, fallback);
}

export function getGalleryImages(locale: Locale = 'ar'): LibraryGalleryImage[] {
  return cmsGallery(
    locale,
    libraryCatalog.gallery.map((item) => ({ ...item })),
  );
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

/* ------------------------------------------------------------------ */
/* Library hub helpers: unified search, series, navigation, reading    */
/* ------------------------------------------------------------------ */

export const documentCollectionSlugs = [
  'periodic-reports',
  'waqf-books',
  'waqf-literature',
  'yemeni-figures',
] as const satisfies readonly LibraryCollectionSlug[];

export type LibraryDocumentCollectionSlug = (typeof documentCollectionSlugs)[number];

export type LibrarySearchHit = {
  id: string;
  kind: 'article' | 'story' | 'document' | 'image';
  collection: LibraryCollectionSlug | 'gallery';
  title: string;
  subtitle: string;
  image: string;
  href: string;
  external: boolean;
  hasPdf: boolean;
  date: string;
};

export type LibrarySearchGroup = {
  collection: LibraryCollectionSlug | 'gallery';
  title: string;
  route: string;
  total: number;
  hits: LibrarySearchHit[];
};

export type LibraryCounts = Record<LibraryCollectionSlug | 'gallery', number>;

function matches(haystack: string, needle: string) {
  if (!needle) return true;
  const normalizedHaystack = normalize(haystack);
  return needle
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => normalizedHaystack.includes(token));
}

export function getLibraryCounts(locale: Locale): LibraryCounts {
  return {
    forum: getForumArticles(locale).length,
    'periodic-reports': getDocuments('periodicReports', locale).length,
    'waqf-books': getDocuments('waqfBooks', locale).length,
    'waqf-literature': getDocuments('waqfLiterature', locale).length,
    'yemeni-figures': getDocuments('yemeniFigures', locale).length,
    'success-stories': getSuccessStories(locale).length,
    gallery: getGalleryImages(locale).length,
  };
}

function textHit(item: LibraryTextItem, kind: 'article' | 'story', collection: LibraryCollectionSlug): LibrarySearchHit {
  return {
    id: item.id,
    kind,
    collection,
    title: item.title,
    subtitle: item.excerpt,
    image: item.image,
    href: item.route,
    external: false,
    hasPdf: false,
    date: item.date,
  };
}

function documentHit(item: LibraryDocumentItem, collection: LibraryCollectionSlug): LibrarySearchHit {
  return {
    id: item.id,
    kind: 'document',
    collection,
    title: item.title,
    subtitle: item.excerpt,
    image: item.image,
    href: item.pdfUrl ?? item.sourceUrl,
    external: true,
    hasPdf: Boolean(item.pdfUrl),
    date: item.date,
  };
}

/** Search across every library collection at once, grouped by section. */
export function searchLibrary(locale: Locale, query: string, perGroup = 4): LibrarySearchGroup[] {
  const needle = normalize(query.trim());
  if (!needle) return [];

  const content = getLibraryContent(locale);
  const groups: LibrarySearchGroup[] = [];

  const pushGroup = (collection: LibraryCollectionSlug | 'gallery', hits: LibrarySearchHit[]) => {
    if (!hits.length) return;
    const info = content.collections[collection];
    groups.push({ collection, title: info.shortTitle, route: info.route, total: hits.length, hits: hits.slice(0, perGroup) });
  };

  pushGroup(
    'forum',
    getForumArticles(locale)
      .filter((item) => matches(`${item.title} ${item.originalTitle} ${item.excerpt} ${item.year ?? ''}`, needle))
      .map((item) => textHit(item, 'article', 'forum'))
  );

  for (const slug of documentCollectionSlugs) {
    const info = content.collections[slug];
    if (!info.documentCollection) continue;
    pushGroup(
      slug,
      getDocuments(info.documentCollection, locale)
        .filter((item) => matches(`${item.title} ${item.excerpt} ${item.year ?? ''}`, needle))
        .map((item) => documentHit(item, slug))
    );
  }

  pushGroup(
    'success-stories',
    getSuccessStories(locale)
      .filter((item) => matches(`${item.title} ${item.originalTitle} ${item.excerpt}`, needle))
      .map((item) => textHit(item, 'story', 'success-stories'))
  );

  pushGroup(
    'gallery',
    getGalleryImages(locale)
      .filter((item) => matches(`${item.title} ${item.imageAlt}`, needle))
      .map((item) => ({
        id: item.id,
        kind: 'image' as const,
        collection: 'gallery' as const,
        title: item.title,
        subtitle: '',
        image: item.thumbnail,
        href: libraryRoutes.gallery,
        external: false,
        hasPdf: false,
        date: '',
      }))
  );

  return groups;
}

/** Suggested search terms per locale (shown under the unified search box). */
export function getLibrarySearchSuggestions(locale: Locale): string[] {
  const suggestions: Record<Locale, string[]> = {
    ar: ['اقتصاد الوقف', 'أويس في أرقام', 'الاستثمار الوقفي', 'براءة اختراع', 'التنمية المستدامة'],
    en: ['Economics of Waqf', 'Owais in Numbers', 'Waqf investment', 'patent', 'sustainable'],
    tr: ['Vakıf Ekonomisi', 'Owais in Numbers', 'vakıf yatırımı', 'patent', 'sürdürülebilir'],
  };
  return suggestions[locale];
}

/** Latest items across articles, stories, and dated documents, newest first. */
export function getLatestLibraryItems(locale: Locale, limit = 6): LibrarySearchHit[] {
  const hits: LibrarySearchHit[] = [
    ...getForumArticles(locale).map((item) => textHit(item, 'article', 'forum')),
    ...getSuccessStories(locale).map((item) => textHit(item, 'story', 'success-stories')),
  ];

  for (const slug of documentCollectionSlugs) {
    const info = collectionSettings[slug];
    if (!info.documentCollection) continue;
    hits.push(
      ...getDocuments(info.documentCollection, locale)
        .filter((item) => item.date)
        .map((item) => documentHit(item, slug))
    );
  }

  return hits
    .filter((hit) => hit.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

const wordsPerMinute = 190;

export function getReadingMinutes(item: Pick<LibraryTextItem, 'content' | 'excerpt'>) {
  const words = item.content.join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

const partOrder: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
};

export type LibrarySeries = {
  key: string;
  title: string;
  parts: { slug: string; title: string; route: string; order: number }[];
  currentIndex: number;
};

/** Detects "-part-one/two/..." article series from slugs. */
export function getArticleSeries(locale: Locale, slug: string): LibrarySeries | null {
  const match = slug.match(/^(.*)-part-([a-z]+)$/);
  if (!match) return null;
  const key = match[1];
  const parts = getForumArticles(locale)
    .map((item) => {
      const itemMatch = item.slug.match(/^(.*)-part-([a-z]+)$/);
      if (!itemMatch || itemMatch[1] !== key) return null;
      return { slug: item.slug, title: item.title, route: item.route, order: partOrder[itemMatch[2]] ?? 99 };
    })
    .filter((part): part is NonNullable<typeof part> => part !== null)
    .sort((a, b) => a.order - b.order);

  if (parts.length < 2) return null;

  const seriesTitle: Record<Locale, string> = {
    ar: parts[0].title.replace(/\s*الجزء.*$/, ''),
    en: parts[0].title.replace(/,?\s*Part.*$/i, ''),
    tr: parts[0].title.replace(/,?\s*(Birinci|İkinci|Üçüncü|Dördüncü).*$/i, ''),
  };

  return {
    key,
    title: seriesTitle[locale] || parts[0].title,
    parts,
    currentIndex: parts.findIndex((part) => part.slug === slug),
  };
}

/** Previous / next items in a text collection (array order = newest first). */
export function getAdjacentTextItems(locale: Locale, type: 'forum' | 'success-stories', slug: string) {
  const items = type === 'forum' ? getForumArticles(locale) : getSuccessStories(locale);
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1) return { previous: undefined, next: undefined };
  return {
    // "next" = the next newer item, "previous" = the older one
    next: index > 0 ? items[index - 1] : undefined,
    previous: index < items.length - 1 ? items[index + 1] : undefined,
  };
}

export type LibraryDocumentSeries = { key: string; label: string; count: number };

/** Groups documents that share a title prefix before " – " / " - " (e.g. "Owais in Numbers – Issue 7"). */
export function getDocumentSeries(items: LibraryDocumentItem[], minCount = 3): LibraryDocumentSeries[] {
  const buckets = new Map<string, number>();
  for (const item of items) {
    const key = getDocumentSeriesKey(item);
    if (!key) continue;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return [...buckets.entries()]
    .filter(([, count]) => count >= minCount)
    .map(([key, count]) => ({ key, label: key, count }))
    .sort((a, b) => b.count - a.count);
}

export function getDocumentSeriesKey(item: Pick<LibraryDocumentItem, 'title'>) {
  const match = item.title.match(/^(.+?)\s+[–—-]\s+/);
  return match ? match[1].trim() : null;
}

export function filterDocuments(
  items: LibraryDocumentItem[],
  options: { query?: string; pdfOnly?: boolean; series?: string | null }
) {
  const needle = normalize((options.query ?? '').trim());
  return items.filter((item) => {
    if (options.pdfOnly && !item.pdfUrl) return false;
    if (options.series && getDocumentSeriesKey(item) !== options.series) return false;
    return matches(`${item.title} ${item.excerpt} ${item.year ?? ''}`, needle);
  });
}

// --- Static (CMS-free) views, used by the dashboard's import tool -----------
export function staticLibraryContent(locale: Locale): LibraryContent {
  return {
    hero: {
      ...heroText[locale],
      image: libraryCatalog.forumArticles[0]?.image ?? '/library/forum/waqf-economics-part-three.jpeg',
    },
    labels: labels[locale],
    collections: buildCollections(locale),
    breadcrumbs: {
      index: [{ label: labels[locale].home, href: '/' }, { label: labels[locale].library }],
    },
  };
}

export function staticForumArticles(locale: Locale): LibraryTextItem[] {
  return libraryCatalog.forumArticles.map((item) => localizeTextItem(item, locale, 'forum'));
}

export function staticSuccessStories(locale: Locale): LibraryTextItem[] {
  return libraryCatalog.stories.map((item) => localizeTextItem(item, locale, 'success-stories'));
}

export function staticDocuments(collection: LibraryDocumentCollection): LibraryDocumentItem[] {
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

export function staticGalleryImages(): LibraryGalleryImage[] {
  return libraryCatalog.gallery.map((item) => ({ ...item }));
}
