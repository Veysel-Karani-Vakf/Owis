import {
  Award,
  CalendarCheck2,
  Compass,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  HeartPulse,
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
  ImagePlus,
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

/** Soft per-field tints for the category cards (chip, icon ink and the card's landscape waves). */
export type AwardTint = { chip: string; ink: string; wave: string; waveDeep: string; edge: string };

export const categoryTints: Record<AwardCategoryId, AwardTint> = {
  education: { chip: '#ece7f7', ink: '#5b4b9a', wave: '#e6e0f5', waveDeep: '#d8cfef', edge: 'rgba(91,75,154,0.32)' },
  health: { chip: '#fbe9e7', ink: '#a8473e', wave: '#f8e3e0', waveDeep: '#f1d0cb', edge: 'rgba(168,71,62,0.3)' },
  environment: { chip: '#e2f0e5', ink: '#2e7a4b', wave: '#dcede1', waveDeep: '#c8e2cf', edge: 'rgba(46,122,75,0.32)' },
  empowerment: { chip: '#e3edf8', ink: '#2f6699', wave: '#dde8f6', waveDeep: '#cadcf1', edge: 'rgba(47,102,153,0.3)' },
  development: { chip: '#f5ebd8', ink: '#8f6631', wave: '#f2e6cf', waveDeep: '#e8d5b1', edge: 'rgba(143,102,49,0.32)' },
};
