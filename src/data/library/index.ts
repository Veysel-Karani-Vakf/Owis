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

export type LibraryDocumentCollection = 'periodicReports' | 'waqfBooks' | 'waqfLiterature';

/** Collections rendered as readable articles (news-style cards + a reading page). */
export type LibraryTextCollectionSlug = 'forum' | 'success-stories' | 'yemeni-figures';

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
  /** Heading above the item's original (untranslated) title on the reading page. */
  originalTitle: string;
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
  viewNews: string;
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
  typeFigure: string;
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
  /** Optional hero image for the collection page; empty = first item's image. */
  image?: string;
  imageAlt?: string;
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
  /** Optional attached document (e.g. a book scan) offered for download on the reading page. */
  pdfUrl: string | null;
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
  /** Editor-set series name (CMS rows); static items derive it from the title. */
  series?: string;
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
    imageAlt: string;
  };
  labels: LibraryLabels;
  collections: Record<LibraryCollectionSlug | 'gallery', LibraryCollectionInfo>;
  /** Suggested search terms shown under the unified search box. */
  searchSuggestions: string[];
  /** Counts the client can tune from the admin (advanced fields). */
  layout: {
    searchPerGroup: number;
    latestLimit: number;
    relatedLimit: number;
  };
  breadcrumbs: {
    index: BreadcrumbItem[];
  };
};

const searchSuggestions: Record<Locale, string[]> = {
  ar: ['اقتصاد الوقف', 'أويس في أرقام', 'الاستثمار الوقفي', 'براءة اختراع', 'التنمية المستدامة'],
  en: ['Economics of Waqf', 'Owais in Numbers', 'Waqf investment', 'patent', 'sustainable'],
  tr: ['Vakıf Ekonomisi', 'Owais in Numbers', 'vakıf yatırımı', 'patent', 'sürdürülebilir'],
};

const defaultLayout: LibraryContent['layout'] = {
  searchPerGroup: 4,
  latestLimit: 8,
  relatedLimit: 4,
};

/** Coerces an admin-entered count (may arrive as a string or blank) to a usable positive integer. */
function positiveCount(value: unknown, fallback: number) {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

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
    originalTitle: 'العنوان الأصلي',
    published: 'تاريخ النشر',
    sourceLanguage: 'لغة المصدر',
    originalLanguageNote: 'النص الكامل معروض بلغته الأصلية.',
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
    viewNews: 'عرض بطاقات',
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
    typeFigure: 'شخصية يمانية',
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
    originalTitle: 'Original title',
    published: 'Published',
    sourceLanguage: 'Source Language',
    originalLanguageNote: 'The full text is shown in its original language.',
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
    viewNews: 'News cards view',
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
    typeFigure: 'Yemeni figure',
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
    originalTitle: 'Orijinal başlık',
    published: 'Yayın tarihi',
    sourceLanguage: 'Kaynak dili',
    originalLanguageNote: 'Tam metin orijinal dilinde gösterilir.',
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
    viewNews: 'Kart görünümü',
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
    typeFigure: 'Yemenli şahsiyet',
    typeImage: 'Fotoğraf',
    showMore: 'Daha fazla göster',
    showLess: 'Daha az göster',
  },
};

const collectionText: Record<
  Locale,
  Record<LibraryCollectionSlug | 'gallery', Pick<LibraryCollectionInfo, 'title' | 'shortTitle' | 'eyebrow' | 'description'>>
> = {
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
      description: 'سير ومقالات توثق شخصيات يمنية بارزة في الداخل والمهجر، تُقرأ مباشرة داخل الموقع.',
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
      description: 'Profiles and articles documenting notable Yemeni figures at home and abroad, readable on the site.',
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
      description: 'Yurt içinde ve diasporada öne çıkan Yemenli şahsiyetleri belgeleyen, sitede okunabilen profil ve yazılar.',
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
  Pick<LibraryCollectionInfo, 'route' | 'kind' | 'documentCollection'>
> = {
  forum: {
    route: libraryRoutes.forum,
    kind: 'articles',
  },
  'periodic-reports': {
    route: libraryRoutes.periodicReports,
    kind: 'documents',
    documentCollection: 'periodicReports',
  },
  'waqf-books': {
    route: libraryRoutes.waqfBooks,
    kind: 'documents',
    documentCollection: 'waqfBooks',
  },
  'waqf-literature': {
    route: libraryRoutes.waqfLiterature,
    kind: 'documents',
    documentCollection: 'waqfLiterature',
  },
  'yemeni-figures': {
    route: libraryRoutes.yemeniFigures,
    kind: 'articles',
  },
  'success-stories': {
    route: libraryRoutes.successStories,
    kind: 'stories',
  },
  gallery: {
    route: libraryRoutes.gallery,
    kind: 'gallery',
  },
};

function buildCollections(locale: Locale): Record<LibraryCollectionSlug | 'gallery', LibraryCollectionInfo> {
  const text = collectionText[locale];
  // image/imageAlt default to '' so the admin paths always have a static value;
  // components fall back to the first item's image when they are empty.
  const build = (slug: LibraryCollectionSlug | 'gallery'): LibraryCollectionInfo => ({
    slug,
    ...text[slug],
    image: '',
    imageAlt: '',
    ...collectionSettings[slug],
  });

  return {
    forum: build('forum'),
    'periodic-reports': build('periodic-reports'),
    'waqf-books': build('waqf-books'),
    'waqf-literature': build('waqf-literature'),
    'yemeni-figures': build('yemeni-figures'),
    'success-stories': build('success-stories'),
    gallery: build('gallery'),
  };
}

const heroText: Record<Locale, Omit<LibraryContent['hero'], 'image' | 'imageAlt'>> = {
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

export const textCollectionRoutes: Record<LibraryTextCollectionSlug, string> = {
  forum: libraryRoutes.forum,
  'success-stories': libraryRoutes.successStories,
  'yemeni-figures': libraryRoutes.yemeniFigures,
};

type CatalogTextItem =
  | (typeof libraryCatalog.forumArticles)[number]
  | (typeof libraryCatalog.stories)[number]
  | (typeof libraryCatalog.yemeniFigures)[number];

function localizeTextItem<T extends CatalogTextItem>(
  item: T,
  locale: Locale,
  section: LibraryTextCollectionSlug
): LibraryTextItem {
  return {
    id: item.id,
    slug: item.slug,
    route: `${textCollectionRoutes[section]}/${item.slug}`,
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
    pdfUrl: 'pdfUrl' in item ? item.pdfUrl : null,
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
  const merged = cmsPageContent('library-page', locale, staticLibraryContent(locale));
  // Numbers typed in the admin may come back as strings or blanks; never let
  // them turn into NaN slices that would hide whole sections.
  return {
    ...merged,
    searchSuggestions: Array.isArray(merged.searchSuggestions)
      ? merged.searchSuggestions.filter((entry): entry is string => typeof entry === 'string' && entry.trim() !== '')
      : [],
    layout: {
      searchPerGroup: positiveCount(merged.layout?.searchPerGroup, defaultLayout.searchPerGroup),
      latestLimit: positiveCount(merged.layout?.latestLimit, defaultLayout.latestLimit),
      relatedLimit: positiveCount(merged.layout?.relatedLimit, defaultLayout.relatedLimit),
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

export function getLibraryTextBreadcrumbs(locale: Locale, item: LibraryTextItem, parentSlug: LibraryTextCollectionSlug): BreadcrumbItem[] {
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

export function getYemeniFigures(locale: Locale): LibraryTextItem[] {
  return cmsLibraryArticles(
    'yemeni-figures',
    locale,
    libraryCatalog.yemeniFigures.map((item) => localizeTextItem(item, locale, 'yemeni-figures')),
  );
}

export function getYemeniFigure(locale: Locale, slug: string | undefined): LibraryTextItem | undefined {
  if (!slug) return undefined;
  return getYemeniFigures(locale).find((item) => item.slug === slug);
}

/** All items of a text collection, newest first (array order). */
export function getTextItems(locale: Locale, collection: LibraryTextCollectionSlug): LibraryTextItem[] {
  switch (collection) {
    case 'forum':
      return getForumArticles(locale);
    case 'success-stories':
      return getSuccessStories(locale);
    default:
      return getYemeniFigures(locale);
  }
}

export function getTextItem(locale: Locale, collection: LibraryTextCollectionSlug, slug: string | undefined) {
  if (!slug) return undefined;
  return getTextItems(locale, collection).find((item) => item.slug === slug);
}

export function getRelatedTextItems(
  locale: Locale,
  collection: LibraryTextCollectionSlug,
  slug: string,
  limit = getLibraryContent(locale).layout.relatedLimit,
) {
  return getTextItems(locale, collection)
    .filter((item) => item.slug !== slug)
    .slice(0, limit);
}

/** Runtime collection keys mapped to the slugs stored in `library_documents`. */
const documentCollectionSlugByKey: Record<LibraryDocumentCollection, string> = {
  periodicReports: 'periodic-reports',
  waqfBooks: 'waqf-books',
  waqfLiterature: 'waqf-literature',
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
] as const satisfies readonly LibraryCollectionSlug[];

export type LibraryDocumentCollectionSlug = (typeof documentCollectionSlugs)[number];

export type LibrarySearchHit = {
  id: string;
  kind: 'article' | 'story' | 'figure' | 'document' | 'image';
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
    'yemeni-figures': getYemeniFigures(locale).length,
    'success-stories': getSuccessStories(locale).length,
    gallery: getGalleryImages(locale).length,
  };
}

function textHit(item: LibraryTextItem, kind: 'article' | 'story' | 'figure', collection: LibraryCollectionSlug): LibrarySearchHit {
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
  // Without a PDF the hit opens the collection page pre-filtered on the
  // title; this site is the official source, so nothing links off-site.
  const hasPdf = Boolean(item.pdfUrl);
  return {
    id: item.id,
    kind: 'document',
    collection,
    title: item.title,
    subtitle: item.excerpt,
    image: item.image,
    href: hasPdf ? (item.pdfUrl as string) : `${collectionSettings[collection].route}?q=${encodeURIComponent(item.title)}`,
    external: hasPdf,
    hasPdf,
    date: item.date,
  };
}

/** Search across every library collection at once, grouped by section. */
export function searchLibrary(locale: Locale, query: string, perGroup?: number): LibrarySearchGroup[] {
  const needle = normalize(query.trim());
  if (!needle) return [];

  const content = getLibraryContent(locale);
  const groupLimit = perGroup ?? content.layout.searchPerGroup;
  const groups: LibrarySearchGroup[] = [];

  const pushGroup = (collection: LibraryCollectionSlug | 'gallery', hits: LibrarySearchHit[]) => {
    if (!hits.length) return;
    const info = content.collections[collection];
    groups.push({ collection, title: info.shortTitle, route: info.route, total: hits.length, hits: hits.slice(0, groupLimit) });
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
    'yemeni-figures',
    getYemeniFigures(locale)
      .filter((item) => matches(`${item.title} ${item.originalTitle} ${item.excerpt} ${item.year ?? ''}`, needle))
      .map((item) => textHit(item, 'figure', 'yemeni-figures'))
  );

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

/** Suggested search terms (shown under the unified search box); editable from the admin. */
export function getLibrarySearchSuggestions(locale: Locale): string[] {
  return getLibraryContent(locale).searchSuggestions;
}

/** True when the free-text date column holds something `new Date()` can parse. */
function hasValidDate(date: string) {
  return Boolean(date) && !Number.isNaN(Date.parse(date));
}

/** Latest items across articles, stories, and dated documents, newest first. */
export function getLatestLibraryItems(
  locale: Locale,
  limit = getLibraryContent(locale).layout.latestLimit,
): LibrarySearchHit[] {
  const hits: LibrarySearchHit[] = [
    ...getForumArticles(locale).map((item) => textHit(item, 'article', 'forum')),
    ...getSuccessStories(locale).map((item) => textHit(item, 'story', 'success-stories')),
    ...getYemeniFigures(locale).map((item) => textHit(item, 'figure', 'yemeni-figures')),
  ];

  for (const slug of documentCollectionSlugs) {
    const info = collectionSettings[slug];
    if (!info.documentCollection) continue;
    hits.push(
      ...getDocuments(info.documentCollection, locale)
        .filter((item) => hasValidDate(item.date))
        .map((item) => documentHit(item, slug))
    );
  }

  // Undated / unparsable dates are left out rather than mis-sorted.
  return hits
    .filter((hit) => hasValidDate(hit.date))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
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
export function getAdjacentTextItems(locale: Locale, type: LibraryTextCollectionSlug, slug: string) {
  const items = getTextItems(locale, type);
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

export function getDocumentSeriesKey(item: Pick<LibraryDocumentItem, 'title' | 'series'>) {
  // An editor-set series wins; the title prefix is only a fallback for static items.
  const explicit = item.series?.trim();
  if (explicit) return explicit;
  const match = (item.title ?? '').match(/^(.+?)\s+[–—-]\s+/);
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
      imageAlt: heroText[locale].title,
    },
    labels: labels[locale],
    collections: buildCollections(locale),
    searchSuggestions: searchSuggestions[locale],
    layout: { ...defaultLayout },
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

export function staticYemeniFigures(locale: Locale): LibraryTextItem[] {
  return libraryCatalog.yemeniFigures.map((item) => localizeTextItem(item, locale, 'yemeni-figures'));
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
