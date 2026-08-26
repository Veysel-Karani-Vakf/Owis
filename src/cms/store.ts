// Module-level CMS snapshot.
//
// The site's data accessors (`getProjectsContent`, `getAboutContent`, …) are
// plain functions called during render, so the snapshot lives outside React and
// is read synchronously. `CmsProvider` owns hydration and notifies React.

import type {
  DonationRow,
  GalleryImageRow,
  LibraryArticleRow,
  LibraryDocumentRow,
  NewsRow,
  PartnerRow,
  ProgramRow,
  ProjectRow,
  StatRow,
} from '@/lib/types';

export type CmsTables = {
  news: NewsRow[];
  projects: ProjectRow[];
  programs: ProgramRow[];
  library_articles: LibraryArticleRow[];
  library_documents: LibraryDocumentRow[];
  gallery_images: GalleryImageRow[];
  donation_opportunities: DonationRow[];
  partners: PartnerRow[];
  stat_indicators: StatRow[];
};

export type CmsPages = Record<string, Record<string, unknown>>;

export type CmsSnapshot = {
  tables: Partial<CmsTables>;
  pages: CmsPages;
};

const EMPTY: CmsSnapshot = { tables: {}, pages: {} };

/** Content loaded from Supabase. */
let published: CmsSnapshot = EMPTY;
/** Unsaved dashboard edits, pushed into the preview frame over postMessage. */
let draft: CmsSnapshot | null = null;
/** Merged view; recomputed whenever either layer changes. */
let effective: CmsSnapshot = EMPTY;
let version = 0;

const listeners = new Set<() => void>();

function recompute() {
  if (!draft) {
    effective = published;
  } else {
    effective = {
      tables: { ...published.tables, ...draft.tables },
      pages: { ...published.pages, ...draft.pages },
    };
  }
  version += 1;
  listeners.forEach((fn) => fn());
}

/** Current merged snapshot. Never null — empty until hydration completes. */
export function getCms(): CmsSnapshot {
  return effective;
}

export function getCmsVersion(): number {
  return version;
}

export function setPublished(next: CmsSnapshot) {
  published = next;
  recompute();
}

/** Replaces the preview layer. Pass `null` to drop back to published content. */
export function setDraft(next: CmsSnapshot | null) {
  draft = next;
  recompute();
}

export function subscribeCms(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Rows for a table, or `null` when the table was never loaded (offline or a
 * failed fetch), which the adapters read as "use the static defaults".
 *
 * A table that loaded with zero published rows returns `[]`: an editor who
 * unpublishes everything in a list means it to be empty, not to fall back to
 * the copy that ships in this repo.
 */
export function cmsRows<K extends keyof CmsTables>(table: K): CmsTables[K] | null {
  const rows = effective.tables[table];
  return rows ? (rows as CmsTables[K]) : null;
}

/** Stored data for a site page, or `null` when unset. */
export function cmsPage(key: string): Record<string, unknown> | null {
  const page = effective.pages[key];
  return page && Object.keys(page).length ? page : null;
}
