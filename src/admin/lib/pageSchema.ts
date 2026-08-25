// Declarative description of every editable page on the site.
//
// Each entry maps to one `site_pages` row whose `data` is locale-first:
//   { ar: { hero: { title: "…" } }, tr: { … }, en: { … } }
// The dashboard edits one locale at a time, so field paths below are relative
// to `data[locale]`.

import {
  Home,
  Settings2,
  FolderKanban,
  GraduationCap,
  Newspaper,
  BookOpen,
  HandHeart,
  Landmark,
  Scale,
  Users,
  Compass,
  Type,
  Image as ImageIcon,
  BarChart3,
  Handshake,
  Megaphone,
  Info,
  ListTree,
  MessageSquare,
  Video,
  Target,
  Award,
  Route as RouteIcon,
  Building2,
  type LucideIcon,
} from 'lucide-react';
import type { Locale } from '@/lib/types';

/** Compact trilingual label. */
const L = (ar: string, tr: string, en: string): Record<Locale, string> => ({ ar, tr, en });

export type PageFieldType =
  | 'text'
  | 'textarea'
  | 'paragraphs'
  | 'list'
  | 'image'
  | 'url'
  | 'number'
  | 'boolean'
  | 'video'
  | 'repeater';

export type PageFieldDef = {
  /** Dot path inside the locale-scoped page data. */
  path: string;
  label: Record<Locale, string>;
  type: PageFieldType;
  help?: Record<Locale, string>;
  /** Item shape for `repeater` fields; paths are relative to the item. */
  itemFields?: PageFieldDef[];
  /** Item field whose value titles the collapsed row. */
  itemTitleField?: string;
  full?: boolean;
};

export type PageSectionDef = {
  key: string;
  label: Record<Locale, string>;
  icon: LucideIcon;
  /** Element in the live preview to scroll to and outline while editing. */
  anchor?: string;
  fields: PageFieldDef[];
};

export type PageGroup = 'main' | 'about' | 'involve' | 'library' | 'system';

export type SitePageDef = {
  /** Primary key of the `site_pages` row. */
  key: string;
  group: PageGroup;
  label: Record<Locale, string>;
  icon: LucideIcon;
  /** Public route opened in the preview frame. */
  route: string;
  sections: PageSectionDef[];
};

export const PAGE_GROUPS: { key: PageGroup; label: Record<Locale, string> }[] = [
  { key: 'main', label: L('الرئيسية', 'Ana', 'Main') },
  { key: 'about', label: L('عن الوقف', 'Hakkında', 'About') },
  { key: 'involve', label: L('شارك معنا', 'Katılım', 'Get involved') },
  { key: 'library', label: L('المكتبة والأخبار', 'Kütüphane', 'Library & news') },
  { key: 'system', label: L('إعدادات الموقع', 'Site ayarları', 'Site settings') },
];

// Reusable field clusters ----------------------------------------------------
const seoFields = (prefix = 'seo'): PageFieldDef[] => [
  { path: `${prefix}.title`, label: L('عنوان الصفحة', 'Sayfa başlığı', 'Page title'), type: 'text' },
  {
    path: `${prefix}.description`,
    label: L('وصف الصفحة', 'Sayfa açıklaması', 'Page description'),
    type: 'textarea',
  },
];

const heroFields = (prefix = 'hero'): PageFieldDef[] => [
  { path: `${prefix}.title`, label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
  { path: `${prefix}.description`, label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
  { path: `${prefix}.image`, label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
];

const introFields = (prefix = 'intro'): PageFieldDef[] => [
  { path: `${prefix}.eyebrow`, label: L('العنوان الفرعي', 'Üst başlık', 'Eyebrow'), type: 'text' },
  { path: `${prefix}.title`, label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
  {
    path: `${prefix}.paragraphs`,
    label: L('الفقرات', 'Paragraflar', 'Paragraphs'),
    type: 'paragraphs',
  },
];

const linkItemFields: PageFieldDef[] = [
  { path: 'label', label: L('النص', 'Etiket', 'Label'), type: 'text' },
  { path: 'href', label: L('الرابط', 'Bağlantı', 'Link'), type: 'text' },
];

/** Turns a flat label map into individual text fields. */
function labelFields(prefix: string, entries: [string, string, string, string][]): PageFieldDef[] {
  return entries.map(([key, ar, tr, en]) => ({
    path: `${prefix}.${key}`,
    label: L(ar, tr, en),
    type: 'text' as const,
  }));
}

// PAGES ----------------------------------------------------------------------
export const SITE_PAGES: SitePageDef[] = [
  // HOME ---------------------------------------------------------------------
  {
    key: 'home',
    group: 'main',
    label: L('الصفحة الرئيسية', 'Ana sayfa', 'Home'),
    icon: Home,
    route: '/',
    sections: [
      {
        key: 'hero',
        label: L('الواجهة الرئيسية', 'Hero bölümü', 'Hero section'),
        icon: Megaphone,
        anchor: '#hero',
        fields: [
          { path: 'hero.title', label: L('العنوان', 'Başlık', 'Title'), type: 'textarea' },
          { path: 'hero.description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
          {
            path: 'hero.primaryButton',
            label: L('الزر الأساسي', 'Ana buton', 'Primary button'),
            type: 'text',
          },
          {
            path: 'hero.secondaryButton',
            label: L('الزر الثانوي', 'İkincil buton', 'Secondary button'),
            type: 'text',
          },
          { path: 'hero', label: L('فيديو الخلفية', 'Arka plan videosu', 'Background video'), type: 'video' },
        ],
      },
      {
        key: 'about',
        label: L('عن الوقف', 'Vakıf hakkında', 'About the waqf'),
        icon: Info,
        anchor: '#about',
        fields: [
          { path: 'about.eyebrow', label: L('العنوان الفرعي', 'Üst başlık', 'Eyebrow'), type: 'text' },
          { path: 'about.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          { path: 'about.description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
          { path: 'about.image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
          { path: 'about.tabs.vision', label: L('تبويب: الرؤية', 'Sekme: Vizyon', 'Tab: Vision'), type: 'text' },
          { path: 'about.tabs.mission', label: L('تبويب: الرسالة', 'Sekme: Misyon', 'Tab: Mission'), type: 'text' },
          {
            path: 'about.tabs.methodology',
            label: L('تبويب: المنهجية', 'Sekme: Metodoloji', 'Tab: Methodology'),
            type: 'text',
          },
          { path: 'about.tabs.values', label: L('تبويب: القيم', 'Sekme: Değerler', 'Tab: Values'), type: 'text' },
          { path: 'about.tabs.sectors', label: L('تبويب: القطاعات', 'Sekme: Sektörler', 'Tab: Sectors'), type: 'text' },
          { path: 'about.vision', label: L('الرؤية', 'Vizyon', 'Vision'), type: 'textarea' },
          { path: 'about.mission', label: L('الرسالة', 'Misyon', 'Mission'), type: 'list' },
          { path: 'about.methodology', label: L('المنهجية', 'Metodoloji', 'Methodology'), type: 'list' },
          { path: 'about.values', label: L('القيم', 'Değerler', 'Values'), type: 'list' },
          { path: 'about.sectors', label: L('القطاعات', 'Sektörler', 'Sectors'), type: 'list' },
          { path: 'about.goals', label: L('الأهداف', 'Hedefler', 'Goals'), type: 'list' },
        ],
      },
      {
        key: 'projects',
        label: L('المشاريع الوقفية', 'Vakıf projeleri', 'Waqf projects'),
        icon: FolderKanban,
        anchor: '#projects',
        fields: [
          { path: 'projects.eyebrow', label: L('العنوان الفرعي', 'Üst başlık', 'Eyebrow'), type: 'text' },
          { path: 'projects.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          { path: 'projects.description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
          {
            path: 'projects.items',
            label: L('بطاقات المشاريع', 'Proje kartları', 'Project cards'),
            type: 'repeater',
            itemTitleField: 'name',
            itemFields: [
              { path: 'name', label: L('الاسم', 'Ad', 'Name'), type: 'text' },
              { path: 'description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
              { path: 'contribution', label: L('قيمة المساهمة', 'Katkı', 'Contribution'), type: 'text' },
              { path: 'image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
              { path: 'detailsUrl', label: L('رابط التفاصيل', 'Detay bağlantısı', 'Details link'), type: 'text' },
              {
                path: 'contributionUrl',
                label: L('رابط المساهمة', 'Katkı bağlantısı', 'Contribution link'),
                type: 'text',
              },
            ],
          },
        ],
      },
      {
        key: 'programs',
        label: L('البرامج', 'Programlar', 'Programs'),
        icon: GraduationCap,
        anchor: '#programs',
        fields: [
          { path: 'programs.eyebrow', label: L('العنوان الفرعي', 'Üst başlık', 'Eyebrow'), type: 'text' },
          { path: 'programs.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          { path: 'programs.description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
          {
            path: 'programs.items',
            label: L('بطاقات البرامج', 'Program kartları', 'Program cards'),
            type: 'repeater',
            itemTitleField: 'title',
            itemFields: [
              { path: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
              { path: 'description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
              { path: 'image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
              { path: 'url', label: L('الرابط', 'Bağlantı', 'Link'), type: 'text' },
            ],
          },
        ],
      },
      {
        key: 'yemenPioneers',
        label: L('رواد اليمن', 'Yemen öncüleri', 'Yemen pioneers'),
        icon: Award,
        anchor: '#yemen-pioneers',
        fields: [
          { path: 'yemenPioneers.eyebrow', label: L('العنوان الفرعي', 'Üst başlık', 'Eyebrow'), type: 'text' },
          { path: 'yemenPioneers.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          {
            path: 'yemenPioneers.description',
            label: L('الوصف', 'Açıklama', 'Description'),
            type: 'textarea',
          },
          { path: 'yemenPioneers.button', label: L('نص الزر', 'Buton metni', 'Button label'), type: 'text' },
          { path: 'yemenPioneers.image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
          {
            path: 'yemenPioneers.statisticsSource.label',
            label: L('اسم المصدر', 'Kaynak adı', 'Source label'),
            type: 'text',
          },
          {
            path: 'yemenPioneers.statisticsSource.url',
            label: L('رابط المصدر', 'Kaynak bağlantısı', 'Source URL'),
            type: 'url',
          },
          {
            path: 'yemenPioneers.indicators',
            label: L('المؤشرات', 'Göstergeler', 'Indicators'),
            type: 'repeater',
            itemTitleField: 'label',
            itemFields: [
              { path: 'label', label: L('البيان', 'Etiket', 'Label'), type: 'text' },
              { path: 'value', label: L('القيمة', 'Değer', 'Value'), type: 'number' },
            ],
          },
        ],
      },
      {
        key: 'statistics',
        label: L('الإحصائيات', 'İstatistikler', 'Statistics'),
        icon: BarChart3,
        anchor: '#statistics',
        fields: [
          { path: 'statistics.eyebrow', label: L('العنوان الفرعي', 'Üst başlık', 'Eyebrow'), type: 'text' },
          { path: 'statistics.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          { path: 'statistics.description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
          {
            path: 'statistics.source.label',
            label: L('اسم المصدر', 'Kaynak adı', 'Source label'),
            type: 'text',
          },
          {
            path: 'statistics.source.url',
            label: L('رابط المصدر', 'Kaynak bağlantısı', 'Source URL'),
            type: 'url',
          },
          {
            path: 'statistics.indicators',
            label: L('المؤشرات', 'Göstergeler', 'Indicators'),
            type: 'repeater',
            itemTitleField: 'label',
            itemFields: [
              { path: 'label', label: L('البيان', 'Etiket', 'Label'), type: 'text' },
              { path: 'value', label: L('القيمة', 'Değer', 'Value'), type: 'number' },
              { path: 'suffix', label: L('اللاحقة', 'Sonek', 'Suffix'), type: 'text' },
              { path: 'detail', label: L('التفصيل', 'Detay', 'Detail'), type: 'text' },
            ],
          },
        ],
      },
      {
        key: 'news',
        label: L('قسم الأخبار', 'Haber bölümü', 'News section'),
        icon: Newspaper,
        anchor: '#news',
        fields: [
          { path: 'news.eyebrow', label: L('العنوان الفرعي', 'Üst başlık', 'Eyebrow'), type: 'text' },
          { path: 'news.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
        ],
      },
      {
        key: 'partners',
        label: L('الشركاء', 'Ortaklar', 'Partners'),
        icon: Handshake,
        anchor: '#partners',
        fields: [
          { path: 'partners.eyebrow', label: L('العنوان الفرعي', 'Üst başlık', 'Eyebrow'), type: 'text' },
          { path: 'partners.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
        ],
      },
      {
        key: 'participation',
        label: L('دعوة المشاركة', 'Katılım çağrısı', 'Participation call'),
        icon: MessageSquare,
        anchor: '#participate',
        fields: [
          { path: 'participation.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          {
            path: 'participation.description',
            label: L('الوصف', 'Açıklama', 'Description'),
            type: 'textarea',
          },
          {
            path: 'participation.primaryButton',
            label: L('الزر الأساسي', 'Ana buton', 'Primary button'),
            type: 'text',
          },
          {
            path: 'participation.secondaryButton',
            label: L('الزر الثانوي', 'İkincil buton', 'Secondary button'),
            type: 'text',
          },
          { path: 'participation.image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
        ],
      },
    ],
  },

  // SITE SETTINGS ------------------------------------------------------------
  {
    key: 'settings',
    group: 'system',
    label: L('الهوية والتذييل', 'Kimlik ve altbilgi', 'Identity & footer'),
    icon: Settings2,
    route: '/',
    sections: [
      {
        key: 'meta',
        label: L('بيانات الموقع', 'Site meta', 'Site meta'),
        icon: Type,
        fields: [
          { path: 'meta.title', label: L('عنوان المتصفح', 'Tarayıcı başlığı', 'Browser title'), type: 'text' },
          { path: 'meta.description', label: L('وصف الموقع', 'Site açıklaması', 'Site description'), type: 'textarea' },
        ],
      },
      {
        key: 'siteConfig',
        label: L('الهوية القانونية', 'Kurumsal kimlik', 'Legal identity'),
        icon: Building2,
        fields: [
          { path: 'siteConfig.name', label: L('اسم المؤسسة', 'Kurum adı', 'Organisation name'), type: 'text' },
          { path: 'siteConfig.logo', label: L('الشعار', 'Logo', 'Logo'), type: 'image' },
          { path: 'siteConfig.licenseNumber', label: L('رقم الترخيص', 'Lisans no', 'License number'), type: 'text' },
          {
            path: 'siteConfig.courtDecision',
            label: L('قرار المحكمة', 'Mahkeme kararı', 'Court decision'),
            type: 'text',
          },
          { path: 'siteConfig.taxNumber', label: L('الرقم الضريبي', 'Vergi no', 'Tax number'), type: 'text' },
          {
            path: 'siteConfig.taxExempt',
            label: L('إعفاء ضريبي', 'Vergi muafiyeti', 'Tax exempt'),
            type: 'boolean',
          },
          { path: 'siteConfig.socialLinks.facebook', label: L('فيسبوك', 'Facebook', 'Facebook'), type: 'url' },
          { path: 'siteConfig.socialLinks.twitter', label: L('تويتر / X', 'Twitter / X', 'Twitter / X'), type: 'url' },
          { path: 'siteConfig.socialLinks.instagram', label: L('إنستغرام', 'Instagram', 'Instagram'), type: 'url' },
          { path: 'siteConfig.socialLinks.youtube', label: L('يوتيوب', 'YouTube', 'YouTube'), type: 'url' },
        ],
      },
      {
        key: 'navLinks',
        label: L('قائمة التنقل', 'Menü bağlantıları', 'Navigation menu'),
        icon: ListTree,
        anchor: 'header',
        fields: [
          {
            path: 'navLinks',
            label: L('روابط القائمة', 'Menü bağlantıları', 'Menu links'),
            type: 'repeater',
            itemTitleField: 'label',
            itemFields: linkItemFields,
          },
        ],
      },
      {
        key: 'footer',
        label: L('التذييل', 'Altbilgi', 'Footer'),
        icon: Landmark,
        anchor: 'footer',
        fields: [
          { path: 'footer.description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
          {
            path: 'footer.contactInfo.address',
            label: L('العنوان البريدي', 'Adres', 'Address'),
            type: 'textarea',
          },
          { path: 'footer.contactInfo.email', label: L('البريد الإلكتروني', 'E-posta', 'Email'), type: 'text' },
          { path: 'footer.contactInfo.phone', label: L('الهاتف', 'Telefon', 'Phone'), type: 'text' },
          {
            path: 'footer.bankAccountsLink',
            label: L('رابط الحسابات البنكية', 'Banka hesapları bağlantısı', 'Bank accounts link'),
            type: 'text',
          },
          {
            path: 'footer.newsletterTitle',
            label: L('عنوان النشرة', 'Bülten başlığı', 'Newsletter title'),
            type: 'text',
          },
          {
            path: 'footer.newsletterDescription',
            label: L('وصف النشرة', 'Bülten açıklaması', 'Newsletter description'),
            type: 'textarea',
          },
          {
            path: 'footer.quickLinks',
            label: L('روابط سريعة', 'Hızlı bağlantılar', 'Quick links'),
            type: 'repeater',
            itemTitleField: 'label',
            itemFields: linkItemFields,
          },
        ],
      },
      {
        key: 'uiCommon',
        label: L('أزرار ونصوص متكررة', 'Ortak metinler', 'Common labels'),
        icon: Type,
        fields: labelFields('ui.common', [
          ['learnMore', 'اعرف المزيد', 'Daha fazla', 'Learn more'],
          ['readMore', 'اقرأ المزيد', 'Devamını oku', 'Read more'],
          ['viewDetails', 'عرض التفاصيل', 'Detaylar', 'View details'],
          ['donateWithUs', 'ساهم معنا', 'Bizimle bağış yapın', 'Donate with us'],
          ['donateNow', 'ساهم الآن', 'Şimdi bağış yap', 'Donate now'],
          ['quickLinks', 'روابط سريعة', 'Hızlı bağlantılar', 'Quick links'],
          ['subscribe', 'اشترك', 'Abone ol', 'Subscribe'],
          ['subscribed', 'تم الاشتراك', 'Abone olundu', 'Subscribed'],
          ['emailPlaceholder', 'حقل البريد', 'E-posta alanı', 'Email placeholder'],
          ['taxExempt', 'إعفاء ضريبي', 'Vergi muafiyeti', 'Tax exempt'],
          ['discoverMore', 'اكتشف المزيد', 'Keşfet', 'Discover more'],
          ['unavailable', 'غير متاح', 'Mevcut değil', 'Unavailable'],
        ]),
      },
      {
        key: 'uiFooter',
        label: L('نصوص التذييل', 'Altbilgi metinleri', 'Footer labels'),
        icon: Landmark,
        fields: labelFields('ui.footer', [
          ['licensePrefix', 'بادئة الترخيص', 'Lisans ön eki', 'License prefix'],
          ['courtDecisionPrefix', 'بادئة قرار المحكمة', 'Mahkeme kararı ön eki', 'Court decision prefix'],
          ['taxNumberPrefix', 'بادئة الرقم الضريبي', 'Vergi no ön eki', 'Tax number prefix'],
          ['rightsReserved', 'حقوق النشر', 'Telif hakkı', 'Rights reserved'],
          ['yearSuffix', 'لاحقة السنة', 'Yıl son eki', 'Year suffix'],
        ]),
      },
      {
        key: 'uiAccessibility',
        label: L('نصوص إمكانية الوصول', 'Erişilebilirlik', 'Accessibility labels'),
        icon: Compass,
        fields: labelFields('ui.accessibility', [
          ['openMenu', 'فتح القائمة', 'Menüyü aç', 'Open menu'],
          ['closeMenu', 'إغلاق القائمة', 'Menüyü kapat', 'Close menu'],
          ['playVideo', 'تشغيل الفيديو', 'Videoyu oynat', 'Play video'],
          ['closeVideo', 'إغلاق الفيديو', 'Videoyu kapat', 'Close video'],
          ['scrollDown', 'التمرير لأسفل', 'Aşağı kaydır', 'Scroll down'],
          ['videoTitle', 'عنوان الفيديو', 'Video başlığı', 'Video title'],
          ['loadingVideo', 'جارٍ تحميل الفيديو', 'Video yükleniyor', 'Loading video'],
          ['languageSwitcher', 'مبدّل اللغة', 'Dil değiştirici', 'Language switcher'],
        ]),
      },
    ],
  },

  // PROJECTS INDEX -----------------------------------------------------------
  {
    key: 'projects-page',
    group: 'main',
    label: L('صفحة المشاريع', 'Projeler sayfası', 'Projects page'),
    icon: FolderKanban,
    route: '/projects',
    sections: [
      { key: 'seo', label: L('تحسين محركات البحث', 'SEO', 'SEO'), icon: Type, fields: seoFields() },
      { key: 'hero', label: L('الواجهة', 'Hero', 'Hero'), icon: ImageIcon, fields: heroFields() },
      { key: 'intro', label: L('المقدمة', 'Giriş', 'Intro'), icon: Info, fields: introFields() },
      {
        key: 'grid',
        label: L('شبكة المشاريع', 'Proje ızgarası', 'Projects grid'),
        icon: FolderKanban,
        fields: [
          { path: 'grid.eyebrow', label: L('العنوان الفرعي', 'Üst başlık', 'Eyebrow'), type: 'text' },
          { path: 'grid.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          { path: 'grid.description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
        ],
      },
      {
        key: 'labels',
        label: L('النصوص والأزرار', 'Etiketler', 'Labels'),
        icon: Type,
        fields: labelFields('labels', [
          ['projectBadge', 'شارة المشروع', 'Proje rozeti', 'Project badge'],
          ['contribution', 'المساهمة', 'Katkı', 'Contribution'],
          ['details', 'التفاصيل', 'Detaylar', 'Details'],
          ['contribute', 'ساهم', 'Katkıda bulun', 'Contribute'],
          ['externalNotice', 'تنبيه رابط خارجي', 'Dış bağlantı uyarısı', 'External notice'],
          ['source', 'المصدر', 'Kaynak', 'Source'],
          ['facts', 'الحقائق', 'Bilgiler', 'Facts'],
          ['overview', 'نظرة عامة', 'Genel bakış', 'Overview'],
        ]),
      },
    ],
  },

  // PROGRAMS INDEX -----------------------------------------------------------
  {
    key: 'programs-page',
    group: 'main',
    label: L('صفحات البرامج', 'Program sayfaları', 'Programs pages'),
    icon: GraduationCap,
    route: '/programs/yemen-pioneers',
    sections: [
      {
        key: 'nav',
        label: L('قائمة البرامج', 'Program menüsü', 'Programs menu'),
        icon: ListTree,
        fields: [
          {
            path: 'nav',
            label: L('روابط البرامج', 'Program bağlantıları', 'Program links'),
            type: 'repeater',
            itemTitleField: 'label',
            itemFields: linkItemFields,
          },
        ],
      },
      {
        key: 'labels',
        label: L('نصوص صفحات البرامج', 'Program etiketleri', 'Program labels'),
        icon: Type,
        fields: labelFields('labels', [
          ['overview', 'نظرة عامة', 'Genel bakış', 'Overview'],
          ['goals', 'الأهداف', 'Hedefler', 'Goals'],
          ['components', 'المكوّنات', 'Bileşenler', 'Components'],
          ['statistics', 'الإحصائيات', 'İstatistikler', 'Statistics'],
          ['initiatives', 'المبادرات', 'Girişimler', 'Initiatives'],
          ['products', 'المنتجات', 'Ürünler', 'Products'],
          ['watchVideo', 'مشاهدة الفيديو', 'Videoyu izle', 'Watch video'],
          ['officialSource', 'المصدر الرسمي', 'Resmî kaynak', 'Official source'],
          ['contact', 'تواصل', 'İletişim', 'Contact'],
          ['otherPrograms', 'برامج أخرى', 'Diğer programlar', 'Other programs'],
          ['details', 'التفاصيل', 'Detaylar', 'Details'],
          ['donate', 'ساهم', 'Bağış', 'Donate'],
          ['journey', 'المسار', 'Yolculuk', 'Journey'],
          ['pillars', 'الركائز', 'Sütunlar', 'Pillars'],
          ['videoGallery', 'معرض الفيديو', 'Video galerisi', 'Video gallery'],
        ]),
      },
    ],
  },

  // ABOUT: WAQF --------------------------------------------------------------
  {
    key: 'about-waqf',
    group: 'about',
    label: L('عن الوقف', 'Vakıf hakkında', 'About the waqf'),
    icon: Landmark,
    route: '/about/waqf',
    sections: [
      { key: 'seo', label: L('تحسين محركات البحث', 'SEO', 'SEO'), icon: Type, fields: seoFields() },
      { key: 'hero', label: L('الواجهة', 'Hero', 'Hero'), icon: ImageIcon, fields: heroFields() },
      {
        key: 'intro',
        label: L('المقدمة والحقائق', 'Giriş ve bilgiler', 'Intro & facts'),
        icon: Info,
        fields: [
          ...introFields(),
          {
            path: 'intro.downloadLabel',
            label: L('نص زر التحميل', 'İndirme butonu', 'Download label'),
            type: 'text',
          },
          { path: 'intro.downloadUrl', label: L('رابط التحميل', 'İndirme bağlantısı', 'Download URL'), type: 'text' },
          {
            path: 'intro.facts',
            label: L('الحقائق', 'Bilgiler', 'Facts'),
            type: 'repeater',
            itemTitleField: 'label',
            itemFields: [
              { path: 'label', label: L('البيان', 'Etiket', 'Label'), type: 'text' },
              { path: 'value', label: L('القيمة', 'Değer', 'Value'), type: 'text' },
            ],
          },
        ],
      },
      {
        key: 'video',
        label: L('الفيديو التعريفي', 'Tanıtım videosu', 'Intro video'),
        icon: Video,
        fields: [
          { path: 'video.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          { path: 'video.description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
          { path: 'video', label: L('الفيديو', 'Video', 'Video'), type: 'video' },
        ],
      },
      {
        key: 'goals',
        label: L('الأهداف', 'Hedefler', 'Goals'),
        icon: Target,
        fields: [
          { path: 'goals.eyebrow', label: L('العنوان الفرعي', 'Üst başlık', 'Eyebrow'), type: 'text' },
          { path: 'goals.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          { path: 'goals.description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
          { path: 'goals.items', label: L('قائمة الأهداف', 'Hedef listesi', 'Goal list'), type: 'list' },
        ],
      },
      {
        key: 'identity',
        label: L('الرؤية والرسالة والقيم', 'Vizyon, misyon, değerler', 'Vision, mission, values'),
        icon: Compass,
        fields: [
          { path: 'identity.ctaLabel', label: L('نص الزر', 'Buton metni', 'CTA label'), type: 'text' },
          { path: 'identity.visionTitle', label: L('عنوان الرؤية', 'Vizyon başlığı', 'Vision title'), type: 'text' },
          { path: 'identity.vision', label: L('الرؤية', 'Vizyon', 'Vision'), type: 'textarea' },
          { path: 'identity.missionTitle', label: L('عنوان الرسالة', 'Misyon başlığı', 'Mission title'), type: 'text' },
          { path: 'identity.mission', label: L('الرسالة', 'Misyon', 'Mission'), type: 'textarea' },
          { path: 'identity.valuesTitle', label: L('عنوان القيم', 'Değerler başlığı', 'Values title'), type: 'text' },
          { path: 'identity.values', label: L('القيم', 'Değerler', 'Values'), type: 'list' },
        ],
      },
      {
        key: 'methodology',
        label: L('المنهجية', 'Metodoloji', 'Methodology'),
        icon: RouteIcon,
        fields: [
          { path: 'methodology.eyebrow', label: L('العنوان الفرعي', 'Üst başlık', 'Eyebrow'), type: 'text' },
          { path: 'methodology.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          { path: 'methodology.description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
          { path: 'methodology.stepLabel', label: L('كلمة "خطوة"', 'Adım etiketi', 'Step label'), type: 'text' },
          { path: 'methodology.itemTitles', label: L('عناوين الخطوات', 'Adım başlıkları', 'Step titles'), type: 'list' },
          { path: 'methodology.items', label: L('شرح الخطوات', 'Adım açıklamaları', 'Step descriptions'), type: 'list' },
        ],
      },
      {
        key: 'president',
        label: L('كلمة الرئيس', 'Başkanın mesajı', "President's message"),
        icon: Users,
        fields: [
          { path: 'president.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          { path: 'president.name', label: L('الاسم', 'Ad', 'Name'), type: 'text' },
          { path: 'president.role', label: L('الصفة', 'Görev', 'Role'), type: 'text' },
          { path: 'president.image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
          { path: 'president.paragraphs', label: L('النص', 'Metin', 'Text'), type: 'paragraphs' },
        ],
      },
      {
        key: 'cycle',
        label: L('دورة الوقف', 'Vakıf döngüsü', 'Waqf cycle'),
        icon: RouteIcon,
        fields: [
          { path: 'cycle.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          { path: 'cycle.description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
          {
            path: 'cycle.phases',
            label: L('المراحل', 'Aşamalar', 'Phases'),
            type: 'repeater',
            itemTitleField: 'title',
            itemFields: [
              { path: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
              { path: 'description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
              { path: 'bullets', label: L('النقاط', 'Maddeler', 'Bullets'), type: 'list' },
            ],
          },
        ],
      },
    ],
  },

  // ABOUT: GOVERNANCE --------------------------------------------------------
  {
    key: 'governance',
    group: 'about',
    label: L('الحوكمة والسياسات', 'Yönetişim', 'Governance'),
    icon: Scale,
    route: '/about/governance',
    sections: [
      { key: 'seo', label: L('تحسين محركات البحث', 'SEO', 'SEO'), icon: Type, fields: seoFields() },
      { key: 'hero', label: L('الواجهة', 'Hero', 'Hero'), icon: ImageIcon, fields: heroFields() },
      {
        key: 'intro',
        label: L('المقدمة', 'Giriş', 'Intro'),
        icon: Info,
        fields: [
          { path: 'intro.eyebrow', label: L('العنوان الفرعي', 'Üst başlık', 'Eyebrow'), type: 'text' },
          { path: 'intro.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          { path: 'intro.description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
          { path: 'intro.navTitle', label: L('عنوان القائمة', 'Menü başlığı', 'Nav title'), type: 'text' },
        ],
      },
      {
        key: 'policies',
        label: L('السياسات', 'Politikalar', 'Policies'),
        icon: Scale,
        fields: [
          {
            path: 'policies',
            label: L('قائمة السياسات', 'Politika listesi', 'Policy list'),
            type: 'repeater',
            itemTitleField: 'title',
            itemFields: [
              { path: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
              { path: 'summary', label: L('الملخص', 'Özet', 'Summary'), type: 'textarea' },
              {
                path: 'blocks',
                label: L('الأقسام', 'Bloklar', 'Blocks'),
                type: 'repeater',
                itemTitleField: 'heading',
                itemFields: [
                  { path: 'heading', label: L('العنوان', 'Başlık', 'Heading'), type: 'text' },
                  { path: 'paragraphs', label: L('الفقرات', 'Paragraflar', 'Paragraphs'), type: 'paragraphs' },
                  { path: 'bullets', label: L('النقاط', 'Maddeler', 'Bullets'), type: 'list' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // ABOUT NAV ----------------------------------------------------------------
  {
    key: 'about-nav',
    group: 'about',
    label: L('قائمة "عن الوقف"', 'Hakkında menüsü', 'About menu'),
    icon: ListTree,
    route: '/about/waqf',
    sections: [
      {
        key: 'nav',
        label: L('روابط القائمة', 'Menü bağlantıları', 'Menu links'),
        icon: ListTree,
        fields: [
          {
            path: '',
            label: L('الروابط', 'Bağlantılar', 'Links'),
            type: 'repeater',
            itemTitleField: 'label',
            itemFields: linkItemFields,
          },
        ],
      },
    ],
  },

  // DONATE -------------------------------------------------------------------
  {
    key: 'donate-page',
    group: 'involve',
    label: L('صفحة المساهمة', 'Bağış sayfası', 'Donate page'),
    icon: HandHeart,
    route: '/donate',
    sections: [
      { key: 'seo', label: L('تحسين محركات البحث', 'SEO', 'SEO'), icon: Type, fields: seoFields() },
      {
        key: 'hero',
        label: L('الواجهة', 'Hero', 'Hero'),
        icon: ImageIcon,
        fields: [
          ...heroFields(),
          { path: 'hero.imageAlt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image alt'), type: 'text' },
        ],
      },
      { key: 'intro', label: L('المقدمة', 'Giriş', 'Intro'), icon: Info, fields: introFields() },
      {
        key: 'labels',
        label: L('النصوص والأزرار', 'Etiketler', 'Labels'),
        icon: Type,
        fields: labelFields('labels', [
          ['opportunities', 'الفرص', 'Fırsatlar', 'Opportunities'],
          ['contributionValue', 'قيمة المساهمة', 'Katkı değeri', 'Contribution value'],
          ['available', 'متاح', 'Mevcut', 'Available'],
          ['closed', 'مغلق', 'Kapalı', 'Closed'],
          ['contribute', 'ساهم', 'Katkıda bulun', 'Contribute'],
          ['unavailable', 'غير متاح', 'Mevcut değil', 'Unavailable'],
          ['officialNotice', 'تنبيه رسمي', 'Resmî uyarı', 'Official notice'],
          ['externalNotice', 'تنبيه رابط خارجي', 'Dış bağlantı uyarısı', 'External notice'],
        ]),
      },
    ],
  },

  // PARTICIPATE --------------------------------------------------------------
  {
    key: 'participate',
    group: 'involve',
    label: L('صفحات المشاركة', 'Katılım sayfaları', 'Participate pages'),
    icon: MessageSquare,
    route: '/participate/share-ideas',
    sections: [
      {
        key: 'nav',
        label: L('قائمة المشاركة', 'Katılım menüsü', 'Participate menu'),
        icon: ListTree,
        fields: [
          {
            path: 'nav',
            label: L('الروابط', 'Bağlantılar', 'Links'),
            type: 'repeater',
            itemTitleField: 'label',
            itemFields: [
              { path: 'key', label: L('المفتاح', 'Anahtar', 'Key'), type: 'text' },
              ...linkItemFields,
            ],
          },
        ],
      },
      {
        key: 'labels',
        label: L('نصوص النماذج', 'Form etiketleri', 'Form labels'),
        icon: Type,
        fields: labelFields('labels', [
          ['sectionTitle', 'عنوان القسم', 'Bölüm başlığı', 'Section title'],
          ['formNotice', 'تنبيه النموذج', 'Form uyarısı', 'Form notice'],
          ['submit', 'إرسال', 'Gönder', 'Submit'],
          ['submitting', 'جارٍ الإرسال', 'Gönderiliyor', 'Submitting'],
          ['next', 'التالي', 'İleri', 'Next'],
          ['previous', 'السابق', 'Geri', 'Previous'],
          ['step', 'خطوة', 'Adım', 'Step'],
          ['requiredMessage', 'رسالة الحقل المطلوب', 'Zorunlu alan mesajı', 'Required message'],
          ['emailMessage', 'رسالة البريد', 'E-posta mesajı', 'Email message'],
          ['submitSuccess', 'رسالة النجاح', 'Başarı mesajı', 'Success message'],
          ['submitError', 'رسالة الخطأ', 'Hata mesajı', 'Error message'],
          ['selectedFiles', 'الملفات المختارة', 'Seçilen dosyalar', 'Selected files'],
          ['openLink', 'فتح الرابط', 'Bağlantıyı aç', 'Open link'],
        ]),
      },
      ...(
        [
          ['shareIdeas', 'شارك بفكرة', 'Fikir paylaş', 'Share an idea'],
          ['complaintsSuggestions', 'الشكاوى والمقترحات', 'Şikayet ve öneriler', 'Complaints & suggestions'],
          ['volunteer', 'التطوع', 'Gönüllülük', 'Volunteer'],
          ['contact', 'تواصل معنا', 'İletişim', 'Contact us'],
        ] as const
      ).map(([key, ar, tr, en]) => ({
        key: `page-${key}`,
        label: L(ar, tr, en),
        icon: MessageSquare,
        fields: [
          ...seoFields(`pages.${key}.seo`),
          { path: `pages.${key}.hero.title`, label: L('عنوان الواجهة', 'Hero başlığı', 'Hero title'), type: 'text' as const },
          {
            path: `pages.${key}.hero.description`,
            label: L('وصف الواجهة', 'Hero açıklaması', 'Hero description'),
            type: 'textarea' as const,
          },
          { path: `pages.${key}.hero.image`, label: L('صورة الواجهة', 'Hero görseli', 'Hero image'), type: 'image' as const },
          { path: `pages.${key}.intro.eyebrow`, label: L('العنوان الفرعي', 'Üst başlık', 'Eyebrow'), type: 'text' as const },
          { path: `pages.${key}.intro.title`, label: L('عنوان المقدمة', 'Giriş başlığı', 'Intro title'), type: 'text' as const },
          {
            path: `pages.${key}.intro.paragraphs`,
            label: L('فقرات المقدمة', 'Giriş paragrafları', 'Intro paragraphs'),
            type: 'paragraphs' as const,
          },
          {
            path: `pages.${key}.form.title`,
            label: L('عنوان النموذج', 'Form başlığı', 'Form title'),
            type: 'text' as const,
          },
          {
            path: `pages.${key}.form.description`,
            label: L('وصف النموذج', 'Form açıklaması', 'Form description'),
            type: 'textarea' as const,
          },
          {
            path: `pages.${key}.form.fields`,
            label: L('حقول النموذج', 'Form alanları', 'Form fields'),
            type: 'repeater' as const,
            itemTitleField: 'label',
            itemFields: [
              {
                // Form steps reference their fields by this name, so unlike
                // other records it cannot be generated behind the scenes.
                path: 'id',
                label: L('اسم الحقل', 'Alan adı', 'Field name'),
                type: 'text' as const,
                help: L(
                  'يربط الحقل بخطوات النموذج — لا تغيّره إلا عند الضرورة',
                  'Alanı form adımlarına bağlar — gerekmedikçe değiştirmeyin',
                  'Links the field to the form steps — change only if necessary',
                ),
              },
              { path: 'label', label: L('العنوان', 'Etiket', 'Label'), type: 'text' as const },
              { path: 'placeholder', label: L('النص التوضيحي', 'Yer tutucu', 'Placeholder'), type: 'text' as const },
              { path: 'type', label: L('النوع', 'Tür', 'Type'), type: 'text' as const },
              { path: 'required', label: L('مطلوب', 'Zorunlu', 'Required'), type: 'boolean' as const },
              { path: 'options', label: L('الخيارات', 'Seçenekler', 'Options'), type: 'list' as const },
            ],
          },
        ],
      })),
    ],
  },

  // LIBRARY & NEWS COPY ------------------------------------------------------
  {
    key: 'library-page',
    group: 'library',
    label: L('صفحة المكتبة', 'Kütüphane sayfası', 'Library page'),
    icon: BookOpen,
    route: '/library',
    sections: [
      {
        key: 'hero',
        label: L('الواجهة', 'Hero', 'Hero'),
        icon: ImageIcon,
        fields: [
          { path: 'hero.eyebrow', label: L('العنوان الفرعي', 'Üst başlık', 'Eyebrow'), type: 'text' },
          ...heroFields(),
        ],
      },
      {
        key: 'labels',
        label: L('نصوص المكتبة', 'Kütüphane etiketleri', 'Library labels'),
        icon: Type,
        fields: labelFields('labels', [
          ['library', 'المكتبة', 'Kütüphane', 'Library'],
          ['browse', 'تصفح القسم', 'Bölüme göz at', 'Browse section'],
          ['latest', 'أحدث المواد', 'En yeniler', 'Latest items'],
          ['search', 'بحث', 'Ara', 'Search'],
          ['searchPlaceholder', 'نص حقل البحث', 'Arama yer tutucu', 'Search placeholder'],
          ['noResults', 'لا نتائج', 'Sonuç yok', 'No results'],
          ['readArticle', 'قراءة المقال', 'Makaleyi oku', 'Read article'],
          ['readStory', 'قراءة القصة', 'Hikayeyi oku', 'Read story'],
          ['openDocument', 'فتح الوثيقة', 'Belgeyi aç', 'Open document'],
          ['downloadPdf', 'تحميل PDF', 'PDF indir', 'Download PDF'],
          ['officialSource', 'المصدر الرسمي', 'Resmî kaynak', 'Official source'],
          ['readingTime', 'وقت القراءة', 'Okuma süresi', 'Reading time'],
          ['share', 'مشاركة', 'Paylaş', 'Share'],
          ['donateCta', 'دعوة المساهمة', 'Bağış çağrısı', 'Donate CTA'],
        ]),
      },
    ],
  },
  {
    key: 'news-page',
    group: 'library',
    label: L('صفحة الأخبار', 'Haberler sayfası', 'News page'),
    icon: Newspaper,
    route: '/news',
    sections: [
      {
        key: 'hero',
        label: L('الواجهة والنصوص', 'Hero ve etiketler', 'Hero & labels'),
        icon: ImageIcon,
        fields: labelFields('', [
          ['eyebrow', 'العنوان الفرعي', 'Üst başlık', 'Eyebrow'],
          ['news', 'كلمة "الأخبار"', 'Haberler', 'News'],
          ['heroDescription', 'وصف الواجهة', 'Hero açıklaması', 'Hero description'],
          ['featured', 'الخبر المميّز', 'Öne çıkan', 'Featured'],
          ['latest', 'الأحدث', 'En yeni', 'Latest'],
          ['readArticle', 'قراءة الخبر', 'Haberi oku', 'Read article'],
          ['allNews', 'كل الأخبار', 'Tüm haberler', 'All news'],
          ['search', 'بحث', 'Ara', 'Search'],
          ['searchPlaceholder', 'نص حقل البحث', 'Arama yer tutucu', 'Search placeholder'],
          ['allYears', 'كل السنوات', 'Tüm yıllar', 'All years'],
          ['noResults', 'لا نتائج', 'Sonuç yok', 'No results'],
          ['published', 'تاريخ النشر', 'Yayın tarihi', 'Published'],
          ['officialSource', 'المصدر الرسمي', 'Resmî kaynak', 'Official source'],
          ['related', 'أخبار ذات صلة', 'İlgili haberler', 'Related'],
          ['backToNews', 'العودة للأخبار', 'Haberlere dön', 'Back to news'],
          ['share', 'مشاركة', 'Paylaş', 'Share'],
        ]).map((field) => ({ ...field, path: field.path.replace(/^\./, '') })),
      },
    ],
  },
];

export function getPageDef(key: string): SitePageDef | undefined {
  return SITE_PAGES.find((page) => page.key === key);
}

/** Number of leaf fields on a page — shown next to its name in the page list. */
export function countPageFields(page: SitePageDef): number {
  const countField = (field: PageFieldDef): number =>
    field.type === 'repeater' ? (field.itemFields ?? []).reduce((sum, f) => sum + countField(f), 0) : 1;
  return page.sections.reduce(
    (sum, section) => sum + section.fields.reduce((inner, field) => inner + countField(field), 0),
    0,
  );
}
