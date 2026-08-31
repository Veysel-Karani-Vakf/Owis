import {
  Newspaper,
  FolderKanban,
  GraduationCap,
  BookOpen,
  FileText,
  Images,
  HandHeart,
  Handshake,
  BarChart3,
  Landmark,
  type LucideIcon,
} from 'lucide-react';
import type { Locale } from '@/lib/types';
import type { FieldDef, ResourceDef, SelectOption } from './fields';
import type { PageFieldDef } from './pageSchema';

/** compact trilingual label */
const L = (ar: string, tr: string, en: string): Record<Locale, string> => ({ ar, tr, en });

// Shared field builders -------------------------------------------------------
const fPublished: FieldDef = {
  key: 'is_published',
  label: L('منشور على الموقع', 'Sitede yayında', 'Published on the site'),
  type: 'boolean',
  help: L('ألغِ التحديد لإخفائه من الموقع دون حذفه', 'Silmeden gizlemek için işareti kaldırın', 'Untick to hide it from the site without deleting it'),
};
const fSort: FieldDef = {
  key: 'sort_order',
  label: L('الترتيب', 'Sıra', 'Order'),
  type: 'number',
  advanced: true,
  help: L(
    'يُضبط بالأسهم في القائمة',
    'Listedeki oklarla ayarlanır',
    'Set with the arrows in the list',
  ),
};

const seoGroup: PageFieldDef[] = [
  { path: 'title', label: L('عنوان الصفحة في جوجل', 'Google başlığı', 'Search title'), type: 'text' },
  {
    path: 'description',
    label: L('وصف الصفحة في جوجل', 'Google açıklaması', 'Search description'),
    type: 'textarea',
  },
  {
    path: 'canonical',
    label: L('الرابط الأساسي (canonical)', 'Kanonik bağlantı', 'Canonical URL'),
    type: 'url',
    advanced: true,
    help: L('اتركه فارغاً إلا إذا كانت الصفحة منشورة على رابط آخر أيضاً', 'Sayfa başka bir adreste de yayındaysa doldurun', 'Leave empty unless the page also lives at another address'),
  },
];

const ctaGroup: PageFieldDef[] = [
  { path: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
  { path: 'description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
  { path: 'button', label: L('نص الزر', 'Buton metni', 'Button label'), type: 'text' },
  {
    path: 'url',
    label: L('وجهة الزر', 'Buton hedefi', 'Button destination'),
    type: 'text',
    help: L('مثال: /donate — يُستخدم /donate إن تُرك فارغاً', 'Örnek: /donate', 'Example: /donate — /donate is used when empty'),
  },
];

const phaseGroup: PageFieldDef[] = [
  { path: 'label', label: L('اسم المرحلة', 'Aşama adı', 'Phase name'), type: 'text' },
  { path: 'period', label: L('الفترة الزمنية', 'Dönem', 'Period'), type: 'text' },
  { path: 'description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
];

/** Shorthand for a grouped value stored per language. */
const group = (
  key: string,
  label: Record<Locale, string>,
  itemFields: PageFieldDef[],
  extra: Partial<FieldDef> = {},
): FieldDef => ({
  key,
  label,
  type: 'localizedGroup',
  itemFields,
  ...extra,
});

export type FullResourceDef = ResourceDef & { icon: LucideIcon };

const forumOptions: SelectOption[] = [
  { value: 'forum', label: L('منتدى الوقف (مقالات)', 'Vakıf forumu', 'Waqf forum (articles)') },
  { value: 'success-stories', label: L('قصص النجاح', 'Başarı hikayeleri', 'Success stories') },
  { value: 'yemeni-figures', label: L('شخصيات يمانية', 'Yemenli şahsiyetler', 'Yemeni figures') },
];

const docCollectionOptions: SelectOption[] = [
  { value: 'periodic-reports', label: L('التقارير الدورية', 'Periyodik raporlar', 'Periodic reports') },
  { value: 'waqf-books', label: L('كتب الوقف', 'Vakıf kitapları', 'Waqf books') },
  { value: 'waqf-literature', label: L('أدبيات الوقف', 'Vakıf literatürü', 'Waqf literature') },
];

const statGroupOptions: SelectOption[] = [
  { value: 'statistics', label: L('إحصائيات الوقف (الصفحة الرئيسية)', 'Vakıf istatistikleri (ana sayfa)', 'Waqf statistics (home page)') },
  { value: 'yemen-pioneers', label: L('أرقام رواد اليمن', 'Yemen öncüleri rakamları', 'Yemen pioneers figures') },
];

const languageOptions: SelectOption[] = [
  { value: 'ar', label: L('العربية', 'Arapça', 'Arabic') },
  { value: 'tr', label: L('التركية', 'Türkçe', 'Turkish') },
  { value: 'en', label: L('الإنجليزية', 'İngilizce', 'English') },
];

const programLayoutOptions: SelectOption[] = [
  { value: '', label: L('تلقائي (حسب البرنامج)', 'Otomatik', 'Automatic (by program)') },
  { value: 'generic', label: L('تخطيط عام (نظرة عامة، أهداف، إحصائيات…)', 'Genel düzen', 'Generic (overview, goals, statistics…)') },
  { value: 'pioneers', label: L('تخطيط رواد اليمن (مسار وركائز وأرقام)', 'Yemen öncüleri düzeni', 'Yemen pioneers layout (journey, pillars, figures)') },
  { value: 'volunteer', label: L('تخطيط الوحدة التطوعية', 'Gönüllü birimi düzeni', 'Volunteer unit layout') },
  { value: 'institutional', label: L('تخطيط التطوير المؤسسي', 'Kurumsal gelişim düzeni', 'Institutional development layout') },
  { value: 'awareness', label: L('تخطيط منصة أويس (التوعية)', 'Farkındalık düzeni', 'Owais platform (awareness) layout') },
];

// Item shapes for the repeating groups stored as jsonb on content rows. -------
const F = {
  title: { path: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
  description: { path: 'description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
  image: { path: 'image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
  imageAlt: { path: 'imageAlt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'), type: 'text' },
  url: { path: 'url', label: L('الرابط', 'Bağlantı', 'Link'), type: 'text' },
  icon: {
    path: 'icon',
    label: L('الأيقونة', 'Simge', 'Icon'),
    type: 'icon',
    help: L('اختياري', 'İsteğe bağlı', 'Optional'),
  },
} satisfies Record<string, PageFieldDef>;

/** Project facts: one list, texts per language (matches how rows are stored). */
const factItem: PageFieldDef[] = [
  { path: 'label', label: L('البيان', 'Etiket', 'Label'), type: 'localized' },
  { path: 'value', label: L('القيمة', 'Değer', 'Value'), type: 'localized' },
];

const allocationItem: PageFieldDef[] = [
  {
    path: 'percent',
    label: L('النسبة', 'Yüzde', 'Percent'),
    type: 'text',
    help: L('مثال: 40%', 'Örnek: %40', 'Example: 40%'),
  },
  { path: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'localized' },
  { path: 'description', label: L('الوصف', 'Açıklama', 'Description'), type: 'localizedTextarea' },
];

const sectionItem: PageFieldDef[] = [
  F.title,
  { path: 'paragraphs', label: L('الفقرات', 'Paragraflar', 'Paragraphs'), type: 'paragraphs' },
  { path: 'bullets', label: L('النقاط', 'Maddeler', 'Bullets'), type: 'list' },
  { path: 'ordered', label: L('قائمة مرقّمة', 'Numaralı liste', 'Numbered list'), type: 'boolean' },
  {
    path: 'id',
    label: L('معرّف القسم', 'Bölüm kimliği', 'Section id'),
    type: 'text',
    advanced: true,
    help: L('لروابط القفز داخل الصفحة', 'Sayfa içi bağlantılar için', 'For in-page jump links'),
  },
];

const programStatItem: PageFieldDef[] = [
  { path: 'label', label: L('البيان', 'Etiket', 'Label'), type: 'text' },
  { path: 'value', label: L('القيمة', 'Değer', 'Value'), type: 'text' },
  F.description,
];

const programVideoItem: PageFieldDef[] = [
  F.title,
  F.description,
  { path: '', label: L('الفيديو', 'Video', 'Video'), type: 'video' },
];

const initiativeItem: PageFieldDef[] = [
  F.title,
  F.description,
  F.image,
  F.imageAlt,
  { ...F.url, help: L('اختياري — يجعل البطاقة قابلة للنقر', 'İsteğe bağlı', 'Optional — makes the card a link') },
  { path: 'products', label: L('المنتجات', 'Ürünler', 'Products'), type: 'list' },
];

const cityItem: PageFieldDef[] = [
  { path: 'name', label: L('اسم المدينة', 'Şehir adı', 'City name'), type: 'text' },
  F.image,
  F.imageAlt,
  { path: 'partner', label: L('الشريك', 'Ortak', 'Partner'), type: 'text' },
  { path: 'videoTitle', label: L('عنوان الفيديو', 'Video başlığı', 'Video title'), type: 'text' },
  { path: '', label: L('الفيديو', 'Video', 'Video'), type: 'video' },
];

const titledItem: PageFieldDef[] = [F.title, F.description, F.icon];

const pillarItem: PageFieldDef[] = [
  F.title,
  { path: 'body', label: L('النص', 'Metin', 'Body'), type: 'textarea' },
  { path: 'points', label: L('النقاط', 'Maddeler', 'Points'), type: 'list' },
  F.icon,
];

const galleryItem: PageFieldDef[] = [
  { path: 'src', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
  { path: 'alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'), type: 'text' },
  { path: 'caption', label: L('التعليق', 'Açıklama', 'Caption'), type: 'text' },
  { path: 'width', label: L('العرض', 'Genişlik', 'Width'), type: 'number', advanced: true },
  { path: 'height', label: L('الارتفاع', 'Yükseklik', 'Height'), type: 'number', advanced: true },
];

/** News gallery: one list shared by all languages, only the texts are per language. */
const newsGalleryItem: PageFieldDef[] = [
  F.image,
  {
    path: 'thumbnail',
    label: L('صورة مصغّرة (اختياري)', 'Küçük görsel (isteğe bağlı)', 'Thumbnail (optional)'),
    type: 'image',
    help: L('تُستخدم الصورة نفسها إن تُركت فارغة', 'Boşsa aynı görsel kullanılır', 'The image itself is used when empty'),
  },
  { path: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'localized' },
  { path: 'imageAlt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'), type: 'localized' },
  { path: 'width', label: L('العرض', 'Genişlik', 'Width'), type: 'number', advanced: true },
  { path: 'height', label: L('الارتفاع', 'Yükseklik', 'Height'), type: 'number', advanced: true },
];

const mediaProductItem: PageFieldDef[] = [
  F.title,
  { path: 'tagline', label: L('الشعار القصير', 'Kısa slogan', 'Tagline'), type: 'text' },
  F.description,
  F.icon,
];

const spotlightGroup: PageFieldDef[] = [
  { path: 'eyebrow', label: L('السطر الصغير فوق العنوان', 'Başlık üstü satır', 'Line above the title'), type: 'text' },
  F.title,
  F.description,
  {
    path: 'images',
    label: L('الصور (حتى 3)', 'Görseller (en fazla 3)', 'Photos (up to 3)'),
    type: 'repeater',
    itemTitleField: 'alt',
    max: 3,
    itemFields: [
      { path: 'src', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
      { path: 'alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'), type: 'text' },
    ],
  },
  { path: 'linkLabel', label: L('نص الزر', 'Buton metni', 'Button label'), type: 'text' },
  { path: 'route', label: L('وجهة الزر', 'Buton hedefi', 'Button destination'), type: 'text', help: L('مثال: /news/اسم-الخبر', 'Örnek: /news/haber-adi', 'Example: /news/article-name') },
];

const sectionCopy = (prefix: string, label: Record<Locale, string>): PageFieldDef[] => [
  { path: `${prefix}.eyebrow`, label: L(`${label.ar}: السطر الصغير`, `${label.tr}: üst satır`, `${label.en}: line above`), type: 'text' },
  { path: `${prefix}.title`, label: L(`${label.ar}: العنوان`, `${label.tr}: başlık`, `${label.en}: title`), type: 'text' },
  { path: `${prefix}.description`, label: L(`${label.ar}: الوصف`, `${label.tr}: açıklama`, `${label.en}: description`), type: 'textarea' },
];

const volunteerGroup: PageFieldDef[] = [
  { path: 'eyebrow', label: L('شارة الواجهة', 'Hero rozeti', 'Hero badge'), type: 'text' },
  { path: 'slogan', label: L('الشعار', 'Slogan', 'Slogan'), type: 'textarea' },
  { path: 'hashtags', label: L('الوسوم (هاشتاغ)', 'Etiketler (hashtag)', 'Hashtags'), type: 'list' },
  { path: 'joinCta', label: L('زر الانضمام', 'Katıl butonu', 'Join button'), type: 'text' },
  {
    path: 'joinUrl',
    label: L('وجهة زر الانضمام', 'Katıl butonu hedefi', 'Join button destination'),
    type: 'text',
    help: L('يُستخدم نموذج التطوع إن تُرك فارغاً', 'Boşsa gönüllü formu kullanılır', 'The volunteer form is used when empty'),
  },
  { path: 'exploreCta', label: L('زر الاستكشاف', 'Keşfet butonu', 'Explore button'), type: 'text' },
  { path: 'contactTitle', label: L('عنوان شريط التواصل', 'İletişim şeridi başlığı', 'Contact strip title'), type: 'text' },
  { path: 'quoteLabel', label: L('عنوان الاقتباس', 'Alıntı başlığı', 'Quote heading'), type: 'text' },
  ...sectionCopy('statement', L('البيان', 'Bildiri', 'Statement')),
  ...sectionCopy('fields', L('مجالات التطوع', 'Gönüllülük alanları', 'Volunteer fields')),
  ...sectionCopy('goals', L('الأهداف', 'Hedefler', 'Goals')),
  ...sectionCopy('steps', L('خطوات الانضمام', 'Katılım adımları', 'Joining steps')),
];

/** Project video: one link shared by all languages, title and button per language. */
const projectVideoGroup: PageFieldDef[] = [
  { path: 'title', label: L('عنوان قسم الفيديو', 'Video bölümü başlığı', 'Video section title'), type: 'localized' },
  { path: 'buttonLabel', label: L('نص زر التشغيل', 'Oynat butonu metni', 'Play button label'), type: 'localized' },
  { path: '', label: L('الفيديو', 'Video', 'Video'), type: 'video' },
];

/** Shorthand for a repeating group stored per language. */
const repeater = (
  key: string,
  label: Record<Locale, string>,
  itemFields: PageFieldDef[],
  itemTitleField = 'title',
  extra: Partial<FieldDef> = {},
): FieldDef => ({ key, label, type: 'localizedRepeater', itemFields, itemTitleField, ...extra });

const unusedHelp = L(
  'لا يظهر حالياً في أي صفحة — محفوظ لتصميم لاحق',
  'Şu anda hiçbir sayfada görünmüyor',
  'Not shown on any page at the moment — kept for a later design',
);

export const RESOURCES: FullResourceDef[] = [
  // NEWS ---------------------------------------------------------------------
  {
    key: 'news',
    table: 'news',
    section: 'content',
    labelKey: 'news',
    description: L(
      'الأخبار في صفحة /news وقسم آخر الأخبار في الصفحة الرئيسية — مرتبة بتاريخ النشر',
      '/news sayfasındaki ve ana sayfadaki haberler — yayın tarihine göre sıralı',
      'Articles on /news and in the home page news section — ordered by publish date',
    ),
    icon: Newspaper,
    titleField: 'title',
    publicRoute: '/news/:slug',
    defaultSort: { column: 'published_at', ascending: false },
    newDefaults: { source_language: 'ar', featured: false },
    fields: [
      { key: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'localized', required: true },
      {
        key: 'slug',
        label: L('رابط الصفحة', 'Sayfa bağlantısı', 'Page link'),
        type: 'slug',
        slugPrefix: '/news/',
        required: true,
      },
      { key: 'category', label: L('التصنيف', 'Kategori', 'Category'), type: 'localized', help: L('مثال: فعاليات، بيانات، شراكات', 'Örnek: etkinlikler, duyurular', 'Example: events, statements, partnerships') },
      {
        key: 'published_at',
        label: L('تاريخ النشر', 'Yayın tarihi', 'Published at'),
        type: 'datetime',
        required: true,
        help: L('يحدد ترتيب الخبر وسنته في الفلتر', 'Sıralamayı ve yıl filtresini belirler', 'Sets the article’s order and its year in the filter'),
      },
      {
        key: 'featured',
        label: L('خبر رئيسي', 'Öne çıkan haber', 'Featured article'),
        type: 'boolean',
        help: L('يظهر كالخبر الكبير في صفحة الأخبار والصفحة الرئيسية', 'Haber sayfasında ve ana sayfada büyük kart olarak gösterilir', 'Shown as the big card on the news page and the home page'),
      },
      { key: 'excerpt', label: L('المقتطف', 'Özet', 'Excerpt'), type: 'localizedTextarea', help: L('يظهر على البطاقة وفي نتائج البحث', 'Kartta ve arama sonuçlarında görünür', 'Shown on the card and in search results') },
      { key: 'content', label: L('نص الخبر', 'Haber metni', 'Article text'), type: 'localizedParagraphs' },
      { key: 'image', label: L('الصورة الرئيسية', 'Ana görsel', 'Cover image'), type: 'image' },
      { key: 'image_alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'), type: 'localized' },
      {
        key: 'gallery',
        label: L('معرض صور الخبر', 'Haber galerisi', 'Article gallery'),
        type: 'repeater',
        itemFields: newsGalleryItem,
        itemTitleField: 'title',
      },
      {
        key: 'source_language',
        label: L('لغة النص الأصلي', 'Orijinal metnin dili', 'Original text language'),
        type: 'select',
        options: languageOptions,
        advanced: true,
      },
      fPublished,
    ],
  },
  // PROJECTS -----------------------------------------------------------------
  {
    key: 'projects',
    table: 'projects',
    section: 'content',
    labelKey: 'projects',
    description: L(
      'صفحات المشاريع الوقفية (/projects) — كل مشروع له صفحة تفاصيل خاصة',
      'Vakıf proje sayfaları (/projects)',
      'The waqf project pages (/projects) — each project has its own detail page',
    ),
    icon: FolderKanban,
    titleField: 'title',
    publicRoute: '/projects/:slug',
    defaultSort: { column: 'sort_order', ascending: true },
    fields: [
      { key: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'localized', required: true },
      {
        key: 'slug',
        label: L('رابط الصفحة', 'Sayfa bağlantısı', 'Page link'),
        type: 'slug',
        slugPrefix: '/projects/',
        required: true,
      },
      { key: 'category', label: L('التصنيف', 'Kategori', 'Category'), type: 'localized' },
      { key: 'short_description', label: L('وصف مختصر', 'Kısa açıklama', 'Short description'), type: 'localizedTextarea', help: L('يظهر في الواجهة وبطاقة المشروع', 'Hero ve kartta görünür', 'Shown in the hero and on the project card') },
      { key: 'full_description', label: L('الوصف الكامل', 'Tam açıklama', 'Full description'), type: 'localizedParagraphs' },
      { key: 'image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
      { key: 'image_alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'), type: 'localized' },
      { key: 'contribution_value', label: L('قيمة المساهمة', 'Katkı değeri', 'Contribution value'), type: 'localized', help: L('مثال: 100 دولار', 'Örnek: 100 dolar', 'Example: 100 dollars') },
      { key: 'official_contribution_url', label: L('وجهة زر المساهمة', 'Katkı butonu hedefi', 'Contribute button destination'), type: 'text', help: L('مثال: /donate/checkout/blessed-tree (صفحة الدفع) أو /donate', 'Örnek: /donate/checkout/blessed-tree (ödeme sayfası) veya /donate', 'Example: /donate/checkout/blessed-tree (checkout page) or /donate') },
      {
        key: 'facts',
        label: L('معلومات المشروع (بطاقات صغيرة)', 'Proje bilgileri', 'Project facts (small tiles)'),
        type: 'repeater',
        itemFields: factItem,
        itemTitleField: 'label',
      },
      { key: 'returns_title', label: L('عنوان قسم العوائد', 'Getiri başlığı', 'Returns section title'), type: 'localized' },
      { key: 'returns_intro', label: L('مقدمة العوائد', 'Getiri girişi', 'Returns intro'), type: 'localizedTextarea' },
      { key: 'return_uses', label: L('مصارف العوائد', 'Getiri kullanımları', 'Return uses'), type: 'localizedParagraphs' },
      {
        key: 'allocations',
        label: L('توزيع العوائد (نِسب)', 'Getiri dağılımı', 'Return allocation (percentages)'),
        type: 'repeater',
        itemFields: allocationItem,
        itemTitleField: 'title',
      },
      { key: 'video', label: L('الفيديو الرسمي', 'Resmi video', 'Official video'), type: 'group', itemFields: projectVideoGroup },
      { key: 'cta_title', label: L('عنوان الدعوة للمساهمة', 'CTA başlığı', 'Call-to-action title'), type: 'localized' },
      { key: 'cta_description', label: L('وصف الدعوة للمساهمة', 'CTA açıklaması', 'Call-to-action description'), type: 'localizedTextarea' },
      group('seo', L('الظهور في محركات البحث', 'Arama motorları', 'Search engines'), seoGroup, { advanced: true }),
      {
        key: 'image_scale',
        label: L('تكبير الصورة', 'Görsel ölçeği', 'Image scale'),
        type: 'number',
        advanced: true,
        help: L('1 = الحجم الطبيعي', '1 = doğal boyut', '1 = natural size'),
      },
      fPublished,
      fSort,
    ],
  },
  // PROGRAMS -----------------------------------------------------------------
  {
    key: 'programs',
    table: 'programs',
    section: 'content',
    labelKey: 'programs',
    description: L(
      'صفحات البرامج (/programs/…). لكل برنامج تخطيط صفحة يحدد أي الأقسام تظهر — راجع حقل "تخطيط الصفحة"',
      'Program sayfaları (/programs/…). "Sayfa düzeni" alanı hangi bölümlerin görüneceğini belirler',
      'The program pages (/programs/…). Each program’s "page layout" decides which sections appear',
    ),
    icon: GraduationCap,
    titleField: 'title',
    publicRoute: '/programs/:slug',
    defaultSort: { column: 'sort_order', ascending: true },
    fields: [
      { key: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'localized', required: true },
      {
        key: 'slug',
        label: L('رابط الصفحة', 'Sayfa bağlantısı', 'Page link'),
        type: 'slug',
        slugPrefix: '/programs/',
        required: true,
      },
      {
        key: 'layout',
        label: L('تخطيط الصفحة', 'Sayfa düzeni', 'Page layout'),
        type: 'select',
        options: programLayoutOptions,
        help: L(
          'يحدد شكل الصفحة والأقسام التي تظهر فيها. "تلقائي" يختار حسب البرنامج',
          'Sayfanın şeklini ve görünen bölümleri belirler',
          'Decides the page design and which sections it shows. "Automatic" picks by program',
        ),
      },
      { key: 'summary', label: L('الملخص', 'Özet', 'Summary'), type: 'localizedTextarea', help: L('يظهر في الواجهة وبطاقة البرنامج', 'Hero ve kartta görünür', 'Shown in the hero and on the program card') },
      {
        key: 'hero_image',
        label: L('صورة الغلاف', 'Kapak görseli', 'Hero image'),
        type: 'image',
        help: L(
          'تظهر أعلى الصفحة وفي بطاقة البرنامج وعند مشاركة الرابط',
          'Sayfanın üstünde, program kartında ve paylaşımda görünür',
          'Shown at the top of the page, on the program card and when the link is shared',
        ),
      },
      { key: 'hero_image_alt', label: L('وصف صورة الغلاف', 'Kapak açıklaması', 'Hero image description'), type: 'localized' },
      { key: 'overview_image', label: L('صورة النظرة العامة / الشارة', 'Genel bakış görseli', 'Overview / badge image'), type: 'image', help: L('الصورة الكبيرة بجانب النص التعريفي، أو شارة الوحدة التطوعية', 'Tanıtım metninin yanındaki büyük görsel', 'The large photo beside the overview text, or the volunteer unit badge') },
      { key: 'overview_image_alt', label: L('وصف صورة النظرة العامة', 'Genel bakış görseli açıklaması', 'Overview image description'), type: 'localized' },
      { key: 'contact_email', label: L('بريد التواصل', 'İletişim e-postası', 'Contact email'), type: 'text' },
      { key: 'contact_phone', label: L('هاتف التواصل', 'İletişim telefonu', 'Contact phone'), type: 'text', help: L('مع رمز الدولة، مثال: +90 5xx', 'Ülke koduyla', 'With country code, e.g. +90 5xx') },
      { key: 'highlights', label: L('أبرز الملامح (شريط متحرك)', 'Öne çıkanlar (kayan şerit)', 'Highlights (moving strip)'), type: 'localizedParagraphs', help: L('كل سطر عبارة قصيرة', 'Her satır kısa bir ifade', 'One short phrase per paragraph') },
      repeater('sections', L('أقسام النص', 'Metin bölümleri', 'Text sections'), sectionItem, 'title', {
        help: L('القسم الأول هو النظرة العامة: فقرته الأولى المقدمة والباقي اقتباس', 'İlk bölüm genel bakıştır', 'The first section is the overview: its first paragraph is the lead, the rest a quote'),
      }),
      { key: 'goals', label: L('الأهداف', 'Hedefler', 'Goals'), type: 'localizedParagraphs' },
      { key: 'components', label: L('المكوّنات', 'Bileşenler', 'Components'), type: 'localizedParagraphs' },
      repeater('journey', L('المسار (خطوات)', 'Yolculuk (adımlar)', 'Journey (steps)'), titledItem),
      repeater('pillars', L('الركائز', 'Sütunlar', 'Pillars'), pillarItem),
      repeater('audiences', L('الفئات المستهدفة', 'Hedef kitleler', 'Audiences'), titledItem),
      repeater('themes', L('المحاور', 'Temalar', 'Themes'), titledItem),
      repeater('statistics', L('الإحصائيات', 'İstatistikler', 'Statistics'), programStatItem, 'label', {
        help: L('أرقام رواد اليمن تُدار من "الإحصائيات" في القائمة', 'Yemen öncüleri rakamları "İstatistikler"den yönetilir', 'Yemen pioneers figures are managed under "Statistics" in the menu'),
      }),
      repeater('videos', L('الفيديوهات', 'Videolar', 'Videos'), programVideoItem),
      repeater('image_gallery', L('معرض الصور', 'Görsel galeri', 'Image gallery'), galleryItem, 'alt'),
      repeater('initiatives', L('المبادرات', 'Girişimler', 'Initiatives'), initiativeItem),
      repeater('media_products', L('المنتجات المعرفية (منصة أويس)', 'Bilgi ürünleri (Owais platformu)', 'Media formats (Owais platform)'), mediaProductItem),
      group('spotlight', L('فعالية مميزة (منصة أويس)', 'Öne çıkan etkinlik', 'Featured event (Owais platform)'), spotlightGroup),
      group('volunteer', L('نصوص الوحدة التطوعية', 'Gönüllü birimi metinleri', 'Volunteer unit copy'), volunteerGroup),
      group('cta', L('الدعوة للمساهمة (أسفل الصفحة)', 'Katkı çağrısı', 'Call to action (page bottom)'), ctaGroup),
      { key: 'media_note', label: L('ملاحظة الوسائط', 'Medya notu', 'Media note'), type: 'localizedTextarea' },
      group('seo', L('الظهور في محركات البحث', 'Arama motorları', 'Search engines'), seoGroup, { advanced: true }),
      repeater('cities', L('المدن', 'Şehirler', 'Cities'), cityItem, 'name', { advanced: true, help: unusedHelp }),
      group('phase', L('المرحلة الحالية', 'Mevcut aşama', 'Current phase'), phaseGroup, { advanced: true, help: unusedHelp }),
      { key: 'images', label: L('صور إضافية', 'Ek görseller', 'Extra images'), type: 'stringList', advanced: true, help: unusedHelp },
      fPublished,
      fSort,
    ],
  },
  // LIBRARY ARTICLES ---------------------------------------------------------
  {
    key: 'library_articles',
    table: 'library_articles',
    section: 'library',
    labelKey: 'library_articles',
    description: L(
      'المواد المقروءة في المكتبة: مقالات المنتدى، قصص النجاح، الشخصيات اليمانية',
      'Kütüphanedeki okunabilir içerik: forum makaleleri, başarı hikayeleri, Yemenli şahsiyetler',
      'Readable library items: forum articles, success stories, Yemeni figures',
    ),
    icon: BookOpen,
    titleField: 'title',
    publicRoute: '/library/:collection/:slug',
    defaultSort: { column: 'sort_order', ascending: true },
    filter: { column: 'collection', options: forumOptions },
    newDefaults: { collection: 'forum', source_language: 'ar' },
    fields: [
      { key: 'collection', label: L('القسم', 'Bölüm', 'Section'), type: 'select', options: forumOptions, required: true },
      { key: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'localized', required: true },
      {
        key: 'slug',
        label: L('رابط الصفحة', 'Sayfa bağlantısı', 'Page link'),
        type: 'slug',
        slugPrefix: '/library/…/',
        required: true,
      },
      { key: 'excerpt', label: L('المقتطف', 'Özet', 'Excerpt'), type: 'localizedTextarea' },
      {
        key: 'content',
        label: L('النص', 'Metin', 'Text'),
        type: 'localizedParagraphs',
        help: L(
          'فقرة قصيرة بلا نقطة في آخرها تصبح عنواناً فرعياً؛ سطر يبدأ بـ "بقلم" يصبح بطاقة الكاتب',
          'Sonunda nokta olmayan kısa bir paragraf alt başlık olur',
          'A short paragraph without a full stop becomes a subheading; a line starting with "By" becomes the author card',
        ),
      },
      { key: 'image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
      { key: 'image_alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'), type: 'localized' },
      { key: 'date', label: L('التاريخ', 'Tarih', 'Date'), type: 'date', help: L('يظهر على البطاقة ويحدد الترتيب في "أُضيف حديثاً"', 'Kartta görünür ve sıralamayı belirler', 'Shown on the card and orders "recently added"') },
      { key: 'pdf_url', label: L('ملف PDF مرفق', 'Ekli PDF dosyası', 'Attached PDF'), type: 'file', accept: 'application/pdf' },
      { key: 'original_title', label: L('العنوان الأصلي (إن كان مترجماً)', 'Orijinal başlık', 'Original title (if translated)'), type: 'text', advanced: true },
      { key: 'source_language', label: L('لغة النص الأصلي', 'Orijinal dil', 'Original text language'), type: 'select', options: languageOptions, advanced: true },
      { key: 'year', label: L('السنة', 'Yıl', 'Year'), type: 'number', advanced: true, help: L('لفلتر السنوات', 'Yıl filtresi için', 'For the year filter') },
      fPublished,
      fSort,
    ],
  },
  // LIBRARY DOCUMENTS --------------------------------------------------------
  {
    key: 'library_documents',
    table: 'library_documents',
    section: 'library',
    labelKey: 'library_documents',
    description: L(
      'ملفات PDF في المكتبة: التقارير الدورية، كتب الوقف، أدبيات الوقف',
      'Kütüphanedeki PDF dosyaları: raporlar, kitaplar, literatür',
      'PDF files in the library: periodic reports, waqf books, waqf literature',
    ),
    icon: FileText,
    titleField: 'title',
    defaultSort: { column: 'sort_order', ascending: true },
    filter: { column: 'collection', options: docCollectionOptions },
    newDefaults: { collection: 'periodic-reports' },
    fields: [
      { key: 'collection', label: L('القسم', 'Bölüm', 'Section'), type: 'select', options: docCollectionOptions, required: true },
      { key: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'localized', required: true },
      {
        key: 'series',
        label: L('السلسلة', 'Seri', 'Series'),
        type: 'localized',
        help: L('اختياري — اسم السلسلة أو الإصدار، مثال: أويس في أرقام. يجمع الإصدارات تحت فلتر واحد', 'İsteğe bağlı seri adı', 'Optional — the series or issue family, e.g. "Owais in numbers". Groups issues under one filter'),
      },
      { key: 'pdf_url', label: L('ملف PDF', 'PDF dosyası', 'PDF file'), type: 'file', accept: 'application/pdf' },
      { key: 'image', label: L('صورة الغلاف', 'Kapak görseli', 'Cover image'), type: 'image' },
      { key: 'image_alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'), type: 'localized' },
      { key: 'excerpt', label: L('المقتطف', 'Özet', 'Excerpt'), type: 'localizedTextarea' },
      { key: 'date', label: L('التاريخ', 'Tarih', 'Date'), type: 'date' },
      { key: 'year', label: L('السنة', 'Yıl', 'Year'), type: 'number', advanced: true },
      fPublished,
      fSort,
    ],
  },
  // GALLERY ------------------------------------------------------------------
  {
    key: 'gallery_images',
    table: 'gallery_images',
    section: 'library',
    labelKey: 'gallery',
    description: L('صور معرض المكتبة (/library/gallery)', 'Kütüphane galerisi fotoğrafları', 'Photos in the library gallery (/library/gallery)'),
    icon: Images,
    titleField: 'title',
    defaultSort: { column: 'sort_order', ascending: true },
    fields: [
      { key: 'image', label: L('الصورة', 'Görsel', 'Image'), type: 'image', required: true, dimensionsFor: { width: 'width', height: 'height' } },
      { key: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'localized', help: L('يظهر على الصورة وفي المعاينة', 'Görsel üzerinde ve önizlemede görünür', 'Shown on the photo and in the lightbox') },
      { key: 'image_alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'), type: 'localized' },
      { key: 'thumbnail', label: L('صورة مصغّرة (اختياري)', 'Küçük görsel (isteğe bağlı)', 'Thumbnail (optional)'), type: 'image', advanced: true },
      { key: 'width', label: L('العرض', 'Genişlik', 'Width'), type: 'number', advanced: true },
      { key: 'height', label: L('الارتفاع', 'Yükseklik', 'Height'), type: 'number', advanced: true },
      fPublished,
      fSort,
    ],
  },
  // DONATIONS ----------------------------------------------------------------
  {
    key: 'donation_opportunities',
    table: 'donation_opportunities',
    section: 'content',
    labelKey: 'donations',
    description: L('بطاقات فرص المساهمة في صفحة /donate', '/donate sayfasındaki bağış kartları', 'The opportunity cards on /donate'),
    icon: HandHeart,
    titleField: 'title',
    defaultSort: { column: 'sort_order', ascending: true },
    newDefaults: { available: true },
    visibility: {
      column: 'available',
      onLabel: L('ظاهر في المتجر', 'Sitede görünür', 'Shown in the store'),
      offLabel: L('مخفي من المتجر', 'Sitede gizli', 'Hidden from the store'),
    },
    fields: [
      { key: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'localized', required: true },
      {
        key: 'slug',
        label: L('المعرّف', 'Kimlik', 'Identifier'),
        type: 'slug',
        required: true,
      },
      { key: 'description', label: L('الوصف', 'Açıklama', 'Description'), type: 'localizedTextarea' },
      { key: 'price', label: L('قيمة المساهمة', 'Katkı değeri', 'Contribution value'), type: 'localized', help: L('مثال: $100.00', 'Örnek: $100.00', 'Example: $100.00') },
      { key: 'image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
      { key: 'image_alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'), type: 'localized' },
      { key: 'url', label: L('وجهة زر المساهمة', 'Katkı butonu hedefi', 'Contribute button destination'), type: 'text', help: L('اتركه فارغاً ليفتح صفحة الدفع الخاصة بالفرصة، أو ضع رابطاً مخصصاً مثل /participate/contact', 'Boş bırakılırsa fırsatın ödeme sayfası açılır; özel bağlantı da girebilirsiniz (örn. /participate/contact)', 'Leave empty to open the checkout page of this opportunity, or set a custom link such as /participate/contact') },
      { key: 'available', label: L('متاح للمساهمة', 'Katkıya açık', 'Open for contributions'), type: 'boolean', help: L('عند الإيقاف تُخفى البطاقة من صفحة المتجر نهائياً، ويمكن إظهارها مجدداً في أي وقت', 'Kapatıldığında kart sitedeki sayfadan tamamen gizlenir; istediğiniz zaman yeniden açabilirsiniz', 'Turned off, the card is hidden from the donate page entirely; switch it back on to show it again') },
      fPublished,
      fSort,
    ],
  },
  // BANK ACCOUNTS ------------------------------------------------------------
  {
    key: 'bank_accounts',
    table: 'bank_accounts',
    section: 'content',
    labelKey: 'bank_accounts',
    description: L(
      'بطاقات البنوك وأرقام الآيبان في صفحة الحسابات البنكية — البيانات نفسها لكل اللغات',
      'Banka hesapları sayfasındaki banka kartları ve IBAN numaraları — bilgiler her dilde aynıdır',
      'The bank cards and IBANs on the bank accounts page — the same details in every language',
    ),
    icon: Landmark,
    titleField: 'name',
    publicRoute: '/bank-accounts',
    defaultSort: { column: 'sort_order', ascending: true },
    fields: [
      { key: 'name', label: L('اسم البنك', 'Banka adı', 'Bank name'), type: 'text', required: true },
      {
        key: 'slug',
        label: L('المعرّف', 'Kimlik', 'Identifier'),
        type: 'slug',
        required: true,
      },
      {
        key: 'branch',
        label: L('الفرع', 'Şube', 'Branch'),
        type: 'text',
        help: L('كما يكتبه البنك، مثال: Taksim / İstanbul Şubesi', 'Bankanın yazdığı gibi', 'As the bank writes it, e.g. Taksim / İstanbul Şubesi'),
      },
      { key: 'swift', label: L('رمز SWIFT', 'SWIFT kodu', 'SWIFT code'), type: 'text' },
      {
        key: 'account_number',
        label: L('رقم الحساب الموحّد', 'Ortak hesap numarası', 'Shared account number'),
        type: 'text',
        help: L('اختياري — فقط إن كان للبنك رقم حساب واحد لكل العملات', 'İsteğe bağlı — tüm para birimleri için tek hesap numarası varsa', 'Optional — only when the bank uses one account number for every currency'),
      },
      {
        key: 'accounts',
        label: L('الحسابات حسب العملة', 'Para birimine göre hesaplar', 'Accounts by currency'),
        type: 'repeater',
        itemTitleField: 'currency',
        itemFields: [
          {
            path: 'currency',
            label: L('العملة', 'Para birimi', 'Currency'),
            type: 'select',
            options: [
              { value: 'TRY', label: L('الليرة التركية (TRY)', 'Türk Lirası (TRY)', 'Turkish Lira (TRY)') },
              { value: 'USD', label: L('الدولار الأمريكي (USD)', 'ABD Doları (USD)', 'US Dollar (USD)') },
              { value: 'EUR', label: L('اليورو (EUR)', 'Euro (EUR)', 'Euro (EUR)') },
              { value: 'SAR', label: L('الريال السعودي (SAR)', 'Suudi Riyali (SAR)', 'Saudi Riyal (SAR)') },
            ],
          },
          {
            path: 'iban',
            label: L('رقم الآيبان (IBAN)', 'IBAN', 'IBAN'),
            type: 'text',
            help: L('بدون فراغات — الموقع ينسّقه تلقائياً', 'Boşluksuz — site otomatik biçimlendirir', 'Without spaces — the site formats it automatically'),
          },
          {
            path: 'accountNumber',
            label: L('رقم الحساب لهذه العملة', 'Bu para biriminin hesap numarası', 'Account number for this currency'),
            type: 'text',
            help: L('اختياري', 'İsteğe bağlı', 'Optional'),
          },
        ],
      },
      { key: 'logo', label: L('شعار البنك', 'Banka logosu', 'Bank logo'), type: 'image' },
      {
        key: 'monogram',
        label: L('الحرفان البديلان', 'Kısaltma', 'Fallback initials'),
        type: 'text',
        help: L('يظهران في الشارة إذا تعذّر تحميل الشعار، مثال: VB', 'Logo yüklenemezse rozette görünür, örn. VB', 'Shown in the badge when the logo fails to load, e.g. VB'),
      },
      {
        key: 'brand_color',
        label: L('لون البنك', 'Banka rengi', 'Brand colour'),
        type: 'text',
        placeholder: '#0a7a5c',
        help: L('صيغة hex مثل ‎#f7c600 — يلوّن شارة البنك', 'Hex biçimi, örn. #f7c600', 'Hex format such as #f7c600 — colours the bank badge'),
        advanced: true,
      },
      fPublished,
      fSort,
    ],
  },
  // PARTNERS -----------------------------------------------------------------
  {
    key: 'partners',
    table: 'partners',
    section: 'content',
    labelKey: 'partners',
    description: L('شعارات الشركاء في شريط الشركاء بالصفحة الرئيسية', 'Ana sayfadaki ortak logoları', 'Partner logos in the home page strip'),
    icon: Handshake,
    titleField: 'name',
    defaultSort: { column: 'sort_order', ascending: true },
    fields: [
      { key: 'name', label: L('الاسم', 'Ad', 'Name'), type: 'localized', required: true },
      { key: 'logo', label: L('الشعار', 'Logo', 'Logo'), type: 'image', required: true },
      { key: 'url', label: L('رابط موقع الشريك', 'Ortağın sitesi', 'Partner website'), type: 'url', help: L('اختياري — يجعل الشعار قابلاً للنقر', 'İsteğe bağlı', 'Optional — makes the logo a link') },
      fPublished,
      fSort,
    ],
  },
  // STATISTICS ---------------------------------------------------------------
  {
    key: 'stat_indicators',
    table: 'stat_indicators',
    section: 'content',
    labelKey: 'statistics',
    description: L(
      'الأرقام في قسم الإحصائيات وقسم رواد اليمن بالصفحة الرئيسية (وصفحة رواد اليمن)',
      'Ana sayfadaki istatistik ve Yemen öncüleri bölümlerinin rakamları',
      'The figures in the home page statistics and Yemen pioneers sections (and the pioneers page)',
    ),
    icon: BarChart3,
    titleField: 'label',
    defaultSort: { column: 'sort_order', ascending: true },
    filter: { column: 'stat_group', options: statGroupOptions },
    newDefaults: { stat_group: 'statistics' },
    fields: [
      { key: 'stat_group', label: L('المجموعة', 'Grup', 'Group'), type: 'select', options: statGroupOptions, required: true },
      { key: 'label', label: L('البيان', 'Etiket', 'Label'), type: 'localized', required: true },
      { key: 'value', label: L('القيمة (رقم)', 'Değer (sayı)', 'Value (number)'), type: 'number', required: true },
      { key: 'suffix', label: L('لاحقة الرقم', 'Sonek', 'Suffix'), type: 'localized', help: L('مثال: % أو + — تظهر بعد الرقم', 'Örnek: % veya +', 'Example: % or + — shown after the number') },
      { key: 'detail', label: L('جملة الشرح (خلف البطاقة)', 'Açıklama cümlesi (kartın arkası)', 'Explanation sentence (card back)'), type: 'localizedTextarea' },
      { key: 'icon', label: L('الأيقونة', 'Simge', 'Icon'), type: 'icon' },
      fPublished,
      fSort,
    ],
  },
];

export function getResource(key: string): FullResourceDef | undefined {
  return RESOURCES.find((r) => r.key === key);
}
