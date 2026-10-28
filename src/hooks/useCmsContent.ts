import { useMemo } from 'react';
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
import type { Locale, Partner, Program, Project } from '@/i18n/content';
import type { StatRow } from '@/lib/types';

const EMPTY_HOME_PROJECTS: Project[] = [];

export function useNewsArticles(locale: Locale) {
  const cmsVersion = useCmsVersion();
  return useMemo(() => getNewsArticles(locale), [locale, cmsVersion]);
}

export function useProjectsContent(
  locale: Locale,
  homeProjects: Project[] = EMPTY_HOME_PROJECTS,
): ProjectsPageContent {
  const cmsVersion = useCmsVersion();
  return useMemo(() => {
    const page = getProjectsContent(locale);
    return {
      ...page,
      projects: applyHomeProjectImages(page.projects, homeProjects),
    };
  }, [locale, homeProjects, cmsVersion]);
}

export function useHomeProjects(_locale: Locale, fallbackProjects: Project[]) {
  return fallbackProjects;
}

export function useProgramsContent(locale: Locale): ProgramsPageContent {
  const cmsVersion = useCmsVersion();
  return useMemo(() => getProgramsContent(locale), [locale, cmsVersion]);
}

export function useHomePrograms(_locale: Locale, fallbackPrograms: Program[]) {
  return fallbackPrograms;
}

export function useDonateContent(locale: Locale): DonatePageContent {
  const cmsVersion = useCmsVersion();
  return useMemo(() => getDonateContent(locale), [locale, cmsVersion]);
}

export function usePartners(_locale: Locale, fallbackPartners: Partner[]) {
  return fallbackPartners;
}

export function useStatIndicators<
  T extends { label: string; value: number | null; suffix?: string; detail?: string },
>(_locale: Locale, _group: StatRow['stat_group'], fallbackIndicators: T[]) {
  return fallbackIndicators;
}

export function useLibraryTextItems(locale: Locale, collection: LibraryTextCollectionSlug) {
  const cmsVersion = useCmsVersion();
  return useMemo(() => getTextItems(locale, collection), [collection, locale, cmsVersion]);
}

export function useLibraryDocuments(locale: Locale, collection: LibraryDocumentCollectionSlug) {
  const cmsVersion = useCmsVersion();
  return useMemo(() => {
    const library = getLibraryContent(locale);
    const info = library.collections[collection];
    return info.documentCollection ? getDocuments(info.documentCollection, locale) : [];
  }, [collection, locale, cmsVersion]);
}

export function useGalleryImages(locale: Locale) {
  const cmsVersion = useCmsVersion();
  return useMemo(() => getGalleryImages(locale), [locale, cmsVersion]);
}
