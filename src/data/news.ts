import { cmsNews, cmsPageContent } from '@/cms/adapters';
import type { Locale } from '@/i18n/content';
import type { BreadcrumbItem } from '@/data/about';
import { archivedNewsArticles } from './newsArchive.generated';

type LocalizedString = Partial<Record<Locale, string>> & { ar: string };
type LocalizedParagraphs = Partial<Record<Locale, string[]>> & { ar: string[] };

export type NewsGalleryImage = {
  id: string;
  image: string;
  thumbnail: string;
  sourceUrl: string;
  title: LocalizedString;
  imageAlt: LocalizedString;
  width: number;
  height: number;
};

export type NewsArticle = {
  id: string;
  slug: string;
  sourceSlug: string;
  sourceUrl: string;
  publishedAt: string;
  year: number;
  sourceLanguage: 'ar';
  category: LocalizedString;
  title: LocalizedString;
  excerpt: LocalizedString;
  content: LocalizedParagraphs;
  image: string;
  imageAlt: LocalizedString;
  gallery: NewsGalleryImage[];
  sourceImages: string[];
};

export type LocalizedNewsArticle = {
  id: string;
  slug: string;
  route: string;
  sourceSlug: string;
  sourceUrl: string;
  publishedAt: string;
  year: number;
  /** ISO-639 code of the language the article was originally written in. */
  sourceLanguage: string;
  /** Set from the admin "featured" toggle; the spotlight card honours it. */
  featured?: boolean;
  category: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  imageAlt: string;
  gallery: {
    id: string;
    image: string;
    thumbnail: string;
    sourceUrl: string;
    title: string;
    imageAlt: string;
    width: number;
    height: number;
  }[];
  sourceImages: string[];
};

export type NewsLabels = {
  home: string;
  news: string;
  eyebrow: string;
  heroDescription: string;
  featured: string;
  latest: string;
  readArticle: string;
  readMore: string;
  allNews: string;
  search: string;
  searchPlaceholder: string;
  clearSearch: string;
  allYears: string;
  results: string;
  noResults: string;
  sourceLanguage: string;
  originalLanguageNote: string;
  related: string;
  backToNews: string;
  share: string;
  copyLink: string;
  linkCopied: string;
  whatsapp: string;
  facebook: string;
  x: string;
  gallery: string;
  loadPage: string;
  // The `news-page` CMS row stores the labels at its root, so the hero, SEO
  // and layout groups declared in pageSchema nest inside the labels object.
  hero: { image?: string; imageAlt?: string };
  seo: { title?: string; description?: string; canonical?: string };
  layout: { sideCount: number; pageSize: number; relatedCount: number };
};

/** Defaults for the display counts; editable in the admin "Display counts" section. */
export const defaultNewsLayout = { sideCount: 2, pageSize: 9, relatedCount: 3 } as const;

export const newsRoutes = {
  index: '/news',
  detail: (slug: string) => `/news/${slug}`,
} as const;

export const newsLabels: Record<Locale, NewsLabels> = {
  ar: {
    home: 'الرئيسية',
    news: 'الأخبار',
    eyebrow: 'آخر أخبار الوقف',
    heroDescription: 'تابع آخر أخبار وقف أويس القرني وبرامجه ومبادراته وفعالياته.',
    featured: 'أحدث الأخبار',
    latest: 'جميع الأخبار',
    readArticle: 'اقرأ الخبر',
    readMore: 'اقرأ المزيد',
    allNews: 'عرض جميع الأخبار',
    search: 'بحث',
    searchPlaceholder: 'ابحث بالعنوان أو الوصف أو السنة',
    clearSearch: 'مسح البحث',
    allYears: 'كل السنوات',
    results: 'نتيجة',
    noResults: 'لا توجد أخبار مطابقة لبحثك.',
    sourceLanguage: 'لغة المصدر',
    originalLanguageNote: 'النص الكامل محفوظ بصيغته العربية الأصلية.',
    related: 'أخبار ذات صلة',
    backToNews: 'العودة إلى الأخبار',
    share: 'مشاركة الخبر',
    copyLink: 'نسخ الرابط',
    linkCopied: 'تم نسخ الرابط',
    whatsapp: 'واتساب',
    facebook: 'فيسبوك',
    x: 'منصة X',
    gallery: 'معرض صور الخبر',
    loadPage: 'الصفحة',
    hero: {},
    seo: {},
    layout: { ...defaultNewsLayout },
  },
  en: {
    home: 'Home',
    news: 'News',
    eyebrow: 'Latest Waqf News',
    heroDescription: 'Follow the latest news from Veysel Karani Waqf, its programs, initiatives, and events.',
    featured: 'Latest News',
    latest: 'All News',
    readArticle: 'Read Article',
    readMore: 'Read More',
    allNews: 'View All News',
    search: 'Search',
    searchPlaceholder: 'Search by title, description, or year',
    clearSearch: 'Clear search',
    allYears: 'All years',
    results: 'results',
    noResults: 'No news matches your search.',
    sourceLanguage: 'Source Language',
    originalLanguageNote: 'The full article text is preserved in its original Arabic.',
    related: 'Related News',
    backToNews: 'Back to News',
    share: 'Share Article',
    copyLink: 'Copy Link',
    linkCopied: 'Link copied',
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    x: 'X',
    gallery: 'Article Gallery',
    loadPage: 'Page',
    hero: {},
    seo: {},
    layout: { ...defaultNewsLayout },
  },
  tr: {
    home: 'Ana Sayfa',
    news: 'Haberler',
    eyebrow: 'Vakfın Son Haberleri',
    heroDescription: 'Veysel Karani Vakfı’nın programları, girişimleri ve etkinliklerinden son haberleri takip edin.',
    featured: 'Son Haber',
    latest: 'Tüm Haberler',
    readArticle: 'Haberi Oku',
    readMore: 'Devamını Oku',
    allNews: 'Tüm Haberleri Gör',
    search: 'Ara',
    searchPlaceholder: 'Başlık, açıklama veya yıla göre ara',
    clearSearch: 'Aramayı temizle',
    allYears: 'Tüm yıllar',
    results: 'sonuç',
    noResults: 'Aramanızla eşleşen haber yok.',
    sourceLanguage: 'Kaynak dili',
    originalLanguageNote: 'Haber metninin tamamı orijinal Arapça haliyle korunmuştur.',
    related: 'İlgili Haberler',
    backToNews: 'Haberlere Dön',
    share: 'Haberi Paylaş',
    copyLink: 'Bağlantıyı Kopyala',
    linkCopied: 'Bağlantı kopyalandı',
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    x: 'X',
    gallery: 'Haber Galerisi',
    loadPage: 'Sayfa',
    hero: {},
    seo: {},
    layout: { ...defaultNewsLayout },
  },
};

/** Human-readable name of an article's source language, in the UI language. */
const sourceLanguageNames: Record<Locale, Record<string, string>> = {
  ar: { ar: 'العربية', en: 'الإنجليزية', tr: 'التركية' },
  en: { ar: 'Arabic', en: 'English', tr: 'Turkish' },
  tr: { ar: 'Arapça', en: 'İngilizce', tr: 'Türkçe' },
};

export function getSourceLanguageName(locale: Locale, code: string | undefined) {
  if (!code) return '';
  return sourceLanguageNames[locale][code] ?? code;
}

const curatedNewsArticles = [
  {
    "id": "24011",
    "slug": "shura-member-condolences-sheikh-hamad",
    "sourceSlug": "shura-member-condolences-sheikh-hamad-bin-khalifa",
    "sourceUrl": "https://veysvakfi.org/shura-member-condolences-sheikh-hamad-bin-khalifa/",
    "publishedAt": "2026-07-15T19:06:25",
    "year": 2026,
    "sourceLanguage": "ar",
    "category": {
      "ar": "الأخبار",
      "en": "News",
      "tr": "Haberler"
    },
    "title": {
      "ar": "عضو مجلس الشورى ورئيس وقف أويس القرني يقدّم واجب العزاء في وفاة الأمير الوالد الشيخ حمد بن خليفة آل ثاني",
      "en": "Shura Council member and Veysel Karani Waqf president offers condolences on the passing of Sheikh Hamad bin Khalifa Al Thani",
      "tr": "Şura Meclisi üyesi ve Veysel Karani Vakfı Başkanı, Şeyh Hamad bin Halife Al Sani için taziyelerini sundu"
    },
    "excerpt": {
      "ar": "قدّم رئيس وقف أويس القرني عضو مجلس الشورى الأستاذ صلاح باتيس واجب العزاء في وفاة الأمير الوالد سمو الشيخ حمد بن خليفة آل ثاني، وذلك في القنصلية العامة لدولة قطر بمدينة إسطنبول. وعبّر الأستاذ صلاح باتيس عن خالص التعازي وصادق المواساة لدولة قطر الشقيقة، قيادةً وشعبًا، ولأسرة آل ثاني الكريمة، سائلاً الله تعالى أن يتغمد",
      "en": "Salah Batiss offered condolences at the Consulate General of Qatar in Istanbul on the passing of Sheikh Hamad bin Khalifa Al Thani.",
      "tr": "Salah Batiss, Şeyh Hamad bin Halife Al Sani’nin vefatı dolayısıyla İstanbul’daki Katar Başkonsolosluğunda taziyelerini sundu."
    },
    "content": {
      "ar": [
        "قدّم رئيس وقف أويس القرني عضو مجلس الشورى الأستاذ صلاح باتيس واجب العزاء في وفاة الأمير الوالد سمو الشيخ حمد بن خليفة آل ثاني، وذلك في القنصلية العامة لدولة قطر بمدينة إسطنبول.",
        "وعبّر الأستاذ صلاح باتيس عن خالص التعازي وصادق المواساة لدولة قطر الشقيقة، قيادةً وشعبًا، ولأسرة آل ثاني الكريمة، سائلاً الله تعالى أن يتغمد الفقيد بواسع رحمته، وأن يسكنه فسيح جناته، وأن يجزيه خير الجزاء على ما قدّمه لوطنه وأمته.",
        "وأكد أن رحيل الأمير الوالد يمثل خسارة كبيرة لقطر والأمة العربية والإسلامية، مستذكرًا مسيرته في خدمة بلاده ودوره البارز في نهضتها وتطورها.",
        "إنا لله وإنا إليه راجعون",
        "وقفأويسالقرني #وقفنامعالنهضة_اليمن #قطر"
      ],
      "en": [
        "قدّم رئيس وقف أويس القرني عضو مجلس الشورى الأستاذ صلاح باتيس واجب العزاء في وفاة الأمير الوالد سمو الشيخ حمد بن خليفة آل ثاني، وذلك في القنصلية العامة لدولة قطر بمدينة إسطنبول.",
        "وعبّر الأستاذ صلاح باتيس عن خالص التعازي وصادق المواساة لدولة قطر الشقيقة، قيادةً وشعبًا، ولأسرة آل ثاني الكريمة، سائلاً الله تعالى أن يتغمد الفقيد بواسع رحمته، وأن يسكنه فسيح جناته، وأن يجزيه خير الجزاء على ما قدّمه لوطنه وأمته.",
        "وأكد أن رحيل الأمير الوالد يمثل خسارة كبيرة لقطر والأمة العربية والإسلامية، مستذكرًا مسيرته في خدمة بلاده ودوره البارز في نهضتها وتطورها.",
        "إنا لله وإنا إليه راجعون",
        "وقفأويسالقرني #وقفنامعالنهضة_اليمن #قطر"
      ],
      "tr": [
        "قدّم رئيس وقف أويس القرني عضو مجلس الشورى الأستاذ صلاح باتيس واجب العزاء في وفاة الأمير الوالد سمو الشيخ حمد بن خليفة آل ثاني، وذلك في القنصلية العامة لدولة قطر بمدينة إسطنبول.",
        "وعبّر الأستاذ صلاح باتيس عن خالص التعازي وصادق المواساة لدولة قطر الشقيقة، قيادةً وشعبًا، ولأسرة آل ثاني الكريمة، سائلاً الله تعالى أن يتغمد الفقيد بواسع رحمته، وأن يسكنه فسيح جناته، وأن يجزيه خير الجزاء على ما قدّمه لوطنه وأمته.",
        "وأكد أن رحيل الأمير الوالد يمثل خسارة كبيرة لقطر والأمة العربية والإسلامية، مستذكرًا مسيرته في خدمة بلاده ودوره البارز في نهضتها وتطورها.",
        "إنا لله وإنا إليه راجعون",
        "وقفأويسالقرني #وقفنامعالنهضة_اليمن #قطر"
      ]
    },
    "image": "/news/01-shura-member-condolences-sheikh-hamad-1.jpeg",
    "imageAlt": {
      "ar": "عضو مجلس الشورى ورئيس وقف أويس القرني يقدّم واجب العزاء في وفاة الأمير الوالد الشيخ حمد بن خليفة آل ثاني",
      "en": "Shura Council member and Veysel Karani Waqf president offers condolences on the passing of Sheikh Hamad bin Khalifa Al Thani",
      "tr": "Şura Meclisi üyesi ve Veysel Karani Vakfı Başkanı, Şeyh Hamad bin Halife Al Sani için taziyelerini sundu"
    },
    "gallery": [
      {
        "id": "shura-member-condolences-sheikh-hamad-1",
        "image": "/news/01-shura-member-condolences-sheikh-hamad-2.jpeg",
        "thumbnail": "/news/01-shura-member-condolences-sheikh-hamad-2.jpeg",
        "sourceUrl": "https://veysvakfi.org/shura-member-condolences-sheikh-hamad-bin-khalifa/",
        "title": {
          "ar": "عضو مجلس الشورى ورئيس وقف أويس القرني يقدّم واجب العزاء في وفاة الأمير الوالد الشيخ حمد بن خليفة آل ثاني - صورة 1",
          "en": "Shura Council member and Veysel Karani Waqf president offers condolences on the passing of Sheikh Hamad bin Khalifa Al Thani - image 1",
          "tr": "Şura Meclisi üyesi ve Veysel Karani Vakfı Başkanı, Şeyh Hamad bin Halife Al Sani için taziyelerini sundu - görsel 1"
        },
        "imageAlt": {
          "ar": "عضو مجلس الشورى ورئيس وقف أويس القرني يقدّم واجب العزاء في وفاة الأمير الوالد الشيخ حمد بن خليفة آل ثاني - صورة 1",
          "en": "Shura Council member and Veysel Karani Waqf president offers condolences on the passing of Sheikh Hamad bin Khalifa Al Thani - image 1",
          "tr": "Şura Meclisi üyesi ve Veysel Karani Vakfı Başkanı, Şeyh Hamad bin Halife Al Sani için taziyelerini sundu - görsel 1"
        },
        "width": 1200,
        "height": 800
      }
    ],
    "sourceImages": [
      "/media/.jpg-scaled-ed6ad55b.jpeg",
      "/media/.jpg-1024x683-c0cd6554.jpeg"
    ]
  },
  {
    "id": "24021",
    "slug": "democracy-national-unity-day",
    "sourceSlug": "owais-waqf-democracy-and-national-unity-day",
    "sourceUrl": "https://veysvakfi.org/owais-waqf-democracy-and-national-unity-day/",
    "publishedAt": "2026-07-15T10:11:00",
    "year": 2026,
    "sourceLanguage": "ar",
    "category": {
      "ar": "الأخبار",
      "en": "News",
      "tr": "Haberler"
    },
    "title": {
      "ar": "وقف أويس القرني يحيي الذكرى العاشرة ليوم الديمقراطية والوحدة الوطنية في تركيا",
      "en": "Veysel Karani Waqf marks the tenth anniversary of Turkey’s Democracy and National Unity Day",
      "tr": "Veysel Karani Vakfı, Demokrasi ve Milli Birlik Günü’nün onuncu yıl dönümünü andı"
    },
    "excerpt": {
      "ar": "في الذكرى العاشرة ليوم الديمقراطية والوحدة الوطنية، يستذكر وقف أويس القرني بكل تقدير تضحيات الشعب التركي في حماية وطنه وإرادته ووحدته.ونترحم على أرواح الشهداء، ونعبر عن امتناننا للجرحى، سائلين الله أن يحفظ الجمهورية التركية وشعبها، وأن يديم عليها الأمن والوحدة والاستقرار. 15 Temmuz Demokrasi ve Millî Birlik Günü’nün 10. yıl dönümünde, aziz milletimizin iradesine, birlik",
      "en": "On the tenth anniversary of Democracy and National Unity Day, the waqf honored the sacrifices of the Turkish people and prayed for lasting security and unity.",
      "tr": "Vakif, Demokrasi ve Milli Birlik Günü’nün onuncu yılında Türk halkının fedakarlıklarını saygıyla andı ve birlik ile huzurun daim olması için dua etti."
    },
    "content": {
      "ar": [
        "في الذكرى العاشرة ليوم الديمقراطية والوحدة الوطنية، يستذكر وقف أويس القرني بكل تقدير تضحيات الشعب التركي في حماية وطنه وإرادته ووحدته.ونترحم على أرواح الشهداء، ونعبر عن امتناننا للجرحى، سائلين الله أن يحفظ الجمهورية التركية وشعبها، وأن يديم عليها الأمن والوحدة والاستقرار.",
        "15 Temmuz Demokrasi ve Millî Birlik Günü’nün 10. yıl dönümünde, aziz milletimizin iradesine, birlik ve beraberliğine sahip çıkma kararlılığını bir kez daha saygıyla selamlıyoruz.",
        "Veysel Karani Vakfı olarak, vatanı ve milleti uğruna canlarını feda eden şehitlerimizi rahmet ve minnetle anıyor, kahraman gazilerimize şükranlarımızı sunuyoruz.",
        "Birliğimiz, beraberliğimiz ve huzurumuz daim olsun 🇾🇪🇹🇷.",
        "15Temmuz",
        "يومالديمقراطيةوالوحدة_الوطنية",
        "وقفأويسالقرني"
      ],
      "en": [
        "في الذكرى العاشرة ليوم الديمقراطية والوحدة الوطنية، يستذكر وقف أويس القرني بكل تقدير تضحيات الشعب التركي في حماية وطنه وإرادته ووحدته.ونترحم على أرواح الشهداء، ونعبر عن امتناننا للجرحى، سائلين الله أن يحفظ الجمهورية التركية وشعبها، وأن يديم عليها الأمن والوحدة والاستقرار.",
        "15 Temmuz Demokrasi ve Millî Birlik Günü’nün 10. yıl dönümünde, aziz milletimizin iradesine, birlik ve beraberliğine sahip çıkma kararlılığını bir kez daha saygıyla selamlıyoruz.",
        "Veysel Karani Vakfı olarak, vatanı ve milleti uğruna canlarını feda eden şehitlerimizi rahmet ve minnetle anıyor, kahraman gazilerimize şükranlarımızı sunuyoruz.",
        "Birliğimiz, beraberliğimiz ve huzurumuz daim olsun 🇾🇪🇹🇷.",
        "15Temmuz",
        "يومالديمقراطيةوالوحدة_الوطنية",
        "وقفأويسالقرني"
      ],
      "tr": [
        "في الذكرى العاشرة ليوم الديمقراطية والوحدة الوطنية، يستذكر وقف أويس القرني بكل تقدير تضحيات الشعب التركي في حماية وطنه وإرادته ووحدته.ونترحم على أرواح الشهداء، ونعبر عن امتناننا للجرحى، سائلين الله أن يحفظ الجمهورية التركية وشعبها، وأن يديم عليها الأمن والوحدة والاستقرار.",
        "15 Temmuz Demokrasi ve Millî Birlik Günü’nün 10. yıl dönümünde, aziz milletimizin iradesine, birlik ve beraberliğine sahip çıkma kararlılığını bir kez daha saygıyla selamlıyoruz.",
        "Veysel Karani Vakfı olarak, vatanı ve milleti uğruna canlarını feda eden şehitlerimizi rahmet ve minnetle anıyor, kahraman gazilerimize şükranlarımızı sunuyoruz.",
        "Birliğimiz, beraberliğimiz ve huzurumuz daim olsun 🇾🇪🇹🇷.",
        "15Temmuz",
        "يومالديمقراطيةوالوحدة_الوطنية",
        "وقفأويسالقرني"
      ]
    },
    "image": "/news/02-democracy-national-unity-day-1.jpeg",
    "imageAlt": {
      "ar": "وقف أويس القرني يحيي الذكرى العاشرة ليوم الديمقراطية والوحدة الوطنية في تركيا",
      "en": "Veysel Karani Waqf marks the tenth anniversary of Turkey’s Democracy and National Unity Day",
      "tr": "Veysel Karani Vakfı, Demokrasi ve Milli Birlik Günü’nün onuncu yıl dönümünü andı"
    },
    "gallery": [
      {
        "id": "democracy-national-unity-day-1",
        "image": "/news/02-democracy-national-unity-day-2.jpeg",
        "thumbnail": "/news/02-democracy-national-unity-day-2.jpeg",
        "sourceUrl": "https://veysvakfi.org/owais-waqf-democracy-and-national-unity-day/",
        "title": {
          "ar": "وقف أويس القرني يحيي الذكرى العاشرة ليوم الديمقراطية والوحدة الوطنية في تركيا - صورة 1",
          "en": "Veysel Karani Waqf marks the tenth anniversary of Turkey’s Democracy and National Unity Day - image 1",
          "tr": "Veysel Karani Vakfı, Demokrasi ve Milli Birlik Günü’nün onuncu yıl dönümünü andı - görsel 1"
        },
        "imageAlt": {
          "ar": "وقف أويس القرني يحيي الذكرى العاشرة ليوم الديمقراطية والوحدة الوطنية في تركيا - صورة 1",
          "en": "Veysel Karani Waqf marks the tenth anniversary of Turkey’s Democracy and National Unity Day - image 1",
          "tr": "Veysel Karani Vakfı, Demokrasi ve Milli Birlik Günü’nün onuncu yıl dönümünü andı - görsel 1"
        },
        "width": 1200,
        "height": 800
      }
    ],
    "sourceImages": [
      "/media/file-9aa999b6.jpeg",
      "/media/819x1024-8fb5cb57.jpeg"
    ]
  },
  {
    "id": "24016",
    "slug": "qatar-condolences-sheikh-hamad",
    "sourceSlug": "owais-waqf-condolences-sheikh-hamad-bin-khalifa",
    "sourceUrl": "https://veysvakfi.org/owais-waqf-condolences-sheikh-hamad-bin-khalifa/",
    "publishedAt": "2026-07-13T19:09:54",
    "year": 2026,
    "sourceLanguage": "ar",
    "category": {
      "ar": "الأخبار",
      "en": "News",
      "tr": "Haberler"
    },
    "title": {
      "ar": "وقف أويس القرني يعزّي دولة قطر في وفاة الأمير الوالد الشيخ حمد بن خليفة آل ثاني",
      "en": "Veysel Karani Waqf extends condolences to Qatar on the passing of Sheikh Hamad bin Khalifa Al Thani",
      "tr": "Veysel Karani Vakfı, Şeyh Hamad bin Halife Al Sani’nin vefatı nedeniyle Katar’a taziyelerini iletti"
    },
    "excerpt": {
      "ar": "إنا لله وإنا إليه راجعون بقلوب مؤمنة بقضاء الله وقدره تلقينا نبأ وفاةسمو الأمير الوالد الشيخ حمد بن خليفة آل ثاني رحمه الله وبهذا المصاب الجلل، تتقدم كافة هيئات وقف أويس القرني ومنتسبيه بخالص العزاء والمواساة لدولة قطر قيادةً وشعبًا، وللأمة العربية والإسلامية، نسأل الله أن يتغمده بواسع رحمته، وأن يسكنه الفردوس الأعلى من الجنة.",
      "en": "The waqf extended sincere condolences to Qatar, its leadership and people, and to the Arab and Islamic nation.",
      "tr": "Vakıf, Katar Devleti’ne, yönetimine ve halkına; ayrıca Arap ve İslam dünyasına en içten taziyelerini sundu."
    },
    "content": {
      "ar": [
        "إنا لله وإنا إليه راجعون\nبقلوب مؤمنة بقضاء الله وقدره تلقينا نبأ وفاة\nسمو الأمير الوالد الشيخ حمد بن خليفة آل ثاني رحمه الله",
        "وبهذا المصاب الجلل، تتقدم كافة هيئات وقف أويس القرني ومنتسبيه بخالص العزاء والمواساة لدولة قطر قيادةً وشعبًا، وللأمة العربية والإسلامية، نسأل الله أن يتغمده بواسع رحمته، وأن يسكنه الفردوس الأعلى من الجنة.",
        "وقفأويسالقرني #وقفنامعالنهضة_اليمن"
      ],
      "en": [
        "إنا لله وإنا إليه راجعون\nبقلوب مؤمنة بقضاء الله وقدره تلقينا نبأ وفاة\nسمو الأمير الوالد الشيخ حمد بن خليفة آل ثاني رحمه الله",
        "وبهذا المصاب الجلل، تتقدم كافة هيئات وقف أويس القرني ومنتسبيه بخالص العزاء والمواساة لدولة قطر قيادةً وشعبًا، وللأمة العربية والإسلامية، نسأل الله أن يتغمده بواسع رحمته، وأن يسكنه الفردوس الأعلى من الجنة.",
        "وقفأويسالقرني #وقفنامعالنهضة_اليمن"
      ],
      "tr": [
        "إنا لله وإنا إليه راجعون\nبقلوب مؤمنة بقضاء الله وقدره تلقينا نبأ وفاة\nسمو الأمير الوالد الشيخ حمد بن خليفة آل ثاني رحمه الله",
        "وبهذا المصاب الجلل، تتقدم كافة هيئات وقف أويس القرني ومنتسبيه بخالص العزاء والمواساة لدولة قطر قيادةً وشعبًا، وللأمة العربية والإسلامية، نسأل الله أن يتغمده بواسع رحمته، وأن يسكنه الفردوس الأعلى من الجنة.",
        "وقفأويسالقرني #وقفنامعالنهضة_اليمن"
      ]
    },
    "image": "/news/03-qatar-condolences-sheikh-hamad-1.jpeg",
    "imageAlt": {
      "ar": "وقف أويس القرني يعزّي دولة قطر في وفاة الأمير الوالد الشيخ حمد بن خليفة آل ثاني",
      "en": "Veysel Karani Waqf extends condolences to Qatar on the passing of Sheikh Hamad bin Khalifa Al Thani",
      "tr": "Veysel Karani Vakfı, Şeyh Hamad bin Halife Al Sani’nin vefatı nedeniyle Katar’a taziyelerini iletti"
    },
    "gallery": [
      {
        "id": "qatar-condolences-sheikh-hamad-1",
        "image": "/news/03-qatar-condolences-sheikh-hamad-2.jpeg",
        "thumbnail": "/news/03-qatar-condolences-sheikh-hamad-2.jpeg",
        "sourceUrl": "https://veysvakfi.org/owais-waqf-condolences-sheikh-hamad-bin-khalifa/",
        "title": {
          "ar": "وقف أويس القرني يعزّي دولة قطر في وفاة الأمير الوالد الشيخ حمد بن خليفة آل ثاني - صورة 1",
          "en": "Veysel Karani Waqf extends condolences to Qatar on the passing of Sheikh Hamad bin Khalifa Al Thani - image 1",
          "tr": "Veysel Karani Vakfı, Şeyh Hamad bin Halife Al Sani’nin vefatı nedeniyle Katar’a taziyelerini iletti - görsel 1"
        },
        "imageAlt": {
          "ar": "وقف أويس القرني يعزّي دولة قطر في وفاة الأمير الوالد الشيخ حمد بن خليفة آل ثاني - صورة 1",
          "en": "Veysel Karani Waqf extends condolences to Qatar on the passing of Sheikh Hamad bin Khalifa Al Thani - image 1",
          "tr": "Veysel Karani Vakfı, Şeyh Hamad bin Halife Al Sani’nin vefatı nedeniyle Katar’a taziyelerini iletti - görsel 1"
        },
        "width": 1200,
        "height": 800
      }
    ],
    "sourceImages": [
      "/media/whatsapp-image-2026-07-13-at-15.55.06-7a2c58f4.jpeg",
      "/media/whatsapp-image-2026-07-13-at-15.55.06-576x1024-02665540.jpeg"
    ]
  },
  {
    "id": "23999",
    "slug": "wamy-riyadh-cooperation",
    "sourceSlug": "wamyveyselvisit",
    "sourceUrl": "https://veysvakfi.org/wamyveyselvisit/",
    "publishedAt": "2026-07-07T10:19:57",
    "year": 2026,
    "sourceLanguage": "ar",
    "category": {
      "ar": "الأخبار",
      "en": "News",
      "tr": "Haberler"
    },
    "title": {
      "ar": "عضو مجلس الشورى ورئيس وقف أويس القرني يبحث في الرياض تعزيز التعاون مع الندوة العالمية للشباب الإسلامي",
      "en": "Shura Council member and Veysel Karani Waqf president discusses cooperation with WAMY in Riyadh",
      "tr": "Şura Meclisi üyesi ve Veysel Karani Vakfı Başkanı, Riyad’da WAMY ile iş birliğini görüştü"
    },
    "excerpt": {
      "ar": "التقى عضو مجلس الشورى ورئيس وقف أويس القرني، الأستاذ صلاح باتيس، معالي الدكتور صالح بابعير، الأمين العام للندوة العالمية للشباب الإسلامي، في مقر الأمانة العامة للندوة بمدينة الرياض، لبحث آفاق التعاون المشترك وتطوير الشراكة مع المنظمات والمؤسسات اليمنية الأعضاء في الندوة. وتناول اللقاء عددًا من الموضوعات ذات الاهتمام المشترك، وفي مقدمتها توسيع مجالات التعاون المؤسسي،",
      "en": "Salah Batiss met Dr. Saleh Baabeer at WAMY headquarters in Riyadh to discuss cooperation and institutional partnerships.",
      "tr": "Salah Batiss, Riyad’daki WAMY genel merkezinde Dr. Salih Baabeer ile kurumsal iş birliği ve ortaklık imkanlarını görüştü."
    },
    "content": {
      "ar": [
        "التقى عضو مجلس الشورى ورئيس وقف أويس القرني، الأستاذ صلاح باتيس، معالي الدكتور صالح بابعير، الأمين العام للندوة العالمية للشباب الإسلامي، في مقر الأمانة العامة للندوة بمدينة الرياض، لبحث آفاق التعاون المشترك وتطوير الشراكة مع المنظمات والمؤسسات اليمنية الأعضاء في الندوة.",
        "وتناول اللقاء عددًا من الموضوعات ذات الاهتمام المشترك، وفي مقدمتها توسيع مجالات التعاون المؤسسي، وبناء شراكات أكثر فاعلية تسهم في تحقيق أثر تنموي مستدام، وتعزز من جهود المؤسسات العاملة في خدمة المجتمع اليمني.",
        "وأشاد الأستاذ صلاح باتيس بما تشهده الندوة العالمية للشباب الإسلامي من تحول استراتيجي يركز على تعظيم الأثر وصناعة مستقبل أفضل، معربًا عن تقديره للجهود التي تبذلها الندوة في تطوير برامجها، والارتقاء بأدائها المؤسسي، وتوسيع نطاق أثرها التنموي.",
        "وأكد الجانبان أهمية مواصلة التنسيق وتبادل الخبرات، والعمل على تطوير الشراكات مع المنظمات والمؤسسات اليمنية الحاصلة على عضوية الندوة، بما يسهم في تحقيق الأهداف المشتركة، وتعزيز التنمية المستدامة، وخدمة المجتمع."
      ],
      "en": [
        "التقى عضو مجلس الشورى ورئيس وقف أويس القرني، الأستاذ صلاح باتيس، معالي الدكتور صالح بابعير، الأمين العام للندوة العالمية للشباب الإسلامي، في مقر الأمانة العامة للندوة بمدينة الرياض، لبحث آفاق التعاون المشترك وتطوير الشراكة مع المنظمات والمؤسسات اليمنية الأعضاء في الندوة.",
        "وتناول اللقاء عددًا من الموضوعات ذات الاهتمام المشترك، وفي مقدمتها توسيع مجالات التعاون المؤسسي، وبناء شراكات أكثر فاعلية تسهم في تحقيق أثر تنموي مستدام، وتعزز من جهود المؤسسات العاملة في خدمة المجتمع اليمني.",
        "وأشاد الأستاذ صلاح باتيس بما تشهده الندوة العالمية للشباب الإسلامي من تحول استراتيجي يركز على تعظيم الأثر وصناعة مستقبل أفضل، معربًا عن تقديره للجهود التي تبذلها الندوة في تطوير برامجها، والارتقاء بأدائها المؤسسي، وتوسيع نطاق أثرها التنموي.",
        "وأكد الجانبان أهمية مواصلة التنسيق وتبادل الخبرات، والعمل على تطوير الشراكات مع المنظمات والمؤسسات اليمنية الحاصلة على عضوية الندوة، بما يسهم في تحقيق الأهداف المشتركة، وتعزيز التنمية المستدامة، وخدمة المجتمع."
      ],
      "tr": [
        "التقى عضو مجلس الشورى ورئيس وقف أويس القرني، الأستاذ صلاح باتيس، معالي الدكتور صالح بابعير، الأمين العام للندوة العالمية للشباب الإسلامي، في مقر الأمانة العامة للندوة بمدينة الرياض، لبحث آفاق التعاون المشترك وتطوير الشراكة مع المنظمات والمؤسسات اليمنية الأعضاء في الندوة.",
        "وتناول اللقاء عددًا من الموضوعات ذات الاهتمام المشترك، وفي مقدمتها توسيع مجالات التعاون المؤسسي، وبناء شراكات أكثر فاعلية تسهم في تحقيق أثر تنموي مستدام، وتعزز من جهود المؤسسات العاملة في خدمة المجتمع اليمني.",
        "وأشاد الأستاذ صلاح باتيس بما تشهده الندوة العالمية للشباب الإسلامي من تحول استراتيجي يركز على تعظيم الأثر وصناعة مستقبل أفضل، معربًا عن تقديره للجهود التي تبذلها الندوة في تطوير برامجها، والارتقاء بأدائها المؤسسي، وتوسيع نطاق أثرها التنموي.",
        "وأكد الجانبان أهمية مواصلة التنسيق وتبادل الخبرات، والعمل على تطوير الشراكات مع المنظمات والمؤسسات اليمنية الحاصلة على عضوية الندوة، بما يسهم في تحقيق الأهداف المشتركة، وتعزيز التنمية المستدامة، وخدمة المجتمع."
      ]
    },
    "image": "/news/04-wamy-riyadh-cooperation-1.jpeg",
    "imageAlt": {
      "ar": "عضو مجلس الشورى ورئيس وقف أويس القرني يبحث في الرياض تعزيز التعاون مع الندوة العالمية للشباب الإسلامي",
      "en": "Shura Council member and Veysel Karani Waqf president discusses cooperation with WAMY in Riyadh",
      "tr": "Şura Meclisi üyesi ve Veysel Karani Vakfı Başkanı, Riyad’da WAMY ile iş birliğini görüştü"
    },
    "gallery": [
      {
        "id": "wamy-riyadh-cooperation-1",
        "image": "/news/04-wamy-riyadh-cooperation-2.jpeg",
        "thumbnail": "/news/04-wamy-riyadh-cooperation-2.jpeg",
        "sourceUrl": "https://veysvakfi.org/wamyveyselvisit/",
        "title": {
          "ar": "عضو مجلس الشورى ورئيس وقف أويس القرني يبحث في الرياض تعزيز التعاون مع الندوة العالمية للشباب الإسلامي - صورة 1",
          "en": "Shura Council member and Veysel Karani Waqf president discusses cooperation with WAMY in Riyadh - image 1",
          "tr": "Şura Meclisi üyesi ve Veysel Karani Vakfı Başkanı, Riyad’da WAMY ile iş birliğini görüştü - görsel 1"
        },
        "imageAlt": {
          "ar": "عضو مجلس الشورى ورئيس وقف أويس القرني يبحث في الرياض تعزيز التعاون مع الندوة العالمية للشباب الإسلامي - صورة 1",
          "en": "Shura Council member and Veysel Karani Waqf president discusses cooperation with WAMY in Riyadh - image 1",
          "tr": "Şura Meclisi üyesi ve Veysel Karani Vakfı Başkanı, Riyad’da WAMY ile iş birliğini görüştü - görsel 1"
        },
        "width": 1200,
        "height": 800
      }
    ],
    "sourceImages": [
      "/media/184f04c0-8983-4739-a9dc-dc05b79ce648-0f904d16.jpeg",
      "/media/184f04c0-8983-4739-a9dc-dc05b79ce648-1017x1024-6beef627.jpeg"
    ]
  },
  {
    "id": "23977",
    "slug": "fuad-al-himyari-book-launch",
    "sourceSlug": "fuad-al-himyaribook",
    "sourceUrl": "https://veysvakfi.org/fuad-al-himyaribook/",
    "publishedAt": "2026-07-04T21:00:00",
    "year": 2026,
    "sourceLanguage": "ar",
    "category": {
      "ar": "الأخبار",
      "en": "News",
      "tr": "Haberler"
    },
    "title": {
      "ar": "إسطنبول تحتفي بإرث فؤاد الحميري.. منصة أويس تدشن كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” في الذكرى الأولى لرحيله",
      "en": "Istanbul honors Fuad Al-Himyari’s legacy as Owais Platform launches “From Awakening to Witnessing”",
      "tr": "İstanbul, Fuad el-Himyari’nin mirasını andı; Owais Platformu “Uyanıştan Şahitliğe” kitabını tanıttı"
    },
    "excerpt": {
      "ar": "أقامت منصة أويس التابعة لوقف أويس القرني، مساء يوم الجمعة 3 يوليو 2026 في مدينة إسطنبول، حفل تدشين كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” للأديب والمفكر اليمني الراحل فؤاد الحميري، وذلك تزامنا مع الذكرى الأولى لرحيله، في فعالية ثقافية حملت معاني الوفاء والعرفان لإحدى أبرز القامات الفكرية والأدبية اليمنية.وشهد الحفل",
      "en": "Owais Platform held a book launch in Istanbul for the late Yemeni writer and thinker Fuad Al-Himyari on the first anniversary of his passing.",
      "tr": "Owais Platformu, merhum Yemenli yazar ve düşünür Fuad el-Himyari’nin vefatının birinci yılında İstanbul’da kitap tanıtım programı düzenledi."
    },
    "content": {
      "ar": [
        "أقامت منصة أويس التابعة لوقف أويس القرني، مساء يوم الجمعة 3 يوليو 2026 في مدينة إسطنبول، حفل تدشين كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” للأديب والمفكر اليمني الراحل فؤاد الحميري، وذلك تزامنا مع الذكرى الأولى لرحيله، في فعالية ثقافية حملت معاني الوفاء والعرفان لإحدى أبرز القامات الفكرية والأدبية اليمنية.\nوشهد الحفل حضور نخبة من المفكرين والأدباء والأكاديميين والإعلاميين والبرلمانيين، إلى جانب عدد من الشخصيات الثقافية والاجتماعية، الذين اجتمعوا لاستذكار المسيرة الفكرية والأدبية للراحل، والاحتفاء بإرثه الذي ما يزال حاضرًا في الوعي الثقافي اليمني.\nوافتتح اللقاء بكلمة لرئيس مجلس إدارة وقف أويس القرني، الأستاذ صلاح الدين القياضي، أكد فيها أن تدشين هذا الكتاب ليس مجرد إصدار جديد أو مناسبة لاستذكار شخصية راحلة، بل وفاء لفكرة باقية، وحفظ لإرث فكري يستحق أن يصل إلى الأجيال القادمة.\nوقال القياضي في كلمته: “نحن في وقف أويس القرني نؤمن بأن الوقف لا يحفظ المال فحسب، بل يحفظ العلم والفكرة والذاكرة والقيم، وأن رعاية الإنتاج الفكري، وتوثيق التجارب الملهمة، وإبقاء الكلمة النافعة حية بين الناس، هو أحد وجوه الوقف الحضاري الذي تحتاج إليه أمتنا اليوم.”\nوأشار إلى أن للأستاذ فؤاد الحميري مكانة خاصة في مسيرة الوقف، إذ كان صاحب الصياغة اللفظية لشعاره: “وقفنا معا لنهضة اليمن”، وهو الشعار الذي أصبح معبرا عن رسالة الوقف ورؤيته في بناء الإنسان والإسهام في نهضة الوطن، مؤكدا أن إصدار هذا الكتاب يأتي تقديرا لعطائه الفكري، وحفاظا على أثره العلمي والثقافي.\nوتواصلت فقرات الندوة بكلمة لمحرر الكتاب الأستاذ خالد بريه، استعرض فيها فكرة الكتاب المكوّن من عدة فصول توثق أطروحات الراحل، ومنهجية جمع مادته العلمية، والجهد المبذول في تحريره، موضحا أن الإصدار يضم خلاصة أفكار الأستاذ فؤاد الحميري ورؤاه التي قدمها عبر محاضراته ولقاءاته وبرامجه، لتخرج في عمل متكامل ييسر وصولها إلى القراء، ولا سيما فئة الشباب. مشيرا إلى أن الكتاب يمثل بداية لمشروع توثيق أوسع لإرث الراحل وتدوينه.\nكما ألقى الأستاذ نبيل البكيري كلمة تناول فيها القيمة الفكرية للكتاب، وأهمية إعادة نشر أفكار الراحل في هذه المرحلة، باعتبارها تمثل مشروعا في الوعي والنهضة وتجديد الفكر، فيما تحدث الأستاذ ياسين التميمي عن الجوانب الإنسانية والفكرية في شخصية الأستاذ فؤاد الحميري، مستعرضا محطات من حياته ومسيرته الثقافية، وما تركه من أثر عميق في محيطه الفكري والوطني.\nوشهدت الندوة نقاشات مستفيضة، كان من أبرزها مداخلة الدكتور عبد الرزاق الأشول، رئيس فريق الخبراء بوقف أويس القرني ووزير التربية والتعليم اليمني السابق، إلى جانب مشاركات متعددة من الحاضرين الذين ركزوا على أهمية توثيق هذا النتاج المعرفي وإتاحته للأجيال الجديدة كمرجعية فكرية ملهمة.\nوفي ختام الفعالية، جرى توزيع نسخ من الكتاب على الحضور، في خطوة تهدف إلى توسيع دائرة الاستفادة من مضامينه، وترسيخ حضوره في الأوساط الثقافية والفكرية، بما يخدم رؤية وقف أويس القرني في صون المعرفة الوطنية وإحياء الكلمة النافعة بوصفها أحد أهم روافد النهضة الحضارية."
      ],
      "en": [
        "أقامت منصة أويس التابعة لوقف أويس القرني، مساء يوم الجمعة 3 يوليو 2026 في مدينة إسطنبول، حفل تدشين كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” للأديب والمفكر اليمني الراحل فؤاد الحميري، وذلك تزامنا مع الذكرى الأولى لرحيله، في فعالية ثقافية حملت معاني الوفاء والعرفان لإحدى أبرز القامات الفكرية والأدبية اليمنية.\nوشهد الحفل حضور نخبة من المفكرين والأدباء والأكاديميين والإعلاميين والبرلمانيين، إلى جانب عدد من الشخصيات الثقافية والاجتماعية، الذين اجتمعوا لاستذكار المسيرة الفكرية والأدبية للراحل، والاحتفاء بإرثه الذي ما يزال حاضرًا في الوعي الثقافي اليمني.\nوافتتح اللقاء بكلمة لرئيس مجلس إدارة وقف أويس القرني، الأستاذ صلاح الدين القياضي، أكد فيها أن تدشين هذا الكتاب ليس مجرد إصدار جديد أو مناسبة لاستذكار شخصية راحلة، بل وفاء لفكرة باقية، وحفظ لإرث فكري يستحق أن يصل إلى الأجيال القادمة.\nوقال القياضي في كلمته: “نحن في وقف أويس القرني نؤمن بأن الوقف لا يحفظ المال فحسب، بل يحفظ العلم والفكرة والذاكرة والقيم، وأن رعاية الإنتاج الفكري، وتوثيق التجارب الملهمة، وإبقاء الكلمة النافعة حية بين الناس، هو أحد وجوه الوقف الحضاري الذي تحتاج إليه أمتنا اليوم.”\nوأشار إلى أن للأستاذ فؤاد الحميري مكانة خاصة في مسيرة الوقف، إذ كان صاحب الصياغة اللفظية لشعاره: “وقفنا معا لنهضة اليمن”، وهو الشعار الذي أصبح معبرا عن رسالة الوقف ورؤيته في بناء الإنسان والإسهام في نهضة الوطن، مؤكدا أن إصدار هذا الكتاب يأتي تقديرا لعطائه الفكري، وحفاظا على أثره العلمي والثقافي.\nوتواصلت فقرات الندوة بكلمة لمحرر الكتاب الأستاذ خالد بريه، استعرض فيها فكرة الكتاب المكوّن من عدة فصول توثق أطروحات الراحل، ومنهجية جمع مادته العلمية، والجهد المبذول في تحريره، موضحا أن الإصدار يضم خلاصة أفكار الأستاذ فؤاد الحميري ورؤاه التي قدمها عبر محاضراته ولقاءاته وبرامجه، لتخرج في عمل متكامل ييسر وصولها إلى القراء، ولا سيما فئة الشباب. مشيرا إلى أن الكتاب يمثل بداية لمشروع توثيق أوسع لإرث الراحل وتدوينه.\nكما ألقى الأستاذ نبيل البكيري كلمة تناول فيها القيمة الفكرية للكتاب، وأهمية إعادة نشر أفكار الراحل في هذه المرحلة، باعتبارها تمثل مشروعا في الوعي والنهضة وتجديد الفكر، فيما تحدث الأستاذ ياسين التميمي عن الجوانب الإنسانية والفكرية في شخصية الأستاذ فؤاد الحميري، مستعرضا محطات من حياته ومسيرته الثقافية، وما تركه من أثر عميق في محيطه الفكري والوطني.\nوشهدت الندوة نقاشات مستفيضة، كان من أبرزها مداخلة الدكتور عبد الرزاق الأشول، رئيس فريق الخبراء بوقف أويس القرني ووزير التربية والتعليم اليمني السابق، إلى جانب مشاركات متعددة من الحاضرين الذين ركزوا على أهمية توثيق هذا النتاج المعرفي وإتاحته للأجيال الجديدة كمرجعية فكرية ملهمة.\nوفي ختام الفعالية، جرى توزيع نسخ من الكتاب على الحضور، في خطوة تهدف إلى توسيع دائرة الاستفادة من مضامينه، وترسيخ حضوره في الأوساط الثقافية والفكرية، بما يخدم رؤية وقف أويس القرني في صون المعرفة الوطنية وإحياء الكلمة النافعة بوصفها أحد أهم روافد النهضة الحضارية."
      ],
      "tr": [
        "أقامت منصة أويس التابعة لوقف أويس القرني، مساء يوم الجمعة 3 يوليو 2026 في مدينة إسطنبول، حفل تدشين كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” للأديب والمفكر اليمني الراحل فؤاد الحميري، وذلك تزامنا مع الذكرى الأولى لرحيله، في فعالية ثقافية حملت معاني الوفاء والعرفان لإحدى أبرز القامات الفكرية والأدبية اليمنية.\nوشهد الحفل حضور نخبة من المفكرين والأدباء والأكاديميين والإعلاميين والبرلمانيين، إلى جانب عدد من الشخصيات الثقافية والاجتماعية، الذين اجتمعوا لاستذكار المسيرة الفكرية والأدبية للراحل، والاحتفاء بإرثه الذي ما يزال حاضرًا في الوعي الثقافي اليمني.\nوافتتح اللقاء بكلمة لرئيس مجلس إدارة وقف أويس القرني، الأستاذ صلاح الدين القياضي، أكد فيها أن تدشين هذا الكتاب ليس مجرد إصدار جديد أو مناسبة لاستذكار شخصية راحلة، بل وفاء لفكرة باقية، وحفظ لإرث فكري يستحق أن يصل إلى الأجيال القادمة.\nوقال القياضي في كلمته: “نحن في وقف أويس القرني نؤمن بأن الوقف لا يحفظ المال فحسب، بل يحفظ العلم والفكرة والذاكرة والقيم، وأن رعاية الإنتاج الفكري، وتوثيق التجارب الملهمة، وإبقاء الكلمة النافعة حية بين الناس، هو أحد وجوه الوقف الحضاري الذي تحتاج إليه أمتنا اليوم.”\nوأشار إلى أن للأستاذ فؤاد الحميري مكانة خاصة في مسيرة الوقف، إذ كان صاحب الصياغة اللفظية لشعاره: “وقفنا معا لنهضة اليمن”، وهو الشعار الذي أصبح معبرا عن رسالة الوقف ورؤيته في بناء الإنسان والإسهام في نهضة الوطن، مؤكدا أن إصدار هذا الكتاب يأتي تقديرا لعطائه الفكري، وحفاظا على أثره العلمي والثقافي.\nوتواصلت فقرات الندوة بكلمة لمحرر الكتاب الأستاذ خالد بريه، استعرض فيها فكرة الكتاب المكوّن من عدة فصول توثق أطروحات الراحل، ومنهجية جمع مادته العلمية، والجهد المبذول في تحريره، موضحا أن الإصدار يضم خلاصة أفكار الأستاذ فؤاد الحميري ورؤاه التي قدمها عبر محاضراته ولقاءاته وبرامجه، لتخرج في عمل متكامل ييسر وصولها إلى القراء، ولا سيما فئة الشباب. مشيرا إلى أن الكتاب يمثل بداية لمشروع توثيق أوسع لإرث الراحل وتدوينه.\nكما ألقى الأستاذ نبيل البكيري كلمة تناول فيها القيمة الفكرية للكتاب، وأهمية إعادة نشر أفكار الراحل في هذه المرحلة، باعتبارها تمثل مشروعا في الوعي والنهضة وتجديد الفكر، فيما تحدث الأستاذ ياسين التميمي عن الجوانب الإنسانية والفكرية في شخصية الأستاذ فؤاد الحميري، مستعرضا محطات من حياته ومسيرته الثقافية، وما تركه من أثر عميق في محيطه الفكري والوطني.\nوشهدت الندوة نقاشات مستفيضة، كان من أبرزها مداخلة الدكتور عبد الرزاق الأشول، رئيس فريق الخبراء بوقف أويس القرني ووزير التربية والتعليم اليمني السابق، إلى جانب مشاركات متعددة من الحاضرين الذين ركزوا على أهمية توثيق هذا النتاج المعرفي وإتاحته للأجيال الجديدة كمرجعية فكرية ملهمة.\nوفي ختام الفعالية، جرى توزيع نسخ من الكتاب على الحضور، في خطوة تهدف إلى توسيع دائرة الاستفادة من مضامينه، وترسيخ حضوره في الأوساط الثقافية والفكرية، بما يخدم رؤية وقف أويس القرني في صون المعرفة الوطنية وإحياء الكلمة النافعة بوصفها أحد أهم روافد النهضة الحضارية."
      ]
    },
    "image": "/news/05-fuad-al-himyari-book-launch-1.jpeg",
    "imageAlt": {
      "ar": "إسطنبول تحتفي بإرث فؤاد الحميري.. منصة أويس تدشن كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” في الذكرى الأولى لرحيله",
      "en": "Istanbul honors Fuad Al-Himyari’s legacy as Owais Platform launches “From Awakening to Witnessing”",
      "tr": "İstanbul, Fuad el-Himyari’nin mirasını andı; Owais Platformu “Uyanıştan Şahitliğe” kitabını tanıttı"
    },
    "gallery": [
      {
        "id": "fuad-al-himyari-book-launch-1",
        "image": "/news/05-fuad-al-himyari-book-launch-2.jpeg",
        "thumbnail": "/news/05-fuad-al-himyari-book-launch-2.jpeg",
        "sourceUrl": "https://veysvakfi.org/fuad-al-himyaribook/",
        "title": {
          "ar": "إسطنبول تحتفي بإرث فؤاد الحميري.. منصة أويس تدشن كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” في الذكرى الأولى لرحيله - صورة 1",
          "en": "Istanbul honors Fuad Al-Himyari’s legacy as Owais Platform launches “From Awakening to Witnessing” - image 1",
          "tr": "İstanbul, Fuad el-Himyari’nin mirasını andı; Owais Platformu “Uyanıştan Şahitliğe” kitabını tanıttı - görsel 1"
        },
        "imageAlt": {
          "ar": "إسطنبول تحتفي بإرث فؤاد الحميري.. منصة أويس تدشن كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” في الذكرى الأولى لرحيله - صورة 1",
          "en": "Istanbul honors Fuad Al-Himyari’s legacy as Owais Platform launches “From Awakening to Witnessing” - image 1",
          "tr": "İstanbul, Fuad el-Himyari’nin mirasını andı; Owais Platformu “Uyanıştan Şahitliğe” kitabını tanıttı - görsel 1"
        },
        "width": 1200,
        "height": 800
      },
      {
        "id": "fuad-al-himyari-book-launch-2",
        "image": "/news/05-fuad-al-himyari-book-launch-3.jpeg",
        "thumbnail": "/news/05-fuad-al-himyari-book-launch-3.jpeg",
        "sourceUrl": "https://veysvakfi.org/fuad-al-himyaribook/",
        "title": {
          "ar": "إسطنبول تحتفي بإرث فؤاد الحميري.. منصة أويس تدشن كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” في الذكرى الأولى لرحيله - صورة 2",
          "en": "Istanbul honors Fuad Al-Himyari’s legacy as Owais Platform launches “From Awakening to Witnessing” - image 2",
          "tr": "İstanbul, Fuad el-Himyari’nin mirasını andı; Owais Platformu “Uyanıştan Şahitliğe” kitabını tanıttı - görsel 2"
        },
        "imageAlt": {
          "ar": "إسطنبول تحتفي بإرث فؤاد الحميري.. منصة أويس تدشن كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” في الذكرى الأولى لرحيله - صورة 2",
          "en": "Istanbul honors Fuad Al-Himyari’s legacy as Owais Platform launches “From Awakening to Witnessing” - image 2",
          "tr": "İstanbul, Fuad el-Himyari’nin mirasını andı; Owais Platformu “Uyanıştan Şahitliğe” kitabını tanıttı - görsel 2"
        },
        "width": 1200,
        "height": 800
      },
      {
        "id": "fuad-al-himyari-book-launch-3",
        "image": "/news/05-fuad-al-himyari-book-launch-4.jpeg",
        "thumbnail": "/news/05-fuad-al-himyari-book-launch-4.jpeg",
        "sourceUrl": "https://veysvakfi.org/fuad-al-himyaribook/",
        "title": {
          "ar": "إسطنبول تحتفي بإرث فؤاد الحميري.. منصة أويس تدشن كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” في الذكرى الأولى لرحيله - صورة 3",
          "en": "Istanbul honors Fuad Al-Himyari’s legacy as Owais Platform launches “From Awakening to Witnessing” - image 3",
          "tr": "İstanbul, Fuad el-Himyari’nin mirasını andı; Owais Platformu “Uyanıştan Şahitliğe” kitabını tanıttı - görsel 3"
        },
        "imageAlt": {
          "ar": "إسطنبول تحتفي بإرث فؤاد الحميري.. منصة أويس تدشن كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” في الذكرى الأولى لرحيله - صورة 3",
          "en": "Istanbul honors Fuad Al-Himyari’s legacy as Owais Platform launches “From Awakening to Witnessing” - image 3",
          "tr": "İstanbul, Fuad el-Himyari’nin mirasını andı; Owais Platformu “Uyanıştan Şahitliğe” kitabını tanıttı - görsel 3"
        },
        "width": 1200,
        "height": 800
      },
      {
        "id": "fuad-al-himyari-book-launch-4",
        "image": "/news/05-fuad-al-himyari-book-launch-5.jpeg",
        "thumbnail": "/news/05-fuad-al-himyari-book-launch-5.jpeg",
        "sourceUrl": "https://veysvakfi.org/fuad-al-himyaribook/",
        "title": {
          "ar": "إسطنبول تحتفي بإرث فؤاد الحميري.. منصة أويس تدشن كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” في الذكرى الأولى لرحيله - صورة 4",
          "en": "Istanbul honors Fuad Al-Himyari’s legacy as Owais Platform launches “From Awakening to Witnessing” - image 4",
          "tr": "İstanbul, Fuad el-Himyari’nin mirasını andı; Owais Platformu “Uyanıştan Şahitliğe” kitabını tanıttı - görsel 4"
        },
        "imageAlt": {
          "ar": "إسطنبول تحتفي بإرث فؤاد الحميري.. منصة أويس تدشن كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” في الذكرى الأولى لرحيله - صورة 4",
          "en": "Istanbul honors Fuad Al-Himyari’s legacy as Owais Platform launches “From Awakening to Witnessing” - image 4",
          "tr": "İstanbul, Fuad el-Himyari’nin mirasını andı; Owais Platformu “Uyanıştan Şahitliğe” kitabını tanıttı - görsel 4"
        },
        "width": 1200,
        "height": 800
      },
      {
        "id": "fuad-al-himyari-book-launch-5",
        "image": "/news/05-fuad-al-himyari-book-launch-6.jpeg",
        "thumbnail": "/news/05-fuad-al-himyari-book-launch-6.jpeg",
        "sourceUrl": "https://veysvakfi.org/fuad-al-himyaribook/",
        "title": {
          "ar": "إسطنبول تحتفي بإرث فؤاد الحميري.. منصة أويس تدشن كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” في الذكرى الأولى لرحيله - صورة 5",
          "en": "Istanbul honors Fuad Al-Himyari’s legacy as Owais Platform launches “From Awakening to Witnessing” - image 5",
          "tr": "İstanbul, Fuad el-Himyari’nin mirasını andı; Owais Platformu “Uyanıştan Şahitliğe” kitabını tanıttı - görsel 5"
        },
        "imageAlt": {
          "ar": "إسطنبول تحتفي بإرث فؤاد الحميري.. منصة أويس تدشن كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” في الذكرى الأولى لرحيله - صورة 5",
          "en": "Istanbul honors Fuad Al-Himyari’s legacy as Owais Platform launches “From Awakening to Witnessing” - image 5",
          "tr": "İstanbul, Fuad el-Himyari’nin mirasını andı; Owais Platformu “Uyanıştan Şahitliğe” kitabını tanıttı - görsel 5"
        },
        "width": 1200,
        "height": 800
      },
      {
        "id": "fuad-al-himyari-book-launch-6",
        "image": "/news/05-fuad-al-himyari-book-launch-7.jpeg",
        "thumbnail": "/news/05-fuad-al-himyari-book-launch-7.jpeg",
        "sourceUrl": "https://veysvakfi.org/fuad-al-himyaribook/",
        "title": {
          "ar": "إسطنبول تحتفي بإرث فؤاد الحميري.. منصة أويس تدشن كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” في الذكرى الأولى لرحيله - صورة 6",
          "en": "Istanbul honors Fuad Al-Himyari’s legacy as Owais Platform launches “From Awakening to Witnessing” - image 6",
          "tr": "İstanbul, Fuad el-Himyari’nin mirasını andı; Owais Platformu “Uyanıştan Şahitliğe” kitabını tanıttı - görsel 6"
        },
        "imageAlt": {
          "ar": "إسطنبول تحتفي بإرث فؤاد الحميري.. منصة أويس تدشن كتاب “من الصحوة إلى الشهود: رحلة الوعي والنهضة في زمن التحولات” في الذكرى الأولى لرحيله - صورة 6",
          "en": "Istanbul honors Fuad Al-Himyari’s legacy as Owais Platform launches “From Awakening to Witnessing” - image 6",
          "tr": "İstanbul, Fuad el-Himyari’nin mirasını andı; Owais Platformu “Uyanıştan Şahitliğe” kitabını tanıttı - görsel 6"
        },
        "width": 1200,
        "height": 800
      }
    ],
    "sourceImages": [
      "/media/whatsapp-image-2026-07-04-at-21.49.23-scaled-5a765e1d.jpeg",
      "/media/whatsapp-image-2026-07-04-at-21.49.18-1024x768-b38b6dd0.jpeg",
      "/media/whatsapp-image-2026-07-04-at-21.49.20-1-1024x768-3fba8071.jpeg",
      "/media/whatsapp-image-2026-07-04-at-21.49.20-2-1024x768-9d6d811f.jpeg",
      "/media/whatsapp-image-2026-07-04-at-21.49.22-1024x768-7b0d98d8.jpeg",
      "/media/whatsapp-image-2026-07-04-at-21.49.23-2-1024x768-0d97d7d3.jpeg",
      "/media/whatsapp-image-2026-07-04-at-21.49.23-1024x768-7d195bfe.jpeg"
    ]
  },
  {
    "id": "23955",
    "slug": "hilal-al-ashwal-neuroscience-award",
    "sourceSlug": "%d8%a7%d9%84%d8%a8%d8%b1%d9%88%d9%81%d9%8a%d8%b3%d9%88%d8%b1-%d9%87%d9%84%d8%a7%d9%84-%d8%a7%d9%84%d8%a3%d8%b4%d9%88%d9%84-%d9%8a%d8%ad%d9%82%d9%82-%d8%a5%d9%86%d8%ac%d8%a7%d8%b2%d9%8b%d8%a7-%d8%b9",
    "sourceUrl": "https://veysvakfi.org/%d8%a7%d9%84%d8%a8%d8%b1%d9%88%d9%81%d9%8a%d8%b3%d9%88%d8%b1-%d9%87%d9%84%d8%a7%d9%84-%d8%a7%d9%84%d8%a3%d8%b4%d9%88%d9%84-%d9%8a%d8%ad%d9%82%d9%82-%d8%a5%d9%86%d8%ac%d8%a7%d8%b2%d9%8b%d8%a7-%d8%b9/",
    "publishedAt": "2026-06-05T21:17:00",
    "year": 2026,
    "sourceLanguage": "ar",
    "category": {
      "ar": "الأخبار",
      "en": "News",
      "tr": "Haberler"
    },
    "title": {
      "ar": "البروفيسور هلال الأشول يحقق إنجازًا عالميًا جديدًا في مجال علوم الأعصاب",
      "en": "Professor Hilal Al-Ashwal achieves a new global milestone in neuroscience",
      "tr": "Profesör Hilal el-Aşval sinir bilimlerinde yeni bir küresel başarıya imza attı"
    },
    "excerpt": {
      "ar": "يُهنئ وقف أويس القرني وبرنامج رواد اليمنالبروفيسور هلال الأشولأستاذ علوم الأعصاب في طب الأعصاب بجامعة وايل كورنيل للطب – قطر بمناسبة حصوله على منحة عالمية مرموقة لقيادة مشروع دولي رائد في مجال أبحاث مرض باركنسون. إن هذا الإنجاز العلمي النوعي على مستوى البشرية يُعد مصدر فخر واعتزاز لكل يمني، ويعكس ما يمتلكه الباحث اليمني من",
      "en": "Veysel Karani Waqf and Yemen Pioneers congratulated Professor Hilal Al-Ashwal on receiving a major international grant for Parkinson’s disease research.",
      "tr": "Veysel Karani Vakfı ve Yemen Öncüleri, Profesör Hilal el-Aşval’ı Parkinson araştırmaları alanındaki uluslararası hibesi nedeniyle tebrik etti."
    },
    "content": {
      "ar": [
        "يُهنئ وقف أويس القرني وبرنامج رواد اليمن\nالبروفيسور هلال الأشول\nأستاذ علوم الأعصاب في طب الأعصاب بجامعة وايل كورنيل للطب – قطر",
        "بمناسبة حصوله على منحة عالمية مرموقة لقيادة مشروع دولي رائد في مجال أبحاث مرض باركنسون.",
        "إن هذا الإنجاز العلمي النوعي على مستوى البشرية يُعد مصدر فخر واعتزاز لكل يمني، ويعكس ما يمتلكه الباحث اليمني من كفاءة وقدرة، سيكون لها أثرها في النهوض الحضاري باليمن مستقبلًا بإذن الله تعالى."
      ],
      "en": [
        "يُهنئ وقف أويس القرني وبرنامج رواد اليمن\nالبروفيسور هلال الأشول\nأستاذ علوم الأعصاب في طب الأعصاب بجامعة وايل كورنيل للطب – قطر",
        "بمناسبة حصوله على منحة عالمية مرموقة لقيادة مشروع دولي رائد في مجال أبحاث مرض باركنسون.",
        "إن هذا الإنجاز العلمي النوعي على مستوى البشرية يُعد مصدر فخر واعتزاز لكل يمني، ويعكس ما يمتلكه الباحث اليمني من كفاءة وقدرة، سيكون لها أثرها في النهوض الحضاري باليمن مستقبلًا بإذن الله تعالى."
      ],
      "tr": [
        "يُهنئ وقف أويس القرني وبرنامج رواد اليمن\nالبروفيسور هلال الأشول\nأستاذ علوم الأعصاب في طب الأعصاب بجامعة وايل كورنيل للطب – قطر",
        "بمناسبة حصوله على منحة عالمية مرموقة لقيادة مشروع دولي رائد في مجال أبحاث مرض باركنسون.",
        "إن هذا الإنجاز العلمي النوعي على مستوى البشرية يُعد مصدر فخر واعتزاز لكل يمني، ويعكس ما يمتلكه الباحث اليمني من كفاءة وقدرة، سيكون لها أثرها في النهوض الحضاري باليمن مستقبلًا بإذن الله تعالى."
      ]
    },
    "image": "/news/06-hilal-al-ashwal-neuroscience-award-1.png",
    "imageAlt": {
      "ar": "البروفيسور هلال الأشول يحقق إنجازًا عالميًا جديدًا في مجال علوم الأعصاب",
      "en": "Professor Hilal Al-Ashwal achieves a new global milestone in neuroscience",
      "tr": "Profesör Hilal el-Aşval sinir bilimlerinde yeni bir küresel başarıya imza attı"
    },
    "gallery": [
      {
        "id": "hilal-al-ashwal-neuroscience-award-1",
        "image": "/news/06-hilal-al-ashwal-neuroscience-award-2.jpeg",
        "thumbnail": "/news/06-hilal-al-ashwal-neuroscience-award-2.jpeg",
        "sourceUrl": "https://veysvakfi.org/%d8%a7%d9%84%d8%a8%d8%b1%d9%88%d9%81%d9%8a%d8%b3%d9%88%d8%b1-%d9%87%d9%84%d8%a7%d9%84-%d8%a7%d9%84%d8%a3%d8%b4%d9%88%d9%84-%d9%8a%d8%ad%d9%82%d9%82-%d8%a5%d9%86%d8%ac%d8%a7%d8%b2%d9%8b%d8%a7-%d8%b9/",
        "title": {
          "ar": "البروفيسور هلال الأشول يحقق إنجازًا عالميًا جديدًا في مجال علوم الأعصاب - صورة 1",
          "en": "Professor Hilal Al-Ashwal achieves a new global milestone in neuroscience - image 1",
          "tr": "Profesör Hilal el-Aşval sinir bilimlerinde yeni bir küresel başarıya imza attı - görsel 1"
        },
        "imageAlt": {
          "ar": "البروفيسور هلال الأشول يحقق إنجازًا عالميًا جديدًا في مجال علوم الأعصاب - صورة 1",
          "en": "Professor Hilal Al-Ashwal achieves a new global milestone in neuroscience - image 1",
          "tr": "Profesör Hilal el-Aşval sinir bilimlerinde yeni bir küresel başarıya imza attı - görsel 1"
        },
        "width": 1200,
        "height": 800
      }
    ],
    "sourceImages": [
      "/media/image-eec8f4eb.png",
      "/media/819x1024-95c73a9c.jpeg"
    ]
  },
  {
    "id": "23963",
    "slug": "condolences-former-president-hadi",
    "sourceSlug": "%d9%88%d9%82%d9%81-%d8%a3%d9%88%d9%8a%d8%b3-%d8%a7%d9%84%d9%82%d8%b1%d9%86%d9%8a-%d9%8a%d8%b9%d8%b2%d9%8a-%d9%81%d9%8a-%d9%88%d9%81%d8%a7%d8%a9-%d8%a7%d9%84%d8%b1%d8%a6%d9%8a%d8%b3-%d8%a7%d9%84%d9%8a",
    "sourceUrl": "https://veysvakfi.org/%d9%88%d9%82%d9%81-%d8%a3%d9%88%d9%8a%d8%b3-%d8%a7%d9%84%d9%82%d8%b1%d9%86%d9%8a-%d9%8a%d8%b9%d8%b2%d9%8a-%d9%81%d9%8a-%d9%88%d9%81%d8%a7%d8%a9-%d8%a7%d9%84%d8%b1%d8%a6%d9%8a%d8%b3-%d8%a7%d9%84%d9%8a/",
    "publishedAt": "2026-06-04T12:24:59",
    "year": 2026,
    "sourceLanguage": "ar",
    "category": {
      "ar": "الأخبار",
      "en": "News",
      "tr": "Haberler"
    },
    "title": {
      "ar": "وقف أويس القرني يعزي في وفاة الرئيس اليمني السابق عبدربه منصور هادي",
      "en": "Veysel Karani Waqf offers condolences on the passing of former Yemeni President Abdrabbuh Mansur Hadi",
      "tr": "Veysel Karani Vakfı, eski Yemen Cumhurbaşkanı Abdrabbuh Mansur Hadi’nin vefatı için taziyede bulundu"
    },
    "excerpt": {
      "ar": "قدّم رئيس مجلس إدارة وقف أويس القرني صلاح الدين القياضي، باسم هيئات الوقف وكافة منتسبيه، واجب العزاء في وفاة الرئيس اليمني السابق عبدربه منصور هادي، وذلك في مقر الجالية اليمنية بمدينة إسطنبول، حيث أقامت سفارة الجمهورية اليمنية مجلس العزاء بحضور سعادة السفير اليمني في أنقرة الأستاذ محمد صالح طريق. وخلال الزيارة، دوّن رئيس مجلس الإدارة",
      "en": "Salah Al-Qiyadi offered condolences on behalf of the waqf bodies and members at the Yemeni community headquarters in Istanbul.",
      "tr": "Salah el-Kıyadi, vakıf heyetleri ve mensupları adına İstanbul’daki Yemen topluluğu merkezinde taziyelerini sundu."
    },
    "content": {
      "ar": [
        "قدّم رئيس مجلس إدارة وقف أويس القرني صلاح الدين القياضي، باسم هيئات الوقف وكافة منتسبيه، واجب العزاء في وفاة الرئيس اليمني السابق عبدربه منصور هادي، وذلك في مقر الجالية اليمنية بمدينة إسطنبول، حيث أقامت سفارة الجمهورية اليمنية مجلس العزاء بحضور سعادة السفير اليمني في أنقرة الأستاذ محمد صالح طريق. وخلال الزيارة، دوّن رئيس مجلس الإدارة كلمة في سجل التعازي، عبّر فيها عن خالص المواساة وصادق التعازي إلى أسرة الفقيد وذويه، وإلى القيادة اليمنية والشعب اليمني كافة، سائلاً الله تعالى أن يتغمد الفقيد بواسع رحمته، وأن يسكنه فسيح جناته، وأن يلهم أهله ومحبيه الصبر والسلوان. إنا لله وإنا إليه راجعون"
      ],
      "en": [
        "قدّم رئيس مجلس إدارة وقف أويس القرني صلاح الدين القياضي، باسم هيئات الوقف وكافة منتسبيه، واجب العزاء في وفاة الرئيس اليمني السابق عبدربه منصور هادي، وذلك في مقر الجالية اليمنية بمدينة إسطنبول، حيث أقامت سفارة الجمهورية اليمنية مجلس العزاء بحضور سعادة السفير اليمني في أنقرة الأستاذ محمد صالح طريق. وخلال الزيارة، دوّن رئيس مجلس الإدارة كلمة في سجل التعازي، عبّر فيها عن خالص المواساة وصادق التعازي إلى أسرة الفقيد وذويه، وإلى القيادة اليمنية والشعب اليمني كافة، سائلاً الله تعالى أن يتغمد الفقيد بواسع رحمته، وأن يسكنه فسيح جناته، وأن يلهم أهله ومحبيه الصبر والسلوان. إنا لله وإنا إليه راجعون"
      ],
      "tr": [
        "قدّم رئيس مجلس إدارة وقف أويس القرني صلاح الدين القياضي، باسم هيئات الوقف وكافة منتسبيه، واجب العزاء في وفاة الرئيس اليمني السابق عبدربه منصور هادي، وذلك في مقر الجالية اليمنية بمدينة إسطنبول، حيث أقامت سفارة الجمهورية اليمنية مجلس العزاء بحضور سعادة السفير اليمني في أنقرة الأستاذ محمد صالح طريق. وخلال الزيارة، دوّن رئيس مجلس الإدارة كلمة في سجل التعازي، عبّر فيها عن خالص المواساة وصادق التعازي إلى أسرة الفقيد وذويه، وإلى القيادة اليمنية والشعب اليمني كافة، سائلاً الله تعالى أن يتغمد الفقيد بواسع رحمته، وأن يسكنه فسيح جناته، وأن يلهم أهله ومحبيه الصبر والسلوان. إنا لله وإنا إليه راجعون"
      ]
    },
    "image": "/news/07-condolences-former-president-hadi-1.jpeg",
    "imageAlt": {
      "ar": "وقف أويس القرني يعزي في وفاة الرئيس اليمني السابق عبدربه منصور هادي",
      "en": "Veysel Karani Waqf offers condolences on the passing of former Yemeni President Abdrabbuh Mansur Hadi",
      "tr": "Veysel Karani Vakfı, eski Yemen Cumhurbaşkanı Abdrabbuh Mansur Hadi’nin vefatı için taziyede bulundu"
    },
    "gallery": [],
    "sourceImages": [
      "/media/file-e011659c.jpeg"
    ]
  },
  {
    "id": "23390",
    "slug": "ramadan-programs-wamy",
    "sourceSlug": "pioneers-of-yemen-program2",
    "sourceUrl": "https://veysvakfi.org/pioneers-of-yemen-program2/",
    "publishedAt": "2026-04-02T11:05:10",
    "year": 2026,
    "sourceLanguage": "ar",
    "category": {
      "ar": "الأخبار",
      "en": "News",
      "tr": "Haberler"
    },
    "title": {
      "ar": "برعاية الندوة العالمية للشباب الإسلامي.. برنامج رواد اليمن يقيم سلسلة البرامج الرمضانية",
      "en": "With WAMY sponsorship, Yemen Pioneers holds a series of Ramadan programs",
      "tr": "WAMY sponsorluğunda Yemen Öncüleri Ramazan programları serisi düzenledi"
    },
    "excerpt": {
      "ar": "أقام برنامج رواد اليمن سلسلة من البرامج الرمضانية، وذلك برعاية كريمة من الندوة العالمية للشباب الإسلامي، ضمن المسار الأول من البرنامج التدريبي للرواد، والذي يركّز على الجانب القيمي والشخصي. وشملت هذه السلسلة تنفيذ برنامج الإفطار الرمضاني، بالشراكة مع عدد من الاتحادات والأندية الطلابية في مدن كوتاهيا، أفيون، وسكاريا في تركيا، في إطار تعزيز الروابط المجتمعية",
      "en": "Yemen Pioneers held Ramadan programs focused on values and personal development within the first track of its training program.",
      "tr": "Yemen Öncüleri, eğitim programının ilk güzergahı kapsamında değerler ve kişisel gelişime odaklanan Ramazan programları düzenledi."
    },
    "content": {
      "ar": [
        "أقام برنامج رواد اليمن سلسلة من البرامج الرمضانية، وذلك برعاية كريمة من الندوة العالمية للشباب الإسلامي، ضمن المسار الأول من البرنامج التدريبي للرواد، والذي يركّز على الجانب القيمي والشخصي.",
        "وشملت هذه السلسلة تنفيذ برنامج الإفطار الرمضاني، بالشراكة مع عدد من الاتحادات والأندية الطلابية في مدن كوتاهيا، أفيون، وسكاريا في تركيا، في إطار تعزيز الروابط المجتمعية بين الطلبة اليمنيين، وتنمية الجوانب القيمية لديهم خلال شهر رمضان المبارك.",
        "وركّزت البرامج على أهمية تحقيق التوازن لدى الطالب المغترب، بين متطلبات التحصيل الأكاديمي، وتنمية المهارات، والارتقاء بالجوانب الإيمانية والشخصية، بما يسهم في بناء شخصية متكاملة قادرة على العطاء والتأثير.",
        "وانطلقت الفعاليات بأمسيات رمضانية تفاعلية، تخللتها فقرات توجيهية وإيمانية، واختُتمت بموائد إفطار جماعية خلال أيام العشر الأواخر المباركة، في أجواء إيمانية تعزز روح الأخوة والانتماء.",
        "ويأتي تنفيذ هذه السلسلة ضمن جهود برنامج رواد اليمن في إعداد جيل واعٍ ومؤهل، يجمع بين الكفاءة العلمية والقيم الأصيلة، بما يسهم في تحقيق رسالته في بناء الإنسان والنهوض بالمجتمع."
      ],
      "en": [
        "أقام برنامج رواد اليمن سلسلة من البرامج الرمضانية، وذلك برعاية كريمة من الندوة العالمية للشباب الإسلامي، ضمن المسار الأول من البرنامج التدريبي للرواد، والذي يركّز على الجانب القيمي والشخصي.",
        "وشملت هذه السلسلة تنفيذ برنامج الإفطار الرمضاني، بالشراكة مع عدد من الاتحادات والأندية الطلابية في مدن كوتاهيا، أفيون، وسكاريا في تركيا، في إطار تعزيز الروابط المجتمعية بين الطلبة اليمنيين، وتنمية الجوانب القيمية لديهم خلال شهر رمضان المبارك.",
        "وركّزت البرامج على أهمية تحقيق التوازن لدى الطالب المغترب، بين متطلبات التحصيل الأكاديمي، وتنمية المهارات، والارتقاء بالجوانب الإيمانية والشخصية، بما يسهم في بناء شخصية متكاملة قادرة على العطاء والتأثير.",
        "وانطلقت الفعاليات بأمسيات رمضانية تفاعلية، تخللتها فقرات توجيهية وإيمانية، واختُتمت بموائد إفطار جماعية خلال أيام العشر الأواخر المباركة، في أجواء إيمانية تعزز روح الأخوة والانتماء.",
        "ويأتي تنفيذ هذه السلسلة ضمن جهود برنامج رواد اليمن في إعداد جيل واعٍ ومؤهل، يجمع بين الكفاءة العلمية والقيم الأصيلة، بما يسهم في تحقيق رسالته في بناء الإنسان والنهوض بالمجتمع."
      ],
      "tr": [
        "أقام برنامج رواد اليمن سلسلة من البرامج الرمضانية، وذلك برعاية كريمة من الندوة العالمية للشباب الإسلامي، ضمن المسار الأول من البرنامج التدريبي للرواد، والذي يركّز على الجانب القيمي والشخصي.",
        "وشملت هذه السلسلة تنفيذ برنامج الإفطار الرمضاني، بالشراكة مع عدد من الاتحادات والأندية الطلابية في مدن كوتاهيا، أفيون، وسكاريا في تركيا، في إطار تعزيز الروابط المجتمعية بين الطلبة اليمنيين، وتنمية الجوانب القيمية لديهم خلال شهر رمضان المبارك.",
        "وركّزت البرامج على أهمية تحقيق التوازن لدى الطالب المغترب، بين متطلبات التحصيل الأكاديمي، وتنمية المهارات، والارتقاء بالجوانب الإيمانية والشخصية، بما يسهم في بناء شخصية متكاملة قادرة على العطاء والتأثير.",
        "وانطلقت الفعاليات بأمسيات رمضانية تفاعلية، تخللتها فقرات توجيهية وإيمانية، واختُتمت بموائد إفطار جماعية خلال أيام العشر الأواخر المباركة، في أجواء إيمانية تعزز روح الأخوة والانتماء.",
        "ويأتي تنفيذ هذه السلسلة ضمن جهود برنامج رواد اليمن في إعداد جيل واعٍ ومؤهل، يجمع بين الكفاءة العلمية والقيم الأصيلة، بما يسهم في تحقيق رسالته في بناء الإنسان والنهوض بالمجتمع."
      ]
    },
    "image": "/news/08-ramadan-programs-wamy-1.jpg",
    "imageAlt": {
      "ar": "برعاية الندوة العالمية للشباب الإسلامي.. برنامج رواد اليمن يقيم سلسلة البرامج الرمضانية",
      "en": "With WAMY sponsorship, Yemen Pioneers holds a series of Ramadan programs",
      "tr": "WAMY sponsorluğunda Yemen Öncüleri Ramazan programları serisi düzenledi"
    },
    "gallery": [
      {
        "id": "ramadan-programs-wamy-1",
        "image": "/news/08-ramadan-programs-wamy-2.jpg",
        "thumbnail": "/news/08-ramadan-programs-wamy-2.jpg",
        "sourceUrl": "https://veysvakfi.org/pioneers-of-yemen-program2/",
        "title": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. برنامج رواد اليمن يقيم سلسلة البرامج الرمضانية - صورة 1",
          "en": "With WAMY sponsorship, Yemen Pioneers holds a series of Ramadan programs - image 1",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri Ramazan programları serisi düzenledi - görsel 1"
        },
        "imageAlt": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. برنامج رواد اليمن يقيم سلسلة البرامج الرمضانية - صورة 1",
          "en": "With WAMY sponsorship, Yemen Pioneers holds a series of Ramadan programs - image 1",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri Ramazan programları serisi düzenledi - görsel 1"
        },
        "width": 1200,
        "height": 800
      },
      {
        "id": "ramadan-programs-wamy-2",
        "image": "/news/08-ramadan-programs-wamy-3.jpg",
        "thumbnail": "/news/08-ramadan-programs-wamy-3.jpg",
        "sourceUrl": "https://veysvakfi.org/pioneers-of-yemen-program2/",
        "title": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. برنامج رواد اليمن يقيم سلسلة البرامج الرمضانية - صورة 2",
          "en": "With WAMY sponsorship, Yemen Pioneers holds a series of Ramadan programs - image 2",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri Ramazan programları serisi düzenledi - görsel 2"
        },
        "imageAlt": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. برنامج رواد اليمن يقيم سلسلة البرامج الرمضانية - صورة 2",
          "en": "With WAMY sponsorship, Yemen Pioneers holds a series of Ramadan programs - image 2",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri Ramazan programları serisi düzenledi - görsel 2"
        },
        "width": 1200,
        "height": 800
      },
      {
        "id": "ramadan-programs-wamy-3",
        "image": "/news/08-ramadan-programs-wamy-4.jpg",
        "thumbnail": "/news/08-ramadan-programs-wamy-4.jpg",
        "sourceUrl": "https://veysvakfi.org/pioneers-of-yemen-program2/",
        "title": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. برنامج رواد اليمن يقيم سلسلة البرامج الرمضانية - صورة 3",
          "en": "With WAMY sponsorship, Yemen Pioneers holds a series of Ramadan programs - image 3",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri Ramazan programları serisi düzenledi - görsel 3"
        },
        "imageAlt": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. برنامج رواد اليمن يقيم سلسلة البرامج الرمضانية - صورة 3",
          "en": "With WAMY sponsorship, Yemen Pioneers holds a series of Ramadan programs - image 3",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri Ramazan programları serisi düzenledi - görsel 3"
        },
        "width": 1200,
        "height": 800
      }
    ],
    "sourceImages": [
      "/media/wamy-c4161329.jpg",
      "/media/wamy-1-1024x576-dfd1ee27.jpg",
      "/media/img_6891-1024x576-7ae9c967.jpg",
      "/media/img_6076-1024x576-2e127cdf.jpg"
    ]
  },
  {
    "id": "23342",
    "slug": "yemen-pioneers-second-scientific-conference",
    "sourceSlug": "the-international-symposium-for-islamic-youth-pioneers-of-yemen",
    "sourceUrl": "https://veysvakfi.org/the-international-symposium-for-islamic-youth-pioneers-of-yemen/",
    "publishedAt": "2026-03-26T18:09:00",
    "year": 2026,
    "sourceLanguage": "ar",
    "category": {
      "ar": "الأخبار",
      "en": "News",
      "tr": "Haberler"
    },
    "title": {
      "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني",
      "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference",
      "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı"
    },
    "excerpt": {
      "ar": "أطلق برنامج رواد اليمن المؤتمر العلمي الثاني لرواد اليمن، وذلك برعاية كريمة من الندوة العالمية للشباب الإسلامي، استكمالاً لمسيرة النجاح التي حققها المؤتمر العلمي الأول. ويأتي هذا المؤتمر امتداداً لجهود البرنامج في تعزيز التدريب التخصصي، حيث يتيح للرواد عرض مشاريعهم البحثية والتطبيقية أمام لجنة علمية مختصة، إلى جانب إتاحة التقييم الجماهيري، بما يسهم في تطوير",
      "en": "The Yemen Pioneers program launched its second scientific conference to continue supporting students’ research and knowledge production.",
      "tr": "Yemen Öncüleri programı, öğrencilerin araştırma ve bilgi üretimini desteklemek için ikinci bilimsel konferansını başlattı."
    },
    "content": {
      "ar": [
        "أطلق برنامج رواد اليمن المؤتمر العلمي الثاني لرواد اليمن، وذلك برعاية كريمة من الندوة العالمية للشباب الإسلامي، استكمالاً لمسيرة النجاح التي حققها المؤتمر العلمي الأول.",
        "ويأتي هذا المؤتمر امتداداً لجهود البرنامج في تعزيز التدريب التخصصي، حيث يتيح للرواد عرض مشاريعهم البحثية والتطبيقية أمام لجنة علمية مختصة، إلى جانب إتاحة التقييم الجماهيري، بما يسهم في تطوير مخرجاتهم العلمية والعملية.",
        "وتتنوع مجالات المشاريع المشاركة لتشمل عدداً من التخصصات الحيوية، من بينها: الموارد البشرية، علم النفس، الميكاترونكس، السيارات الكهربائية، الروبوتات، بالإضافة إلى مشاريع نوعية في مجالات الكهوف، بما يعكس تنوع اهتمامات المشاركين واتجاههم نحو الابتكار والمعرفة التطبيقية.",
        "ويُعد المؤتمر امتداداً لرسالة الوقف في دعم المشاريع النوعية، والإسهام في تحقيق نهضة حضارية مستدامة لليمن من خلال تمكين الكفاءات الشابة وتأهيلها علميًا ومهارياً."
      ],
      "en": [
        "أطلق برنامج رواد اليمن المؤتمر العلمي الثاني لرواد اليمن، وذلك برعاية كريمة من الندوة العالمية للشباب الإسلامي، استكمالاً لمسيرة النجاح التي حققها المؤتمر العلمي الأول.",
        "ويأتي هذا المؤتمر امتداداً لجهود البرنامج في تعزيز التدريب التخصصي، حيث يتيح للرواد عرض مشاريعهم البحثية والتطبيقية أمام لجنة علمية مختصة، إلى جانب إتاحة التقييم الجماهيري، بما يسهم في تطوير مخرجاتهم العلمية والعملية.",
        "وتتنوع مجالات المشاريع المشاركة لتشمل عدداً من التخصصات الحيوية، من بينها: الموارد البشرية، علم النفس، الميكاترونكس، السيارات الكهربائية، الروبوتات، بالإضافة إلى مشاريع نوعية في مجالات الكهوف، بما يعكس تنوع اهتمامات المشاركين واتجاههم نحو الابتكار والمعرفة التطبيقية.",
        "ويُعد المؤتمر امتداداً لرسالة الوقف في دعم المشاريع النوعية، والإسهام في تحقيق نهضة حضارية مستدامة لليمن من خلال تمكين الكفاءات الشابة وتأهيلها علميًا ومهارياً."
      ],
      "tr": [
        "أطلق برنامج رواد اليمن المؤتمر العلمي الثاني لرواد اليمن، وذلك برعاية كريمة من الندوة العالمية للشباب الإسلامي، استكمالاً لمسيرة النجاح التي حققها المؤتمر العلمي الأول.",
        "ويأتي هذا المؤتمر امتداداً لجهود البرنامج في تعزيز التدريب التخصصي، حيث يتيح للرواد عرض مشاريعهم البحثية والتطبيقية أمام لجنة علمية مختصة، إلى جانب إتاحة التقييم الجماهيري، بما يسهم في تطوير مخرجاتهم العلمية والعملية.",
        "وتتنوع مجالات المشاريع المشاركة لتشمل عدداً من التخصصات الحيوية، من بينها: الموارد البشرية، علم النفس، الميكاترونكس، السيارات الكهربائية، الروبوتات، بالإضافة إلى مشاريع نوعية في مجالات الكهوف، بما يعكس تنوع اهتمامات المشاركين واتجاههم نحو الابتكار والمعرفة التطبيقية.",
        "ويُعد المؤتمر امتداداً لرسالة الوقف في دعم المشاريع النوعية، والإسهام في تحقيق نهضة حضارية مستدامة لليمن من خلال تمكين الكفاءات الشابة وتأهيلها علميًا ومهارياً."
      ]
    },
    "image": "/news/09-yemen-pioneers-second-scientific-conference-1.jpg",
    "imageAlt": {
      "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني",
      "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference",
      "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı"
    },
    "gallery": [
      {
        "id": "yemen-pioneers-second-scientific-conference-1",
        "image": "/news/09-yemen-pioneers-second-scientific-conference-2.jpg",
        "thumbnail": "/news/09-yemen-pioneers-second-scientific-conference-2.jpg",
        "sourceUrl": "https://veysvakfi.org/the-international-symposium-for-islamic-youth-pioneers-of-yemen/",
        "title": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 1",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 1",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 1"
        },
        "imageAlt": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 1",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 1",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 1"
        },
        "width": 1200,
        "height": 800
      },
      {
        "id": "yemen-pioneers-second-scientific-conference-2",
        "image": "/news/09-yemen-pioneers-second-scientific-conference-3.jpg",
        "thumbnail": "/news/09-yemen-pioneers-second-scientific-conference-3.jpg",
        "sourceUrl": "https://veysvakfi.org/the-international-symposium-for-islamic-youth-pioneers-of-yemen/",
        "title": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 2",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 2",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 2"
        },
        "imageAlt": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 2",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 2",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 2"
        },
        "width": 1200,
        "height": 800
      },
      {
        "id": "yemen-pioneers-second-scientific-conference-3",
        "image": "/news/09-yemen-pioneers-second-scientific-conference-4.jpg",
        "thumbnail": "/news/09-yemen-pioneers-second-scientific-conference-4.jpg",
        "sourceUrl": "https://veysvakfi.org/the-international-symposium-for-islamic-youth-pioneers-of-yemen/",
        "title": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 3",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 3",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 3"
        },
        "imageAlt": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 3",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 3",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 3"
        },
        "width": 1200,
        "height": 800
      },
      {
        "id": "yemen-pioneers-second-scientific-conference-4",
        "image": "/news/09-yemen-pioneers-second-scientific-conference-5.png",
        "thumbnail": "/news/09-yemen-pioneers-second-scientific-conference-5.png",
        "sourceUrl": "https://veysvakfi.org/the-international-symposium-for-islamic-youth-pioneers-of-yemen/",
        "title": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 4",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 4",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 4"
        },
        "imageAlt": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 4",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 4",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 4"
        },
        "width": 1200,
        "height": 800
      },
      {
        "id": "yemen-pioneers-second-scientific-conference-5",
        "image": "/news/09-yemen-pioneers-second-scientific-conference-6.png",
        "thumbnail": "/news/09-yemen-pioneers-second-scientific-conference-6.png",
        "sourceUrl": "https://veysvakfi.org/the-international-symposium-for-islamic-youth-pioneers-of-yemen/",
        "title": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 5",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 5",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 5"
        },
        "imageAlt": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 5",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 5",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 5"
        },
        "width": 1200,
        "height": 800
      },
      {
        "id": "yemen-pioneers-second-scientific-conference-6",
        "image": "/news/09-yemen-pioneers-second-scientific-conference-7.png",
        "thumbnail": "/news/09-yemen-pioneers-second-scientific-conference-7.png",
        "sourceUrl": "https://veysvakfi.org/the-international-symposium-for-islamic-youth-pioneers-of-yemen/",
        "title": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 6",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 6",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 6"
        },
        "imageAlt": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 6",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 6",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 6"
        },
        "width": 1200,
        "height": 800
      },
      {
        "id": "yemen-pioneers-second-scientific-conference-7",
        "image": "/news/09-yemen-pioneers-second-scientific-conference-8.jpg",
        "thumbnail": "/news/09-yemen-pioneers-second-scientific-conference-8.jpg",
        "sourceUrl": "https://veysvakfi.org/the-international-symposium-for-islamic-youth-pioneers-of-yemen/",
        "title": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 7",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 7",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 7"
        },
        "imageAlt": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 7",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 7",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 7"
        },
        "width": 1200,
        "height": 800
      },
      {
        "id": "yemen-pioneers-second-scientific-conference-8",
        "image": "/news/09-yemen-pioneers-second-scientific-conference-9.png",
        "thumbnail": "/news/09-yemen-pioneers-second-scientific-conference-9.png",
        "sourceUrl": "https://veysvakfi.org/the-international-symposium-for-islamic-youth-pioneers-of-yemen/",
        "title": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 8",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 8",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 8"
        },
        "imageAlt": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 8",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 8",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 8"
        },
        "width": 1200,
        "height": 800
      },
      {
        "id": "yemen-pioneers-second-scientific-conference-9",
        "image": "/news/09-yemen-pioneers-second-scientific-conference-10.png",
        "thumbnail": "/news/09-yemen-pioneers-second-scientific-conference-10.png",
        "sourceUrl": "https://veysvakfi.org/the-international-symposium-for-islamic-youth-pioneers-of-yemen/",
        "title": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 9",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 9",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 9"
        },
        "imageAlt": {
          "ar": "برعاية الندوة العالمية للشباب الإسلامي.. رواد اليمن يطلقون المؤتمر العلمي الثاني - صورة 9",
          "en": "With WAMY sponsorship, Yemen Pioneers launches its second scientific conference - image 9",
          "tr": "WAMY sponsorluğunda Yemen Öncüleri ikinci bilimsel konferansını başlattı - görsel 9"
        },
        "width": 1200,
        "height": 800
      }
    ],
    "sourceImages": [
      "/media/16-scaled-a956ce65.jpg",
      "/media/16-1024x683-65df3857.jpg",
      "/media/17-1024x683-ad7d52b5.jpg",
      "/media/12-1024x683-d94d77ac.jpg",
      "/media/10-1024x576-f8fccc8a.png",
      "/media/4-1024x683-6c02ae12.png",
      "/media/2-1024x683-f57af3c3.png",
      "/media/11-1024x683-62659713.jpg",
      "/media/5-1-1024x683-0f42135c.png",
      "/media/7-1024x683-51474eac.png"
    ]
  },
  {
    "id": "23324",
    "slug": "sakarya-leadership-values-evening",
    "sourceSlug": "%d8%a8%d8%b1%d9%86%d8%a7%d9%85%d8%ac-%d8%b1%d9%88%d8%a7%d8%af-%d8%a7%d9%84%d9%8a%d9%85%d9%86-%d9%8a%d9%86%d8%b8%d9%85-%d8%a3%d9%85%d8%b3%d9%8a%d8%a9-%d8%b1%d9%85%d8%b6%d8%a7%d9%86%d9%8a%d8%a9-%d8%a8",
    "sourceUrl": "https://veysvakfi.org/%d8%a8%d8%b1%d9%86%d8%a7%d9%85%d8%ac-%d8%b1%d9%88%d8%a7%d8%af-%d8%a7%d9%84%d9%8a%d9%85%d9%86-%d9%8a%d9%86%d8%b8%d9%85-%d8%a3%d9%85%d8%b3%d9%8a%d8%a9-%d8%b1%d9%85%d8%b6%d8%a7%d9%86%d9%8a%d8%a9-%d8%a8/",
    "publishedAt": "2026-03-18T17:01:29",
    "year": 2026,
    "sourceLanguage": "ar",
    "category": {
      "ar": "الأخبار",
      "en": "News",
      "tr": "Haberler"
    },
    "title": {
      "ar": "برنامج رواد اليمن ينظم أمسية رمضانية بعنوان “قيم ومبادئ القائد” في سكاريا – تركيا",
      "en": "Yemen Pioneers holds a Ramadan evening on “The Leader’s Values and Principles” in Sakarya",
      "tr": "Yemen Öncüleri Sakarya’da “Liderin Değerleri ve İlkeleri” konulu Ramazan buluşması düzenledi"
    },
    "excerpt": {
      "ar": "برنامج رواد اليمن ينظم أمسية رمضانية بعنوان “قيم ومبادئ القائد” في سكاريا – تركيا في إطار الزيارات الدورية لإدارة برنامج رواد اليمن ضمن المسارات التدريبية للرواد، نُظِّمت يوم 09 مارس 2026 في مدينة سكاريا أمسية رمضانية بعنوان “قيم ومبادئ القائد”، قدمها مدير البرامج في الوقف أ/ أيمن رياض. وتأتي هذه الأمسية ضمن المسار القيمي والشخصي",
      "en": "The program organized a Ramadan evening in Sakarya led by program director Ayman Riyadh, focusing on leadership values.",
      "tr": "Program, Sakarya’da program müdürü Ayman Riyadh’ın sunduğu ve liderlik değerlerine odaklanan bir Ramazan buluşması düzenledi."
    },
    "content": {
      "ar": [
        "برنامج رواد اليمن ينظم أمسية رمضانية بعنوان “قيم ومبادئ القائد” في سكاريا – تركيا",
        "في إطار الزيارات الدورية لإدارة برنامج رواد اليمن ضمن المسارات التدريبية للرواد، نُظِّمت يوم 09 مارس 2026 في مدينة سكاريا أمسية رمضانية بعنوان “قيم ومبادئ القائد”، قدمها مدير البرامج في الوقف أ/ أيمن رياض.",
        "وتأتي هذه الأمسية ضمن المسار القيمي والشخصي في البرنامج، حيث ركزت على تعزيز منظومة القيم الفاضلة والمبادئ النبيلة لدى الرواد، وأهمية تجسيدها في سلوكهم القيادي، بما يسهم في إعداد قيادات واعية قادرة على تقديم خدمة نوعية ومؤثرة لمجتمعاتها والإسهام في النهوض الحضاري لليمن.",
        "وجاءت الأمسية في أجواء رمضانية مميزة عكست روح الأخوة والتواصل بين المشاركين، واختُتمت بجلسة إفطار جماعي جمعت الرواد وإدارة البرنامج في أجواء ودية تعزز قيم التعاون والتقارب."
      ],
      "en": [
        "برنامج رواد اليمن ينظم أمسية رمضانية بعنوان “قيم ومبادئ القائد” في سكاريا – تركيا",
        "في إطار الزيارات الدورية لإدارة برنامج رواد اليمن ضمن المسارات التدريبية للرواد، نُظِّمت يوم 09 مارس 2026 في مدينة سكاريا أمسية رمضانية بعنوان “قيم ومبادئ القائد”، قدمها مدير البرامج في الوقف أ/ أيمن رياض.",
        "وتأتي هذه الأمسية ضمن المسار القيمي والشخصي في البرنامج، حيث ركزت على تعزيز منظومة القيم الفاضلة والمبادئ النبيلة لدى الرواد، وأهمية تجسيدها في سلوكهم القيادي، بما يسهم في إعداد قيادات واعية قادرة على تقديم خدمة نوعية ومؤثرة لمجتمعاتها والإسهام في النهوض الحضاري لليمن.",
        "وجاءت الأمسية في أجواء رمضانية مميزة عكست روح الأخوة والتواصل بين المشاركين، واختُتمت بجلسة إفطار جماعي جمعت الرواد وإدارة البرنامج في أجواء ودية تعزز قيم التعاون والتقارب."
      ],
      "tr": [
        "برنامج رواد اليمن ينظم أمسية رمضانية بعنوان “قيم ومبادئ القائد” في سكاريا – تركيا",
        "في إطار الزيارات الدورية لإدارة برنامج رواد اليمن ضمن المسارات التدريبية للرواد، نُظِّمت يوم 09 مارس 2026 في مدينة سكاريا أمسية رمضانية بعنوان “قيم ومبادئ القائد”، قدمها مدير البرامج في الوقف أ/ أيمن رياض.",
        "وتأتي هذه الأمسية ضمن المسار القيمي والشخصي في البرنامج، حيث ركزت على تعزيز منظومة القيم الفاضلة والمبادئ النبيلة لدى الرواد، وأهمية تجسيدها في سلوكهم القيادي، بما يسهم في إعداد قيادات واعية قادرة على تقديم خدمة نوعية ومؤثرة لمجتمعاتها والإسهام في النهوض الحضاري لليمن.",
        "وجاءت الأمسية في أجواء رمضانية مميزة عكست روح الأخوة والتواصل بين المشاركين، واختُتمت بجلسة إفطار جماعي جمعت الرواد وإدارة البرنامج في أجواء ودية تعزز قيم التعاون والتقارب."
      ]
    },
    "image": "/news/10-sakarya-leadership-values-evening-1.jpeg",
    "imageAlt": {
      "ar": "برنامج رواد اليمن ينظم أمسية رمضانية بعنوان “قيم ومبادئ القائد” في سكاريا – تركيا",
      "en": "Yemen Pioneers holds a Ramadan evening on “The Leader’s Values and Principles” in Sakarya",
      "tr": "Yemen Öncüleri Sakarya’da “Liderin Değerleri ve İlkeleri” konulu Ramazan buluşması düzenledi"
    },
    "gallery": [
      {
        "id": "sakarya-leadership-values-evening-1",
        "image": "/news/10-sakarya-leadership-values-evening-2.jpeg",
        "thumbnail": "/news/10-sakarya-leadership-values-evening-2.jpeg",
        "sourceUrl": "https://veysvakfi.org/%d8%a8%d8%b1%d9%86%d8%a7%d9%85%d8%ac-%d8%b1%d9%88%d8%a7%d8%af-%d8%a7%d9%84%d9%8a%d9%85%d9%86-%d9%8a%d9%86%d8%b8%d9%85-%d8%a3%d9%85%d8%b3%d9%8a%d8%a9-%d8%b1%d9%85%d8%b6%d8%a7%d9%86%d9%8a%d8%a9-%d8%a8/",
        "title": {
          "ar": "برنامج رواد اليمن ينظم أمسية رمضانية بعنوان “قيم ومبادئ القائد” في سكاريا – تركيا - صورة 1",
          "en": "Yemen Pioneers holds a Ramadan evening on “The Leader’s Values and Principles” in Sakarya - image 1",
          "tr": "Yemen Öncüleri Sakarya’da “Liderin Değerleri ve İlkeleri” konulu Ramazan buluşması düzenledi - görsel 1"
        },
        "imageAlt": {
          "ar": "برنامج رواد اليمن ينظم أمسية رمضانية بعنوان “قيم ومبادئ القائد” في سكاريا – تركيا - صورة 1",
          "en": "Yemen Pioneers holds a Ramadan evening on “The Leader’s Values and Principles” in Sakarya - image 1",
          "tr": "Yemen Öncüleri Sakarya’da “Liderin Değerleri ve İlkeleri” konulu Ramazan buluşması düzenledi - görsel 1"
        },
        "width": 1200,
        "height": 800
      }
    ],
    "sourceImages": [
      "/media/1-310e5953.jpeg",
      "/media/819x1024-0f78f6ac.jpeg"
    ]
  },
  {
    "id": "23307",
    "slug": "konya-leadership-values-evening",
    "sourceSlug": "%d8%a8%d8%b1%d9%86%d8%a7%d9%85%d8%ac-%d8%b1%d9%88%d8%a7%d8%af-%d8%a7%d9%84%d9%8a%d9%85%d9%86-%d9%8a%d8%b3%d8%aa%d8%b6%d9%8a%d9%81-%d8%a7%d9%84%d8%a8%d8%b1%d9%88%d9%81%d9%8a%d8%b3%d9%88%d8%b1-%d8%b9",
    "sourceUrl": "https://veysvakfi.org/%d8%a8%d8%b1%d9%86%d8%a7%d9%85%d8%ac-%d8%b1%d9%88%d8%a7%d8%af-%d8%a7%d9%84%d9%8a%d9%85%d9%86-%d9%8a%d8%b3%d8%aa%d8%b6%d9%8a%d9%81-%d8%a7%d9%84%d8%a8%d8%b1%d9%88%d9%81%d9%8a%d8%b3%d9%88%d8%b1-%d8%b9/",
    "publishedAt": "2026-03-11T08:49:21",
    "year": 2026,
    "sourceLanguage": "ar",
    "category": {
      "ar": "الأخبار",
      "en": "News",
      "tr": "Haberler"
    },
    "title": {
      "ar": "برنامج رواد اليمن يستضيف البروفيسور عبدالقادر بايزيد في أمسية رمضانية بعنوان “قيم ومبادئ القائد” في كونيا – تركيا",
      "en": "Yemen Pioneers hosts Professor Abdulkader Bayezid for a Ramadan evening on “The Leader’s Values and Principles” in Konya",
      "tr": "Yemen Öncüleri, Konya’da “Liderin Değerleri ve İlkeleri” programında Prof. Abdulkader Bayezid’i ağırladı"
    },
    "excerpt": {
      "ar": "برنامج رواد اليمن يستضيف البروفيسور عبدالقادر بايزيد في أمسية رمضانية بعنوان “قيم ومبادئ القائد” في كونيا – تركيا في إطار الزيارات الدورية لإدارة برنامج رواد اليمن ضمن المسارات التدريبية للرواد، نُظِّمت يوم 11 مارس 2026 في مدينة كونيا أمسية رمضانية بعنوان “قيم ومبادئ القائد”، قدمها البروفيسور عبدالقادر بايزيد. وتأتي هذه الدورة ضمن المسار القيمي والشخصي",
      "en": "The program hosted Professor Abdulkader Bayezid in Konya for a Ramadan evening focused on values and leadership principles.",
      "tr": "Program, Konya’da değerler ve liderlik ilkelerine odaklanan Ramazan buluşmasında Prof. Abdulkader Bayezid’i ağırladı."
    },
    "content": {
      "ar": [
        "برنامج رواد اليمن يستضيف البروفيسور عبدالقادر بايزيد في أمسية رمضانية بعنوان “قيم ومبادئ القائد” في كونيا – تركيا",
        "في إطار الزيارات الدورية لإدارة برنامج رواد اليمن ضمن المسارات التدريبية للرواد، نُظِّمت يوم 11 مارس 2026 في مدينة كونيا أمسية رمضانية بعنوان “قيم ومبادئ القائد”، قدمها البروفيسور عبدالقادر بايزيد.",
        "وتأتي هذه الدورة ضمن المسار القيمي والشخصي في البرنامج، حيث ركزت على تعزيز منظومة القيم الفاضلة والمبادئ النبيلة لدى الرواد، وأهمية تجسيدها في سلوكهم القيادي، بما يسهم في إعداد قيادات واعية قادرة على تقديم خدمة نوعية ومؤثرة لمجتمعاتها والإسهام في النهوض الحضاري لليمن.",
        "وجاءت الدورة في أجواء رمضانية مميزة عكست روح الأخوة والتواصل بين المشاركين، واختُتمت بجلسة إفطار جماعي جمعت الرواد وإدارة البرنامج في أجواء ودية تعزز قيم التعاون والتقارب.",
        "وقف أويس القرني",
        "برنامج رواد اليمن"
      ],
      "en": [
        "برنامج رواد اليمن يستضيف البروفيسور عبدالقادر بايزيد في أمسية رمضانية بعنوان “قيم ومبادئ القائد” في كونيا – تركيا",
        "في إطار الزيارات الدورية لإدارة برنامج رواد اليمن ضمن المسارات التدريبية للرواد، نُظِّمت يوم 11 مارس 2026 في مدينة كونيا أمسية رمضانية بعنوان “قيم ومبادئ القائد”، قدمها البروفيسور عبدالقادر بايزيد.",
        "وتأتي هذه الدورة ضمن المسار القيمي والشخصي في البرنامج، حيث ركزت على تعزيز منظومة القيم الفاضلة والمبادئ النبيلة لدى الرواد، وأهمية تجسيدها في سلوكهم القيادي، بما يسهم في إعداد قيادات واعية قادرة على تقديم خدمة نوعية ومؤثرة لمجتمعاتها والإسهام في النهوض الحضاري لليمن.",
        "وجاءت الدورة في أجواء رمضانية مميزة عكست روح الأخوة والتواصل بين المشاركين، واختُتمت بجلسة إفطار جماعي جمعت الرواد وإدارة البرنامج في أجواء ودية تعزز قيم التعاون والتقارب.",
        "وقف أويس القرني",
        "برنامج رواد اليمن"
      ],
      "tr": [
        "برنامج رواد اليمن يستضيف البروفيسور عبدالقادر بايزيد في أمسية رمضانية بعنوان “قيم ومبادئ القائد” في كونيا – تركيا",
        "في إطار الزيارات الدورية لإدارة برنامج رواد اليمن ضمن المسارات التدريبية للرواد، نُظِّمت يوم 11 مارس 2026 في مدينة كونيا أمسية رمضانية بعنوان “قيم ومبادئ القائد”، قدمها البروفيسور عبدالقادر بايزيد.",
        "وتأتي هذه الدورة ضمن المسار القيمي والشخصي في البرنامج، حيث ركزت على تعزيز منظومة القيم الفاضلة والمبادئ النبيلة لدى الرواد، وأهمية تجسيدها في سلوكهم القيادي، بما يسهم في إعداد قيادات واعية قادرة على تقديم خدمة نوعية ومؤثرة لمجتمعاتها والإسهام في النهوض الحضاري لليمن.",
        "وجاءت الدورة في أجواء رمضانية مميزة عكست روح الأخوة والتواصل بين المشاركين، واختُتمت بجلسة إفطار جماعي جمعت الرواد وإدارة البرنامج في أجواء ودية تعزز قيم التعاون والتقارب.",
        "وقف أويس القرني",
        "برنامج رواد اليمن"
      ]
    },
    "image": "/news/11-konya-leadership-values-evening-1.jpeg",
    "imageAlt": {
      "ar": "برنامج رواد اليمن يستضيف البروفيسور عبدالقادر بايزيد في أمسية رمضانية بعنوان “قيم ومبادئ القائد” في كونيا – تركيا",
      "en": "Yemen Pioneers hosts Professor Abdulkader Bayezid for a Ramadan evening on “The Leader’s Values and Principles” in Konya",
      "tr": "Yemen Öncüleri, Konya’da “Liderin Değerleri ve İlkeleri” programında Prof. Abdulkader Bayezid’i ağırladı"
    },
    "gallery": [
      {
        "id": "konya-leadership-values-evening-1",
        "image": "/news/11-konya-leadership-values-evening-2.jpeg",
        "thumbnail": "/news/11-konya-leadership-values-evening-2.jpeg",
        "sourceUrl": "https://veysvakfi.org/%d8%a8%d8%b1%d9%86%d8%a7%d9%85%d8%ac-%d8%b1%d9%88%d8%a7%d8%af-%d8%a7%d9%84%d9%8a%d9%85%d9%86-%d9%8a%d8%b3%d8%aa%d8%b6%d9%8a%d9%81-%d8%a7%d9%84%d8%a8%d8%b1%d9%88%d9%81%d9%8a%d8%b3%d9%88%d8%b1-%d8%b9/",
        "title": {
          "ar": "برنامج رواد اليمن يستضيف البروفيسور عبدالقادر بايزيد في أمسية رمضانية بعنوان “قيم ومبادئ القائد” في كونيا – تركيا - صورة 1",
          "en": "Yemen Pioneers hosts Professor Abdulkader Bayezid for a Ramadan evening on “The Leader’s Values and Principles” in Konya - image 1",
          "tr": "Yemen Öncüleri, Konya’da “Liderin Değerleri ve İlkeleri” programında Prof. Abdulkader Bayezid’i ağırladı - görsel 1"
        },
        "imageAlt": {
          "ar": "برنامج رواد اليمن يستضيف البروفيسور عبدالقادر بايزيد في أمسية رمضانية بعنوان “قيم ومبادئ القائد” في كونيا – تركيا - صورة 1",
          "en": "Yemen Pioneers hosts Professor Abdulkader Bayezid for a Ramadan evening on “The Leader’s Values and Principles” in Konya - image 1",
          "tr": "Yemen Öncüleri, Konya’da “Liderin Değerleri ve İlkeleri” programında Prof. Abdulkader Bayezid’i ağırladı - görsel 1"
        },
        "width": 1200,
        "height": 800
      },
      {
        "id": "konya-leadership-values-evening-2",
        "image": "/news/11-konya-leadership-values-evening-3.jpeg",
        "thumbnail": "/news/11-konya-leadership-values-evening-3.jpeg",
        "sourceUrl": "https://veysvakfi.org/%d8%a8%d8%b1%d9%86%d8%a7%d9%85%d8%ac-%d8%b1%d9%88%d8%a7%d8%af-%d8%a7%d9%84%d9%8a%d9%85%d9%86-%d9%8a%d8%b3%d8%aa%d8%b6%d9%8a%d9%81-%d8%a7%d9%84%d8%a8%d8%b1%d9%88%d9%81%d9%8a%d8%b3%d9%88%d8%b1-%d8%b9/",
        "title": {
          "ar": "برنامج رواد اليمن يستضيف البروفيسور عبدالقادر بايزيد في أمسية رمضانية بعنوان “قيم ومبادئ القائد” في كونيا – تركيا - صورة 2",
          "en": "Yemen Pioneers hosts Professor Abdulkader Bayezid for a Ramadan evening on “The Leader’s Values and Principles” in Konya - image 2",
          "tr": "Yemen Öncüleri, Konya’da “Liderin Değerleri ve İlkeleri” programında Prof. Abdulkader Bayezid’i ağırladı - görsel 2"
        },
        "imageAlt": {
          "ar": "برنامج رواد اليمن يستضيف البروفيسور عبدالقادر بايزيد في أمسية رمضانية بعنوان “قيم ومبادئ القائد” في كونيا – تركيا - صورة 2",
          "en": "Yemen Pioneers hosts Professor Abdulkader Bayezid for a Ramadan evening on “The Leader’s Values and Principles” in Konya - image 2",
          "tr": "Yemen Öncüleri, Konya’da “Liderin Değerleri ve İlkeleri” programında Prof. Abdulkader Bayezid’i ağırladı - görsel 2"
        },
        "width": 1200,
        "height": 800
      }
    ],
    "sourceImages": [
      "/media/22-22-392b344b.jpeg",
      "/media/22-22-1024x642-8b39f4ee.jpeg",
      "/media/22-22-1-1024x768-a146b600.jpeg"
    ]
  },
  {
    "id": "22970",
    "slug": "owais-ambassadors-orientation",
    "sourceSlug": "%d9%88%d9%82%d9%81-%d8%a3%d9%88%d9%8a%d8%b3-%d8%a7%d9%84%d9%82%d8%b1%d9%86%d9%8a-%d9%8a%d8%b7%d9%84%d9%82-%d9%84%d9%82%d8%a7%d8%a1%d8%aa%d9%87-%d8%a7%d9%84%d8%aa%d8%b9%d8%b1%d9%8a%d9%81%d9%8a%d8%a9",
    "sourceUrl": "https://veysvakfi.org/%d9%88%d9%82%d9%81-%d8%a3%d9%88%d9%8a%d8%b3-%d8%a7%d9%84%d9%82%d8%b1%d9%86%d9%8a-%d9%8a%d8%b7%d9%84%d9%82-%d9%84%d9%82%d8%a7%d8%a1%d8%aa%d9%87-%d8%a7%d9%84%d8%aa%d8%b9%d8%b1%d9%8a%d9%81%d9%8a%d8%a9/",
    "publishedAt": "2025-12-27T20:26:37",
    "year": 2025,
    "sourceLanguage": "ar",
    "category": {
      "ar": "الأخبار",
      "en": "News",
      "tr": "Haberler"
    },
    "title": {
      "ar": "وقف أويس القرني يطلق لقاءته التعريفية مع سفراء أويس",
      "en": "Veysel Karani Waqf launches orientation meetings with Owais ambassadors",
      "tr": "Veysel Karani Vakfı, Owais elçileriyle tanıtım buluşmalarını başlattı"
    },
    "excerpt": {
      "ar": "نفّذ وقف أويس القرني برنامجًا تعريفيًا موجّهًا لسفراء أويس، ضمن توجهه لتعزيز الوعي المؤسسي بفكرة الوقف، وبناء فهم مشترك حول رسالته وأهدافه الاستراتيجية، وذلك في إطار التحضير لمرحلة الانطلاق مع الجاليات واستثمار الفرص المتاحة. وهدف البرنامج إلى تمكين سفراء أويس معرفيًا، وتوحيد الرؤية حول طبيعة الوقف ودوره التنموي، من خلال تقديم محتوى تعريفي مركز يغطي",
      "en": "The waqf held orientation meetings for Owais ambassadors to build shared understanding of its message, goals, investments, and programs.",
      "tr": "Vakıf, mesajı, hedefleri, yatırımları ve programları hakkında ortak anlayış oluşturmak için Owais elçilerine yönelik tanıtım buluşmaları düzenledi."
    },
    "content": {
      "ar": [
        "نفّذ وقف أويس القرني برنامجًا تعريفيًا موجّهًا لسفراء أويس، ضمن توجهه لتعزيز الوعي المؤسسي بفكرة الوقف، وبناء فهم مشترك حول رسالته وأهدافه الاستراتيجية، وذلك في إطار التحضير لمرحلة الانطلاق مع الجاليات واستثمار الفرص المتاحة.",
        "وهدف البرنامج إلى تمكين سفراء أويس معرفيًا، وتوحيد الرؤية حول طبيعة الوقف ودوره التنموي، من خلال تقديم محتوى تعريفي مركز يغطي الجوانب الفكرية والشرعية والاستثمارية والبرامجية للوقف، بما يسهم في تعزيز جاهزية السفراء لأداء دورهم كشركاء فاعلين في تمثيل الوقف داخل مجتمعاتهم.",
        "وتضمّن البرنامج ثلاث جلسات تعريفية عُقدت عن بُعد، تراوحت مدة كل جلسة بين 20 و30 دقيقة. خُصّصت الجلسة الأولى لعرض فكرة تأسيس الوقف ومبررات إنشائه، قدّمها الأستاذ صلاح الدين القياضي، رئيس مجلس إدارة وقف أويس القرني، حيث تناول الهدف الاستراتيجي للوقف، وأسباب اختيار نموذج الوقف كخيار تنموي مستدام، ومنظوره الشرعي، إضافة إلى كونه فكرة تشاركية وصندوقًا قوميًّا يمنيًّا.",
        "فيما تناولت الجلسة الثانية استثمارات الوقف، وقدّمها الأستاذ أيوب علي الروحاني، المدير التنفيذي لشركة أركان الدولية للتجارة الداخلية والخارجية، حيث استعرض آلية عمل لجنة الاستثمار، والسياسات المعتمدة في إدارة الأموال الوقفية، والمشاريع الاستثمارية الحالية، إلى جانب عرض موجز لعوائد الاستثمارات خلال السنوات الخمس الماضية.",
        "واختُتم البرنامج بالجلسة الثالثة التي تناولت برامج الوقف، قدّمها الأستاذ أيمن رياض، مدير البرامج في وقف أويس القرني، حيث استعرض مسارات الوقف الأربعة ومبررات اختيارها، ودور البرامج في تحويل العوائد الاستثمارية إلى مشاريع تنموية ذات أثر مستدام.",
        "وأكد وقف أويس القرني أن هذا البرنامج يُعد محطة تأسيسية مهمة في مسار بناء منظومة سفراء أويس، ويأتي ضمن رؤية متكاملة تهدف إلى تعزيز الحضور المؤسسي للوقف، وتوسيع دائرة المشاركة المجتمعية، بما يسهم في تحقيق أثر تنموي مستدام يخدم المجتمع على المدى البعيد."
      ],
      "en": [
        "نفّذ وقف أويس القرني برنامجًا تعريفيًا موجّهًا لسفراء أويس، ضمن توجهه لتعزيز الوعي المؤسسي بفكرة الوقف، وبناء فهم مشترك حول رسالته وأهدافه الاستراتيجية، وذلك في إطار التحضير لمرحلة الانطلاق مع الجاليات واستثمار الفرص المتاحة.",
        "وهدف البرنامج إلى تمكين سفراء أويس معرفيًا، وتوحيد الرؤية حول طبيعة الوقف ودوره التنموي، من خلال تقديم محتوى تعريفي مركز يغطي الجوانب الفكرية والشرعية والاستثمارية والبرامجية للوقف، بما يسهم في تعزيز جاهزية السفراء لأداء دورهم كشركاء فاعلين في تمثيل الوقف داخل مجتمعاتهم.",
        "وتضمّن البرنامج ثلاث جلسات تعريفية عُقدت عن بُعد، تراوحت مدة كل جلسة بين 20 و30 دقيقة. خُصّصت الجلسة الأولى لعرض فكرة تأسيس الوقف ومبررات إنشائه، قدّمها الأستاذ صلاح الدين القياضي، رئيس مجلس إدارة وقف أويس القرني، حيث تناول الهدف الاستراتيجي للوقف، وأسباب اختيار نموذج الوقف كخيار تنموي مستدام، ومنظوره الشرعي، إضافة إلى كونه فكرة تشاركية وصندوقًا قوميًّا يمنيًّا.",
        "فيما تناولت الجلسة الثانية استثمارات الوقف، وقدّمها الأستاذ أيوب علي الروحاني، المدير التنفيذي لشركة أركان الدولية للتجارة الداخلية والخارجية، حيث استعرض آلية عمل لجنة الاستثمار، والسياسات المعتمدة في إدارة الأموال الوقفية، والمشاريع الاستثمارية الحالية، إلى جانب عرض موجز لعوائد الاستثمارات خلال السنوات الخمس الماضية.",
        "واختُتم البرنامج بالجلسة الثالثة التي تناولت برامج الوقف، قدّمها الأستاذ أيمن رياض، مدير البرامج في وقف أويس القرني، حيث استعرض مسارات الوقف الأربعة ومبررات اختيارها، ودور البرامج في تحويل العوائد الاستثمارية إلى مشاريع تنموية ذات أثر مستدام.",
        "وأكد وقف أويس القرني أن هذا البرنامج يُعد محطة تأسيسية مهمة في مسار بناء منظومة سفراء أويس، ويأتي ضمن رؤية متكاملة تهدف إلى تعزيز الحضور المؤسسي للوقف، وتوسيع دائرة المشاركة المجتمعية، بما يسهم في تحقيق أثر تنموي مستدام يخدم المجتمع على المدى البعيد."
      ],
      "tr": [
        "نفّذ وقف أويس القرني برنامجًا تعريفيًا موجّهًا لسفراء أويس، ضمن توجهه لتعزيز الوعي المؤسسي بفكرة الوقف، وبناء فهم مشترك حول رسالته وأهدافه الاستراتيجية، وذلك في إطار التحضير لمرحلة الانطلاق مع الجاليات واستثمار الفرص المتاحة.",
        "وهدف البرنامج إلى تمكين سفراء أويس معرفيًا، وتوحيد الرؤية حول طبيعة الوقف ودوره التنموي، من خلال تقديم محتوى تعريفي مركز يغطي الجوانب الفكرية والشرعية والاستثمارية والبرامجية للوقف، بما يسهم في تعزيز جاهزية السفراء لأداء دورهم كشركاء فاعلين في تمثيل الوقف داخل مجتمعاتهم.",
        "وتضمّن البرنامج ثلاث جلسات تعريفية عُقدت عن بُعد، تراوحت مدة كل جلسة بين 20 و30 دقيقة. خُصّصت الجلسة الأولى لعرض فكرة تأسيس الوقف ومبررات إنشائه، قدّمها الأستاذ صلاح الدين القياضي، رئيس مجلس إدارة وقف أويس القرني، حيث تناول الهدف الاستراتيجي للوقف، وأسباب اختيار نموذج الوقف كخيار تنموي مستدام، ومنظوره الشرعي، إضافة إلى كونه فكرة تشاركية وصندوقًا قوميًّا يمنيًّا.",
        "فيما تناولت الجلسة الثانية استثمارات الوقف، وقدّمها الأستاذ أيوب علي الروحاني، المدير التنفيذي لشركة أركان الدولية للتجارة الداخلية والخارجية، حيث استعرض آلية عمل لجنة الاستثمار، والسياسات المعتمدة في إدارة الأموال الوقفية، والمشاريع الاستثمارية الحالية، إلى جانب عرض موجز لعوائد الاستثمارات خلال السنوات الخمس الماضية.",
        "واختُتم البرنامج بالجلسة الثالثة التي تناولت برامج الوقف، قدّمها الأستاذ أيمن رياض، مدير البرامج في وقف أويس القرني، حيث استعرض مسارات الوقف الأربعة ومبررات اختيارها، ودور البرامج في تحويل العوائد الاستثمارية إلى مشاريع تنموية ذات أثر مستدام.",
        "وأكد وقف أويس القرني أن هذا البرنامج يُعد محطة تأسيسية مهمة في مسار بناء منظومة سفراء أويس، ويأتي ضمن رؤية متكاملة تهدف إلى تعزيز الحضور المؤسسي للوقف، وتوسيع دائرة المشاركة المجتمعية، بما يسهم في تحقيق أثر تنموي مستدام يخدم المجتمع على المدى البعيد."
      ]
    },
    "image": "/news/12-owais-ambassadors-orientation-1.png",
    "imageAlt": {
      "ar": "وقف أويس القرني يطلق لقاءته التعريفية مع سفراء أويس",
      "en": "Veysel Karani Waqf launches orientation meetings with Owais ambassadors",
      "tr": "Veysel Karani Vakfı, Owais elçileriyle tanıtım buluşmalarını başlattı"
    },
    "gallery": [],
    "sourceImages": [
      "/media/1-2-scaled-fe0d0095.png"
    ]
  }
] as const satisfies readonly NewsArticle[];

/**
 * The newest stories retain their reviewed English/Turkish summaries and
 * hand-picked galleries. The generated archive contains every older public
 * WordPress story and is refreshed by `npm run import:news`.
 */
export const newsArticles: NewsArticle[] = [
  ...curatedNewsArticles,
  ...archivedNewsArticles,
].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

const dateLocales: Record<Locale, string> = {
  ar: 'ar',
  en: 'en-US',
  tr: 'tr-TR',
};

function normalize(value: string) {
  return value.toLowerCase().normalize('NFKD');
}

function localizedText(value: LocalizedString, locale: Locale) {
  return value[locale]?.trim() || value.ar;
}

function localizedParagraphs(value: LocalizedParagraphs, locale: Locale) {
  return value[locale]?.length ? value[locale] : value.ar;
}

function localizeArticle(article: NewsArticle, locale: Locale): LocalizedNewsArticle {
  return {
    id: article.id,
    slug: article.slug,
    route: newsRoutes.detail(article.slug),
    sourceSlug: article.sourceSlug,
    sourceUrl: article.sourceUrl,
    publishedAt: article.publishedAt,
    year: article.year,
    sourceLanguage: article.sourceLanguage,
    category: localizedText(article.category, locale),
    title: localizedText(article.title, locale),
    excerpt: localizedText(article.excerpt, locale),
    content: localizedParagraphs(article.content, locale),
    image: article.image,
    imageAlt: localizedText(article.imageAlt, locale),
    gallery: article.gallery.map((image) => ({
      id: image.id,
      image: image.image,
      thumbnail: image.thumbnail,
      sourceUrl: image.sourceUrl,
      title: localizedText(image.title, locale),
      imageAlt: localizedText(image.imageAlt, locale),
      width: image.width,
      height: image.height,
    })),
    sourceImages: [...article.sourceImages],
  };
}

/** Labels merged with the `news-page` CMS entry. */
export function getNewsLabels(locale: Locale): NewsLabels {
  const labels = cmsPageContent('news-page', locale, newsLabels[locale]);
  // Number fields can arrive as an empty string or 0 when the editor clears
  // them; fall back to the defaults instead of rendering nothing.
  const count = (value: unknown, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
  };
  return {
    ...labels,
    hero: labels.hero ?? {},
    seo: labels.seo ?? {},
    layout: {
      sideCount: count(labels.layout?.sideCount, defaultNewsLayout.sideCount),
      pageSize: count(labels.layout?.pageSize, defaultNewsLayout.pageSize),
      relatedCount: count(labels.layout?.relatedCount, defaultNewsLayout.relatedCount),
    },
  };
}

export function getNewsArticles(locale: Locale): LocalizedNewsArticle[] {
  return cmsNews(
    locale,
    newsArticles.map((article) => localizeArticle(article, locale)),
  );
}

export function getNewsArticle(locale: Locale, slug: string | undefined): LocalizedNewsArticle | undefined {
  if (!slug) return undefined;
  return getNewsArticles(locale).find((article) => article.slug === slug);
}

/**
 * Articles with the admin-chosen featured one first, then the rest by date.
 * Falls back to the newest article when nothing is marked featured.
 */
export function getOrderedNews(locale: Locale): LocalizedNewsArticle[] {
  const articles = getNewsArticles(locale);
  const featured = articles.find((article) => article.featured) ?? articles[0];
  if (!featured) return [];
  return [featured, ...articles.filter((article) => article !== featured)];
}

export function getLatestNews(locale: Locale, limit = 3): LocalizedNewsArticle[] {
  return getOrderedNews(locale).slice(0, Math.max(0, limit));
}

/** Undefined when the editor has unpublished every article. */
export function getFeaturedNews(locale: Locale): LocalizedNewsArticle | undefined {
  return getOrderedNews(locale)[0];
}

export function getNewsYears(locale: Locale = 'ar') {
  // The adapter derives `year` from published_at; skip rows without a valid date.
  const years = getNewsArticles(locale)
    .map((article) => article.year)
    .filter((year) => Number.isFinite(year) && year > 0);
  return [...new Set(years)].sort((a, b) => b - a);
}

export function searchNewsArticles(
  articles: LocalizedNewsArticle[],
  query: string,
  year: string
): LocalizedNewsArticle[] {
  const needle = normalize(query.trim());

  return articles.filter((article) => {
    const matchesYear = year === 'all' || String(article.year) === year;
    const haystack = normalize(`${article.title} ${article.excerpt} ${article.content.join(' ')} ${article.year}`);
    return matchesYear && (!needle || haystack.includes(needle));
  });
}

/** Absolute URL for structured data; storage URLs are already absolute (news-16). */
export function absoluteUrl(origin: string, src: string) {
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) return src;
  return `${origin}${src.startsWith('/') ? '' : '/'}${src}`;
}

export function getRelatedNewsArticles(locale: Locale, slug: string, limit = 3) {
  const article = getNewsArticle(locale, slug);
  const articles = getNewsArticles(locale).filter((item) => item.slug !== slug);
  if (!article) return articles.slice(0, limit);

  const sameCategory = articles.filter((item) => item.category === article.category);
  const byDateDistance = articles
    .filter((item) => item.category !== article.category)
    .sort(
      (a, b) =>
        Math.abs(new Date(a.publishedAt).getTime() - new Date(article.publishedAt).getTime()) -
        Math.abs(new Date(b.publishedAt).getTime() - new Date(article.publishedAt).getTime())
    );

  return [...sameCategory, ...byDateDistance].slice(0, limit);
}

export function formatNewsDate(locale: Locale, date: string) {
  return new Intl.DateTimeFormat(dateLocales[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function getNewsBreadcrumbs(locale: Locale, article?: LocalizedNewsArticle): BreadcrumbItem[] {
  const labels = getNewsLabels(locale);
  const crumbs: BreadcrumbItem[] = [
    { label: labels.home, href: '/' },
    article ? { label: labels.news, href: newsRoutes.index } : { label: labels.news },
  ];

  if (article) crumbs.push({ label: article.title });
  return crumbs;
}
