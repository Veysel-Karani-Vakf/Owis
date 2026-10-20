import { useEffect, useMemo, useState } from 'react';
import { useCmsVersion } from '@/cms/CmsProvider';
import { getDonateContent, type DonatePageContent } from '@/data/donate';
import {
  getDocuments,
  getGalleryImages,
  getLibraryContent,
  getTextItems,
  type LibraryDocumentCollectionSlug,
  type LibraryTextCollectionSlug,
} from '@/data/library';
import { getNewsArticles } from '@/data/news';
import { getProgramsContent, type ProgramsPageContent } from '@/data/programs';
import { applyHomeProjectImages, getProjectsContent, type ProjectsPageContent } from '@/data/projects';
import type { Locale } from '@/i18n/content';
import type { Partner, Program, Project } from '@/i18n/content';
import {
  loadDonationOpportunities,
  loadGalleryImages,
  loadLibraryDocuments,
  loadLibraryTextItems,
  loadNewsArticles,
  loadPartners,
  loadProgramRows,
  loadProjectRows,
  loadStatIndicators,
  mapProgramRow,
  mapProgramRowToHome,
  mapProjectRow,
  mapProjectRowToHome,
} from '@/services/cmsContent';
import type { StatRow } from '@/lib/types';

const EMPTY_HOME_PROJECTS: Project[] = [];

function useCmsValue<T>(fallback: T, load: () => Promise<T | null>, deps: unknown[]) {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    setValue(fallback);

    load()
      .then((next) => {
        if (!cancelled && next !== null) setValue(next);
      })
      .catch(() => {
        if (!cancelled) setValue(fallback);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return value;
}

export function useNewsArticles(locale: Locale) {
  const cmsVersion = useCmsVersion();
  const fallback = useMemo(() => getNewsArticles(locale), [locale, cmsVersion]);
  return useCmsValue(fallback, () => loadNewsArticles(locale), [locale, fallback]);
}

export function useProjectsContent(
  locale: Locale,
  homeProjects: Project[] = EMPTY_HOME_PROJECTS
): ProjectsPageContent {
  const cmsVersion = useCmsVersion();
  const fallback = useMemo(() => {
    const page = getProjectsContent(locale);
    return {
      ...page,
      projects: applyHomeProjectImages(page.projects, homeProjects),
    };
  }, [locale, homeProjects, cmsVersion]);

  return useCmsValue(
    fallback,
    async () => {
      const rows = await loadProjectRows();
      return rows
        ? {
            ...fallback,
            projects: applyHomeProjectImages(
              rows.map((row) => mapProjectRow(row, locale)),
              homeProjects
            ),
          }
        : null;
    },
    [locale, fallback, homeProjects]
  );
}

export function useHomeProjects(locale: Locale, fallbackProjects: Project[]) {
  return useCmsValue(
    fallbackProjects,
    async () => {
      const rows = await loadProjectRows();
      return rows ? rows.map((row) => mapProjectRowToHome(row, locale)) : null;
    },
    [locale, fallbackProjects]
  );
}

export function useProgramsContent(locale: Locale): ProgramsPageContent {
  const cmsVersion = useCmsVersion();
  const fallback = useMemo(() => getProgramsContent(locale), [locale, cmsVersion]);

  return useCmsValue(
    fallback,
    async () => {
      const rows = await loadProgramRows();
      return rows ? { ...fallback, programs: rows.map((row) => mapProgramRow(row, locale)) } : null;
    },
    [locale, fallback]
  );
}

export function useHomePrograms(locale: Locale, fallbackPrograms: Program[]) {
  return useCmsValue(
    fallbackPrograms,
    async () => {
      const rows = await loadProgramRows();
      return rows ? rows.map((row) => mapProgramRowToHome(row, locale)) : null;
    },
    [locale, fallbackPrograms]
  );
}

export function useDonateContent(locale: Locale): DonatePageContent {
  const cmsVersion = useCmsVersion();
  const fallback = useMemo(() => getDonateContent(locale), [locale, cmsVersion]);

  return useCmsValue(
    fallback,
    async () => {
      const opportunities = await loadDonationOpportunities(locale);
      return opportunities ? { ...fallback, opportunities } : null;
    },
    [locale, fallback]
  );
}

export function usePartners(locale: Locale, fallbackPartners: Partner[]) {
  return useCmsValue(fallbackPartners, () => loadPartners(locale), [locale, fallbackPartners]);
}

export function useStatIndicators<T extends { label: string; value: number | null; suffix?: string; detail?: string }>(
  locale: Locale,
  group: StatRow['stat_group'],
  fallbackIndicators: T[]
) {
  return useCmsValue(
    fallbackIndicators,
    async () => {
      const rows = await loadStatIndicators(locale, group);
      return rows ? (rows as T[]) : null;
    },
    [locale, group, fallbackIndicators]
  );
}

export function useLibraryTextItems(locale: Locale, collection: LibraryTextCollectionSlug) {
  const fallback = useMemo(() => getTextItems(locale, collection), [collection, locale]);
  return useCmsValue(fallback, () => loadLibraryTextItems(locale, collection), [locale, collection, fallback]);
}

export function useLibraryDocuments(locale: Locale, collection: LibraryDocumentCollectionSlug) {
  const library = useMemo(() => getLibraryContent(locale), [locale]);
  const cmsVersion = useCmsVersion();
  const fallback = useMemo(() => {
    const info = library.collections[collection];
    return info.documentCollection ? getDocuments(info.documentCollection) : [];
  }, [collection, library, cmsVersion]);

  return useCmsValue(fallback, () => loadLibraryDocuments(locale, collection), [locale, collection, fallback]);
}

export function useGalleryImages(locale: Locale) {
  const fallback = useMemo(() => getGalleryImages(), []);
  return useCmsValue(fallback, () => loadGalleryImages(locale), [locale, fallback]);
}
