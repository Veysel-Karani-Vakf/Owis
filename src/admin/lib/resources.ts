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
  type LucideIcon,
} from 'lucide-react';
import type { Locale } from '@/lib/types';
import type { FieldDef, ResourceDef, SelectOption } from './fields';
import type { PageFieldDef } from './pageSchema';

/** compact trilingual label */
const L = (ar: string, tr: string, en: string): Record<Locale, string> => ({ ar, tr, en });

// Shared field builders -------------------------------------------------------
const fPublished: FieldDef = { key: 'is_published', label: L('منشور', 'Yayında', 'Published'), type: 'boolean' };
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
];

const ctaGroup: PageFieldDef[] = [
  { path: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
  { path: 'description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
  { path: 'button', label: L('نص الزر', 'Buton metni', 'Button label'), type: 'text' },
];

const phaseGroup: PageFieldDef[] = [
  { path: 'label', label: L('اسم المرحلة', 'Aşama adı', 'Phase name'), type: 'text' },
  { path: 'period', label: L('الفترة الزمنية', 'Dönem', 'Period'), type: 'text' },
  { path: 'description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
];

/** Shorthand for a grouped value stored per language. */
const group = (key: string, label: Record<Locale, string>, itemFields: PageFieldDef[]): FieldDef => ({
  key,
  label,
  type: 'localizedGroup',
  itemFields,
});

export type FullResourceDef = ResourceDef & { icon: LucideIcon };

const forumOptions: SelectOption[] = [
  { value: 'forum', label: L('المنتدى', 'Forum', 'Forum') },
  { value: 'success-stories', label: L('قصص النجاح', 'Başarı hikayeleri', 'Success stories') },
];

const docCollectionOptions: SelectOption[] = [
  { value: 'periodic-reports', label: L('التقارير الدورية', 'Periyodik raporlar', 'Periodic reports') },
  { value: 'waqf-books', label: L('كتب الوقف', 'Vakıf kitapları', 'Waqf books') },
  { value: 'waqf-literature', label: L('أدبيات الوقف', 'Vakıf literatürü', 'Waqf literature') },
  { value: 'yemeni-figures', label: L('أعلام يمنية', 'Yemenli şahsiyetler', 'Yemeni figures') },
];

const statGroupOptions: SelectOption[] = [
  { value: 'yemen-pioneers', label: L('رواد اليمن', 'Yemen öncüleri', 'Yemen pioneers') },
  { value: 'statistics', label: L('إحصائيات', 'İstatistikler', 'Statistics') },
];

// Item shapes for the repeating groups stored as jsonb on content rows. -------
const F = {
  title: { path: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
  description: { path: 'description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
  image: { path: 'image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
  imageAlt: { path: 'imageAlt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image alt'), type: 'text' },
  sourceUrl: { path: 'sourceUrl', label: L('رابط المصدر', 'Kaynak bağlantısı', 'Source URL'), type: 'url' },
  url: { path: 'url', label: L('الرابط', 'Bağlantı', 'Link'), type: 'text' },
} satisfies Record<string, PageFieldDef>;

const factItem: PageFieldDef[] = [
  { path: 'label', label: L('البيان', 'Etiket', 'Label'), type: 'text' },
  { path: 'value', label: L('القيمة', 'Değer', 'Value'), type: 'text' },
];

const allocationItem: PageFieldDef[] = [
  { path: 'percent', label: L('النسبة', 'Yüzde', 'Percent'), type: 'text' },
  F.title,
  F.description,
];

const sectionItem: PageFieldDef[] = [
  F.title,
  { path: 'paragraphs', label: L('الفقرات', 'Paragraflar', 'Paragraphs'), type: 'paragraphs' },
  { path: 'bullets', label: L('النقاط', 'Maddeler', 'Bullets'), type: 'list' },
  { path: 'ordered', label: L('قائمة مرقّمة', 'Numaralı liste', 'Numbered list'), type: 'boolean' },
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
  F.url,
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

const titledItem: PageFieldDef[] = [F.title, F.description];

const pillarItem: PageFieldDef[] = [
  F.title,
  { path: 'body', label: L('النص', 'Metin', 'Body'), type: 'textarea' },
  { path: 'points', label: L('النقاط', 'Maddeler', 'Points'), type: 'list' },
];

const galleryItem: PageFieldDef[] = [
  { path: 'src', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
  { path: 'alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Alt text'), type: 'text' },
  { path: 'caption', label: L('التعليق', 'Açıklama', 'Caption'), type: 'text' },
  { path: 'width', label: L('العرض', 'Genişlik', 'Width'), type: 'number' },
  { path: 'height', label: L('الارتفاع', 'Yükseklik', 'Height'), type: 'number' },
];

const newsGalleryItem: PageFieldDef[] = [
  F.image,
  { path: 'thumbnail', label: L('الصورة المصغّرة', 'Küçük görsel', 'Thumbnail'), type: 'image' },
  F.sourceUrl,
  F.title,
  F.imageAlt,
  { path: 'width', label: L('العرض', 'Genişlik', 'Width'), type: 'number' },
  { path: 'height', label: L('الارتفاع', 'Yükseklik', 'Height'), type: 'number' },
];

/** Shorthand for a repeating group stored per language. */
const repeater = (
  key: string,
  label: Record<Locale, string>,
  itemFields: PageFieldDef[],
  itemTitleField = 'title',
): FieldDef => ({ key, label, type: 'localizedRepeater', itemFields, itemTitleField });

export const RESOURCES: FullResourceDef[] = [
  // NEWS ---------------------------------------------------------------------
  {
    key: 'news',
    table: 'news',
    section: 'content',
    labelKey: 'news',
    icon: Newspaper,
    titleField: 'title',
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
      { key: 'category', label: L('التصنيف', 'Kategori', 'Category'), type: 'localized' },
      { key: 'excerpt', label: L('المقتطف', 'Özet', 'Excerpt'), type: 'localizedTextarea' },
      { key: 'content', label: L('المحتوى (فقرات)', 'İçerik (paragraflar)', 'Content (paragraphs)'), type: 'localizedParagraphs' },
      { key: 'image', label: L('الصورة الرئيسية', 'Ana görsel', 'Cover image'), type: 'image' },
      { key: 'image_alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image alt'), type: 'localized' },
      { key: 'published_at', label: L('تاريخ النشر', 'Yayın tarihi', 'Published at'), type: 'datetime' },
      { key: 'year', label: L('السنة', 'Yıl', 'Year'), type: 'number' },
      { key: 'featured', label: L('مميّز', 'Öne çıkan', 'Featured'), type: 'boolean' },
      { key: 'source_url', label: L('رابط المصدر', 'Kaynak bağlantısı', 'Source URL'), type: 'url', advanced: true },
      repeater('gallery', L('معرض الصور', 'Galeri', 'Gallery'), newsGalleryItem),
      { key: 'source_images', label: L('صور المصدر', 'Kaynak görselleri', 'Source images'), type: 'stringList', advanced: true },
      fPublished,
      fSort,
    ],
  },
  // PROJECTS -----------------------------------------------------------------
  {
    key: 'projects',
    table: 'projects',
    section: 'content',
    labelKey: 'projects',
    icon: FolderKanban,
    titleField: 'title',
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
      { key: 'short_description', label: L('وصف مختصر', 'Kısa açıklama', 'Short description'), type: 'localizedTextarea' },
      { key: 'full_description', label: L('الوصف الكامل (فقرات)', 'Tam açıklama', 'Full description'), type: 'localizedParagraphs' },
      { key: 'image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
      { key: 'image_alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image alt'), type: 'localized' },
      { key: 'contribution_value', label: L('قيمة المساهمة', 'Katkı değeri', 'Contribution value'), type: 'localized' },
      { key: 'unit_amount', label: L('قيمة الوحدة', 'Birim tutar', 'Unit amount'), type: 'number' },
      { key: 'official_contribution_url', label: L('رابط المساهمة', 'Katkı bağlantısı', 'Contribution URL'), type: 'url' },
      { key: 'official_source_url', label: L('رابط المصدر', 'Kaynak bağlantısı', 'Source URL'), type: 'url', advanced: true },
      { key: 'returns_title', label: L('عنوان العوائد', 'Getiri başlığı', 'Returns title'), type: 'localized' },
      { key: 'returns_intro', label: L('مقدمة العوائد', 'Getiri girişi', 'Returns intro'), type: 'localizedTextarea' },
      { key: 'return_uses', label: L('أوجه العوائد (فقرات)', 'Getiri kullanımları', 'Return uses'), type: 'localizedParagraphs' },
      { key: 'cta_title', label: L('عنوان الدعوة', 'CTA başlığı', 'CTA title'), type: 'localized' },
      { key: 'cta_description', label: L('وصف الدعوة', 'CTA açıklaması', 'CTA description'), type: 'localizedTextarea' },
      repeater('facts', L('الحقائق', 'Bilgiler', 'Facts'), factItem, 'label'),
      repeater('allocations', L('توزيع العوائد', 'Getiri dağılımı', 'Allocations'), allocationItem),
      { key: 'video', label: L('الفيديو', 'Video', 'Video'), type: 'video' },
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
    icon: GraduationCap,
    titleField: 'title',
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
      { key: 'summary', label: L('الملخص', 'Özet', 'Summary'), type: 'localizedTextarea' },
      { key: 'hero_image', label: L('صورة الغلاف', 'Kapak görseli', 'Hero image'), type: 'image' },
      { key: 'hero_image_alt', label: L('وصف صورة الغلاف', 'Kapak açıklaması', 'Hero alt'), type: 'localized' },
      { key: 'contact_email', label: L('البريد', 'E-posta', 'Contact email'), type: 'text' },
      { key: 'official_source_url', label: L('رابط المصدر', 'Kaynak bağlantısı', 'Source URL'), type: 'url', advanced: true },
      { key: 'goals', label: L('الأهداف (فقرات)', 'Hedefler', 'Goals'), type: 'localizedParagraphs' },
      { key: 'components', label: L('المكوّنات (فقرات)', 'Bileşenler', 'Components'), type: 'localizedParagraphs' },
      { key: 'highlights', label: L('أبرز النقاط (فقرات)', 'Öne çıkanlar', 'Highlights'), type: 'localizedParagraphs' },
      repeater('sections', L('الأقسام', 'Bölümler', 'Sections'), sectionItem),
      repeater('statistics', L('الإحصائيات', 'İstatistikler', 'Statistics'), programStatItem, 'label'),
      repeater('videos', L('الفيديوهات', 'Videolar', 'Videos'), programVideoItem),
      repeater('initiatives', L('المبادرات', 'Girişimler', 'Initiatives'), initiativeItem),
      repeater('cities', L('المدن', 'Şehirler', 'Cities'), cityItem, 'name'),
      repeater('pillars', L('الركائز', 'Sütunlar', 'Pillars'), pillarItem),
      repeater('journey', L('المسار', 'Yolculuk', 'Journey'), titledItem),
      repeater('audiences', L('الفئات المستهدفة', 'Hedef kitleler', 'Audiences'), titledItem),
      repeater('themes', L('المحاور', 'Temalar', 'Themes'), titledItem),
      group('phase', L('المرحلة الحالية', 'Mevcut aşama', 'Current phase'), phaseGroup),
      { key: 'images', label: L('الصور', 'Görseller', 'Images'), type: 'stringList' },
      repeater('image_gallery', L('معرض الصور', 'Görsel galeri', 'Image gallery'), galleryItem, 'alt'),
      group('seo', L('الظهور في محركات البحث', 'Arama motorları', 'Search engines'), seoGroup),
      group('cta', L('الدعوة للمساهمة', 'Katkı çağrısı', 'Call to action'), ctaGroup),
      { key: 'media_note', label: L('ملاحظة الوسائط', 'Medya notu', 'Media note'), type: 'localizedTextarea' },
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
    icon: BookOpen,
    titleField: 'title',
    defaultSort: { column: 'sort_order', ascending: true },
    filter: { column: 'collection', options: forumOptions },
    newDefaults: { collection: 'forum', source_language: 'ar' },
    fields: [
      { key: 'collection', label: L('التصنيف', 'Koleksiyon', 'Collection'), type: 'select', options: forumOptions, required: true },
      { key: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'localized', required: true },
      {
        key: 'slug',
        label: L('رابط الصفحة', 'Sayfa bağlantısı', 'Page link'),
        type: 'slug',
        slugPrefix: '/library/',
        required: true,
      },
      { key: 'excerpt', label: L('المقتطف', 'Özet', 'Excerpt'), type: 'localizedTextarea' },
      { key: 'content', label: L('المحتوى (فقرات)', 'İçerik', 'Content (paragraphs)'), type: 'localizedParagraphs' },
      { key: 'image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
      { key: 'image_alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image alt'), type: 'localized' },
      { key: 'original_title', label: L('العنوان الأصلي', 'Orijinal başlık', 'Original title'), type: 'text' },
      { key: 'date', label: L('التاريخ (نص)', 'Tarih', 'Date (text)'), type: 'text' },
      { key: 'year', label: L('السنة', 'Yıl', 'Year'), type: 'number' },
      { key: 'source_url', label: L('رابط المصدر', 'Kaynak', 'Source URL'), type: 'url', advanced: true },
      { key: 'source_language', label: L('لغة المصدر', 'Kaynak dili', 'Source language'), type: 'text', advanced: true },
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
    icon: FileText,
    titleField: 'title',
    defaultSort: { column: 'sort_order', ascending: true },
    filter: { column: 'collection', options: docCollectionOptions },
    newDefaults: { collection: 'periodic-reports' },
    fields: [
      { key: 'collection', label: L('التصنيف', 'Koleksiyon', 'Collection'), type: 'select', options: docCollectionOptions, required: true },
      { key: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'localized', required: true },
      { key: 'pdf_url', label: L('ملف PDF', 'PDF dosyası', 'PDF file'), type: 'file', accept: 'application/pdf' },
      { key: 'image', label: L('صورة الغلاف', 'Kapak görseli', 'Cover image'), type: 'image' },
      { key: 'image_alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image alt'), type: 'localized' },
      { key: 'excerpt', label: L('المقتطف', 'Özet', 'Excerpt'), type: 'localizedTextarea' },
      { key: 'date', label: L('التاريخ (نص)', 'Tarih', 'Date (text)'), type: 'text' },
      { key: 'year', label: L('السنة', 'Yıl', 'Year'), type: 'number' },
      { key: 'source_url', label: L('رابط المصدر', 'Kaynak', 'Source URL'), type: 'url', advanced: true },
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
    icon: Images,
    titleField: 'title',
    defaultSort: { column: 'sort_order', ascending: true },
    fields: [
      { key: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'localized' },
      { key: 'image', label: L('الصورة', 'Görsel', 'Image'), type: 'image', required: true },
      { key: 'thumbnail', label: L('الصورة المصغّرة', 'Küçük görsel', 'Thumbnail'), type: 'image' },
      { key: 'image_alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image alt'), type: 'localized' },
      { key: 'source_url', label: L('رابط المصدر', 'Kaynak', 'Source URL'), type: 'url', advanced: true },
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
    icon: HandHeart,
    titleField: 'title',
    defaultSort: { column: 'sort_order', ascending: true },
    newDefaults: { available: true },
    fields: [
      { key: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'localized', required: true },
      {
        key: 'slug',
        label: L('رابط الصفحة', 'Sayfa bağlantısı', 'Page link'),
        type: 'slug',
        required: true,
      },
      { key: 'description', label: L('الوصف', 'Açıklama', 'Description'), type: 'localizedTextarea' },
      { key: 'price', label: L('السعر', 'Fiyat', 'Price'), type: 'localized' },
      { key: 'image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
      { key: 'image_alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image alt'), type: 'localized' },
      { key: 'url', label: L('الرابط', 'Bağlantı', 'URL'), type: 'url' },
      { key: 'available', label: L('متاح', 'Mevcut', 'Available'), type: 'boolean' },
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
    icon: Handshake,
    titleField: 'name',
    defaultSort: { column: 'sort_order', ascending: true },
    fields: [
      { key: 'name', label: L('الاسم', 'Ad', 'Name'), type: 'localized', required: true },
      { key: 'logo', label: L('الشعار', 'Logo', 'Logo'), type: 'image' },
      { key: 'url', label: L('الرابط', 'Bağlantı', 'URL'), type: 'url' },
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
    icon: BarChart3,
    titleField: 'label',
    defaultSort: { column: 'sort_order', ascending: true },
    filter: { column: 'stat_group', options: statGroupOptions },
    newDefaults: { stat_group: 'statistics' },
    fields: [
      { key: 'stat_group', label: L('المجموعة', 'Grup', 'Group'), type: 'select', options: statGroupOptions, required: true },
      { key: 'label', label: L('البيان', 'Etiket', 'Label'), type: 'localized', required: true },
      { key: 'value', label: L('القيمة', 'Değer', 'Value'), type: 'number' },
      { key: 'suffix', label: L('اللاحقة', 'Sonek', 'Suffix'), type: 'localized' },
      fPublished,
      fSort,
    ],
  },
];

export function getResource(key: string): FullResourceDef | undefined {
  return RESOURCES.find((r) => r.key === key);
}
