// Shared CMS types mirroring the Supabase schema.

export type Locale = 'ar' | 'tr' | 'en';
export const LOCALES: Locale[] = ['ar', 'tr', 'en'];

/** Localized text stored as jsonb: { ar, tr, en } (any key may be missing). */
export type Localized = Partial<Record<Locale, string>>;
/** Localized paragraph arrays: { ar: string[], ... }. */
export type LocalizedList = Partial<Record<Locale, string[]>>;
/**
 * A repeating group stored once per language: { ar: T[], tr: T[], en: T[] }.
 * This is what the dashboard's repeater controls write and what the seed emits.
 */
export type LocalizedRepeater<T = Record<string, unknown>> = Partial<Record<Locale, T[]>>;
/** A single object stored once per language: { ar: T, tr: T, en: T }. */
export type LocalizedGroup<T = Record<string, unknown>> = Partial<Record<Locale, T>>;

/** Page layouts a program record can ask for; NULL means "decide by slug". */
export type ProgramLayout = 'generic' | 'pioneers' | 'volunteer' | 'institutional' | 'awareness';

export type BaseRow = {
  id: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type NewsRow = BaseRow & {
  slug: string;
  source_slug: string | null;
  source_url: string | null;
  published_at: string | null;
  year: number | null;
  source_language: string | null;
  featured: boolean;
  category: Localized;
  title: Localized;
  excerpt: Localized;
  content: LocalizedList;
  image: string | null;
  image_alt: Localized;
  gallery: LocalizedRepeater | unknown[];
  source_images: string[];
};

export type ProjectRow = BaseRow & {
  slug: string;
  route: string | null;
  title: Localized;
  category: Localized;
  short_description: Localized;
  full_description: LocalizedList;
  image: string | null;
  image_alt: Localized;
  image_scale: number | null;
  contribution_value: Localized;
  unit_amount: number | null;
  facts: LocalizedRepeater | unknown[];
  official_contribution_url: string | null;
  official_source_url: string | null;
  returns_title: Localized;
  returns_intro: Localized;
  return_uses: LocalizedList;
  allocations: LocalizedRepeater | unknown[];
  /** { ar: { title, buttonLabel, videoId, sourceUrl, videoFile?, posterImage? }, … } */
  video: LocalizedGroup | null;
  cta_title: Localized;
  cta_description: Localized;
  /** { ar: { title, description }, … } */
  seo: LocalizedGroup;
};

export type ProgramRow = BaseRow & {
  slug: string;
  route: string | null;
  title: Localized;
  summary: Localized;
  hero_image: string | null;
  hero_image_alt: Localized;
  images: string[];
  image_gallery: LocalizedRepeater | unknown[];
  sections: LocalizedRepeater | unknown[];
  goals: LocalizedList;
  components: LocalizedList;
  statistics: LocalizedRepeater | unknown[];
  videos: LocalizedRepeater | unknown[];
  contact_email: string | null;
  contact_phone: string | null;
  initiatives: LocalizedRepeater | unknown[];
  cities: LocalizedRepeater | unknown[];
  journey: LocalizedRepeater | unknown[];
  pillars: LocalizedRepeater | unknown[];
  highlights: LocalizedList;
  phase: LocalizedGroup | null;
  audiences: LocalizedRepeater | unknown[];
  themes: LocalizedRepeater | unknown[];
  overview_image: string | null;
  overview_image_alt: Localized;
  official_source_url: string | null;
  seo: LocalizedGroup;
  cta: LocalizedGroup;
  media_note: Localized;
  /** Volunteer-unit copy block, per language (see VolunteerCopy in data/programs). */
  volunteer: LocalizedGroup | null;
  /** Community-awareness media formats, per language arrays. */
  media_products: LocalizedRepeater | unknown[];
  /** Community-awareness featured event, per language. */
  spotlight: LocalizedGroup | null;
  layout: ProgramLayout | null;
};

export type LibraryArticleRow = BaseRow & {
  collection: 'forum' | 'success-stories' | 'yemeni-figures';
  slug: string;
  route: string | null;
  title: Localized;
  original_title: string | null;
  source_url: string | null;
  pdf_url: string | null;
  source_language: string | null;
  date: string | null;
  year: number | null;
  excerpt: Localized;
  image: string | null;
  image_alt: Localized;
  content: LocalizedList;
};

export type LibraryDocumentRow = BaseRow & {
  collection: 'periodic-reports' | 'waqf-books' | 'waqf-literature';
  title: Localized;
  source_url: string | null;
  pdf_url: string | null;
  date: string | null;
  year: number | null;
  excerpt: Localized;
  image: string | null;
  image_alt: Localized;
  /** Series/issue family name shown as a filter chip, e.g. "Owais in numbers". */
  series: Localized;
};

export type GalleryImageRow = BaseRow & {
  title: Localized;
  image: string | null;
  thumbnail: string | null;
  source_url: string | null;
  image_alt: Localized;
  width: number | null;
  height: number | null;
};

export type DonationRow = BaseRow & {
  slug: string;
  title: Localized;
  description: Localized;
  price: Localized;
  image: string | null;
  image_alt: Localized;
  url: string | null;
  available: boolean;
};

export type PartnerRow = BaseRow & {
  name: Localized;
  logo: string | null;
  url: string | null;
};

export type BankAccountRow = BaseRow & {
  slug: string;
  /** Bank details read the same in every language, so nothing here is localized. */
  name: string | null;
  monogram: string | null;
  logo: string | null;
  brand_color: string | null;
  branch: string | null;
  swift: string | null;
  account_number: string | null;
  /** [{ currency, iban, accountNumber }] */
  accounts: unknown;
};

export type StatRow = BaseRow & {
  stat_group: 'yemen-pioneers' | 'statistics';
  label: Localized;
  value: number | null;
  suffix: Localized;
  /** Sentence shown on the back of the flip card. */
  detail: Localized;
  /** Name of the icon drawn on the card (see `iconRegistry` in the components). */
  icon: string | null;
};

export type SitePageRow = {
  key: string;
  label: Localized;
  data: Record<string, unknown>;
  updated_at: string;
};

export type SubmissionRow = {
  id: string;
  form_id: string | null;
  source_url: string | null;
  payload: Record<string, unknown>;
  files: unknown[];
  status: 'new' | 'read' | 'archived';
  created_at: string;
};

export type SubscriberRow = {
  id: string;
  email: string;
  locale: string | null;
  created_at: string;
};
