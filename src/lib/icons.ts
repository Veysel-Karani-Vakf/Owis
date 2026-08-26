// Named icon registry shared by the dashboard's icon picker and the site's
// components. Editors pick a name; components resolve it here and fall back to
// whatever they used to show when a record carries no icon.

import {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clapperboard,
  Coins,
  Compass,
  Eye,
  FileText,
  Flag,
  Globe2,
  GraduationCap,
  Handshake,
  HeartHandshake,
  History,
  Images,
  Landmark,
  Layers3,
  Leaf,
  Lightbulb,
  Mail,
  MapPin,
  Megaphone,
  MessagesSquare,
  Mic,
  Newspaper,
  PenLine,
  Phone,
  PieChart,
  Puzzle,
  Rocket,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Telescope,
  TrendingUp,
  Trophy,
  UserSearch,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react';

export const ICON_REGISTRY = {
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  users: Users,
  globe: Globe2,
  'trending-up': TrendingUp,
  'heart-handshake': HeartHandshake,
  briefcase: Briefcase,
  landmark: Landmark,
  'file-text': FileText,
  shield: ShieldCheck,
  coins: Coins,
  check: CheckCircle2,
  compass: Compass,
  rocket: Rocket,
  telescope: Telescope,
  award: Award,
  mic: Mic,
  clapperboard: Clapperboard,
  'messages-square': MessagesSquare,
  'pen-line': PenLine,
  history: History,
  eye: Eye,
  building: Building2,
  sparkles: Sparkles,
  target: Target,
  lightbulb: Lightbulb,
  handshake: Handshake,
  star: Star,
  calendar: Calendar,
  'map-pin': MapPin,
  phone: Phone,
  mail: Mail,
  video: Video,
  images: Images,
  newspaper: Newspaper,
  'scroll-text': ScrollText,
  trophy: Trophy,
  layers: Layers3,
  'bar-chart': BarChart3,
  'pie-chart': PieChart,
  leaf: Leaf,
  flag: Flag,
  megaphone: Megaphone,
  'user-search': UserSearch,
  puzzle: Puzzle,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICON_REGISTRY;

export const ICON_NAMES = Object.keys(ICON_REGISTRY) as IconName[];

export function isIconName(value: unknown): value is IconName {
  return typeof value === 'string' && value in ICON_REGISTRY;
}

/** The icon for a stored name, or `undefined` when unset/unknown. */
export function iconByName(name: unknown): LucideIcon | undefined {
  return isIconName(name) ? ICON_REGISTRY[name] : undefined;
}

/**
 * Resolves an item's icon: the editor's choice when present, otherwise the
 * component's own default for that position (cycling so a long list never
 * runs past the end of the default set).
 */
export function resolveIcon(name: unknown, defaults: LucideIcon[], index: number): LucideIcon {
  return iconByName(name) ?? defaults[index % Math.max(defaults.length, 1)];
}
