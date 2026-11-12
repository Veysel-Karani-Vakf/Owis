import {
  Award,
  CalendarCheck2,
  Compass,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  HeartPulse,
  ImagePlus,
  LayoutGrid,
  ListChecks,
  PenLine,
  Route,
  Send,
  Shapes,
  Sparkles,
  Sprout,
  Target,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import type {
  AwardCategoryId,
  AwardConditionId,
  AwardLandingSection,
  AwardPillarId,
  AwardStepId,
} from '@/data/award/content';

export const categoryIcons: Record<AwardCategoryId, LucideIcon> = {
  education: GraduationCap,
  health: HeartPulse,
  environment: Sprout,
  empowerment: HandHeart,
  development: Shapes,
};

export const conditionIcons: Record<AwardConditionId, LucideIcon> = {
  'yemeni-team': UsersRound,
  'inside-yemen': CalendarCheck2,
  voluntary: HeartHandshake,
  'development-field': Target,
  independent: Compass,
};

export const stepIcons: Record<AwardStepId, LucideIcon> = {
  read: ListChecks,
  form: PenLine,
  support: ImagePlus,
  submit: Send,
};

export const pillarIcons: Record<AwardPillarId, LucideIcon> = {
  celebrate: Award,
  impact: Sparkles,
  sustain: Sprout,
};

export const quickLinkIcons: Record<AwardLandingSection, LucideIcon> = {
  about: Award,
  categories: LayoutGrid,
  eligibility: ListChecks,
  steps: Route,
  faq: Sparkles,
};

/**
 * Icon of a landing item by its `id`. The dashboard can add items and change
 * their icon choice; an id the maps do not know gets a neutral icon.
 */
function pick<K extends string>(icons: Record<K, LucideIcon>, fallback: LucideIcon) {
  return (id: string): LucideIcon => (icons as Record<string, LucideIcon | undefined>)[id] ?? fallback;
}

export const categoryIcon = pick(categoryIcons, Shapes);
export const conditionIcon = pick(conditionIcons, ListChecks);
export const stepIcon = pick(stepIcons, PenLine);
export const pillarIcon = pick(pillarIcons, Award);
export const quickLinkIcon = pick(quickLinkIcons, Sparkles);
