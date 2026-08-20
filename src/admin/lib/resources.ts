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

/** compact trilingual label */
const L = (ar: string, tr: string, en: string): Record<Locale, string> => ({ ar, tr, en });

// Shared field builders -------------------------------------------------------
const fPublished: FieldDef = { key: 'is_published', label: L('منشور', 'Yayında', 'Published'), type: 'boolean' };
const fSort: FieldDef = { key: 'sort_order', label: L('الترتيب', 'Sıra', 'Order'), type: 'number' };

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
      { key: 'slug', label: L('المعرف (slug)', 'Slug', 'Slug'), type: 'text', required: true },
      { key: 'category', label: L('التصنيف', 'Kategori', 'Category'), type: 'localized' },
      { key: 'excerpt', label: L('المقتطف', 'Özet', 'Excerpt'), type: 'localizedTextarea' },
      { key: 'content', label: L('المحتوى (فقرات)', 'İçerik (paragraflar)', 'Content (paragraphs)'), type: 'localizedParagraphs' },
      { key: 'image', label: L('الصورة الرئيسية', 'Ana görsel', 'Cover image'), type: 'image' },
      { key: 'image_alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image alt'), type: 'localized' },
      { key: 'published_at', label: L('تاريخ النشر', 'Yayın tarihi', 'Published at'), type: 'datetime' },
      { key: 'year', label: L('السنة', 'Yıl', 'Year'), type: 'number' },
      { key: 'featured', label: L('مميّز', 'Öne çıkan', 'Featured'), type: 'boolean' },
      { key: 'source_url', label: L('رابط المصدر', 'Kaynak bağlantısı', 'Source URL'), type: 'url' },
      { key: 'gallery', label: L('معرض الصور (JSON)', 'Galeri (JSON)', 'Gallery (JSON)'), type: 'json' },
      { key: 'source_images', label: L('صور المصدر (JSON)', 'Kaynak görselleri (JSON)', 'Source images (JSON)'), type: 'json' },
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
      { key: 'slug', label: L('المعرف (slug)', 'Slug', 'Slug'), type: 'text', required: true },
      { key: 'category', label: L('التصنيف', 'Kategori', 'Category'), type: 'localized' },
      { key: 'short_description', label: L('وصف مختصر', 'Kısa açıklama', 'Short description'), type: 'localizedTextarea' },
      { key: 'full_description', label: L('الوصف الكامل (فقرات)', 'Tam açıklama', 'Full description'), type: 'localizedParagraphs' },
      { key: 'image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
      { key: 'image_alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image alt'), type: 'localized' },
      { key: 'contribution_value', label: L('قيمة المساهمة', 'Katkı değeri', 'Contribution value'), type: 'localized' },
      { key: 'unit_amount', label: L('قيمة الوحدة', 'Birim tutar', 'Unit amount'), type: 'number' },
      { key: 'official_contribution_url', label: L('رابط المساهمة', 'Katkı bağlantısı', 'Contribution URL'), type: 'url' },
      { key: 'official_source_url', label: L('رابط المصدر', 'Kaynak bağlantısı', 'Source URL'), type: 'url' },
      { key: 'returns_title', label: L('عنوان العوائد', 'Getiri başlığı', 'Returns title'), type: 'localized' },
      { key: 'returns_intro', label: L('مقدمة العوائد', 'Getiri girişi', 'Returns intro'), type: 'localizedTextarea' },
      { key: 'return_uses', label: L('أوجه العوائد (فقرات)', 'Getiri kullanımları', 'Return uses'), type: 'localizedParagraphs' },
      { key: 'cta_title', label: L('عنوان الدعوة', 'CTA başlığı', 'CTA title'), type: 'localized' },
      { key: 'cta_description', label: L('وصف الدعوة', 'CTA açıklaması', 'CTA description'), type: 'localizedTextarea' },
      { key: 'facts', label: L('الحقائق (JSON)', 'Bilgiler (JSON)', 'Facts (JSON)'), type: 'json' },
      { key: 'allocations', label: L('التوزيعات (JSON)', 'Dağılımlar (JSON)', 'Allocations (JSON)'), type: 'json' },
      { key: 'video', label: L('الفيديو (JSON)', 'Video (JSON)', 'Video (JSON)'), type: 'json' },
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
      { key: 'slug', label: L('المعرف (slug)', 'Slug', 'Slug'), type: 'text', required: true },
      { key: 'summary', label: L('الملخص', 'Özet', 'Summary'), type: 'localizedTextarea' },
      { key: 'hero_image', label: L('صورة الغلاف', 'Kapak görseli', 'Hero image'), type: 'image' },
      { key: 'hero_image_alt', label: L('وصف صورة الغلاف', 'Kapak açıklaması', 'Hero alt'), type: 'localized' },
      { key: 'contact_email', label: L('البريد', 'E-posta', 'Contact email'), type: 'text' },
      { key: 'official_source_url', label: L('رابط المصدر', 'Kaynak bağlantısı', 'Source URL'), type: 'url' },
      { key: 'goals', label: L('الأهداف (فقرات)', 'Hedefler', 'Goals'), type: 'localizedParagraphs' },
      { key: 'components', label: L('المكوّنات (فقرات)', 'Bileşenler', 'Components'), type: 'localizedParagraphs' },
      { key: 'highlights', label: L('أبرز النقاط (فقرات)', 'Öne çıkanlar', 'Highlights'), type: 'localizedParagraphs' },
      { key: 'sections', label: L('الأقسام (JSON)', 'Bölümler (JSON)', 'Sections (JSON)'), type: 'json' },
      { key: 'statistics', label: L('الإحصائيات (JSON)', 'İstatistikler (JSON)', 'Statistics (JSON)'), type: 'json' },
      { key: 'videos', label: L('الفيديوهات (JSON)', 'Videolar (JSON)', 'Videos (JSON)'), type: 'json' },
      { key: 'initiatives', label: L('المبادرات (JSON)', 'Girişimler (JSON)', 'Initiatives (JSON)'), type: 'json' },
      { key: 'cities', label: L('المدن (JSON)', 'Şehirler (JSON)', 'Cities (JSON)'), type: 'json' },
      { key: 'pillars', label: L('الركائز (JSON)', 'Sütunlar (JSON)', 'Pillars (JSON)'), type: 'json' },
      { key: 'journey', label: L('المسار (JSON)', 'Yolculuk (JSON)', 'Journey (JSON)'), type: 'json' },
      { key: 'audiences', label: L('الفئات (JSON)', 'Kitleler (JSON)', 'Audiences (JSON)'), type: 'json' },
      { key: 'themes', label: L('المحاور (JSON)', 'Temalar (JSON)', 'Themes (JSON)'), type: 'json' },
      { key: 'phase', label: L('المرحلة (JSON)', 'Aşama (JSON)', 'Phase (JSON)'), type: 'json' },
      { key: 'images', label: L('الصور (JSON)', 'Görseller (JSON)', 'Images (JSON)'), type: 'json' },
      { key: 'image_gallery', label: L('معرض الصور (JSON)', 'Görsel galeri (JSON)', 'Image gallery (JSON)'), type: 'json' },
      { key: 'seo', label: L('SEO (JSON)', 'SEO (JSON)', 'SEO (JSON)'), type: 'json' },
      { key: 'cta', label: L('الدعوة (JSON)', 'CTA (JSON)', 'CTA (JSON)'), type: 'json' },
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
      { key: 'slug', label: L('المعرف (slug)', 'Slug', 'Slug'), type: 'text', required: true },
      { key: 'excerpt', label: L('المقتطف', 'Özet', 'Excerpt'), type: 'localizedTextarea' },
      { key: 'content', label: L('المحتوى (فقرات)', 'İçerik', 'Content (paragraphs)'), type: 'localizedParagraphs' },
      { key: 'image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
      { key: 'image_alt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image alt'), type: 'localized' },
      { key: 'original_title', label: L('العنوان الأصلي', 'Orijinal başlık', 'Original title'), type: 'text' },
      { key: 'date', label: L('التاريخ (نص)', 'Tarih', 'Date (text)'), type: 'text' },
      { key: 'year', label: L('السنة', 'Yıl', 'Year'), type: 'number' },
      { key: 'source_url', label: L('رابط المصدر', 'Kaynak', 'Source URL'), type: 'url' },
      { key: 'source_language', label: L('لغة المصدر', 'Kaynak dili', 'Source language'), type: 'text' },
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
      { key: 'source_url', label: L('رابط المصدر', 'Kaynak', 'Source URL'), type: 'url' },
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
      { key: 'source_url', label: L('رابط المصدر', 'Kaynak', 'Source URL'), type: 'url' },
      { key: 'width', label: L('العرض', 'Genişlik', 'Width'), type: 'number' },
      { key: 'height', label: L('الارتفاع', 'Yükseklik', 'Height'), type: 'number' },
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
      { key: 'slug', label: L('المعرف (slug)', 'Slug', 'Slug'), type: 'text', required: true },
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
