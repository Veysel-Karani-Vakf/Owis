// One entry per public page of the site, in the order visitors meet them.
//
// The sidebar, the dashboard grid and the per-page hubs are all built from
// this map, so an editor finds everything about a page — its records AND its
// texts — behind a single item named after the page itself. `/admin/content`
// and `/admin/r/:key` still work as redirects into the hubs, so old links and
// browser bookmarks keep opening the right editor.

import {
  Home,
  Landmark,
  Scale,
  FolderKanban,
  GraduationCap,
  Newspaper,
  BookOpen,
  MessageSquare,
  HandHeart,
  Banknote,
  Settings2,
  type LucideIcon,
} from 'lucide-react';
import type { Locale } from '@/lib/types';

const L = (ar: string, tr: string, en: string): Record<Locale, string> => ({ ar, tr, en });

export type AreaPart =
  | {
      type: 'content';
      /** `site_pages` key edited by this tab. */
      pageKey: string;
      /** Tab name; defaults to the shared "page texts & images" string. */
      label?: Record<Locale, string>;
    }
  | {
      type: 'collection';
      /** `RESOURCES` key listed by this tab. */
      resourceKey: string;
      /** Tab name; defaults to the resource's own name. */
      label?: Record<Locale, string>;
    };

export type InboxKey = 'submissions' | 'payments' | 'subscribers';

/**
 * Each page's identity colour, as literal Tailwind classes (dynamic class
 * names would be purged). The same hue follows the page everywhere — sidebar,
 * dashboard card, hub header, tabs — so "green" starts to mean "projects".
 */
export type AreaTone = {
  /** Tinted chip: icon on a soft wash. */
  soft: string;
  /** Solid fill: active sidebar item, active tab, hub icon. */
  solid: string;
  /** Thin identity bar across the top of a dashboard card. */
  bar: string;
  /** Card border on hover. */
  hover: string;
};

export type SiteArea = {
  key: string;
  icon: LucideIcon;
  label: Record<Locale, string>;
  /** One line under the name: what a visitor sees on this page. */
  description: Record<Locale, string>;
  /** Public route this area manages — opened by "view on site". */
  route: string;
  tone: AreaTone;
  /** Tabs of the hub, most-edited first. */
  parts: AreaPart[];
  /** Related inboxes, offered as shortcuts in the hub header. */
  inbox?: InboxKey[];
};

const pageTexts = L('نصوص وصور الصفحة', 'Sayfa metinleri ve görselleri', 'Page texts & images');

export const SITE_AREAS: SiteArea[] = [
  {
    key: 'home',
    icon: Home,
    label: L('الصفحة الرئيسية', 'Ana sayfa', 'Home page'),
    description: L(
      'كل أقسام الصفحة الأولى، مع الشركاء والأرقام التي تظهر فيها',
      'Açılış sayfasının tüm bölümleri, ortaklar ve rakamlarla birlikte',
      'Every section of the landing page, plus the partners and figures shown on it',
    ),
    route: '/',
    tone: {
      soft: 'bg-sky-100 text-sky-700',
      solid: 'bg-sky-600 text-white',
      bar: 'bg-sky-500',
      hover: 'hover:border-sky-300',
    },
    parts: [
      { type: 'content', pageKey: 'home', label: L('أقسام الصفحة', 'Sayfa bölümleri', 'Page sections') },
      { type: 'collection', resourceKey: 'partners' },
      { type: 'collection', resourceKey: 'stat_indicators' },
    ],
  },
  {
    key: 'about-waqf',
    icon: Landmark,
    label: L('عن الوقف', 'Vakıf hakkında', 'About the waqf'),
    description: L(
      'صفحة التعريف بالوقف: الرؤية والرسالة والأهداف وكلمة الرئيس',
      'Vakfı tanıtan sayfa: vizyon, misyon, hedefler ve başkanın mesajı',
      'The page introducing the waqf: vision, mission, goals and the president’s message',
    ),
    route: '/about/waqf',
    tone: {
      soft: 'bg-violet-100 text-violet-700',
      solid: 'bg-violet-600 text-white',
      bar: 'bg-violet-500',
      hover: 'hover:border-violet-300',
    },
    parts: [
      { type: 'content', pageKey: 'about-waqf', label: pageTexts },
      { type: 'content', pageKey: 'about-nav', label: L('قائمة "عن الوقف"', '"Hakkında" menüsü', '"About" menu') },
    ],
  },
  {
    key: 'governance',
    icon: Scale,
    label: L('الحوكمة والسياسات', 'Yönetişim', 'Governance'),
    description: L(
      'صفحة الحوكمة وقائمة سياسات الوقف',
      'Yönetişim sayfası ve vakfın politika listesi',
      'The governance page and the list of waqf policies',
    ),
    route: '/about/governance',
    tone: {
      soft: 'bg-indigo-100 text-indigo-700',
      solid: 'bg-indigo-600 text-white',
      bar: 'bg-indigo-500',
      hover: 'hover:border-indigo-300',
    },
    parts: [{ type: 'content', pageKey: 'governance', label: pageTexts }],
  },
  {
    key: 'projects',
    icon: FolderKanban,
    label: L('المشاريع', 'Projeler', 'Projects'),
    description: L(
      'كل مشروع بطاقة في صفحة المشاريع وله صفحة تفاصيل خاصة',
      'Her proje, projeler sayfasında bir kart ve kendi detay sayfasıdır',
      'Each project is a card on the projects page with its own detail page',
    ),
    route: '/projects',
    tone: {
      soft: 'bg-emerald-100 text-emerald-700',
      solid: 'bg-emerald-600 text-white',
      bar: 'bg-emerald-500',
      hover: 'hover:border-emerald-300',
    },
    parts: [
      { type: 'collection', resourceKey: 'projects', label: L('قائمة المشاريع', 'Proje listesi', 'Project list') },
      { type: 'content', pageKey: 'projects-page', label: pageTexts },
    ],
  },
  {
    key: 'programs',
    icon: GraduationCap,
    label: L('البرامج', 'Programlar', 'Programs'),
    description: L(
      'رواد اليمن، بناء القدرات، التطوير المؤسسي، التوعية، ووحدة التطوع',
      'Yemen Öncüleri, kapasite geliştirme, kurumsal gelişim, farkındalık ve gönüllülük',
      'Yemen Pioneers, capacity building, institutional development, awareness and volunteering',
    ),
    route: '/programs/yemen-pioneers',
    tone: {
      soft: 'bg-amber-100 text-amber-700',
      solid: 'bg-amber-500 text-white',
      bar: 'bg-amber-400',
      hover: 'hover:border-amber-300',
    },
    parts: [
      { type: 'collection', resourceKey: 'programs', label: L('قائمة البرامج', 'Program listesi', 'Program list') },
      { type: 'content', pageKey: 'programs-page', label: L('نصوص صفحات البرامج', 'Program sayfası metinleri', 'Program page texts') },
    ],
  },
  {
    key: 'news',
    icon: Newspaper,
    label: L('الأخبار', 'Haberler', 'News'),
    description: L(
      'الأخبار في صفحة الأخبار وقسم آخر الأخبار بالصفحة الرئيسية',
      'Haberler sayfasındaki ve ana sayfadaki son haberler',
      'Articles on the news page and in the home page’s latest-news section',
    ),
    route: '/news',
    tone: {
      soft: 'bg-rose-100 text-rose-700',
      solid: 'bg-rose-600 text-white',
      bar: 'bg-rose-500',
      hover: 'hover:border-rose-300',
    },
    parts: [
      { type: 'collection', resourceKey: 'news', label: L('قائمة الأخبار', 'Haber listesi', 'News list') },
      { type: 'content', pageKey: 'news-page', label: pageTexts },
    ],
  },
  {
    key: 'library',
    icon: BookOpen,
    label: L('المكتبة', 'Kütüphane', 'Library'),
    description: L(
      'المقالات والقصص والشخصيات، المستندات (PDF)، ومعرض الصور',
      'Makaleler, hikayeler, belgeler (PDF) ve fotoğraf galerisi',
      'Articles, stories and figures, documents (PDF) and the photo gallery',
    ),
    route: '/library',
    tone: {
      soft: 'bg-blue-100 text-blue-700',
      solid: 'bg-blue-600 text-white',
      bar: 'bg-blue-500',
      hover: 'hover:border-blue-300',
    },
    parts: [
      { type: 'collection', resourceKey: 'library_articles' },
      { type: 'collection', resourceKey: 'library_documents' },
      { type: 'collection', resourceKey: 'gallery_images' },
      { type: 'content', pageKey: 'library-page', label: pageTexts },
    ],
  },
  {
    key: 'participate',
    icon: MessageSquare,
    label: L('شارك معنا', 'Katılım', 'Participate'),
    description: L(
      'نماذج شارك بفكرة والشكاوى والتطوع وصفحة التواصل',
      'Fikir, şikayet ve gönüllü formları ile iletişim sayfası',
      'The share-an-idea, complaints and volunteer forms and the contact page',
    ),
    route: '/participate/share-ideas',
    tone: {
      soft: 'bg-teal-100 text-teal-700',
      solid: 'bg-teal-600 text-white',
      bar: 'bg-teal-500',
      hover: 'hover:border-teal-300',
    },
    parts: [{ type: 'content', pageKey: 'participate', label: pageTexts }],
    inbox: ['submissions', 'subscribers'],
  },
  {
    key: 'donate',
    icon: HandHeart,
    label: L('المساهمة', 'Bağış', 'Donate'),
    description: L(
      'فرص المساهمة، نصوص صفحة المساهمة، وصفحتا الدفع والنتيجة',
      'Bağış fırsatları, bağış sayfası metinleri ve ödeme/sonuç sayfaları',
      'The opportunities, the donate page copy, and the checkout & result pages',
    ),
    route: '/donate',
    tone: {
      soft: 'bg-primary-100 text-primary-700',
      solid: 'bg-primary-600 text-white',
      bar: 'bg-primary-500',
      hover: 'hover:border-primary-300',
    },
    parts: [
      { type: 'collection', resourceKey: 'donation_opportunities', label: L('فرص المساهمة', 'Bağış fırsatları', 'Opportunities') },
      { type: 'content', pageKey: 'donate-page', label: pageTexts },
      { type: 'content', pageKey: 'donate-checkout', label: L('صفحة الدفع والنتيجة', 'Ödeme ve sonuç', 'Checkout & result') },
    ],
    inbox: ['payments'],
  },
  {
    key: 'bank-accounts',
    icon: Banknote,
    label: L('الحسابات البنكية', 'Banka hesapları', 'Bank accounts'),
    description: L(
      'البنوك وأرقام الآيبان ونصوص صفحة الحسابات البنكية',
      'Bankalar, IBAN numaraları ve sayfanın metinleri',
      'The banks, their IBANs and the page’s texts',
    ),
    route: '/bank-accounts',
    tone: {
      soft: 'bg-cyan-100 text-cyan-700',
      solid: 'bg-cyan-600 text-white',
      bar: 'bg-cyan-500',
      hover: 'hover:border-cyan-300',
    },
    parts: [
      { type: 'collection', resourceKey: 'bank_accounts', label: L('البنوك والأرقام', 'Bankalar ve numaralar', 'Banks & numbers') },
      { type: 'content', pageKey: 'bank-accounts-page', label: pageTexts },
    ],
  },
  {
    key: 'settings',
    icon: Settings2,
    label: L('إعدادات الموقع', 'Site ayarları', 'Site settings'),
    description: L(
      'ما يتكرر في كل الصفحات: القائمة العلوية، أسفل الموقع، بيانات التواصل',
      'Her sayfada tekrarlanan: üst menü, alt bilgi, iletişim bilgileri',
      'What repeats on every page: the header menu, the footer, contact details',
    ),
    route: '/',
    tone: {
      soft: 'bg-slate-200 text-slate-700',
      solid: 'bg-slate-700 text-white',
      bar: 'bg-slate-400',
      hover: 'hover:border-slate-400',
    },
    parts: [{ type: 'content', pageKey: 'settings', label: L('كل الإعدادات', 'Tüm ayarlar', 'All settings') }],
  },
];

export function getArea(key: string | undefined): SiteArea | undefined {
  return SITE_AREAS.find((area) => area.key === key);
}

/** URL segment of a hub tab. */
export function partKey(part: AreaPart): string {
  return part.type === 'content' ? part.pageKey : part.resourceKey;
}

export function areaForPage(pageKey: string): { area: SiteArea; part: AreaPart } | undefined {
  for (const area of SITE_AREAS) {
    const part = area.parts.find((entry) => entry.type === 'content' && entry.pageKey === pageKey);
    if (part) return { area, part };
  }
  return undefined;
}

export function areaForResource(resourceKey: string): { area: SiteArea; part: AreaPart } | undefined {
  for (const area of SITE_AREAS) {
    const part = area.parts.find((entry) => entry.type === 'collection' && entry.resourceKey === resourceKey);
    if (part) return { area, part };
  }
  return undefined;
}

/** Address of a hub, one of its tabs, or a tab in a given editing language. */
export function hubPath(area: SiteArea, part?: AreaPart, locale?: Locale): string {
  if (!part) return `/admin/site/${area.key}`;
  const base = `/admin/site/${area.key}/${partKey(part)}`;
  return part.type === 'content' && locale ? `${base}/${locale}` : base;
}
