// Shared CMS types mirroring the Supabase schema.

export type Locale = 'ar' | 'tr' | 'en';
export const LOCALES: Locale[] = ['ar', 'tr', 'en'];

/** Localized text stored as jsonb: { ar, tr, en } (any key may be missing). */
export type Localized = Partial<Record<Locale, string>>;
/** Localized paragraph arrays: { ar: string[], ... }. */
export type LocalizedList = Partial<Record<Locale, string[]>>;

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
  gallery: unknown[];
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
  facts: unknown[];
  official_contribution_url: string | null;
  official_source_url: string | null;
  returns_title: Localized;
  returns_intro: Localized;
  return_uses: LocalizedList;
  allocations: unknown[];
  video: unknown | null;
  cta_title: Localized;
  cta_description: Localized;
};

export type ProgramRow = BaseRow & {
  slug: string;
  route: string | null;
  title: Localized;
  summary: Localized;
  hero_image: string | null;
  hero_image_alt: Localized;
  images: string[];
  image_gallery: unknown[];
  sections: unknown[];
  goals: LocalizedList;
  components: LocalizedList;
  statistics: unknown[];
  videos: unknown[];
  contact_email: string | null;
  initiatives: unknown[];
  cities: unknown[];
  journey: unknown[];
  pillars: unknown[];
  highlights: LocalizedList;
  phase: unknown | null;
  audiences: unknown[];
  themes: unknown[];
  overview_image: string | null;
  overview_image_alt: Localized;
  official_source_url: string | null;
  seo: Record<string, unknown>;
  cta: Record<string, unknown>;
  media_note: Localized;
};

export type LibraryArticleRow = BaseRow & {
  collection: 'forum' | 'success-stories';
  slug: string;
  route: string | null;
  title: Localized;
  original_title: string | null;
  source_url: string | null;
  source_language: string | null;
  date: string | null;
  year: number | null;
  excerpt: Localized;
  image: string | null;
  image_alt: Localized;
  content: LocalizedList;
};

export type LibraryDocumentRow = BaseRow & {
  collection: 'periodic-reports' | 'waqf-books' | 'waqf-literature' | 'yemeni-figures';
  title: Localized;
  source_url: string | null;
  pdf_url: string | null;
  date: string | null;
  year: number | null;
  excerpt: Localized;
  image: string | null;
  image_alt: Localized;
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

export type StatRow = BaseRow & {
  stat_group: 'yemen-pioneers' | 'statistics';
  label: Localized;
  value: number | null;
  suffix: Localized;
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
