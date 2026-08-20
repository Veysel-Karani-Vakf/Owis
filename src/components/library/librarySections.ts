import { BookOpen, FileText, Images, Newspaper, ScrollText, Trophy, Users } from 'lucide-react';
import type { LibraryCollectionSlug } from '@/data/library';

export const librarySectionOrder = [
  'forum',
  'periodic-reports',
  'waqf-books',
  'waqf-literature',
  'yemeni-figures',
  'success-stories',
  'gallery',
] as const;

export const librarySectionIcons = {
  forum: Newspaper,
  'periodic-reports': FileText,
  'waqf-books': BookOpen,
  'waqf-literature': ScrollText,
  'yemeni-figures': Users,
  'success-stories': Trophy,
  gallery: Images,
} as const satisfies Record<LibraryCollectionSlug | 'gallery', unknown>;
