// Declarative description of every editable page on the site.
//
// Each entry maps to one `site_pages` row whose `data` is locale-first:
//   { ar: { hero: { title: "…" } }, tr: { … }, en: { … } }
// The dashboard edits one locale at a time, so field paths below are relative
// to `data[locale]`.
//
// Every section carries a `description`: one sentence, in the editor's words,
// saying where on the site the fields appear. That line — not the field count —
// is what tells a non-technical editor they are in the right place.

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
  Share2,
  Accessibility,
  LayoutGrid,
  Phone,
  Search,
  SlidersHorizontal,
  Library,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Banknote,
  Clapperboard,
  type LucideIcon,
} from 'lucide-react';
import type { Locale } from '@/lib/types';
import type { SelectOption } from './fields';

/** Compact trilingual label. */
const L = (ar: string, tr: string, en: string): Record<Locale, string> => ({ ar, tr, en });

export type PageFieldType =
  | 'text'
  | 'textarea'
  | 'paragraphs'
  | 'list'
  | 'image'
  | 'file'
  | 'url'
  | 'number'
  | 'boolean'
  | 'video'
  | 'select'
  | 'icon'
  | 'localized'
  | 'localizedTextarea'
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
  /** Choices for `select` fields. */
  options?: SelectOption[];
  /** Upper bound on repeater rows, where the layout cannot show more. */
  max?: number;
  full?: boolean;
  /** Tucked into a collapsed "more settings" block instead of the main grid. */
  advanced?: boolean;
  placeholder?: string;
  /** `number` fields: accept fractions even when the key is one the record forms treat as an integer. */
  decimal?: boolean;
};

export type PageSectionDef = {
  key: string;
  label: Record<Locale, string>;
  /** Where on the site this section's fields appear. */
  description?: Record<Locale, string>;
  icon: LucideIcon;
  /** Element in the live preview to scroll to and outline while editing. */
  anchor?: string;
  /** Route the preview opens for this section, when it differs from the page's own. */
  route?: string;
  fields: PageFieldDef[];
};

export type PageGroup = 'main' | 'about' | 'involve' | 'library' | 'system';

export type SitePageDef = {
  /** Primary key of the `site_pages` row. */
  key: string;
  group: PageGroup;
  label: Record<Locale, string>;
  /** One line under the page name in the page list. */
  description?: Record<Locale, string>;
  icon: LucideIcon;
  /** Public route opened in the preview frame. */
  route: string;
  sections: PageSectionDef[];
};

export const PAGE_GROUPS: { key: PageGroup; label: Record<Locale, string> }[] = [
  { key: 'main', label: L('الصفحات الرئيسية', 'Ana sayfalar', 'Main pages') },
  { key: 'about', label: L('عن الوقف', 'Hakkında', 'About') },
  { key: 'involve', label: L('المساهمة والمشاركة', 'Katılım', 'Donate & participate') },
  { key: 'library', label: L('المكتبة والأخبار', 'Kütüphane ve haberler', 'Library & news') },
  { key: 'system', label: L('إعدادات الموقع', 'Site ayarları', 'Site settings') },
];

// Reusable field clusters ----------------------------------------------------
const seoFields = (prefix = 'seo'): PageFieldDef[] => [
  {
    path: `${prefix}.title`,
    label: L('عنوان الصفحة في جوجل', 'Google başlığı', 'Search-engine title'),
    type: 'text',
    help: L('يظهر في تبويب المتصفح ونتائج البحث', 'Tarayıcı sekmesinde ve arama sonuçlarında görünür', 'Shown in the browser tab and in search results'),
  },
  {
    path: `${prefix}.description`,
    label: L('وصف الصفحة في جوجل', 'Google açıklaması', 'Search-engine description'),
    type: 'textarea',
  },
  {
    path: `${prefix}.canonical`,
    label: L('الرابط الأساسي (canonical)', 'Kanonik bağlantı', 'Canonical URL'),
    type: 'url',
    advanced: true,
    help: L('اتركه فارغاً إلا إذا كانت الصفحة منشورة على رابط آخر أيضاً', 'Sayfa başka bir adreste de yayındaysa doldurun', 'Leave empty unless the page also lives at another address'),
  },
];

const heroFields = (prefix = 'hero'): PageFieldDef[] => [
  { path: `${prefix}.title`, label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
  { path: `${prefix}.description`, label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
  { path: `${prefix}.image`, label: L('صورة الخلفية', 'Arka plan görseli', 'Background image'), type: 'image' },
  {
    path: `${prefix}.imageAlt`,
    label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'),
    type: 'text',
    help: L('لقارئات الشاشة ومحركات البحث', 'Ekran okuyucular ve arama motorları için', 'For screen readers and search engines'),
  },
];

const introFields = (prefix = 'intro'): PageFieldDef[] => [
  { path: `${prefix}.eyebrow`, label: L('السطر الصغير فوق العنوان', 'Başlık üstü satır', 'Line above the title'), type: 'text' },
  { path: `${prefix}.title`, label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
  {
    path: `${prefix}.paragraphs`,
    label: L('الفقرات', 'Paragraflar', 'Paragraphs'),
    type: 'paragraphs',
  },
];

const linkItemFields: PageFieldDef[] = [
  { path: 'label', label: L('النص', 'Etiket', 'Label'), type: 'text' },
  {
    path: 'href',
    label: L('الرابط', 'Bağlantı', 'Link'),
    type: 'text',
    help: L('مثال: /projects أو #about', 'Örnek: /projects veya #about', 'Example: /projects or #about'),
  },
];

const eyebrowTitleDescription = (prefix: string): PageFieldDef[] => [
  { path: `${prefix}.eyebrow`, label: L('السطر الصغير فوق العنوان', 'Başlık üstü satır', 'Line above the title'), type: 'text' },
  { path: `${prefix}.title`, label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
  { path: `${prefix}.description`, label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
];

const iconField = (path = 'icon'): PageFieldDef => ({
  path,
  label: L('الأيقونة', 'Simge', 'Icon'),
  type: 'icon',
  help: L('اختياري — يُستخدم الافتراضي إن تُرك فارغاً', 'İsteğe bağlı', 'Optional — the default is used when empty'),
});

type LabelEntry = [key: string, ar: string, tr: string, en: string, type?: 'text' | 'textarea'];

/** Turns a flat label map into individual text fields. */
function labelFields(prefix: string, entries: LabelEntry[]): PageFieldDef[] {
  return entries.map(([key, ar, tr, en, type]) => ({
    path: prefix ? `${prefix}.${key}` : key,
    label: L(ar, tr, en),
    type: type ?? 'text',
  }));
}

const socialNetworkFields = (prefix: string): PageFieldDef[] => [
  { path: `${prefix}.facebook`, label: L('فيسبوك', 'Facebook', 'Facebook'), type: 'url' },
  { path: `${prefix}.twitter`, label: L('تويتر / X', 'Twitter / X', 'Twitter / X'), type: 'url' },
  { path: `${prefix}.instagram`, label: L('إنستغرام', 'Instagram', 'Instagram'), type: 'url' },
  { path: `${prefix}.youtube`, label: L('يوتيوب', 'YouTube', 'YouTube'), type: 'url' },
  { path: `${prefix}.linkedin`, label: L('لينكدإن', 'LinkedIn', 'LinkedIn'), type: 'url' },
  { path: `${prefix}.tiktok`, label: L('تيك توك', 'TikTok', 'TikTok'), type: 'url' },
  { path: `${prefix}.whatsapp`, label: L('واتساب', 'WhatsApp', 'WhatsApp'), type: 'url' },
  { path: `${prefix}.telegram`, label: L('تيليغرام', 'Telegram', 'Telegram'), type: 'url' },
];

const formFieldTypeOptions: SelectOption[] = [
  { value: 'text', label: L('نص قصير', 'Kısa metin', 'Short text') },
  { value: 'textarea', label: L('نص طويل', 'Uzun metin', 'Long text') },
  { value: 'email', label: L('بريد إلكتروني', 'E-posta', 'Email') },
  { value: 'tel', label: L('رقم هاتف', 'Telefon', 'Phone number') },
  { value: 'select', label: L('قائمة اختيار', 'Seçim listesi', 'Dropdown') },
  { value: 'file', label: L('رفع ملف', 'Dosya yükleme', 'File upload') },
];

const inputModeOptions: SelectOption[] = [
  { value: 'text', label: L('نص', 'Metin', 'Text') },
  { value: 'email', label: L('بريد', 'E-posta', 'Email') },
  { value: 'tel', label: L('هاتف', 'Telefon', 'Phone') },
  { value: 'numeric', label: L('أرقام', 'Sayısal', 'Numbers') },
];

const contactKindOptions: SelectOption[] = [
  { value: 'whatsapp', label: L('واتساب', 'WhatsApp', 'WhatsApp') },
  { value: 'social', label: L('صفحة تواصل اجتماعي', 'Sosyal medya', 'Social page') },
];

const participateKeyOptions: SelectOption[] = [
  { value: 'shareIdeas', label: L('شارك بفكرة', 'Fikir paylaş', 'Share an idea') },
  { value: 'complaintsSuggestions', label: L('الشكاوى والمقترحات', 'Şikayet ve öneriler', 'Complaints & suggestions') },
  { value: 'volunteer', label: L('التطوع', 'Gönüllülük', 'Volunteer') },
  { value: 'contact', label: L('تواصل معنا', 'İletişim', 'Contact us') },
];

const navMenuOptions: SelectOption[] = [
  { value: '', label: L('بدون قائمة منسدلة', 'Açılır menü yok', 'No dropdown') },
  { value: 'about', label: L('قائمة "عن الوقف"', '"Hakkında" menüsü', '"About" menu') },
  { value: 'programs', label: L('قائمة "البرامج"', '"Programlar" menüsü', '"Programs" menu') },
];

const libraryCollectionKeys: [string, string, string, string][] = [
  ['forum', 'منتدى الوقف (المقالات)', 'Vakıf forumu', 'Waqf forum (articles)'],
  ['periodic-reports', 'التقارير الدورية', 'Periyodik raporlar', 'Periodic reports'],
  ['waqf-books', 'كتب الوقف', 'Vakıf kitapları', 'Waqf books'],
  ['waqf-literature', 'أدبيات الوقف', 'Vakıf literatürü', 'Waqf literature'],
  ['yemeni-figures', 'شخصيات يمانية', 'Yemenli şahsiyetler', 'Yemeni figures'],
  ['success-stories', 'قصص النجاح', 'Başarı hikayeleri', 'Success stories'],
  ['gallery', 'معرض الصور', 'Galeri', 'Photo gallery'],
];


// The waqf-story presentation (/library/profile): every chapter is a heading +
// standfirst and a few "title + text" cards, photographed; the numbers vault
// counts stats that each carry a number, a label and an optional suffix.
const profileHeadingFields = (prefix: string): PageFieldDef[] => [
  { path: `${prefix}.heading`, label: L('عنوان الفصل', 'Bölüm başlığı', 'Chapter heading'), type: 'text' },
  { path: `${prefix}.subheading`, label: L('السطر التمهيدي تحت العنوان', 'Başlık altı satır', 'Standfirst under the heading'), type: 'textarea' },
];

const profileCardFields: PageFieldDef[] = [
  { path: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
  { path: 'text', label: L('النص', 'Metin', 'Text'), type: 'textarea' },
];

const profileCards = (path: string, label: Record<Locale, string>, extra: Partial<PageFieldDef> = {}): PageFieldDef => ({
  path,
  label,
  type: 'repeater',
  itemTitleField: 'title',
  itemFields: profileCardFields,
  ...extra,
});

/** A single titled card stored as `prefix.title` + `prefix.text`. */
const profileCard = (prefix: string, name: Record<Locale, string>): PageFieldDef[] => [
  { path: `${prefix}.title`, label: L(`${name.ar} — العنوان`, `${name.tr} — başlık`, `${name.en} — title`), type: 'text' },
  { path: `${prefix}.text`, label: L(`${name.ar} — النص`, `${name.tr} — metin`, `${name.en} — text`), type: 'textarea' },
];

const profilePhotoFields: PageFieldDef[] = [
  { path: 'src', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
  {
    path: 'alt',
    label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'),
    type: 'text',
    help: L('لقارئات الشاشة ومحركات البحث', 'Ekran okuyucular ve arama motorları için', 'For screen readers and search engines'),
  },
];

const profilePhotos = (path: string, label: Record<Locale, string>, max?: number): PageFieldDef => ({
  path,
  label,
  type: 'repeater',
  itemTitleField: 'alt',
  itemFields: profilePhotoFields,
  max,
  help: L('احذف كل الصور لإخفاء الشريط', 'Şeridi gizlemek için tüm görselleri kaldırın', 'Remove every photo to hide the band'),
});

const profileStatFields: PageFieldDef[] = [
  { path: 'value', label: L('الرقم', 'Sayı', 'Number'), type: 'number', decimal: true },
  { path: 'label', label: L('البيان', 'Etiket', 'Label'), type: 'text' },
  {
    path: 'suffix',
    label: L('لاحقة بعد الرقم', 'Sayı soneki', 'Suffix after the number'),
    type: 'text',
    help: L('مثل % أو M+ — اتركها فارغة إن لم تلزم', 'Örneğin % veya M+ — gerekmiyorsa boş bırakın', 'E.g. % or M+ — leave empty when not needed'),
  },
  { path: 'sublabel', label: L('سطر توضيحي', 'Açıklama satırı', 'Explanatory line'), type: 'text' },
  {
    path: 'decimals',
    label: L('المنازل العشرية', 'Ondalık basamak', 'Decimal places'),
    type: 'number',
    advanced: true,
    help: L('0 للأرقام الصحيحة', 'Tam sayılar için 0', '0 for whole numbers'),
  },
];

/** One stat stored as `prefix.value`, `prefix.label`, … */
const profileStat = (prefix: string, name: Record<Locale, string>): PageFieldDef[] =>
  profileStatFields.map((field) => ({
    ...field,
    path: `${prefix}.${field.path}`,
    label: L(`${name.ar} — ${field.label.ar}`, `${name.tr} — ${field.label.tr}`, `${name.en} — ${field.label.en}`),
  }));

const profileStats = (path: string, label: Record<Locale, string>, extra: Partial<PageFieldDef> = {}): PageFieldDef => ({
  path,
  label,
  type: 'repeater',
  itemTitleField: 'label',
  itemFields: profileStatFields,
  ...extra,
});

const profileChapterNote = (path: string): PageFieldDef => ({
  path,
  label: L('الخلاصة في آخر الفصل', 'Bölüm sonu notu', 'Closing line of the chapter'),
  type: 'textarea',
});

// PAGES ----------------------------------------------------------------------
export const SITE_PAGES: SitePageDef[] = [
  // HOME ---------------------------------------------------------------------
  {
    key: 'home',
    group: 'main',
    label: L('الصفحة الرئيسية', 'Ana sayfa', 'Home'),
    description: L('كل أقسام الصفحة الأولى من الأعلى إلى الأسفل', 'Açılış sayfasının tüm bölümleri', 'Every section of the landing page, top to bottom'),
    icon: Home,
    route: '/',
    sections: [
      {
        key: 'hero',
        label: L('الواجهة الرئيسية', 'Hero bölümü', 'Hero section'),
        description: L('أول ما يراه الزائر: العنوان الكبير فوق الفيديو والزر تحته', 'Ziyaretçinin ilk gördüğü: video üstündeki başlık ve buton', 'The first thing a visitor sees: the big title over the video and the button below it'),
        icon: Megaphone,
        anchor: '#hero',
        fields: [
          { path: 'hero.title', label: L('العنوان الكبير', 'Büyük başlık', 'Headline'), type: 'textarea' },
          {
            path: 'hero.titleImage',
            label: L('صورة العنوان (مخطوطة)', 'Başlık görseli (hat yazısı)', 'Headline image (calligraphy)'),
            type: 'image',
            help: L(
              'عند تعيينها تظهر بدل العنوان النصي، ويبقى العنوان وصفاً لها لقارئات الشاشة',
              'Ayarlandığında metin başlığın yerine görünür; başlık ekran okuyucular için açıklama olur',
              'Shown instead of the text headline; the headline stays as its alt text for screen readers',
            ),
          },
          { path: 'hero.secondaryButton', label: L('نص الزر', 'Buton metni', 'Button label'), type: 'text' },
          {
            path: 'hero.secondaryUrl',
            label: L('وجهة الزر', 'Buton hedefi', 'Button destination'),
            type: 'text',
            help: L('مثال: #participate أو /donate', 'Örnek: #participate veya /donate', 'Example: #participate or /donate'),
          },
          { path: 'hero', label: L('فيديو الخلفية', 'Arka plan videosu', 'Background video'), type: 'video' },
        ],
      },
      {
        key: 'about',
        label: L('عن الوقف', 'Vakıf hakkında', 'About the waqf'),
        description: L('قسم التعريف بالوقف مع التبويبات (الرؤية، الرسالة…)', 'Sekmeli tanıtım bölümü (vizyon, misyon…)', 'The introduction section with its tabs (vision, mission…)'),
        icon: Info,
        anchor: '#about',
        fields: [
          ...eyebrowTitleDescription('about'),
          { path: 'about.image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
          { path: 'about.imageAlt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'), type: 'text' },
          {
            path: 'about.learnMoreUrl',
            label: L('وجهة زر "اعرف المزيد"', '"Daha fazla" hedefi', '"Learn more" destination'),
            type: 'text',
            help: L('مثال: /about/waqf', 'Örnek: /about/waqf', 'Example: /about/waqf'),
          },
          {
            path: 'about.goals',
            label: L('قائمة الأهداف (نقاط ✓)', 'Hedef listesi (✓ maddeler)', 'Goals checklist (✓ items)'),
            type: 'list',
          },
          { path: 'about.tabs.vision', label: L('اسم تبويب الرؤية', 'Vizyon sekmesi adı', 'Vision tab name'), type: 'text' },
          { path: 'about.vision', label: L('نص الرؤية', 'Vizyon metni', 'Vision text'), type: 'textarea' },
          { path: 'about.tabs.mission', label: L('اسم تبويب الرسالة', 'Misyon sekmesi adı', 'Mission tab name'), type: 'text' },
          { path: 'about.mission', label: L('نقاط الرسالة', 'Misyon maddeleri', 'Mission points'), type: 'list' },
          { path: 'about.tabs.methodology', label: L('اسم تبويب المنهجية', 'Metodoloji sekmesi adı', 'Methodology tab name'), type: 'text' },
          { path: 'about.methodology', label: L('نقاط المنهجية', 'Metodoloji maddeleri', 'Methodology points'), type: 'list' },
          { path: 'about.tabs.values', label: L('اسم تبويب القيم', 'Değerler sekmesi adı', 'Values tab name'), type: 'text' },
          { path: 'about.values', label: L('القيم', 'Değerler', 'Values'), type: 'list' },
          { path: 'about.tabs.sectors', label: L('اسم تبويب القطاعات', 'Sektörler sekmesi adı', 'Sectors tab name'), type: 'text' },
          { path: 'about.sectors', label: L('القطاعات', 'Sektörler', 'Sectors'), type: 'list' },
        ],
      },
      {
        key: 'projects',
        label: L('بطاقات المشاريع', 'Proje kartları', 'Project cards'),
        description: L(
          'عنوان قسم المشاريع وبطاقاته الدوّارة. هذه البطاقات مستقلة عن صفحات المشاريع — لتعديل صفحة مشروع كاملة اذهب إلى "المشاريع" في القائمة.',
          'Proje bölümünün başlığı ve kartları. Kartlar proje sayfalarından bağımsızdır; sayfayı düzenlemek için menüden "Projeler"e gidin.',
          'The projects section title and its rotating cards. Cards are independent of the project pages — to edit a full project page open "Projects" in the menu.',
        ),
        icon: FolderKanban,
        anchor: '#projects',
        fields: [
          ...eyebrowTitleDescription('projects'),
          {
            path: 'projects.defaultContributionUrl',
            label: L('وجهة "ساهم معنا" الافتراضية', 'Varsayılan katkı hedefi', 'Default "donate" destination'),
            type: 'text',
            advanced: true,
            help: L('تُستخدم عندما لا يكون للبطاقة رابط مساهمة خاص', 'Kartın kendi bağlantısı yoksa kullanılır', 'Used when a card has no contribution link of its own'),
          },
          {
            path: 'projects.items',
            label: L('البطاقات', 'Kartlar', 'Cards'),
            type: 'repeater',
            itemTitleField: 'name',
            itemFields: [
              { path: 'name', label: L('الاسم', 'Ad', 'Name'), type: 'text' },
              { path: 'description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
              { path: 'contribution', label: L('قيمة المساهمة', 'Katkı', 'Contribution'), type: 'text' },
              { path: 'image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
              { path: 'imageAlt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'), type: 'text' },
              { path: 'detailsUrl', label: L('رابط التفاصيل', 'Detay bağlantısı', 'Details link'), type: 'text' },
              {
                path: 'contributionUrl',
                label: L('رابط المساهمة', 'Katkı bağlantısı', 'Contribution link'),
                type: 'text',
                help: L('مثال: /donate/checkout/waqf-share (صفحة الدفع)', 'Örnek: /donate/checkout/waqf-share (ödeme sayfası)', 'Example: /donate/checkout/waqf-share (checkout page)'),
              },
            ],
          },
        ],
      },
      {
        key: 'programs',
        label: L('بطاقات البرامج', 'Program kartları', 'Program cards'),
        description: L(
          'عنوان قسم البرامج وبطاقاته المتراكبة. البطاقات مستقلة عن صفحات البرامج — لتعديل صفحة برنامج اذهب إلى "البرامج".',
          'Program bölümünün başlığı ve kartları; program sayfalarından bağımsızdır.',
          'The programs section title and its stacked cards. Cards are independent of the program pages — open "Programs" to edit a page.',
        ),
        icon: GraduationCap,
        anchor: '#programs',
        fields: [
          ...eyebrowTitleDescription('programs'),
          {
            path: 'programs.items',
            label: L('البطاقات', 'Kartlar', 'Cards'),
            type: 'repeater',
            itemTitleField: 'title',
            itemFields: [
              { path: 'title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
              { path: 'description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
              { path: 'image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
              { path: 'imageAlt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'), type: 'text' },
              { path: 'url', label: L('الرابط', 'Bağlantı', 'Link'), type: 'text' },
            ],
          },
        ],
      },
      {
        key: 'yemenPioneers',
        label: L('رواد اليمن', 'Yemen öncüleri', 'Yemen pioneers'),
        description: L(
          'القسم الأحمر الخاص برواد اليمن. الأرقام الأربعة تُدار من "الإحصائيات" في القائمة (مجموعة رواد اليمن).',
          'Yemen öncüleri bölümü. Rakamlar menüdeki "İstatistikler"den yönetilir.',
          'The Yemen pioneers band. Its figures are managed under "Statistics" in the menu (Yemen pioneers group).',
        ),
        icon: Award,
        anchor: '#yemen-pioneers',
        fields: [
          ...eyebrowTitleDescription('yemenPioneers'),
          { path: 'yemenPioneers.button', label: L('نص الزر', 'Buton metni', 'Button label'), type: 'text' },
          {
            path: 'yemenPioneers.url',
            label: L('وجهة الزر', 'Buton hedefi', 'Button destination'),
            type: 'text',
            help: L('مثال: /programs/yemen-pioneers', 'Örnek: /programs/yemen-pioneers', 'Example: /programs/yemen-pioneers'),
          },
          { path: 'yemenPioneers.image', label: L('الصورة', 'Görsel', 'Image'), type: 'image' },
        ],
      },
      {
        key: 'statistics',
        label: L('الإحصائيات', 'İstatistikler', 'Statistics'),
        description: L(
          'عنوان قسم الأرقام ووصفه. الأرقام نفسها تُدار من "الإحصائيات" في القائمة.',
          'Rakamlar bölümünün başlığı ve açıklaması. Rakamlar menüdeki "İstatistikler"den yönetilir.',
          'The title and description of the figures section. The figures themselves are managed under "Statistics" in the menu.',
        ),
        icon: BarChart3,
        anchor: '#statistics',
        fields: [...eyebrowTitleDescription('statistics')],
      },
      {
        key: 'news',
        label: L('قسم الأخبار', 'Haber bölümü', 'News section'),
        description: L('عنوان قسم آخر الأخبار في الصفحة الرئيسية؛ الأخبار نفسها من قائمة "الأخبار"', 'Ana sayfadaki haber bölümü başlığı; haberler "Haberler" listesinden gelir', 'The latest-news section title; the articles come from the "News" list'),
        icon: Newspaper,
        anchor: '#news',
        fields: [
          { path: 'news.eyebrow', label: L('السطر الصغير فوق العنوان', 'Başlık üstü satır', 'Line above the title'), type: 'text' },
          { path: 'news.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          {
            path: 'news.count',
            label: L('عدد الأخبار المعروضة', 'Gösterilen haber sayısı', 'Number of articles shown'),
            type: 'number',
            help: L('الافتراضي 3: خبر كبير وخبران صغيران', 'Varsayılan 3', 'Default 3: one large card and two small ones'),
          },
        ],
      },
      {
        key: 'partners',
        label: L('الشركاء', 'Ortaklar', 'Partners'),
        description: L('عنوان شريط شعارات الشركاء؛ الشعارات من قائمة "الشركاء"', 'Ortak logoları şeridinin başlığı; logolar "Ortaklar" listesinden', 'The partner-logo strip title; the logos come from the "Partners" list'),
        icon: Handshake,
        anchor: '#partners',
        fields: [
          { path: 'partners.eyebrow', label: L('السطر الصغير فوق العنوان', 'Başlık üstü satır', 'Line above the title'), type: 'text' },
          { path: 'partners.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
        ],
      },
      {
        key: 'participation',
        label: L('دعوة المشاركة', 'Katılım çağrısı', 'Participation call'),
        description: L('اللوحة الداكنة في أسفل الصفحة الرئيسية وصفحة عن الوقف، بزرّيها', 'Ana sayfanın altındaki koyu pano ve iki butonu', 'The dark banner at the bottom of the home and about pages, with its two buttons'),
        icon: MessageSquare,
        anchor: '#participate',
        fields: [
          { path: 'participation.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          {
            path: 'participation.description',
            label: L('الوصف', 'Açıklama', 'Description'),
            type: 'textarea',
          },
          { path: 'participation.primaryButton', label: L('الزر الأول', 'Birinci buton', 'First button'), type: 'text' },
          { path: 'participation.primaryUrl', label: L('وجهة الزر الأول', 'Birinci buton hedefi', 'First button destination'), type: 'text' },
          { path: 'participation.secondaryButton', label: L('الزر الثاني', 'İkinci buton', 'Second button'), type: 'text' },
          { path: 'participation.secondaryUrl', label: L('وجهة الزر الثاني', 'İkinci buton hedefi', 'Second button destination'), type: 'text' },
          { path: 'participation.image', label: L('صورة الخلفية', 'Arka plan görseli', 'Background image'), type: 'image' },
        ],
      },
    ],
  },

  // SITE SETTINGS ------------------------------------------------------------
  {
    key: 'settings',
    group: 'system',
    label: L('الهوية والقائمة والتذييل', 'Kimlik, menü ve altbilgi', 'Identity, menu & footer'),
    description: L('ما يتكرر في كل الصفحات: الشعار، القائمة العلوية، التذييل، والنصوص العامة', 'Her sayfada tekrarlanan: logo, üst menü, altbilgi, genel metinler', 'What repeats on every page: logo, top menu, footer, and shared labels'),
    icon: Settings2,
    route: '/',
    sections: [
      {
        key: 'meta',
        label: L('بيانات الموقع', 'Site meta', 'Site meta'),
        description: L('عنوان الموقع في تبويب المتصفح ووصفه في نتائج البحث وصورة المشاركة', 'Tarayıcı sekmesi başlığı, arama açıklaması ve paylaşım görseli', 'The browser-tab title, search-result description and share image'),
        icon: Type,
        fields: [
          { path: 'meta.title', label: L('عنوان المتصفح', 'Tarayıcı başlığı', 'Browser title'), type: 'text' },
          { path: 'meta.description', label: L('وصف الموقع', 'Site açıklaması', 'Site description'), type: 'textarea' },
          {
            path: 'meta.ogImage',
            label: L('صورة المشاركة', 'Paylaşım görseli', 'Share image'),
            type: 'image',
            help: L('تظهر عند مشاركة رابط الموقع على واتساب وفيسبوك', 'Site bağlantısı paylaşıldığında görünür', 'Shown when the site link is shared on WhatsApp or Facebook'),
          },
        ],
      },
      {
        key: 'siteConfig',
        label: L('الهوية القانونية والروابط', 'Kurumsal kimlik ve bağlantılar', 'Legal identity & links'),
        description: L('اسم المؤسسة وشعارها وأرقام الترخيص في التذييل، وحسابات التواصل الاجتماعي', 'Kurum adı, logo, altbilgideki lisans numaraları ve sosyal hesaplar', 'Organisation name, logo, the licence numbers in the footer, and social accounts'),
        icon: Building2,
        fields: [
          { path: 'siteConfig.name', label: L('اسم المؤسسة', 'Kurum adı', 'Organisation name'), type: 'text' },
          {
            path: 'siteConfig.logo',
            label: L('الشعار', 'Logo', 'Logo'),
            type: 'image',
            help: L(
              'لكل لغة شعارها الخاص: بدّل اللغة من أعلى الصفحة لرفع شعار مختلف للعربية والتركية والإنجليزية. يُفضّل PNG بخلفية شفافة.',
              'Her dilin kendi logosu vardır: Arapça, Türkçe ve İngilizce için farklı logo yüklemek üzere sayfanın üstünden dili değiştirin. Şeffaf arka planlı PNG tercih edilir.',
              'Each language has its own logo: switch the language at the top of the page to upload a different logo for Arabic, Turkish and English. A PNG with a transparent background works best.'
            ),
          },
          {
            path: 'siteConfig.donateUrl',
            label: L('وجهة زر "ساهم الآن"', '"Bağış yap" hedefi', '"Donate now" destination'),
            type: 'text',
            help: L('يُستخدم في القائمة العلوية والتذييل', 'Üst menü ve altbilgide kullanılır', 'Used in the top menu and the footer'),
          },
          { path: 'siteConfig.licenseNumber', label: L('رقم الترخيص', 'Lisans no', 'License number'), type: 'text' },
          {
            path: 'siteConfig.courtDecision',
            label: L('قرار المحكمة', 'Mahkeme kararı', 'Court decision'),
            type: 'text',
          },
          { path: 'siteConfig.taxNumber', label: L('الرقم الضريبي', 'Vergi no', 'Tax number'), type: 'text' },
          {
            path: 'siteConfig.taxExempt',
            label: L('إظهار سطر "الإعفاء الضريبي" في التذييل', 'Altbilgide "vergi muafiyeti" satırını göster', 'Show the "tax exempt" line in the footer'),
            type: 'boolean',
          },
          ...socialNetworkFields('siteConfig.socialLinks'),
        ],
      },
      {
        key: 'navLinks',
        label: L('القائمة العلوية', 'Üst menü', 'Top menu'),
        description: L('روابط القائمة في رأس الصفحة (وقائمة الجوال)', 'Sayfa başındaki ve mobil menüdeki bağlantılar', 'The links in the page header (and the mobile menu)'),
        icon: ListTree,
        anchor: 'header',
        fields: [
          {
            path: 'navLinks',
            label: L('روابط القائمة', 'Menü bağlantıları', 'Menu links'),
            type: 'repeater',
            itemTitleField: 'label',
            itemFields: [
              ...linkItemFields,
              {
                path: 'menu',
                label: L('قائمة منسدلة', 'Açılır menü', 'Dropdown menu'),
                type: 'select',
                options: navMenuOptions,
                help: L('يعرض تحت هذا الرابط قائمة "عن الوقف" أو "البرامج"', 'Bu bağlantının altında alt menü gösterir', 'Shows the About or Programs submenu under this link'),
              },
            ],
          },
        ],
      },
      {
        key: 'footer',
        label: L('التذييل', 'Altbilgi', 'Footer'),
        description: L('النص والعنوان وبيانات التواصل والروابط السريعة في أسفل كل صفحة', 'Her sayfanın altındaki metin, adres, iletişim ve hızlı bağlantılar', 'The text, address, contact details and quick links at the bottom of every page'),
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
            label: L('نص رابط الحسابات البنكية', 'Banka hesapları bağlantı metni', 'Bank accounts link text'),
            type: 'text',
          },
          {
            path: 'footer.bankAccountsUrl',
            label: L('وجهة رابط الحسابات البنكية', 'Banka hesapları hedefi', 'Bank accounts link destination'),
            type: 'text',
            help: L('مثال: /donate أو رابط ملف PDF', 'Örnek: /donate veya bir PDF', 'Example: /donate or a PDF link'),
          },
          {
            path: 'footer.newsletterTitle',
            label: L('عنوان النشرة البريدية', 'Bülten başlığı', 'Newsletter title'),
            type: 'text',
          },
          {
            path: 'footer.newsletterDescription',
            label: L('وصف النشرة البريدية', 'Bülten açıklaması', 'Newsletter description'),
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
        description: L('كلمات تتكرر في أزرار الموقع مثل "اقرأ المزيد" و"ساهم الآن"', 'Sitedeki butonlarda tekrarlanan kelimeler', 'Words that repeat on buttons across the site, e.g. "Read more"'),
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
          ['taxExempt', 'سطر الإعفاء الضريبي', 'Vergi muafiyeti satırı', 'Tax exempt line'],
          ['discoverMore', 'اكتشف المزيد', 'Keşfet', 'Discover more'],
          ['unavailable', 'غير متاح', 'Mevcut değil', 'Unavailable'],
        ]),
      },
      {
        key: 'uiFooter',
        label: L('نصوص التذييل', 'Altbilgi metinleri', 'Footer labels'),
        description: L('الكلمات الصغيرة في سطر الترخيص وحقوق النشر', 'Lisans ve telif satırındaki küçük kelimeler', 'The small words in the licence and copyright line'),
        icon: Landmark,
        fields: labelFields('ui.footer', [
          ['licensePrefix', 'كلمة "الترخيص"', 'Lisans ön eki', 'License prefix'],
          ['courtDecisionPrefix', 'كلمة "قرار المحكمة"', 'Mahkeme kararı ön eki', 'Court decision prefix'],
          ['taxNumberPrefix', 'كلمة "الرقم الضريبي"', 'Vergi no ön eki', 'Tax number prefix'],
          ['rightsReserved', 'حقوق النشر', 'Telif hakkı', 'Rights reserved'],
          ['yearSuffix', 'لاحقة السنة', 'Yıl son eki', 'Year suffix'],
        ]),
      },
      {
        key: 'uiSocial',
        label: L('أسماء شبكات التواصل', 'Sosyal ağ adları', 'Social network names'),
        description: L('أسماء الأيقونات لقارئات الشاشة', 'Ekran okuyucular için simge adları', 'Icon names for screen readers'),
        icon: Share2,
        fields: labelFields('ui.social', [
          ['facebook', 'فيسبوك', 'Facebook', 'Facebook'],
          ['twitter', 'تويتر / X', 'Twitter / X', 'Twitter / X'],
          ['instagram', 'إنستغرام', 'Instagram', 'Instagram'],
          ['youtube', 'يوتيوب', 'YouTube', 'YouTube'],
          ['linkedin', 'لينكدإن', 'LinkedIn', 'LinkedIn'],
          ['tiktok', 'تيك توك', 'TikTok', 'TikTok'],
          ['whatsapp', 'واتساب', 'WhatsApp', 'WhatsApp'],
          ['telegram', 'تيليغرام', 'Telegram', 'Telegram'],
        ]),
      },
      {
        key: 'uiAccessibility',
        label: L('نصوص قارئات الشاشة', 'Erişilebilirlik metinleri', 'Screen-reader labels'),
        description: L('نصوص لا تظهر على الشاشة لكن تقرؤها برامج المكفوفين', 'Ekranda görünmeyen, ekran okuyucuların okuduğu metinler', 'Text that is not shown but read aloud by assistive software'),
        icon: Accessibility,
        fields: labelFields('ui.accessibility', [
          ['openMenu', 'فتح القائمة', 'Menüyü aç', 'Open menu'],
          ['closeMenu', 'إغلاق القائمة', 'Menüyü kapat', 'Close menu'],
          ['playVideo', 'تشغيل الفيديو', 'Videoyu oynat', 'Play video'],
          ['closeVideo', 'إغلاق الفيديو', 'Videoyu kapat', 'Close video'],
          ['scrollDown', 'التمرير لأسفل', 'Aşağı kaydır', 'Scroll down'],
          ['videoTitle', 'عنوان الفيديو', 'Video başlığı', 'Video title'],
          ['videoBackgroundTitle', 'عنوان فيديو الخلفية', 'Arka plan videosu başlığı', 'Background video title'],
          ['loadingVideo', 'جارٍ تحميل الفيديو', 'Video yükleniyor', 'Loading video'],
          ['languageSwitcher', 'مبدّل اللغة', 'Dil değiştirici', 'Language switcher'],
          ['languageMenu', 'قائمة اللغات', 'Dil menüsü', 'Language menu'],
          ['aboutTabs', 'تبويبات عن الوقف', 'Hakkında sekmeleri', 'About tabs'],
          ['projectGallery', 'معرض المشاريع', 'Proje galerisi', 'Project gallery'],
          ['previousProject', 'المشروع السابق', 'Önceki proje', 'Previous project'],
          ['nextProject', 'المشروع التالي', 'Sonraki proje', 'Next project'],
          ['projectDots', 'نقاط التنقل بين المشاريع', 'Proje noktaları', 'Project navigation dots'],
          ['showProject', 'إظهار المشروع', 'Projeyi göster', 'Show project'],
          ['breadcrumb', 'مسار التنقل', 'Gezinti yolu', 'Breadcrumb'],
        ]),
      },
    ],
  },

  // PROJECTS INDEX -----------------------------------------------------------
  {
    key: 'projects-page',
    group: 'main',
    label: L('صفحة المشاريع', 'Projeler sayfası', 'Projects page'),
    description: L('نصوص صفحة /projects وصفحات تفاصيل المشاريع؛ المشاريع نفسها من قائمة "المشاريع"', '/projects sayfasının ve proje detaylarının metinleri', 'Copy on /projects and the project detail pages; the projects come from the "Projects" list'),
    icon: FolderKanban,
    route: '/projects',
    sections: [
      { key: 'seo', label: L('محركات البحث', 'SEO', 'Search engines'), icon: Search, fields: seoFields() },
      { key: 'hero', label: L('الواجهة', 'Hero', 'Hero'), description: L('الصورة والعنوان أعلى الصفحة', 'Sayfanın üstündeki görsel ve başlık', 'The image and title at the top of the page'), icon: ImageIcon, anchor: '#cms-projects-hero', fields: heroFields() },
      { key: 'intro', label: L('المقدمة', 'Giriş', 'Intro'), icon: Info, anchor: '#cms-projects-intro', fields: introFields() },
      {
        key: 'grid',
        label: L('شبكة المشاريع', 'Proje ızgarası', 'Projects grid'),
        anchor: '#cms-projects-grid',
        description: L('العنوان فوق بطاقات المشاريع', 'Proje kartlarının üstündeki başlık', 'The heading above the project cards'),
        icon: LayoutGrid,
        fields: eyebrowTitleDescription('grid'),
      },
      {
        key: 'labels',
        label: L('النصوص والأزرار', 'Etiketler', 'Labels'),
        description: L('كلمات تظهر على بطاقات المشاريع وصفحات التفاصيل', 'Proje kartlarında ve detay sayfalarında görünen kelimeler', 'Words on the project cards and detail pages'),
        icon: Type,
        anchor: '#cms-projects-grid',
        fields: labelFields('labels', [
          ['projectBadge', 'شارة "مشروع وقفي"', 'Proje rozeti', 'Project badge'],
          ['contribution', 'كلمة "قيمة المساهمة"', 'Katkı', 'Contribution'],
          ['details', 'زر التفاصيل', 'Detaylar', 'Details button'],
          ['contribute', 'زر ساهم', 'Katkıda bulun', 'Contribute button'],
          ['externalNotice', 'تنبيه تحت زر المساهمة', 'Katkı uyarısı', 'Notice under the contribute button'],
          ['facts', 'عنوان معلومات المشروع', 'Proje bilgileri başlığı', 'Project facts heading'],
          ['overview', 'عنوان نظرة عامة', 'Genel bakış', 'Overview heading'],
          ['returns', 'عنوان مصارف العوائد', 'Getiri kullanımları başlığı', 'Return uses heading'],
          ['video', 'عنوان فيديو المشروع', 'Proje videosu başlığı', 'Project video heading'],
          ['otherProjects', 'عنوان مشاريع أخرى', 'Diğer projeler başlığı', 'Other projects heading'],
          ['backToProjects', 'زر العودة إلى المشاريع', 'Projelere dön', 'Back to projects button'],
          // The calculator/share labels (quantity, total, share…) belong to
          // ProjectShowcase, which is not wired into any route yet — no schema
          // fields until the component ships, so editors never edit dead text.
        ]),
      },
    ],
  },

  // PROGRAMS INDEX -----------------------------------------------------------
  {
    key: 'programs-page',
    group: 'main',
    label: L('نصوص صفحات البرامج', 'Program sayfası metinleri', 'Program pages copy'),
    description: L('قائمة البرامج والعناوين الثابتة في صفحات البرامج؛ محتوى كل برنامج من قائمة "البرامج"', 'Program menüsü ve program sayfalarındaki sabit başlıklar', 'The programs menu and the fixed headings on program pages; each program’s content is in the "Programs" list'),
    icon: GraduationCap,
    route: '/programs/yemen-pioneers',
    sections: [
      {
        key: 'nav',
        label: L('قائمة البرامج', 'Program menüsü', 'Programs menu'),
        description: L('الروابط في القائمة المنسدلة "البرامج" في رأس الموقع', 'Üst menüdeki "Programlar" açılır listesi', 'The links in the "Programs" dropdown in the site header'),
        icon: ListTree,
        anchor: 'header',
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
        key: 'labelsGeneral',
        label: L('نصوص عامة', 'Genel etiketler', 'General labels'),
        description: L('عناوين وأزرار تظهر في كل صفحات البرامج', 'Tüm program sayfalarında görünen başlık ve butonlar', 'Headings and buttons shared by every program page'),
        icon: Type,
        anchor: 'main',
        fields: labelFields('labels', [
          ['home', 'مسار التنقل: الرئيسية', 'Gezinti: Ana sayfa', 'Breadcrumb: Home'],
          ['programs', 'مسار التنقل: البرامج', 'Gezinti: Programlar', 'Breadcrumb: Programs'],
          ['programsHref', 'وجهة رابط "البرامج" في المسار', '"Programlar" bağlantı hedefi', '"Programs" breadcrumb destination'],
          ['overview', 'عنوان نظرة عامة', 'Genel bakış', 'Overview heading'],
          ['goals', 'عنوان الأهداف', 'Hedefler', 'Goals heading'],
          ['components', 'عنوان المكوّنات', 'Bileşenler', 'Components heading'],
          ['information', 'عنوان المعلومات والنتائج', 'Bilgi ve sonuçlar', 'Information heading'],
          ['statistics', 'عنوان الإحصائيات', 'İstatistikler', 'Statistics heading'],
          ['statsEyebrow', 'السطر فوق الإحصائيات', 'İstatistik üst satırı', 'Line above statistics'],
          ['noVerifiedStats', 'ملاحظة عدم وجود أرقام موثقة', 'Doğrulanmış rakam yok notu', 'No verified figures note', 'textarea'],
          ['initiatives', 'عنوان المبادرات', 'Girişimler', 'Initiatives heading'],
          ['products', 'كلمة "المنتجات"', 'Ürünler', 'Products'],
          ['officialMedia', 'عنوان الصور والفيديوهات', 'Medya başlığı', 'Media heading'],
          ['videoGallery', 'عنوان معرض الفيديو', 'Video galerisi', 'Video gallery heading'],
          ['videoGalleryDescription', 'وصف معرض الفيديو', 'Video galerisi açıklaması', 'Video gallery description', 'textarea'],
          ['watchVideo', 'زر مشاهدة الفيديو', 'Videoyu izle', 'Watch video button'],
          ['previous', 'زر السابق', 'Önceki', 'Previous button'],
          ['next', 'زر التالي', 'Sonraki', 'Next button'],
          ['contact', 'كلمة "تواصل"', 'İletişim', 'Contact'],
          ['otherPrograms', 'عنوان برامج أخرى', 'Diğer programlar', 'Other programs heading'],
          ['details', 'زر التفاصيل', 'Detaylar', 'Details button'],
          ['highlights', 'اسم شريط أبرز الملامح', 'Öne çıkanlar şeridi', 'Highlights strip name'],
          ['exploreProgram', 'زر استكشاف البرنامج', 'Programı keşfet butonu', 'Explore button'],
          ['donate', 'زر المساهمة في الواجهة', 'Katkı butonu', 'Hero donate button'],
        ]),
      },
      {
        key: 'labelsPioneers',
        label: L('نصوص صفحة رواد اليمن', 'Yemen öncüleri etiketleri', 'Yemen pioneers labels'),
        description: L('العناوين الثابتة في أقسام المسار والركائز والأرقام', 'Yolculuk, sütunlar ve rakamlar bölümlerinin sabit başlıkları', 'Fixed headings in the journey, pillars and figures sections'),
        icon: Award,
        anchor: '#cms-program-journey, #cms-program-pillars, #cms-program-stats',
        fields: labelFields('labels', [
          ['pioneersEyebrow', 'السطر فوق عنوان الصفحة', 'Sayfa başlığı üst satırı', 'Line above the page title'],
          ['journey', 'عنوان المسار', 'Yolculuk', 'Journey heading'],
          ['journeyEyebrow', 'السطر فوق المسار', 'Yolculuk üst satırı', 'Line above the journey'],
          ['journeyDescription', 'وصف المسار', 'Yolculuk açıklaması', 'Journey description', 'textarea'],
          ['stepLabel', 'كلمة "مرحلة"', 'Aşama kelimesi', '"Stage" word'],
          ['pillars', 'عنوان الركائز', 'Sütunlar', 'Pillars heading'],
          ['pillarsEyebrow', 'السطر فوق الركائز', 'Sütunlar üst satırı', 'Line above the pillars'],
          ['pillarsDescription', 'وصف الركائز', 'Sütunlar açıklaması', 'Pillars description', 'textarea'],
          ['pioneerStatsEyebrow', 'السطر فوق الأرقام', 'Rakamlar üst satırı', 'Line above the figures'],
          ['pioneerStatsTitle', 'عنوان الأرقام', 'Rakamlar başlığı', 'Figures heading'],
          ['pioneerStatsDescription', 'وصف الأرقام', 'Rakamlar açıklaması', 'Figures description', 'textarea'],
          ['pioneerStatsCenter', 'نص مركز الشكل السداسي', 'Altıgen merkez metni', 'Hexagon centre text'],
        ]),
      },
      {
        key: 'labelsCapacity',
        label: L('نصوص المدن', 'Şehir etiketleri', 'City labels'),
        description: L('تظهر عندما يحتوي برنامج على قائمة مدن', 'Bir programda şehir listesi olduğunda görünür', 'Shown when a program has a list of cities'),
        icon: Building2,
        route: '/programs/institutional-development',
        anchor: '#cms-program-cities',
        fields: labelFields('labels', [
          ['cityMedia', 'عنوان وسائط المدن', 'Şehir medyası', 'City media heading'],
          ['cityExplorerDescription', 'وصف وسائط المدن', 'Şehir medyası açıklaması', 'City media description', 'textarea'],
          ['partner', 'كلمة "الشريك"', 'Ortak', 'Partner'],
        ]),
      },
      {
        key: 'labelsInstitutional',
        label: L('نصوص التطوير المؤسسي', 'Kurumsal gelişim etiketleri', 'Institutional development labels'),
        icon: Landmark,
        route: '/programs/institutional-development',
        anchor: 'main',
        fields: labelFields('labels', [
          ['manifestoEyebrow', 'السطر فوق عنوان الصفحة', 'Sayfa başlığı üst satırı', 'Line above the page title'],
          ['audiences', 'عنوان الفئات المستهدفة', 'Hedef kitleler', 'Audiences heading'],
          ['audiencesDescription', 'وصف الفئات المستهدفة', 'Hedef kitle açıklaması', 'Audiences description', 'textarea'],
          ['exploreTrack', 'زر استكشاف المسار', 'Programı keşfet butonu', 'Explore button'],
          ['trackProgramsEyebrow', 'السطر فوق برنامجي المسار', 'Eksen programları üst satırı', 'Line above the track programs'],
          ['trackPrograms', 'عنوان برنامجي المسار', 'Eksen programları başlığı', 'Track programs heading'],
          ['trackProgramsDescription', 'وصف برنامجي المسار', 'Eksen programları açıklaması', 'Track programs description', 'textarea'],
          ['programOneLabel', 'تبويب البرنامج الأول', 'Birinci program sekmesi', 'Program one tab'],
          ['programTwoLabel', 'تبويب البرنامج الثاني', 'İkinci program sekmesi', 'Program two tab'],
          ['phaseEyebrow', 'شارة "المرحلة الأولى"', 'Birinci aşama rozeti', '"First phase" badge'],
          ['recommendationsEyebrow', 'السطر فوق مخرجات المرحلة', 'Aşama çıktıları üst satırı', 'Line above the phase outcomes'],
          ['recommendationsDescription', 'وصف مخرجات المرحلة', 'Aşama çıktıları açıklaması', 'Phase outcomes description', 'textarea'],
          ['forumEyebrow', 'شارة الملتقى المصاحب', 'Forum rozeti', 'Companion forum badge'],
          ['forumObjectives', 'عنوان أهداف الملتقى', 'Forum hedefleri başlığı', 'Forum objectives heading'],
          ['focusAreas', 'عنوان مجالات العمل', 'Çalışma alanları başlığı', 'Areas of work heading'],
          ['focusAreasDescription', 'وصف مجالات العمل', 'Çalışma alanları açıklaması', 'Areas of work description', 'textarea'],
          ['areaLabel', 'كلمة "المجال"', '"Alan" kelimesi', '"Area" word'],
        ]),
      },
      {
        key: 'labelsAwareness',
        label: L('نصوص التوعية المجتمعية', 'Toplumsal farkındalık etiketleri', 'Community awareness labels'),
        icon: Megaphone,
        route: '/programs/community-awareness',
        anchor: 'main',
        fields: labelFields('labels', [
          ['awarenessEyebrow', 'شارة الواجهة', 'Hero rozeti', 'Hero badge'],
          ['awarenessHeroNote', 'ملاحظة الواجهة', 'Hero notu', 'Hero note', 'textarea'],
          ['exploreInitiatives', 'زر استكشاف المنصة', 'Platformu keşfet', 'Explore button'],
          ['onAirLabel', 'شارة البث المستمر', 'Yayında rozeti', '"On air" badge'],
          ['awarenessThemes', 'عنوان المحاور', 'Temalar başlığı', 'Themes heading'],
          ['awarenessThemesDescription', 'وصف المحاور', 'Temalar açıklaması', 'Themes description', 'textarea'],
          ['themeLabel', 'كلمة "الدائرة"', 'Tema kelimesi', '"Theme" word'],
          ['awarenessInitiativesEyebrow', 'السطر فوق المبادرات', 'Girişimler üst satırı', 'Line above initiatives'],
          ['awarenessInitiatives', 'عنوان المبادرات', 'Girişimler başlığı', 'Initiatives heading'],
          ['awarenessInitiativesDescription', 'وصف المبادرات', 'Girişimler açıklaması', 'Initiatives description', 'textarea'],
        ]),
      },
    ],
  },

  // ABOUT: WAQF --------------------------------------------------------------
  {
    key: 'about-waqf',
    group: 'about',
    label: L('عن الوقف', 'Vakıf hakkında', 'About the waqf'),
    description: L('صفحة /about/waqf كاملة', '/about/waqf sayfasının tamamı', 'The whole /about/waqf page'),
    icon: Landmark,
    route: '/about/waqf',
    sections: [
      { key: 'seo', label: L('محركات البحث', 'SEO', 'Search engines'), icon: Search, fields: seoFields() },
      { key: 'hero', label: L('الواجهة', 'Hero', 'Hero'), description: L('الصورة والعنوان الكبير أعلى الصفحة', 'Sayfanın üstündeki görsel ve başlık', 'The image and headline at the top of the page'), icon: ImageIcon, fields: heroFields() },
      {
        key: 'intro',
        label: L('المقدمة والحقائق', 'Giriş ve bilgiler', 'Intro & facts'),
        anchor: '#cms-about-waqf-intro',
        description: L('أول قسم بعد الواجهة: الفقرات، زر التحميل، وبطاقات الترخيص الأربع', 'Hero sonrası ilk bölüm: paragraflar, indirme butonu ve bilgi kartları', 'The first section after the hero: paragraphs, download button and the fact tiles'),
        icon: Info,
        fields: [
          ...introFields(),
          {
            path: 'intro.downloadLabel',
            label: L('نص زر التحميل', 'İndirme butonu', 'Download label'),
            type: 'text',
          },
          {
            path: 'intro.downloadUrl',
            label: L('الملف التعريفي (PDF)', 'Tanıtım dosyası (PDF)', 'Profile file (PDF)'),
            type: 'file',
            help: L(
              'ارفع ملف PDF أو اختر من مكتبة الوسائط؛ لكل لغة ملفها الخاص',
              'PDF yükleyin veya medya kütüphanesinden seçin; her dilin kendi dosyası vardır',
              'Upload a PDF or pick one from the media library; each language has its own file',
            ),
          },
          {
            path: 'intro.facts',
            label: L('بطاقات الحقائق', 'Bilgi kartları', 'Fact tiles'),
            type: 'repeater',
            itemTitleField: 'label',
            itemFields: [
              { path: 'label', label: L('البيان', 'Etiket', 'Label'), type: 'text' },
              { path: 'value', label: L('القيمة', 'Değer', 'Value'), type: 'text' },
              iconField(),
            ],
          },
        ],
      },
      {
        key: 'video',
        label: L('الفيديو التعريفي', 'Tanıtım videosu', 'Intro video'),
        icon: Video,
        anchor: '#cms-about-waqf-video',
        fields: [
          { path: 'video.title', label: L('عنوان الفيديو', 'Video başlığı', 'Video title'), type: 'text' },
          { path: 'video.description', label: L('تعليق تحت الفيديو', 'Video altı açıklama', 'Caption under the video'), type: 'textarea' },
          { path: 'video', label: L('الفيديو', 'Video', 'Video'), type: 'video' },
        ],
      },
      {
        key: 'goals',
        label: L('الأهداف', 'Hedefler', 'Goals'),
        icon: Target,
        anchor: '#cms-about-waqf-identity',
        fields: [
          ...eyebrowTitleDescription('goals'),
          { path: 'goals.items', label: L('قائمة الأهداف', 'Hedef listesi', 'Goal list'), type: 'list' },
        ],
      },
      {
        key: 'identity',
        label: L('الرؤية والرسالة والقيم', 'Vizyon, misyon, değerler', 'Vision, mission, values'),
        anchor: '#cms-about-waqf-identity',
        description: L('التبويبات العمودية في قسم الهوية', 'Kimlik bölümündeki dikey sekmeler', 'The vertical tabs in the identity section'),
        icon: Compass,
        fields: [
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
        anchor: '#cms-about-waqf-methodology',
        description: L('الخط الزمني للمبادئ. عناوين الخطوات وشروحها قائمتان متوازيتان: العنصر الأول مع الأول وهكذا', 'İlkeler zaman çizelgesi. Başlıklar ve açıklamalar sıraya göre eşleşir', 'The principles timeline. Step titles and descriptions are two parallel lists: first with first, and so on'),
        icon: RouteIcon,
        fields: [
          ...eyebrowTitleDescription('methodology'),
          { path: 'methodology.stepLabel', label: L('كلمة "خطوة"', 'Adım etiketi', 'Step label'), type: 'text' },
          { path: 'methodology.itemTitles', label: L('عناوين الخطوات', 'Adım başlıkları', 'Step titles'), type: 'list' },
          { path: 'methodology.items', label: L('شرح الخطوات', 'Adım açıklamaları', 'Step descriptions'), type: 'list' },
        ],
      },
      {
        key: 'president',
        label: L('كلمة الرئيس', 'Başkanın mesajı', "President's message"),
        icon: Users,
        anchor: '#president',
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
        anchor: '.waqf-cycle-scroll-stack',
        description: L('البطاقات المتراكبة في آخر الصفحة', 'Sayfanın sonundaki üst üste binen kartlar', 'The stacked cards at the end of the page'),
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
              {
                path: 'shortLabel',
                label: L('اسم قصير للمؤشر', 'Kısa gösterge adı', 'Short indicator name'),
                type: 'text',
                help: L('يظهر في شريط التقدم الجانبي؛ يُؤخذ من العنوان إن تُرك فارغاً', 'Yan ilerleme çubuğunda görünür', 'Shown in the side progress bar; taken from the title when empty'),
              },
              { path: 'description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
              { path: 'bullets', label: L('النقاط', 'Maddeler', 'Bullets'), type: 'list' },
              iconField(),
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
    description: L('صفحة /about/governance وقائمة السياسات', '/about/governance sayfası ve politika listesi', 'The /about/governance page and its policy list'),
    icon: Scale,
    route: '/about/governance',
    sections: [
      { key: 'seo', label: L('محركات البحث', 'SEO', 'Search engines'), icon: Search, fields: seoFields() },
      { key: 'hero', label: L('الواجهة', 'Hero', 'Hero'), icon: ImageIcon, anchor: '#cms-governance-hero', fields: heroFields() },
      {
        key: 'intro',
        label: L('المقدمة', 'Giriş', 'Intro'),
        icon: Info,
        anchor: '#cms-governance-intro',
        fields: [
          ...eyebrowTitleDescription('intro'),
          { path: 'intro.navTitle', label: L('عنوان القائمة الجانبية', 'Yan menü başlığı', 'Side menu title'), type: 'text' },
        ],
      },
      {
        key: 'policies',
        label: L('السياسات', 'Politikalar', 'Policies'),
        anchor: '#cms-governance-policies',
        description: L('كل سياسة تظهر كبطاقة قابلة للطي مع رابط مباشر لها', 'Her politika açılır bir kart ve doğrudan bağlantı olarak görünür', 'Each policy is a collapsible card with its own direct link'),
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
                path: 'id',
                label: L('اسم الرابط المباشر', 'Doğrudan bağlantı adı', 'Direct-link name'),
                type: 'text',
                advanced: true,
                help: L('بحروف لاتينية بدون مسافات، مثال: whistleblowing', 'Latin harflerle, boşluksuz', 'Latin letters, no spaces, e.g. whistleblowing'),
              },
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
    description: L('روابط القائمة المنسدلة "عن الوقف" في رأس الموقع', 'Üst menüdeki "Hakkında" açılır listesi', 'The links in the "About" dropdown in the site header'),
    icon: ListTree,
    route: '/about/waqf',
    sections: [
      {
        key: 'nav',
        label: L('روابط القائمة', 'Menü bağlantıları', 'Menu links'),
        description: L('الوجهات المتاحة: /about/waqf و /about/governance', 'Kullanılabilir hedefler: /about/waqf ve /about/governance', 'Available destinations: /about/waqf and /about/governance'),
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
    description: L('نصوص صفحة /donate؛ فرص المساهمة نفسها من قائمة "فرص المساهمة"', '/donate sayfasının metinleri; fırsatlar "Bağış fırsatları" listesinden', 'Copy on /donate; the opportunities come from the "Donation opportunities" list'),
    icon: HandHeart,
    route: '/donate',
    sections: [
      { key: 'seo', label: L('محركات البحث', 'SEO', 'Search engines'), icon: Search, fields: seoFields() },
      { key: 'hero', label: L('الواجهة', 'Hero', 'Hero'), icon: ImageIcon, anchor: '#cms-donate-hero', fields: heroFields() },
      { key: 'intro', label: L('المقدمة', 'Giriş', 'Intro'), icon: Info, anchor: '#cms-donate-intro', fields: introFields() },
      {
        key: 'grid',
        label: L('عنوان قسم الفرص', 'Fırsatlar bölümü başlığı', 'Opportunities section heading'),
        icon: LayoutGrid,
        anchor: '#cms-donate-grid',
        fields: eyebrowTitleDescription('grid'),
      },
      {
        key: 'labels',
        label: L('النصوص والأزرار', 'Etiketler', 'Labels'),
        icon: Type,
        anchor: '#cms-donate-grid',
        fields: labelFields('labels', [
          ['opportunities', 'كلمة "فرص المساهمة"', 'Fırsatlar', 'Opportunities'],
          ['contributionValue', 'كلمة "قيمة المساهمة"', 'Katkı değeri', 'Contribution value'],
          ['available', 'شارة "متاح"', 'Mevcut', 'Available badge'],
          ['featured', 'شارة "الفرصة الأبرز"', 'Öne çıkan rozeti', 'Featured badge'],
          ['contribute', 'زر ساهم', 'Katkıda bulun', 'Contribute button'],
          ['unavailable', 'زر غير متاح', 'Mevcut değil', 'Unavailable button'],
          ['emptyState', 'نص عدم وجود فرص', 'Fırsat yokken görünen metin', 'No-opportunities message', 'textarea'],
          ['officialNotice', 'التنبيه الرسمي', 'Resmî uyarı', 'Official notice', 'textarea'],
          ['externalNotice', 'تنبيه تحت الزر', 'Buton altı uyarı', 'Notice under the button'],
        ]),
      },
    ],
  },

  // DONATE CHECKOUT + RESULT -------------------------------------------------
  {
    key: 'donate-checkout',
    group: 'involve',
    label: L('صفحة الدفع والنتيجة', 'Ödeme ve sonuç sayfası', 'Checkout & result page'),
    description: L(
      'نصوص صفحة الدفع بالبطاقة وصفحة نتيجة العملية',
      'Kartla ödeme sayfası ile işlem sonucu sayfasının metinleri',
      'Copy on the card payment page and the payment result page',
    ),
    icon: CreditCard,
    route: '/donate/checkout/waqf-share',
    sections: [
      {
        key: 'checkout-hero',
        label: L('عنوان صفحة الدفع', 'Ödeme sayfası başlığı', 'Checkout heading'),
        description: L('العنوان والوصف أعلى نموذج الدفع، وروابط مسار التنقل', 'Ödeme formunun üstündeki başlık ve gezinme bağlantıları', 'The title and description above the payment form, and the breadcrumb links'),
        icon: Megaphone,
        anchor: '#cms-checkout-hero',
        fields: [
          { path: 'checkout.hero.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          { path: 'checkout.hero.description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
          { path: 'checkout.breadcrumbs.home', label: L('رابط "الرئيسية" في المسار', 'Gezinmede "Ana sayfa"', '"Home" breadcrumb'), type: 'text' },
          { path: 'checkout.breadcrumbs.donate', label: L('رابط "ساهم الآن" في المسار', 'Gezinmede "Katkı sun"', '"Donate" breadcrumb'), type: 'text' },
        ],
      },
      {
        key: 'checkout-banner',
        label: L('شريط الوضع التجريبي', 'Test modu şeridi', 'Test-mode banner'),
        description: L('يظهر فقط ما دامت بوابة الدفع في وضع الاختبار', 'Yalnızca ödeme geçidi test modundayken görünür', 'Shown only while the payment gateway runs in test mode'),
        icon: AlertTriangle,
        anchor: '#cms-checkout-banner',
        fields: [
          { path: 'checkout.testBanner.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          { path: 'checkout.testBanner.description', label: L('النص', 'Metin', 'Text'), type: 'textarea' },
        ],
      },
      {
        key: 'checkout-form',
        label: L('أقسام نموذج الدفع', 'Ödeme formu bölümleri', 'Payment form sections'),
        description: L('عناوين وحقول: ملخص المساهمة، المبلغ، بيانات المساهم، والدفع عبر البنك', 'Özet, tutar, katkı sahibi ve banka ödemesi bölümlerinin başlıkları ve alanları', 'Headings and fields of the summary, amount, contributor and bank payment sections'),
        icon: LayoutGrid,
        anchor: '#cms-checkout-form',
        fields: [
          { path: 'checkout.summary.heading', label: L('عنوان "ملخص المساهمة"', 'Özet başlığı', 'Summary heading'), type: 'text' },
          { path: 'checkout.summary.publishedValue', label: L('عبارة "القيمة المنشورة"', '"Yayınlanan değer" etiketi', '"Published value" label'), type: 'text' },
          { path: 'checkout.amount.heading', label: L('عنوان "مبلغ المساهمة"', 'Tutar başlığı', 'Amount heading'), type: 'text' },
          { path: 'checkout.amount.customLabel', label: L('عبارة "أدخل مبلغاً آخر"', 'Başka tutar etiketi', 'Custom amount label'), type: 'text' },
          { path: 'checkout.amount.customPlaceholder', label: L('مثال داخل حقل المبلغ', 'Tutar alanı örneği', 'Amount placeholder'), type: 'text' },
          { path: 'checkout.amount.currencyNote', label: L('ملاحظة العملة', 'Para birimi notu', 'Currency note'), type: 'text' },
          { path: 'checkout.donor.heading', label: L('عنوان "بيانات المساهم"', 'Katkı sahibi başlığı', 'Contributor heading'), type: 'text' },
          { path: 'checkout.donor.nameLabel', label: L('حقل الاسم', 'Ad alanı', 'Name field'), type: 'text' },
          { path: 'checkout.donor.emailLabel', label: L('حقل البريد', 'E-posta alanı', 'Email field'), type: 'text' },
          { path: 'checkout.donor.phoneLabel', label: L('حقل الهاتف', 'Telefon alanı', 'Phone field'), type: 'text' },
          { path: 'checkout.donor.optionalSuffix', label: L('لاحقة "(اختياري)"', '"(isteğe bağlı)" eki', '"(optional)" suffix'), type: 'text' },
          { path: 'checkout.card.heading', label: L('عنوان قسم الدفع عبر البنك', 'Banka ödemesi başlığı', 'Bank payment heading'), type: 'text' },
          { path: 'checkout.card.bankHandoverNote', label: L('نص التحويل إلى صفحة البنك', 'Banka sayfasına yönlendirme metni', 'Bank handover note'), type: 'textarea' },
        ],
      },
      {
        key: 'checkout-actions',
        label: L('الموافقة وزر الدفع', 'Onay ve ödeme butonu', 'Consent & pay button'),
        icon: Type,
        anchor: '#cms-checkout-form',
        fields: [
          { path: 'checkout.consentLabel', label: L('نص الموافقة', 'Onay metni', 'Consent text'), type: 'textarea' },
          { path: 'checkout.submitIdle', label: L('نص زر الدفع', 'Ödeme butonu', 'Pay button label'), type: 'text' },
          { path: 'checkout.submitProcessing', label: L('نص "جارٍ المعالجة"', '"İşleniyor" metni', '"Processing" label'), type: 'text' },
          { path: 'checkout.redirectNote', label: L('ملاحظة التحويل إلى 3-D Secure', '3-D Secure yönlendirme notu', '3-D Secure redirect note'), type: 'textarea' },
        ],
      },
      {
        key: 'checkout-test-cards',
        label: L('صندوق بطاقات الاختبار', 'Test kartları kutusu', 'Test cards box'),
        description: L('يظهر فقط في الوضع التجريبي؛ تُدخل الأرقام في صفحة البنك', 'Yalnızca test modunda görünür; numaralar banka sayfasına girilir', 'Shown only in test mode; the numbers are entered on the bank page'),
        icon: CreditCard,
        anchor: '#cms-checkout-test-cards',
        fields: [
          { path: 'checkout.testCards.heading', label: L('العنوان', 'Başlık', 'Heading'), type: 'text' },
          { path: 'checkout.testCards.description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
          { path: 'checkout.testCards.approveLabel', label: L('وصف بطاقة النجاح', 'Başarı kartı etiketi', 'Success card label'), type: 'text' },
          { path: 'checkout.testCards.fail3dsLabel', label: L('وصف بطاقة فشل التحقق', '3-D Secure hata kartı etiketi', '3-D Secure failure card label'), type: 'text' },
          { path: 'checkout.testCards.declineLabel', label: L('وصف بطاقة الرفض', 'Red kartı etiketi', 'Decline card label'), type: 'text' },
        ],
      },
      {
        key: 'checkout-errors',
        label: L('رسائل الخطأ', 'Hata mesajları', 'Error messages'),
        description: L('تظهر تحت الحقول أو أعلى النموذج عند وجود مشكلة', 'Bir sorun olduğunda alanların altında görünür', 'Shown under the fields or above the form when something is wrong'),
        icon: AlertTriangle,
        fields: [
          { path: 'checkout.errors.amount', label: L('خطأ المبلغ', 'Tutar hatası', 'Amount error'), type: 'text' },
          { path: 'checkout.errors.name', label: L('خطأ الاسم', 'Ad hatası', 'Name error'), type: 'text' },
          { path: 'checkout.errors.email', label: L('خطأ البريد', 'E-posta hatası', 'Email error'), type: 'text' },
          { path: 'checkout.errors.consent', label: L('خطأ الموافقة', 'Onay hatası', 'Consent error'), type: 'text' },
          { path: 'checkout.errors.unavailable', label: L('الفرصة غير متاحة', 'Fırsat kapalı', 'Opportunity unavailable'), type: 'text' },
          { path: 'checkout.errors.network', label: L('خطأ الاتصال', 'Bağlantı hatası', 'Network error'), type: 'text' },
          { path: 'checkout.errors.server', label: L('خطأ غير متوقع', 'Beklenmeyen hata', 'Unexpected error'), type: 'text' },
        ],
      },
      {
        key: 'result-success',
        label: L('صفحة النتيجة — النجاح', 'Sonuç sayfası — başarı', 'Result page — success'),
        description: L('ما يراه المساهم بعد اكتمال الدفع بنجاح', 'Ödeme başarıyla tamamlandığında görünen', 'What the contributor sees after a successful payment'),
        icon: CheckCircle2,
        fields: [
          { path: 'result.loading', label: L('نص "جارٍ التحقق"', 'Doğrulama metni', '"Verifying" text'), type: 'text' },
          { path: 'result.success.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          { path: 'result.success.description', label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' },
          { path: 'result.success.testNote', label: L('ملاحظة العملية التجريبية', 'Test işlemi notu', 'Test transaction note'), type: 'text' },
          { path: 'result.success.amountLabel', label: L('عنوان "المبلغ"', 'Tutar etiketi', 'Amount label'), type: 'text' },
          { path: 'result.success.referenceLabel', label: L('عنوان "رقم التفويض"', 'Onay kodu etiketi', 'Auth code label'), type: 'text' },
          { path: 'result.success.opportunityLabel', label: L('عنوان "فرصة المساهمة"', 'Fırsat etiketi', 'Opportunity label'), type: 'text' },
          { path: 'result.success.donorLabel', label: L('عنوان "اسم المساهم"', 'Katkı sahibi etiketi', 'Contributor label'), type: 'text' },
        ],
      },
      {
        key: 'result-failure',
        label: L('صفحة النتيجة — الفشل', 'Sonuç sayfası — başarısız', 'Result page — failure'),
        description: L('ما يظهر عند فشل العملية أو تعذّر العثور عليها', 'İşlem başarısız olduğunda veya bulunamadığında görünen', 'Shown when the payment fails or cannot be found'),
        icon: AlertTriangle,
        fields: [
          { path: 'result.failure.title', label: L('عنوان الفشل', 'Başarısızlık başlığı', 'Failure title'), type: 'text' },
          { path: 'result.failure.description', label: L('وصف الفشل', 'Başarısızlık açıklaması', 'Failure description'), type: 'textarea' },
          { path: 'result.failure.reasonLabel', label: L('عنوان "السبب"', 'Neden etiketi', 'Reason label'), type: 'text' },
          { path: 'result.failure.retry', label: L('زر إعادة المحاولة', 'Tekrar dene butonu', 'Retry button'), type: 'text' },
          { path: 'result.failure.contact', label: L('زر التواصل', 'İletişim butonu', 'Contact button'), type: 'text' },
          { path: 'result.unverified.title', label: L('عنوان "تعذّر تأكيد النتيجة"', 'Doğrulanamadı başlığı', 'Unverified title'), type: 'text' },
          { path: 'result.unverified.description', label: L('وصف "تعذّر تأكيد النتيجة"', 'Doğrulanamadı açıklaması', 'Unverified description'), type: 'textarea' },
          { path: 'result.unverified.referenceLabel', label: L('عنوان "رقم المرجع"', 'Referans etiketi', 'Reference label'), type: 'text' },
          { path: 'result.notFound.title', label: L('عنوان "لم نجد العملية"', 'Bulunamadı başlığı', 'Not-found title'), type: 'text' },
          { path: 'result.notFound.description', label: L('وصف "لم نجد العملية"', 'Bulunamadı açıklaması', 'Not-found description'), type: 'textarea' },
          { path: 'result.backToDonate', label: L('رابط العودة لفرص المساهمة', 'Fırsatlara dön bağlantısı', 'Back-to-donate link'), type: 'text' },
          { path: 'result.home', label: L('رابط الرئيسية', 'Ana sayfa bağlantısı', 'Home link'), type: 'text' },
        ],
      },
      {
        key: 'seo',
        label: L('محركات البحث', 'SEO', 'Search engines'),
        icon: Search,
        fields: [
          { path: 'checkout.seo.title', label: L('عنوان صفحة الدفع في جوجل', 'Ödeme sayfası Google başlığı', 'Checkout search title'), type: 'text' },
          { path: 'checkout.seo.description', label: L('وصف صفحة الدفع في جوجل', 'Ödeme sayfası Google açıklaması', 'Checkout search description'), type: 'textarea' },
          { path: 'result.seo.title', label: L('عنوان صفحة النتيجة في جوجل', 'Sonuç sayfası Google başlığı', 'Result search title'), type: 'text' },
          { path: 'result.seo.description', label: L('وصف صفحة النتيجة في جوجل', 'Sonuç sayfası Google açıklaması', 'Result search description'), type: 'textarea' },
        ],
      },
    ],
  },

  // BANK ACCOUNTS PAGE -------------------------------------------------------
  {
    key: 'bank-accounts-page',
    group: 'involve',
    label: L('صفحة الحسابات البنكية', 'Banka hesapları sayfası', 'Bank accounts page'),
    description: L(
      'نصوص صفحة /bank-accounts؛ البنوك وأرقام الآيبان نفسها من قائمة "البنوك والحسابات"',
      '/bank-accounts sayfasının metinleri; bankalar "Bankalar ve hesaplar" listesinden gelir',
      'Copy on /bank-accounts; the banks and IBANs themselves come from the "Banks & accounts" list',
    ),
    icon: Banknote,
    route: '/bank-accounts',
    sections: [
      { key: 'seo', label: L('محركات البحث', 'SEO', 'Search engines'), icon: Search, fields: seoFields() },
      {
        key: 'hero',
        label: L('الواجهة', 'Hero', 'Hero'),
        description: L('الصورة والعنوان أعلى الصفحة', 'Sayfanın üstündeki görsel ve başlık', 'The image and title at the top of the page'),
        icon: ImageIcon,
        anchor: '#cms-bank-hero',
        fields: heroFields(),
      },
      {
        key: 'intro',
        label: L('المقدمة', 'Giriş', 'Intro'),
        description: L('الفقرة التعريفية قبل بطاقات البنوك', 'Banka kartlarından önceki tanıtım paragrafı', 'The introduction before the bank cards'),
        icon: Info,
        anchor: '#cms-bank-accounts-intro',
        fields: introFields(),
      },
      {
        key: 'labels',
        label: L('النصوص والأزرار', 'Etiketler', 'Labels'),
        description: L('العناوين الصغيرة وأزرار النسخ داخل بطاقات البنوك', 'Banka kartlarındaki küçük başlıklar ve kopyalama butonları', 'The small headings and copy buttons inside the bank cards'),
        icon: Type,
        fields: [
          { path: 'accountHolder', label: L('اسم صاحب الحساب الرسمي', 'Resmî hesap sahibi adı', 'Official account holder name'), type: 'text', help: L('يظهر كما هو في كل اللغات', 'Her dilde aynı görünür', 'Shown as-is in every language'), full: true },
          ...labelFields('labels', [
            ['accountHolder', 'عنوان "اسم الحساب"', 'Hesap adı etiketi', '"Account name" label'],
            ['accountNumber', 'عنوان "رقم الحساب"', 'Hesap numarası etiketi', '"Account number" label'],
            ['branch', 'عنوان "فرع البنك"', 'Şube etiketi', '"Branch" label'],
            ['swift', 'عنوان "رمز SWIFT"', 'SWIFT etiketi', '"SWIFT code" label'],
            ['iban', 'عنوان "رقم الآيبان"', 'IBAN etiketi', '"IBAN" label'],
            ['copy', 'زر النسخ', 'Kopyala butonu', 'Copy button'],
            ['copied', 'عبارة "تم النسخ"', 'Kopyalandı metni', '"Copied" text'],
            ['copyAll', 'زر نسخ بيانات البنك', 'Banka bilgilerini kopyala butonu', 'Copy-bank-details button'],
            ['notice', 'تنبيه الحسابات الرسمية', 'Resmî hesaplar uyarısı', 'Official-accounts notice', 'textarea'],
            ['contactPrompt', 'سؤال التواصل أسفل الصفحة', 'Sayfa altındaki iletişim sorusu', 'Contact prompt at the bottom'],
            ['contactCta', 'زر التواصل', 'İletişim butonu', 'Contact button'],
          ]),
          { path: 'labels.currencies.TRY', label: L('اسم الليرة التركية', 'TL adı', 'Turkish Lira name'), type: 'text' },
          { path: 'labels.currencies.USD', label: L('اسم الدولار', 'Dolar adı', 'US Dollar name'), type: 'text' },
          { path: 'labels.currencies.EUR', label: L('اسم اليورو', 'Euro adı', 'Euro name'), type: 'text' },
          { path: 'labels.currencies.SAR', label: L('اسم الريال السعودي', 'Riyal adı', 'Saudi Riyal name'), type: 'text' },
        ],
      },
    ],
  },

  // PARTICIPATE --------------------------------------------------------------
  {
    key: 'participate',
    group: 'involve',
    label: L('صفحات المشاركة', 'Katılım sayfaları', 'Participate pages'),
    description: L('نماذج شارك بفكرة والشكاوى والتطوع وصفحة تواصل معنا', 'Fikir, şikayet ve gönüllü formları ile iletişim sayfası', 'The share-idea, complaints and volunteer forms and the contact page'),
    icon: MessageSquare,
    route: '/participate/share-ideas',
    sections: [
      {
        key: 'nav',
        label: L('قائمة المشاركة', 'Katılım menüsü', 'Participate menu'),
        description: L('البطاقات الأربع أعلى صفحات المشاركة', 'Katılım sayfalarının üstündeki dört kart', 'The four cards at the top of the participate pages'),
        icon: ListTree,
        anchor: '#cms-participate-nav',
        fields: [
          {
            path: 'nav',
            label: L('الروابط', 'Bağlantılar', 'Links'),
            type: 'repeater',
            itemTitleField: 'label',
            itemFields: [
              { path: 'label', label: L('النص', 'Etiket', 'Label'), type: 'text' },
              {
                path: 'key',
                label: L('الصفحة', 'Sayfa', 'Page'),
                type: 'select',
                options: participateKeyOptions,
              },
              {
                path: 'href',
                label: L('الرابط', 'Bağlantı', 'Link'),
                type: 'text',
                advanced: true,
                help: L('يُشتق من الصفحة إن تُرك فارغاً', 'Boşsa sayfadan türetilir', 'Derived from the page when empty'),
              },
            ],
          },
        ],
      },
      {
        key: 'labels',
        label: L('نصوص النماذج', 'Form etiketleri', 'Form labels'),
        description: L('الأزرار والرسائل المشتركة بين كل النماذج', 'Tüm formlarda ortak butonlar ve mesajlar', 'Buttons and messages shared by all forms'),
        icon: Type,
        anchor: '#participate-form',
        fields: labelFields('labels', [
          ['home', 'مسار التنقل: الرئيسية', 'Gezinti: Ana sayfa', 'Breadcrumb: Home'],
          ['participate', 'مسار التنقل: شاركنا', 'Gezinti: Katılım', 'Breadcrumb: Participate'],
          ['sectionTitle', 'عنوان القسم', 'Bölüm başlığı', 'Section title'],
          ['formNotice', 'ملاحظة تحت النموذج', 'Form altı notu', 'Note under the form', 'textarea'],
          ['submit', 'زر إرسال', 'Gönder', 'Submit button'],
          ['submitting', 'نص أثناء الإرسال', 'Gönderiliyor', 'While submitting'],
          ['next', 'زر التالي', 'İleri', 'Next button'],
          ['previous', 'زر السابق', 'Geri', 'Previous button'],
          ['step', 'كلمة "خطوة"', 'Adım', '"Step" word'],
          ['requiredMessage', 'رسالة الحقل المطلوب', 'Zorunlu alan mesajı', 'Required-field message'],
          ['emailMessage', 'رسالة البريد غير الصحيح', 'Geçersiz e-posta mesajı', 'Invalid-email message'],
          ['submitSuccess', 'رسالة النجاح', 'Başarı mesajı', 'Success message', 'textarea'],
          ['submitError', 'رسالة الخطأ', 'Hata mesajı', 'Error message', 'textarea'],
          ['selectedFiles', 'كلمة "الملفات المختارة"', 'Seçilen dosyalar', 'Selected files'],
          ['openLink', 'زر فتح الرابط', 'Bağlantıyı aç', 'Open link button'],
        ]),
      },
      ...(
        [
          ['shareIdeas', 'share-ideas', 'شارك بفكرة', 'Fikir paylaş', 'Share an idea', true],
          ['complaintsSuggestions', 'complaints-suggestions', 'الشكاوى والمقترحات', 'Şikayet ve öneriler', 'Complaints & suggestions', true],
          ['volunteer', 'volunteer', 'التطوع', 'Gönüllülük', 'Volunteer', true],
          ['contact', 'contact', 'تواصل معنا', 'İletişim', 'Contact us', false],
        ] as const
      ).map(([key, slug, ar, tr, en, hasForm]) => ({
        key: `page-${key}`,
        label: L(ar, tr, en),
        description: hasForm
          ? L(`صفحة "${ar}": الواجهة والمقدمة والنموذج بخطواته وحقوله`, `"${tr}" sayfası: hero, giriş ve form`, `The "${en}" page: hero, intro and the form with its steps and fields`)
          : L('صفحة تواصل معنا: الواجهة والمقدمة وبطاقات التواصل', 'İletişim sayfası: hero, giriş ve iletişim kartları', 'The contact page: hero, intro and contact cards'),
        icon: hasForm ? MessageSquare : Phone,
        route: `/participate/${slug}`,
        anchor: 'main',
        fields: [
          ...seoFields(`pages.${key}.seo`),
          { path: `pages.${key}.hero.title`, label: L('عنوان الواجهة', 'Hero başlığı', 'Hero title'), type: 'text' as const },
          {
            path: `pages.${key}.hero.description`,
            label: L('وصف الواجهة', 'Hero açıklaması', 'Hero description'),
            type: 'textarea' as const,
          },
          { path: `pages.${key}.hero.image`, label: L('صورة الواجهة', 'Hero görseli', 'Hero image'), type: 'image' as const },
          { path: `pages.${key}.hero.imageAlt`, label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'), type: 'text' as const },
          { path: `pages.${key}.intro.eyebrow`, label: L('السطر الصغير فوق العنوان', 'Başlık üstü satır', 'Line above the title'), type: 'text' as const },
          { path: `pages.${key}.intro.title`, label: L('عنوان المقدمة', 'Giriş başlığı', 'Intro title'), type: 'text' as const },
          {
            path: `pages.${key}.intro.paragraphs`,
            label: L('فقرات المقدمة', 'Giriş paragrafları', 'Intro paragraphs'),
            type: 'paragraphs' as const,
          },
          ...(hasForm
            ? ([
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
                  help: L('كل حقل يجب أن ينتمي إلى خطوة في "خطوات النموذج" أدناه ليظهر', 'Görünmesi için her alan aşağıdaki bir adıma ait olmalı', 'A field appears only when a step below lists it'),
                  itemFields: [
                    {
                      // Form steps reference their fields by this name, so unlike
                      // other records it cannot be generated behind the scenes.
                      path: 'id',
                      label: L('اسم الحقل (معرّف)', 'Alan adı', 'Field name (id)'),
                      type: 'text' as const,
                      help: L(
                        'بحروف لاتينية بدون مسافات، مثال: fullName — يربط الحقل بخطوات النموذج',
                        'Latin harflerle, boşluksuz, örnek: fullName',
                        'Latin letters, no spaces, e.g. fullName — links the field to the form steps',
                      ),
                    },
                    { path: 'label', label: L('العنوان', 'Etiket', 'Label'), type: 'text' as const },
                    { path: 'placeholder', label: L('النص التوضيحي داخل الحقل', 'Yer tutucu', 'Placeholder'), type: 'text' as const },
                    { path: 'type', label: L('نوع الحقل', 'Alan türü', 'Field type'), type: 'select' as const, options: formFieldTypeOptions },
                    { path: 'required', label: L('مطلوب', 'Zorunlu', 'Required'), type: 'boolean' as const },
                    {
                      path: 'options',
                      label: L('الخيارات', 'Seçenekler', 'Options'),
                      type: 'list' as const,
                      help: L('لقائمة الاختيار فقط — الخيار الأول هو النص الافتراضي', 'Sadece seçim listesi için; ilk seçenek yer tutucudur', 'Dropdowns only — the first option is the placeholder'),
                    },
                    { path: 'rows', label: L('عدد الأسطر', 'Satır sayısı', 'Rows'), type: 'number' as const, advanced: true, help: L('للنص الطويل', 'Uzun metin için', 'Long text only') },
                    {
                      path: 'sourceName',
                      label: L('اسم الحقل في الرسالة المستلمة', 'Alınan mesajdaki alan adı', 'Field name in the received message'),
                      type: 'text' as const,
                      advanced: true,
                      help: L('يُشتق من اسم الحقل إن تُرك فارغاً', 'Boşsa alan adından türetilir', 'Derived from the field name when empty'),
                    },
                    { path: 'inputMode', label: L('لوحة مفاتيح الجوال', 'Mobil klavye', 'Mobile keyboard'), type: 'select' as const, options: inputModeOptions, advanced: true },
                    { path: 'accept', label: L('أنواع الملفات المقبولة', 'Kabul edilen dosya türleri', 'Accepted file types'), type: 'text' as const, advanced: true, help: L('مثال: .pdf,.jpg', 'Örnek: .pdf,.jpg', 'Example: .pdf,.jpg') },
                  ],
                },
                {
                  path: `pages.${key}.form.groups`,
                  label: L('خطوات النموذج', 'Form adımları', 'Form steps'),
                  type: 'repeater' as const,
                  itemTitleField: 'title',
                  help: L('خطوة واحدة = نموذج من صفحة واحدة؛ عدة خطوات = نموذج متعدد الصفحات', 'Tek adım = tek sayfa; birden çok adım = çok sayfalı form', 'One step = a single-page form; several steps = a multi-page form'),
                  itemFields: [
                    { path: 'title', label: L('عنوان الخطوة', 'Adım başlığı', 'Step title'), type: 'text' as const },
                    { path: 'description', label: L('وصف الخطوة', 'Adım açıklaması', 'Step description'), type: 'textarea' as const },
                    {
                      path: 'fieldIds',
                      label: L('أسماء الحقول في هذه الخطوة', 'Bu adımdaki alan adları', 'Field names in this step'),
                      type: 'list' as const,
                      help: L('اكتب اسم الحقل (المعرّف) كما هو في قائمة الحقول', 'Alan adını alan listesindeki gibi yazın', 'Type the field name (id) exactly as in the fields list'),
                    },
                    { path: 'id', label: L('معرّف الخطوة', 'Adım kimliği', 'Step id'), type: 'text' as const, advanced: true },
                  ],
                },
              ] as PageFieldDef[])
            : ([
                { path: `pages.${key}.contact.directTitle`, label: L('عنوان بطاقات التواصل المباشر', 'Doğrudan iletişim başlığı', 'Direct contact heading'), type: 'text' as const },
                { path: `pages.${key}.contact.directDescription`, label: L('وصف التواصل المباشر', 'Doğrudan iletişim açıklaması', 'Direct contact description'), type: 'textarea' as const },
                {
                  path: `pages.${key}.contact.directLinks`,
                  label: L('بطاقات التواصل المباشر', 'Doğrudan iletişim kartları', 'Direct contact cards'),
                  type: 'repeater' as const,
                  itemTitleField: 'label',
                  itemFields: [
                    { path: 'label', label: L('الاسم', 'Ad', 'Name'), type: 'text' as const },
                    { path: 'description', label: L('وصف قصير', 'Kısa açıklama', 'Short description'), type: 'text' as const },
                    { path: 'href', label: L('الرابط', 'Bağlantı', 'Link'), type: 'url' as const, help: L('مثال: https://wa.me/9053xxxxxxx', 'Örnek: https://wa.me/9053xxxxxxx', 'Example: https://wa.me/9053xxxxxxx') },
                    { path: 'kind', label: L('النوع', 'Tür', 'Kind'), type: 'select' as const, options: contactKindOptions },
                  ],
                },
                { path: `pages.${key}.contact.socialTitle`, label: L('عنوان صفحات التواصل الاجتماعي', 'Sosyal medya başlığı', 'Social pages heading'), type: 'text' as const },
                { path: `pages.${key}.contact.socialDescription`, label: L('وصف صفحات التواصل الاجتماعي', 'Sosyal medya açıklaması', 'Social pages description'), type: 'textarea' as const },
                {
                  path: `pages.${key}.contact.socialLinks`,
                  label: L('بطاقات التواصل الاجتماعي', 'Sosyal medya kartları', 'Social page cards'),
                  type: 'repeater' as const,
                  itemTitleField: 'label',
                  itemFields: [
                    { path: 'label', label: L('الاسم', 'Ad', 'Name'), type: 'text' as const },
                    { path: 'description', label: L('وصف قصير', 'Kısa açıklama', 'Short description'), type: 'text' as const },
                    { path: 'href', label: L('الرابط', 'Bağlantı', 'Link'), type: 'url' as const },
                    { path: 'kind', label: L('النوع', 'Tür', 'Kind'), type: 'select' as const, options: contactKindOptions },
                  ],
                },
              ] as PageFieldDef[])),
        ],
      })),
    ],
  },

  // LIBRARY & NEWS COPY ------------------------------------------------------
  {
    key: 'library-page',
    group: 'library',
    label: L('صفحة المكتبة', 'Kütüphane sayfası', 'Library page'),
    description: L('واجهة المكتبة وبطاقات أقسامها ونصوصها؛ المواد نفسها من قوائم المكتبة', 'Kütüphane girişi, bölüm kartları ve metinleri', 'The library hero, its section cards and labels; the items come from the library lists'),
    icon: BookOpen,
    route: '/library',
    sections: [
      {
        key: 'hero',
        label: L('الواجهة', 'Hero', 'Hero'),
        icon: ImageIcon,
        anchor: '#cms-library-hero',
        fields: [
          { path: 'hero.eyebrow', label: L('السطر الصغير فوق العنوان', 'Başlık üstü satır', 'Line above the title'), type: 'text' },
          ...heroFields(),
        ],
      },
      ...libraryCollectionKeys.map(([slug, ar, tr, en]) => ({
        key: `collection-${slug}`,
        label: L(`قسم: ${ar}`, `Bölüm: ${tr}`, `Section: ${en}`),
        description: L('بطاقة القسم في صفحة المكتبة وواجهة صفحته', 'Kütüphane sayfasındaki bölüm kartı ve bölüm sayfası girişi', 'The section card on the library page and its own page hero'),
        icon: Library,
        anchor: `#cms-library-collection-${slug}`,
        fields: [
          { path: `collections.${slug}.title`, label: L('العنوان', 'Başlık', 'Title'), type: 'text' as const },
          { path: `collections.${slug}.shortTitle`, label: L('الاسم القصير (في القوائم)', 'Kısa ad', 'Short name (in menus)'), type: 'text' as const },
          { path: `collections.${slug}.eyebrow`, label: L('السطر الصغير فوق العنوان', 'Başlık üstü satır', 'Line above the title'), type: 'text' as const },
          { path: `collections.${slug}.description`, label: L('الوصف', 'Açıklama', 'Description'), type: 'textarea' as const },
          { path: `collections.${slug}.image`, label: L('صورة واجهة القسم', 'Bölüm hero görseli', 'Section hero image'), type: 'image' as const, help: L('إن تُركت فارغة تُستخدم صورة أول مادة', 'Boşsa ilk öğenin görseli kullanılır', 'When empty, the first item’s image is used') },
          { path: `collections.${slug}.imageAlt`, label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'), type: 'text' as const },
        ],
      })),
      {
        key: 'search',
        label: L('البحث الموحّد', 'Birleşik arama', 'Unified search'),
        anchor: '#cms-library-search',
        description: L('صندوق البحث الكبير في صفحة المكتبة واقتراحاته', 'Kütüphane sayfasındaki büyük arama kutusu ve önerileri', 'The big search box on the library page and its suggestions'),
        icon: Search,
        fields: [
          {
            path: 'searchSuggestions',
            label: L('اقتراحات البحث', 'Arama önerileri', 'Search suggestions'),
            type: 'list',
          },
          ...labelFields('labels', [
            ['searchAll', 'عنوان البحث', 'Arama başlığı', 'Search heading'],
            ['searchAllPlaceholder', 'النص داخل صندوق البحث', 'Arama yer tutucu', 'Search placeholder'],
            ['searchHint', 'تلميح البحث', 'Arama ipucu', 'Search hint'],
            ['suggestions', 'كلمة "جرّب البحث عن"', 'Öneri etiketi', '"Try searching for" label'],
            ['seeAllIn', 'رابط "كل النتائج في"', 'Tümünü gör', '"All results in" link'],
            ['results', 'كلمة "نتائج"', 'Sonuçlar', '"Results" word'],
            ['noResults', 'لا نتائج', 'Sonuç yok', 'No results'],
          ]),
          {
            path: 'layout.searchPerGroup',
            label: L('عدد النتائج لكل قسم', 'Bölüm başına sonuç', 'Results per section'),
            type: 'number',
            advanced: true,
          },
        ],
      },
      {
        key: 'labelsIndex',
        label: L('نصوص صفحة المكتبة', 'Kütüphane sayfası etiketleri', 'Library page labels'),
        icon: Type,
        anchor: 'main',
        fields: [
          ...labelFields('labels', [
            ['home', 'مسار التنقل: الرئيسية', 'Gezinti: Ana sayfa', 'Breadcrumb: Home'],
            ['library', 'كلمة "المكتبة"', 'Kütüphane', '"Library" word'],
            ['browse', 'زر تصفح القسم', 'Bölüme göz at', 'Browse section button'],
            ['latest', 'عنوان أحدث المواد', 'En yeniler', 'Latest items heading'],
            ['latestAcross', 'عنوان "أُضيف حديثاً"', 'Son eklenenler', '"Recently added" heading'],
            ['sectionsNav', 'عنوان أقسام المكتبة', 'Kütüphane bölümleri', 'Library sections heading'],
            ['allSections', 'كل الأقسام', 'Tüm bölümler', 'All sections'],
            ['documentsHub', 'عنوان المستندات والمنشورات', 'Belgeler ve yayınlar', 'Documents & publications heading'],
            ['items', 'كلمة "مادة/مواد"', 'Öğe', '"Items" word'],
            ['photos', 'كلمة "صور"', 'Fotoğraflar', '"Photos" word'],
            ['exploreGallery', 'زر استكشاف المعرض', 'Galeriyi keşfet', 'Explore gallery button'],
            ['typeArticle', 'نوع: مقال', 'Tür: makale', 'Type: article'],
            ['typeDocument', 'نوع: مستند', 'Tür: belge', 'Type: document'],
            ['typeStory', 'نوع: قصة', 'Tür: hikaye', 'Type: story'],
            ['typeFigure', 'نوع: شخصية', 'Tür: şahsiyet', 'Type: figure'],
            ['typeImage', 'نوع: صورة', 'Tür: görsel', 'Type: image'],
            ['showMore', 'زر عرض المزيد', 'Daha fazla', 'Show more'],
            ['showLess', 'زر عرض أقل', 'Daha az', 'Show less'],
          ]),
          { path: 'layout.latestLimit', label: L('عدد المواد في "أُضيف حديثاً"', 'Son eklenen sayısı', 'Items in "recently added"'), type: 'number', advanced: true },
        ],
      },
      {
        key: 'labelsCollections',
        label: L('نصوص صفحات الأقسام', 'Bölüm sayfası etiketleri', 'Section page labels'),
        description: L('الفلاتر والأزرار في صفحات المقالات والمستندات والمعرض', 'Makale, belge ve galeri sayfalarındaki filtre ve butonlar', 'Filters and buttons on the article, document and gallery pages'),
        icon: SlidersHorizontal,
        route: '/library/waqf-books',
        anchor: 'main',
        fields: labelFields('labels', [
          ['all', 'كلمة "الكل"', 'Tümü', '"All" word'],
          ['allYears', 'كل السنوات', 'Tüm yıllar', 'All years'],
          ['search', 'كلمة "بحث"', 'Ara', '"Search" word'],
          ['searchPlaceholder', 'النص داخل حقل بحث القسم', 'Bölüm arama yer tutucu', 'Section search placeholder'],
          ['filters', 'كلمة "الفلاتر"', 'Filtreler', '"Filters" word'],
          ['clearFilters', 'زر مسح الفلاتر', 'Filtreleri temizle', 'Clear filters button'],
          ['readArticle', 'زر قراءة المقال', 'Makaleyi oku', 'Read article button'],
          ['readStory', 'زر قراءة القصة', 'Hikayeyi oku', 'Read story button'],
          ['openDocument', 'زر فتح الوثيقة', 'Belgeyi aç', 'Open document button'],
          ['downloadPdf', 'زر تحميل PDF', 'PDF indir', 'Download PDF button'],
          ['pdfOnly', 'فلتر "ملفات PDF فقط"', 'Sadece PDF', '"PDF only" filter'],
          ['pdfShort', 'شارة PDF', 'PDF rozeti', 'PDF badge'],
          ['noPdfShort', 'شارة بدون PDF', 'PDF yok rozeti', 'No-PDF badge'],
          ['preview', 'زر المعاينة', 'Önizleme', 'Preview button'],
          ['openInNewTab', 'زر فتح في تبويب جديد', 'Yeni sekmede aç', 'Open in new tab'],
          ['closePreview', 'زر إغلاق المعاينة', 'Önizlemeyi kapat', 'Close preview'],
          ['previewUnavailable', 'رسالة تعذر المعاينة', 'Önizleme yok mesajı', 'Preview unavailable message'],
          ['viewGrid', 'عرض شبكي', 'Izgara görünümü', 'Grid view'],
          ['viewNews', 'عرض بطاقات', 'Kart görünümü', 'Cards view'],
          ['viewList', 'عرض قائمة', 'Liste görünümü', 'List view'],
          ['series', 'كلمة "سلسلة"', 'Seri', '"Series" word'],
          ['published', 'كلمة "نُشر"', 'Yayınlandı', '"Published" word'],
          ['openImage', 'فتح الصورة (لقارئ الشاشة)', 'Görseli aç', 'Open image (screen reader)'],
          ['closeImage', 'إغلاق الصورة', 'Görseli kapat', 'Close image'],
          ['previousImage', 'الصورة السابقة', 'Önceki görsel', 'Previous image'],
          ['nextImage', 'الصورة التالية', 'Sonraki görsel', 'Next image'],
          ['imageCounter', 'كلمة "صورة" في العدّاد', 'Görsel sayacı', 'Image counter word'],
        ]),
      },
      {
        key: 'labelsReading',
        label: L('نصوص صفحة القراءة', 'Okuma sayfası etiketleri', 'Reading page labels'),
        description: L('صفحة المقال/القصة الواحدة', 'Tek makale/hikaye sayfası', 'The single article/story page'),
        icon: BookOpen,
        fields: [
          ...labelFields('labels', [
            ['originalTitle', 'عنوان "العنوان الأصلي"', 'Orijinal başlık', 'Original title heading'],
            ['sourceLanguage', 'كلمة "لغة المصدر"', 'Kaynak dili', 'Source language'],
            ['originalLanguageNote', 'ملاحظة النص الأصلي بالعربية', 'Orijinal dil notu', 'Original-language note', 'textarea'],
            ['readingTime', 'كلمة "دقائق قراءة"', 'Okuma süresi', 'Reading time'],
            ['tableOfContents', 'عنوان المحتويات', 'İçindekiler', 'Table of contents'],
            ['readingProgress', 'تقدم القراءة', 'Okuma ilerlemesi', 'Reading progress'],
            ['author', 'كلمة "الكاتب"', 'Yazar', '"Author" word'],
            ['partOfSeries', 'ملاحظة "جزء من سلسلة"', 'Seri notu', '"Part of a series" note'],
            ['partLabel', 'كلمة "الجزء"', 'Bölüm', '"Part" word'],
            ['related', 'عنوان مواد ذات صلة', 'İlgili', 'Related heading'],
            ['previousItem', 'زر المادة السابقة', 'Önceki', 'Previous item'],
            ['nextItem', 'زر المادة التالية', 'Sonraki', 'Next item'],
            ['backToLibrary', 'زر العودة للمكتبة', 'Kütüphaneye dön', 'Back to library'],
            ['backToCollection', 'زر العودة للقسم', 'Bölüme dön', 'Back to section'],
            ['share', 'كلمة "مشاركة"', 'Paylaş', 'Share'],
            ['copyLink', 'زر نسخ الرابط', 'Bağlantıyı kopyala', 'Copy link'],
            ['linkCopied', 'رسالة تم النسخ', 'Kopyalandı', 'Link copied'],
            ['print', 'زر الطباعة', 'Yazdır', 'Print'],
            ['donateCta', 'زر الدعوة للمساهمة', 'Bağış çağrısı', 'Donate call-to-action'],
          ]),
          { path: 'layout.relatedLimit', label: L('عدد المواد ذات الصلة', 'İlgili öğe sayısı', 'Related items count'), type: 'number', advanced: true },
        ],
      },
    ],
  },
  // LIBRARY: THE WAQF STORY --------------------------------------------------
  {
    key: 'library-profile',
    group: 'library',
    label: L('العرض التعريفي', 'Tanıtım sunumu', 'Waqf story'),
    description: L(
      'صفحة /library/profile كاملة: الفصول الثلاثة عشر، صورها، وأرقام «أويس في أرقام»',
      '/library/profile sayfasının tamamı: on üç bölüm, görseller ve “Owais rakamlarla”',
      'The whole /library/profile page: the thirteen chapters, their photos and the “Owais in Numbers” figures',
    ),
    icon: Clapperboard,
    route: '/library/profile',
    sections: [
      {
        key: 'meta',
        label: L('اسم الصفحة ووصفها', 'Sayfa adı ve açıklaması', 'Page name & description'),
        description: L(
          'العنوان في تبويب المتصفح وقائمة المكتبة وبطاقة العرض في صفحة المكتبة',
          'Tarayıcı sekmesindeki, kütüphane menüsündeki ve kütüphane sayfasındaki kartın adı',
          'The name in the browser tab, the library menu and the spotlight card on the library page',
        ),
        icon: Search,
        fields: [
          { path: 'meta.title', label: L('اسم الصفحة', 'Sayfa adı', 'Page name'), type: 'text' },
          { path: 'meta.shortTitle', label: L('الاسم القصير (في قائمة المكتبة)', 'Kısa ad (kütüphane menüsünde)', 'Short name (in the library menu)'), type: 'text' },
          { path: 'meta.seoDescription', label: L('وصف الصفحة في جوجل', 'Google açıklaması', 'Search-engine description'), type: 'textarea' },
        ],
      },
      {
        key: 'hero',
        label: L('01 · الافتتاحية', '01 · Açılış', '01 · Opening'),
        description: L('الشاشة الأولى: الصورة الكاملة والعنوان والشعار', 'İlk ekran: tam görsel, başlık ve slogan', 'The first screen: the full-bleed photo, headline and slogan'),
        icon: ImageIcon,
        anchor: '#profile-hero',
        fields: [
          { path: 'hero.eyebrow', label: L('السطر الصغير فوق العنوان', 'Başlık üstü satır', 'Line above the title'), type: 'text' },
          { path: 'hero.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          { path: 'hero.subtitle', label: L('العنوان الفرعي', 'Alt başlık', 'Subtitle'), type: 'textarea' },
          { path: 'hero.slogan', label: L('الشعار', 'Slogan', 'Slogan'), type: 'text' },
          { path: 'hero.intro', label: L('التمهيد', 'Giriş cümlesi', 'Intro line'), type: 'textarea' },
          { path: 'hero.image', label: L('صورة الخلفية', 'Arka plan görseli', 'Background image'), type: 'image' },
        ],
      },
      {
        key: 'pillars',
        label: L('02 · من الفكرة إلى الأثر', '02 · Fikirden etkiye', '02 · From idea to impact'),
        description: L('الركائز الأربع المتراكبة في أول فصل', 'İlk bölümdeki üst üste dizilen dört sütun', 'The four stacked pillars of the first chapter'),
        icon: LayoutGrid,
        anchor: '#profile-pillars',
        fields: [
          ...profileHeadingFields('pillars'),
          profileCards('pillars.items', L('الركائز', 'Sütunlar', 'Pillars')),
          profileChapterNote('pillars.outro'),
        ],
      },
      {
        key: 'problem',
        label: L('03 · المشكلة التي نعالجها', '03 · Ele aldığımız sorun', '03 · The problem we address'),
        description: L(
          'اللوحة الحمراء: ثلاث بطاقات تنقلب لتُظهر المصرف الذي يجيب عنها',
          'Kırmızı pano: cevap veren mecrayı göstermek için dönen üç kart',
          'The crimson plate: three cards that flip to reveal the track answering each need',
        ),
        icon: AlertTriangle,
        anchor: '#profile-problem',
        fields: [
          ...profileHeadingFields('problem'),
          profileCards('problem.cards', L('الاحتياجات الثلاثة', 'Üç ihtiyaç', 'The three needs'), {
            max: 3,
            help: L('التصميم مبني على ثلاث بطاقات', 'Tasarım üç kart için yapılmıştır', 'The layout is built for three cards'),
          }),
          profileChapterNote('problem.note'),
        ],
      },
      {
        key: 'story',
        label: L('04 · قصة التأسيس', '04 · Kuruluş hikayesi', '04 · Founding story'),
        description: L('الخط الزمني، التجارب الأربع، وشريط الصور تحتها', 'Zaman çizelgesi, dört deneyim ve altındaki fotoğraf şeridi', 'The timeline, the four experiences and the photo band under them'),
        icon: RouteIcon,
        anchor: '#profile-story',
        fields: [
          ...profileHeadingFields('story'),
          {
            path: 'story.milestones',
            label: L('محطات الخط الزمني', 'Zaman çizelgesi durakları', 'Timeline milestones'),
            type: 'repeater',
            itemTitleField: 'title',
            itemFields: [
              { path: 'year', label: L('السنة أو التاريخ', 'Yıl veya tarih', 'Year or date'), type: 'text' },
              ...profileCardFields,
            ],
          },
          { path: 'story.experiencesHeading', label: L('عنوان التجارب', 'Deneyimler başlığı', 'Experiences heading'), type: 'text' },
          { path: 'story.experiencesSubheading', label: L('السطر تحت عنوان التجارب', 'Deneyimler alt satırı', 'Line under the experiences heading'), type: 'text' },
          profileCards('story.experiences', L('التجارب', 'Deneyimler', 'Experiences')),
          profileChapterNote('story.conclusion'),
          profilePhotos('story.photos', L('شريط الصور', 'Fotoğraf şeridi', 'Photo band'), 3),
        ],
      },
      {
        key: 'identity',
        label: L('05 · الهوية والمعنى', '05 · Kimlik ve anlam', '05 · Identity & meaning'),
        description: L('صورة أويس، التعريف، الرؤية والرسالة، وقيم المدار', 'Owais portresi, tanım, vizyon-misyon ve dönen değerler', 'The Owais portrait, the definition, vision & mission and the orbiting values'),
        icon: Compass,
        anchor: '#profile-identity',
        fields: [
          ...profileHeadingFields('identity'),
          { path: 'identity.image', label: L('الصورة الجانبية', 'Yan görsel', 'Side portrait'), type: 'image' },
          ...profileCard('identity.why', L('لماذا أويس', 'Neden Owais', 'Why Owais')),
          ...profileCard('identity.what', L('ما هو الوقف', 'Vakıf nedir', 'What the waqf is')),
          ...profileCard('identity.vision', L('الرؤية', 'Vizyon', 'Vision')),
          ...profileCard('identity.mission', L('الرسالة', 'Misyon', 'Mission')),
          { path: 'identity.values.title', label: L('عنوان القيم', 'Değerler başlığı', 'Values heading'), type: 'text' },
          {
            path: 'identity.values.items',
            label: L('القيم', 'Değerler', 'Values'),
            type: 'list',
            help: L('كلمة واحدة لكل قيمة؛ تدور حول المركز', 'Her değer için tek kelime; merkez etrafında döner', 'One word per value; they orbit the centre'),
          },
          profileChapterNote('identity.note'),
        ],
      },
      {
        key: 'cycle',
        label: L('06 · الدورة الوقفية', '06 · Vakıf döngüsü', '06 · The waqf cycle'),
        description: L('الحلقة ذات المراحل الثلاث والوظيفتان المتكاملتان', 'Üç aşamalı halka ve iki tamamlayıcı işlev', 'The three-stage ring and the two complementary functions'),
        icon: RouteIcon,
        anchor: '#profile-cycle',
        fields: [
          ...profileHeadingFields('cycle'),
          profileCards('cycle.stages', L('مراحل الدورة', 'Döngü aşamaları', 'Cycle stages'), {
            max: 3,
            help: L('الرسم مبني على ثلاث مراحل', 'Çizim üç aşama için yapılmıştır', 'The diagram is drawn for three stages'),
          }),
          profileChapterNote('cycle.note'),
          { path: 'cycle.duality.heading', label: L('عنوان الوظيفتين', 'İki işlev başlığı', 'Two-functions heading'), type: 'text' },
          ...profileCard('cycle.duality.direct', L('العطاء المباشر', 'Doğrudan bağış', 'Direct giving')),
          ...profileCard('cycle.duality.waqf', L('المساهمة الوقفية', 'Vakıf katkısı', 'Waqf contribution')),
          { path: 'cycle.duality.note', label: L('خلاصة الوظيفتين', 'İki işlev notu', 'Two-functions note'), type: 'textarea' },
        ],
      },
      {
        key: 'creation',
        label: L('07 · إيجاد الوقف', '07 · Vakfın oluşturulması', '07 · Creating the waqf'),
        description: L('السهم الوقفي، صور الشقق، صور إيجاد الوقف، والشجرة المباركة', 'Vakıf hissesi, daire fotoğrafları, katkı biçimleri ve kutlu ağaç', 'The waqf share, the apartment photos, the forms of contribution and the blessed tree'),
        icon: Landmark,
        anchor: '#profile-creation',
        fields: [
          ...profileHeadingFields('creation'),
          { path: 'creation.share.heading', label: L('عنوان السهم الوقفي', 'Vakıf hissesi başlığı', 'Waqf share heading'), type: 'text' },
          { path: 'creation.share.what.text', label: L('نص السهم الوقفي', 'Vakıf hissesi metni', 'Waqf share text'), type: 'textarea' },
          { path: 'creation.share.note', label: L('ملاحظة السهم', 'Hisse notu', 'Share note'), type: 'textarea' },
          profilePhotos('creation.photos', L('صور الشقق الوقفية', 'Vakıf dairelerinin fotoğrafları', 'Waqf apartment photos'), 4),
          { path: 'creation.formsHeading', label: L('عنوان صور إيجاد الوقف', 'Katkı biçimleri başlığı', 'Forms-of-contribution heading'), type: 'text' },
          { path: 'creation.formsSubheading', label: L('السطر تحت عنوان الصور', 'Katkı biçimleri alt satırı', 'Line under the forms heading'), type: 'text' },
          profileCards('creation.forms', L('صور إيجاد الوقف', 'Katkı biçimleri', 'Forms of contribution')),
          { path: 'creation.tree.heading', label: L('عنوان الشجرة المباركة', 'Kutlu ağaç başlığı', 'Blessed-tree heading'), type: 'text' },
          { path: 'creation.tree.subheading', label: L('السطر فوق عنوان الشجرة', 'Ağaç başlığı üstü satır', 'Line above the tree heading'), type: 'text' },
          {
            path: 'creation.tree.image',
            label: L('لوحة الشجرة', 'Ağaç görseli', 'Tree artwork'),
            type: 'image',
            help: L('صورة مربعة؛ تنمو من الجذور إلى الأعلى عند الوصول إليها', 'Kare görsel; görünüre girince köklerden yukarı büyür', 'A square image; it grows from the roots up as it comes into view'),
          },
          profileCards('creation.tree.steps', L('خطوات الشجرة', 'Ağaç adımları', 'Tree steps')),
          { path: 'creation.tree.note', label: L('خلاصة الشجرة', 'Ağaç notu', 'Tree note'), type: 'textarea' },
        ],
      },
      {
        key: 'investment',
        label: L('08 · التثمير', '08 · Yatırım', '08 · Investment'),
        description: L('المبادئ، مراحل القرار المتحركة، الفصل المؤسسي، والعائد القابل للتخصيص', 'İlkeler, hareketli karar aşamaları, kurumsal ayrım ve dağıtılabilir getiri', 'The principles, the animated decision stages, the institutional separation and the distributable yield'),
        icon: BarChart3,
        anchor: '#profile-governance',
        fields: [
          ...profileHeadingFields('investment'),
          profileCards('investment.principles', L('مبادئ الاستثمار', 'Yatırım ilkeleri', 'Investment principles')),
          { path: 'investment.stagesHeading', label: L('عنوان مراحل القرار', 'Karar aşamaları başlığı', 'Decision-stages heading'), type: 'text' },
          profileCards('investment.stages', L('مراحل القرار', 'Karar aşamaları', 'Decision stages')),
          { path: 'investment.governance.heading', label: L('عنوان الفصل المؤسسي', 'Kurumsal ayrım başlığı', 'Institutional-separation heading'), type: 'text' },
          { path: 'investment.governance.subheading', label: L('السطر تحت عنوان الفصل المؤسسي', 'Kurumsal ayrım alt satırı', 'Line under the separation heading'), type: 'text' },
          profileCards('investment.governance.bodies', L('الجهات', 'Organlar', 'Bodies')),
          { path: 'investment.governance.note', label: L('خلاصة الفصل المؤسسي', 'Kurumsal ayrım notu', 'Separation note'), type: 'textarea' },
          { path: 'investment.yield.heading', label: L('عنوان العائد', 'Getiri başlığı', 'Yield heading'), type: 'text' },
          { path: 'investment.yield.subheading', label: L('السطر تحت عنوان العائد', 'Getiri alt satırı', 'Line under the yield heading'), type: 'text' },
          profileCards('investment.yield.steps', L('خطوات العائد', 'Getiri adımları', 'Yield steps')),
          { path: 'investment.yield.note', label: L('خلاصة العائد', 'Getiri notu', 'Yield note'), type: 'textarea' },
        ],
      },
      {
        key: 'tracks',
        label: L('09 · مصارف الوقف', '09 · Vakıf mecraları', '09 · Waqf tracks'),
        description: L('الشاشة الداكنة: أربع محطات على الخط الأحمر، لكل مصرف صورته', 'Koyu ekran: kırmızı hat üzerinde dört durak, her mecranın kendi fotoğrafı', 'The dark screen: four stations on the crimson line, one photo per track'),
        icon: Megaphone,
        anchor: '#profile-tracks',
        fields: [
          ...profileHeadingFields('tracks'),
          {
            path: 'tracks.items',
            label: L('المصارف الأربعة', 'Dört mecra', 'The four tracks'),
            type: 'repeater',
            itemTitleField: 'title',
            max: 4,
            help: L('الخط مرسوم لأربع محطات؛ تُستخدم الصورة الافتراضية إن تُركت فارغة', 'Hat dört durak için çizilmiştir; boş bırakılan görsel yerine varsayılan kullanılır', 'The line is drawn for four stations; an empty picture falls back to the built-in one'),
            itemFields: [
              ...profileCardFields,
              { path: 'image', label: L('صورة المحطة', 'Durak fotoğrafı', 'Station photo'), type: 'image' },
            ],
          },
        ],
      },
      {
        key: 'pioneers',
        label: L('10 · برنامج رواد اليمن', '10 · Yemenli Öncüler programı', '10 · Yemen Pioneers program'),
        description: L('الفكرة والغاية، سلسلة الفلسفة، المرتكزات والمسارات، وشريط الصور', 'Fikir ve amaç, felsefe zinciri, dayanaklar ve yollar, fotoğraf şeridi', 'The idea and goal, the philosophy chain, the pillars and paths and the photo band'),
        icon: GraduationCap,
        anchor: '#profile-pioneers',
        fields: [
          ...profileHeadingFields('pioneers'),
          ...profileCard('pioneers.idea', L('الفكرة', 'Fikir', 'The idea')),
          ...profileCard('pioneers.goal', L('الغاية', 'Amaç', 'The goal')),
          { path: 'pioneers.philosophyHeading', label: L('عنوان سلسلة الفلسفة', 'Felsefe zinciri başlığı', 'Philosophy-chain heading'), type: 'text' },
          profileCards('pioneers.philosophy', L('حلقات السلسلة', 'Zincir halkaları', 'Chain links')),
          { path: 'pioneers.pillarsHeading', label: L('عنوان المرتكزات', 'Dayanaklar başlığı', 'Pillars heading'), type: 'text' },
          profileCards('pioneers.pillars', L('المرتكزات', 'Dayanaklar', 'Pillars')),
          { path: 'pioneers.pathsHeading', label: L('عنوان المسارات', 'Yollar başlığı', 'Paths heading'), type: 'text' },
          profileCards('pioneers.paths', L('المسارات', 'Yollar', 'Paths')),
          profileChapterNote('pioneers.note'),
          profilePhotos('pioneers.photos', L('شريط الصور', 'Fotoğraf şeridi', 'Photo band'), 2),
        ],
      },
      {
        key: 'numbers',
        label: L('11 · أويس في أرقام', '11 · Owais rakamlarla', '11 · Owais in Numbers'),
        description: L(
          'الخزانة: أرقام إيجاد الوقف والتثمير، البرامج والمستفيدون، سجل المسارات الأربعة، ولوحات الإنفوجرافيك',
          'Kasa: oluşturma ve yatırım rakamları, programlar ve faydalanıcılar, dört mecra kaydı ve infografik panoları',
          'The vault: creation and investment figures, programs and beneficiaries, the four-track record and the infographic boards',
        ),
        icon: BarChart3,
        anchor: '#profile-numbers',
        fields: [
          { path: 'numbers.eyebrow', label: L('السطر الصغير فوق العنوان', 'Başlık üstü satır', 'Line above the title'), type: 'text' },
          ...profileHeadingFields('numbers'),
          { path: 'numbers.capital.heading', label: L('عنوان إيجاد الوقف', 'Oluşturma başlığı', 'Creation heading'), type: 'text' },
          profileStats('numbers.capital.stats', L('أرقام إيجاد الوقف', 'Oluşturma rakamları', 'Creation figures')),
          { path: 'numbers.investment.heading', label: L('عنوان التثمير', 'Yatırım başlığı', 'Investment heading'), type: 'text' },
          { path: 'numbers.investment.lead', label: L('سطر التثمير', 'Yatırım satırı', 'Investment lead line'), type: 'text' },
          ...profileStat('numbers.investment.profit', L('رقم الأرباح', 'Kâr rakamı', 'Profit figure')),
          { path: 'numbers.investment.activities', label: L('الأنشطة الاستثمارية', 'Yatırım faaliyetleri', 'Investment activities'), type: 'list' },
          ...profileStat('numbers.programsStat', L('رقم البرامج', 'Program rakamı', 'Programs figure')),
          ...profileStat('numbers.beneficiariesStat', L('رقم المستفيدين', 'Faydalanıcı rakamı', 'Beneficiaries figure')),
          {
            path: 'numbers.groups',
            label: L('سجل المسارات الأربعة', 'Dört mecra kaydı', 'The four-track record'),
            type: 'repeater',
            itemTitleField: 'heading',
            max: 4,
            help: L('أول رقم في كل مسار يظهر كبيراً والبقية في سطور', 'Her mecranın ilk rakamı büyük, kalanlar satır satır görünür', 'The first figure of each track is shown large, the rest as rows'),
            itemFields: [
              {
                path: 'heading',
                label: L('اسم المسار', 'Mecra adı', 'Track name'),
                type: 'text',
                help: L('الترتيب والاسم يفصل بينهما « · »', 'Sıra ve ad « · » ile ayrılır', 'Ordinal and name separated by « · »'),
              },
              { path: 'caption', label: L('السطر تحت الاسم', 'Adın altındaki satır', 'Line under the name'), type: 'text' },
              profileStats('stats', L('أرقام المسار', 'Mecra rakamları', 'Track figures')),
            ],
          },
          { path: 'numbers.platformsNote', label: L('ملاحظة المنصات', 'Platform notu', 'Platforms note'), type: 'textarea' },
          { path: 'numbers.closing', label: L('الخاتمة', 'Kapanış', 'Closing line'), type: 'textarea' },
          profilePhotos('numbers.boards', L('لوحات الإنفوجرافيك', 'İnfografik panoları', 'Infographic boards')),
        ],
      },
      {
        key: 'participate',
        label: L('12 · آليات المشاركة', '12 · Katılım yolları', '12 · Ways to participate'),
        description: L('بطاقات المشاركة الست وشراكات الاستدامة', 'Altı katılım kartı ve sürdürülebilirlik ortaklıkları', 'The six participation cards and the sustainability partnerships'),
        icon: Handshake,
        anchor: '#profile-participate',
        fields: [
          ...profileHeadingFields('participate'),
          profileCards('participate.ways', L('طرق المشاركة', 'Katılım yolları', 'Ways to participate')),
          { path: 'participate.partners.heading', label: L('عنوان الشراكات', 'Ortaklıklar başlığı', 'Partnerships heading'), type: 'text' },
          { path: 'participate.partners.subheading', label: L('السطر تحت عنوان الشراكات', 'Ortaklıklar alt satırı', 'Line under the partnerships heading'), type: 'text' },
          profileCards('participate.partners.items', L('أشكال الشراكة', 'Ortaklık biçimleri', 'Partnership forms')),
          { path: 'participate.partners.note', label: L('خلاصة الشراكات', 'Ortaklıklar notu', 'Partnerships note'), type: 'textarea' },
        ],
      },
      {
        key: 'cta',
        label: L('13 · الختام', '13 · Kapanış', '13 · Closing'),
        description: L('اللوحة الداكنة الأخيرة: العنوان، الشعار، وزرا المساهمة والمشاركة', 'Son koyu pano: başlık, slogan, bağış ve katılım butonları', 'The final dark plate: the title, slogan and the donate & participate buttons'),
        icon: HandHeart,
        anchor: '#profile-cta',
        fields: [
          { path: 'cta.title', label: L('العنوان', 'Başlık', 'Title'), type: 'text' },
          { path: 'cta.text', label: L('النص', 'Metin', 'Text'), type: 'textarea' },
          { path: 'cta.slogan', label: L('الشعار', 'Slogan', 'Slogan'), type: 'text' },
          { path: 'cta.donate', label: L('زر المساهمة', 'Bağış butonu', 'Donate button'), type: 'text' },
          { path: 'cta.participate', label: L('زر المشاركة', 'Katılım butonu', 'Participate button'), type: 'text' },
          { path: 'cta.backToLibrary', label: L('رابط العودة إلى المكتبة', 'Kütüphaneye dönüş bağlantısı', 'Back-to-library link'), type: 'text' },
          { path: 'cta.image', label: L('صورة الخلفية', 'Arka plan görseli', 'Background image'), type: 'image' },
        ],
      },
      {
        key: 'labels',
        label: L('كلمات صغيرة', 'Küçük sözler', 'Small words'),
        description: L('التسميات القصيرة المنتشرة في الصفحة: شريط الفصول، تلميحات، أزرار التنقل', 'Sayfaya dağılmış kısa etiketler: bölüm şeridi, ipuçları, gezinme butonları', 'Short labels scattered over the page: the chapter rail, hints, navigation buttons'),
        icon: Type,
        fields: labelFields('labels', [
          ['chapter', 'كلمة "الفصل" في الشريط الجانبي', 'Kenar şeridindeki "Bölüm"', '"Chapter" in the side rail'],
          ['scrollHint', 'تلميح التمرير في الافتتاحية', 'Açılıştaki kaydırma ipucu', 'Scroll hint on the opening'],
          ['untilDate', 'تاريخ تحديث الأرقام', 'Rakamların güncellenme tarihi', 'Figures-as-of date'],
          ['watchNumbers', 'اسم قسم الأرقام (في بطاقة المكتبة)', 'Rakamlar bölümünün adı (kütüphane kartında)', 'Name of the numbers section (on the library card)'],
          ['openInfographics', 'زر فتح الإنفوجرافيك', 'İnfografik açma butonu', 'Open-infographics button'],
          ['infographicsNote', 'وصف لوحات الإنفوجرافيك', 'İnfografik panoları açıklaması', 'Infographic boards caption'],
          ['flipHint', 'تلميح قلب البطاقة (فصل المشكلة)', 'Kart çevirme ipucu (sorun bölümü)', 'Flip hint (problem chapter)'],
          ['flipResponse', 'عنوان وجه البطاقة الخلفي', 'Kartın arka yüzü başlığı', 'Card back-face heading'],
          ['track', 'كلمة "المصرف" فوق العنوان الكبير', 'Büyük başlığın üstündeki "Mecra"', '"Track" above the big title'],
          ['previousTrack', 'زر المصرف السابق', 'Önceki mecra butonu', 'Previous-track button'],
          ['nextTrack', 'زر المصرف التالي', 'Sonraki mecra butonu', 'Next-track button'],
          ['pauseReel', 'زر إيقاف التنقل التلقائي', 'Otomatik geçişi durdurma butonu', 'Pause auto-advance button'],
          ['playReel', 'زر تشغيل التنقل التلقائي', 'Otomatik geçişi başlatma butonu', 'Resume auto-advance button'],
        ]),
      },
    ],
  },

  {
    key: 'news-page',
    group: 'library',
    label: L('صفحة الأخبار', 'Haberler sayfası', 'News page'),
    description: L('واجهة صفحة الأخبار ونصوصها؛ الأخبار نفسها من قائمة "الأخبار"', 'Haber sayfasının girişi ve metinleri', 'The news page hero and labels; the articles come from the "News" list'),
    icon: Newspaper,
    route: '/news',
    sections: [
      {
        key: 'hero',
        label: L('الواجهة', 'Hero', 'Hero'),
        icon: ImageIcon,
        anchor: '#cms-news-hero',
        fields: [
          ...labelFields('', [
            ['eyebrow', 'السطر الصغير فوق العنوان', 'Başlık üstü satır', 'Line above the title'],
            ['news', 'عنوان الصفحة (كلمة "الأخبار")', 'Sayfa başlığı', 'Page title ("News")'],
            ['heroDescription', 'وصف الواجهة', 'Hero açıklaması', 'Hero description', 'textarea'],
          ]),
          {
            path: 'hero.image',
            label: L('صورة الواجهة', 'Hero görseli', 'Hero image'),
            type: 'image',
            help: L('إن تُركت فارغة تُستخدم صورة أحدث خبر', 'Boşsa en yeni haberin görseli kullanılır', 'When empty, the newest article’s image is used'),
          },
          { path: 'hero.imageAlt', label: L('وصف الصورة', 'Görsel açıklaması', 'Image description'), type: 'text' },
          ...seoFields('seo'),
        ],
      },
      {
        key: 'labels',
        label: L('النصوص والأزرار', 'Etiketler', 'Labels'),
        icon: Type,
        anchor: '#cms-news-list',
        fields: labelFields('', [
          ['home', 'مسار التنقل: الرئيسية', 'Gezinti: Ana sayfa', 'Breadcrumb: Home'],
          ['featured', 'شارة الخبر المميّز', 'Öne çıkan rozeti', 'Featured badge'],
          ['latest', 'عنوان الأحدث', 'En yeni', 'Latest heading'],
          ['readArticle', 'زر قراءة الخبر', 'Haberi oku', 'Read article button'],
          ['readMore', 'زر اقرأ المزيد', 'Devamını oku', 'Read more button'],
          ['allNews', 'زر كل الأخبار', 'Tüm haberler', 'All news button'],
          ['search', 'كلمة "بحث"', 'Ara', '"Search" word'],
          ['searchPlaceholder', 'النص داخل حقل البحث', 'Arama yer tutucu', 'Search placeholder'],
          ['clearSearch', 'زر مسح البحث', 'Aramayı temizle', 'Clear search'],
          ['allYears', 'فلتر كل السنوات', 'Tüm yıllar', 'All years filter'],
          ['results', 'كلمة "نتائج"', 'Sonuçlar', '"Results" word'],
          ['noResults', 'رسالة لا نتائج', 'Sonuç yok', 'No results message'],
          ['loadPage', 'كلمة "صفحة" في الترقيم', 'Sayfa', '"Page" word in pagination'],
          ['sourceLanguage', 'كلمة "لغة المصدر"', 'Kaynak dili', 'Source language'],
          ['originalLanguageNote', 'ملاحظة النص الأصلي', 'Orijinal metin notu', 'Original-text note', 'textarea'],
          ['gallery', 'عنوان معرض صور الخبر', 'Haber galerisi', 'Article gallery heading'],
          ['related', 'عنوان أخبار ذات صلة', 'İlgili haberler', 'Related news heading'],
          ['backToNews', 'زر العودة للأخبار', 'Haberlere dön', 'Back to news button'],
          ['share', 'كلمة "مشاركة"', 'Paylaş', '"Share" word'],
          ['copyLink', 'زر نسخ الرابط', 'Bağlantıyı kopyala', 'Copy link'],
          ['linkCopied', 'رسالة تم النسخ', 'Kopyalandı', 'Link copied'],
          ['whatsapp', 'زر واتساب', 'WhatsApp', 'WhatsApp button'],
          ['facebook', 'زر فيسبوك', 'Facebook', 'Facebook button'],
          ['x', 'زر X', 'X', 'X button'],
        ]),
      },
      {
        key: 'layout',
        label: L('أعداد العرض', 'Görüntüleme sayıları', 'Display counts'),
        icon: SlidersHorizontal,
        anchor: '#cms-news-list',
        fields: [
          { path: 'layout.sideCount', label: L('عدد الأخبار بجانب الخبر الرئيسي', 'Ana haberin yanındaki haber sayısı', 'Articles beside the featured one'), type: 'number' },
          { path: 'layout.pageSize', label: L('عدد الأخبار في الصفحة', 'Sayfa başına haber', 'Articles per page'), type: 'number' },
          { path: 'layout.relatedCount', label: L('عدد الأخبار ذات الصلة', 'İlgili haber sayısı', 'Related articles count'), type: 'number' },
        ],
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

/**
 * Flat search index over every page, section and field label, for the
 * dashboard's "where do I change X?" search.
 */
export function pageSearchIndex(locale: Locale) {
  const entries: { pageKey: string; sectionKey: string; page: string; section: string; field: string }[] = [];
  for (const page of SITE_PAGES) {
    for (const section of page.sections) {
      const walk = (fields: PageFieldDef[]) => {
        for (const field of fields) {
          entries.push({
            pageKey: page.key,
            sectionKey: section.key,
            page: page.label[locale],
            section: section.label[locale],
            field: field.label[locale],
          });
          if (field.itemFields) walk(field.itemFields);
        }
      };
      walk(section.fields);
    }
  }
  return entries;
}
