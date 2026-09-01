// The landing screen: one card per public page of the site (the same list as
// the sidebar), a few honest numbers, and the latest activity. Every card is
// a single link — the details live inside the page's own hub, not here.

import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  Inbox,
  Images,
  Database,
  CheckCircle,
  FileEdit,
  Users,
  Clock,
  ArrowUpLeft,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/i18n/useI18n';
import type { Locale, SubmissionRow } from '@/lib/types';
import { getParticipateContent } from '@/data/participate';
import { useAdminStrings } from '../hooks/useAdmin';
import { adminStrings } from '../i18n';
import { RESOURCES } from '../lib/resources';
import { getPageDef } from '../lib/pageSchema';
import { SITE_AREAS, areaForPage, areaForResource, hubPath, partKey, type AreaPart } from '../lib/siteMap';
import { getResource } from '../lib/resources';
import { listRows, pickLocalized } from '../lib/api';

// --- data helpers -----------------------------------------------------------

/** Head-only count so the dashboard never downloads whole tables. */
async function countWhere(table: string, column: string, value: unknown): Promise<number> {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true }).eq(column, value);
  if (error) return 0;
  return count ?? 0;
}

async function countAll(table: string): Promise<number> {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  if (error) return 0;
  return count ?? 0;
}

type RecentEdit = {
  id: string;
  title: string;
  updatedAt: string;
  /** Sidebar name of the page the item belongs to. */
  area: string;
  to: string;
};

/** Latest six edits across every record table plus the site pages. */
async function loadRecentEdits(locale: Locale): Promise<RecentEdit[]> {
  const strings = adminStrings[locale];
  const perTable = await Promise.all([
    ...RESOURCES.map(async (resource) => {
      const { data, error } = await supabase
        .from(resource.table)
        .select(`id, updated_at, ${resource.titleField}`)
        .order('updated_at', { ascending: false })
        .limit(6);
      if (error || !data) return [] as RecentEdit[];
      const owner = areaForResource(resource.key);
      return (data as unknown as Record<string, unknown>[]).map<RecentEdit>((row) => ({
        id: String(row.id),
        title: pickLocalized(row[resource.titleField], locale) || '—',
        updatedAt: String(row.updated_at ?? ''),
        area: owner?.area.label[locale] ?? strings.sections[resource.labelKey] ?? resource.key,
        to: `/admin/r/${resource.key}/${row.id}`,
      }));
    }),
    (async () => {
      const { data, error } = await supabase
        .from('site_pages')
        .select('key, updated_at')
        // The assistant-ai config row has no owning area; keep it from
        // consuming one of the six recent-edit slots.
        .neq('key', 'assistant-ai')
        .order('updated_at', { ascending: false })
        .limit(6);
      if (error || !data) return [] as RecentEdit[];
      return (data as { key: string; updated_at: string }[]).flatMap<RecentEdit>((row) => {
        const owner = areaForPage(row.key);
        if (!owner) return [];
        return [
          {
            id: row.key,
            title: getPageDef(row.key)?.label[locale] ?? row.key,
            updatedAt: row.updated_at ?? '',
            area: owner.area.label[locale],
            to: hubPath(owner.area, owner.part, locale),
          },
        ];
      });
    })(),
  ]);
  return perTable
    .flat()
    .filter((edit) => edit.updatedAt)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6);
}

/** "12 Mar 2026, 14:32" in the dashboard's language. */
function formatDate(iso: string, locale: Locale) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(locale === 'ar' ? 'ar' : locale === 'tr' ? 'tr-TR' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// --- page-card animations ---------------------------------------------------

const cardEase = [0.22, 1, 0.36, 1] as const;

const cardGridVariants: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.08, staggerChildren: 0.06 } },
  reduced: { transition: { delayChildren: 0, staggerChildren: 0 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: cardEase } },
  reduced: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.01 } },
};

export default function DashboardPage() {
  const strings = useAdminStrings();
  const { locale } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const [published, setPublished] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<number | null>(null);
  /** Published rows per resource — shown as a count badge on each page card. */
  const [countsByResource, setCountsByResource] = useState<Record<string, number> | null>(null);
  /** Resource key holding the most drafts — where the drafts tile sends the editor. */
  const [draftsKey, setDraftsKey] = useState<string | null>(null);
  const [newCount, setNewCount] = useState<number | null>(null);
  const [subscribers, setSubscribers] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [recent, setRecent] = useState<RecentEdit[]>([]);

  const label = (ar: string, tr: string, en: string) => (locale === 'ar' ? ar : locale === 'tr' ? tr : en);

  const isRtl = locale === 'ar';
  // The hover arrow points "into" the page it opens, following the reading direction.
  const HoverArrow = isRtl ? ArrowUpLeft : ArrowUpRight;
  const cardsState = shouldReduceMotion ? 'reduced' : 'show';

  const partLabel = (part: AreaPart): string => {
    if (part.label) return part.label[locale];
    if (part.type === 'content') return strings.pageTexts;
    const resource = getResource(part.resourceKey);
    return (resource && strings.sections[resource.labelKey]) ?? part.resourceKey;
  };

  useEffect(() => {
    let active = true;

    Promise.all(
      RESOURCES.map(async (resource) => ({
        key: resource.key,
        published: await countWhere(resource.table, 'is_published', true),
        drafts: await countWhere(resource.table, 'is_published', false),
      })),
    ).then((pairs) => {
      if (!active) return;
      setPublished(pairs.reduce((sum, p) => sum + p.published, 0));
      setDrafts(pairs.reduce((sum, p) => sum + p.drafts, 0));
      setCountsByResource(Object.fromEntries(pairs.map((p) => [p.key, p.published])));
      const top = pairs.reduce<(typeof pairs)[number] | null>((best, p) => (p.drafts > (best?.drafts ?? 0) ? p : best), null);
      setDraftsKey(top?.key ?? null);
    });

    countWhere('participate_submissions', 'status', 'new').then((n) => active && setNewCount(n));
    countAll('newsletter_subscribers').then((n) => active && setSubscribers(n));

    listRows('participate_submissions', { sort: { column: 'created_at', ascending: false } })
      .then((rows) => active && setSubmissions((rows as SubmissionRow[]).slice(0, 6)))
      .catch(() => undefined);

    loadRecentEdits(locale).then((edits) => active && setRecent(edits));

    return () => {
      active = false;
    };
  }, [locale]);

  // Submissions carry the form id ("volunteer"); the editor knows the page by
  // its hero title, which may itself have been edited in the CMS.
  const participatePages = Object.values(getParticipateContent(locale).pages);
  const formName = (formId: string | null) => {
    if (!formId) return '';
    const page = participatePages.find((p) => p.form?.id === formId || p.slug === formId || p.key === formId);
    return page?.hero.title ?? formId;
  };

  const stat = (
    icon: LucideIcon,
    tone: string,
    title: string,
    value: number | null,
    hint: string,
    to?: string,
  ) => {
    const Icon = icon;
    const inner = (
      <>
        <div className="mb-3 flex items-center gap-3">
          <span className={'flex h-9 w-9 items-center justify-center rounded-lg ' + tone}>
            <Icon size={18} />
          </span>
          <span className="text-xs font-semibold uppercase text-slate-400">{title}</span>
        </div>
        <p className="text-3xl font-bold tabular-nums text-slate-900">{value === null ? '…' : value.toLocaleString(locale)}</p>
        <p className="mt-2 text-xs text-slate-500">{hint}</p>
      </>
    );
    const cls = 'block h-full rounded-xl border border-slate-200 bg-white p-5 transition';
    return (
      <motion.div
        variants={cardVariants}
        whileHover={to && !shouldReduceMotion ? { y: -3 } : undefined}
        transition={{ type: 'spring', stiffness: 340, damping: 26 }}
      >
        {to ? (
          <Link to={to} className={cls + ' hover:border-slate-300 hover:shadow-md'}>
            {inner}
          </Link>
        ) : (
          <div className={cls}>{inner}</div>
        )}
      </motion.div>
    );
  };

  const panel = (icon: LucideIcon, title: string, action: ReactNode, children: ReactNode) => {
    const Icon = icon;
    return (
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
          <Icon size={17} className="text-slate-400" />
          <h2 className="font-semibold text-slate-800">{title}</h2>
          <span className="ms-auto">{action}</span>
        </div>
        {children}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {label('ماذا تريد أن تعدّل اليوم؟', 'Bugün neyi düzenlemek istiyorsunuz?', 'What would you like to edit today?')}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {label(
            'كل صفحة من صفحات الموقع لها بطاقة هنا وبند في القائمة الجانبية — افتحها لتجد كل ما يخصها في مكان واحد.',
            'Sitenin her sayfasının burada bir kartı ve kenar çubuğunda bir maddesi var — açın, o sayfaya ait her şeyi tek yerde bulun.',
            'Every page of the site has a card here and an item in the sidebar — open it to find everything about that page in one place.',
          )}
        </p>
      </div>

      {/* One card per public page; the whole card is a single link. Each page
          keeps one identity colour (bar + icon) that follows it everywhere —
          sidebar, this grid, its hub — so colours become a map of the site. */}
      <motion.div
        variants={cardGridVariants}
        initial={shouldReduceMotion ? 'reduced' : 'hidden'}
        animate={cardsState}
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {SITE_AREAS.map((area) => {
          const Icon = area.icon;
          const collectionKeys = area.parts.flatMap((part) =>
            part.type === 'collection' ? [part.resourceKey] : [],
          );
          const itemCount =
            countsByResource && collectionKeys.length > 0
              ? collectionKeys.reduce((sum, key) => sum + (countsByResource[key] ?? 0), 0)
              : null;
          return (
            <motion.div
              key={area.key}
              variants={cardVariants}
              whileHover={shouldReduceMotion ? undefined : { y: -5 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            >
              <Link
                to={hubPath(area)}
                className={
                  'group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-lg motion-reduce:transition-none ' +
                  area.tone.hover
                }
              >
                <span className={'block h-1 transition-all duration-300 group-hover:h-1.5 motion-reduce:transition-none ' + area.tone.bar} />
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-center gap-3">
                    <span
                      className={
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100 ' +
                        area.tone.soft
                      }
                    >
                      <Icon size={19} />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-semibold text-slate-900">
                      {area.label[locale]}
                    </span>
                    {itemCount !== null && (
                      <span
                        className={'shrink-0 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums ' + area.tone.soft}
                        title={label('عنصر منشور', 'yayında öğe', 'published items')}
                      >
                        {itemCount.toLocaleString(locale)}
                      </span>
                    )}
                    <HoverArrow
                      size={16}
                      aria-hidden="true"
                      className={
                        'shrink-0 text-slate-400 opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none motion-reduce:translate-x-0 motion-reduce:translate-y-0 ' +
                        (isRtl
                          ? 'translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0'
                          : '-translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0')
                      }
                    />
                  </div>
                  <p className="text-sm leading-relaxed text-slate-500">{area.description[locale]}</p>
                  {area.parts.length > 1 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
                      {area.parts.map((part) => (
                        <span
                          key={partKey(part)}
                          className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-500 transition-colors duration-300 group-hover:border-slate-300 group-hover:text-slate-600 motion-reduce:transition-none"
                        >
                          {partLabel(part)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Honest numbers only: each tile is a real query. */}
      <motion.div
        variants={cardGridVariants}
        initial={shouldReduceMotion ? 'reduced' : 'hidden'}
        animate={cardsState}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stat(
          CheckCircle,
          'bg-green-100 text-green-600',
          strings.published,
          published,
          label('عنصر ظاهر على الموقع', 'Sitede görünen öğe', 'items visible on the site'),
        )}
        {stat(
          FileEdit,
          'bg-amber-100 text-amber-600',
          label('مسودات', 'Taslaklar', 'Drafts'),
          drafts,
          label('عنصر مخفي حتى تنشره', 'Yayınlanana kadar gizli öğe', 'items hidden until you publish them'),
          draftsKey ? `/admin/r/${draftsKey}?status=draft` : undefined,
        )}
        {stat(
          Inbox,
          'bg-primary-100 text-primary-600',
          label('رسائل جديدة', 'Yeni mesajlar', 'New messages'),
          newCount,
          label('لم تُقرأ بعد', 'Henüz okunmadı', 'not read yet'),
          '/admin/submissions',
        )}
        {stat(
          Users,
          'bg-slate-100 text-slate-600',
          strings.sections.subscribers,
          subscribers,
          label('بريد مشترك في النشرة', 'Bülten aboneliği', 'newsletter sign-ups'),
          '/admin/subscribers',
        )}
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        {panel(
          Inbox,
          strings.recentSubmissions,
          <Link to="/admin/submissions" className="text-sm text-primary-600 hover:underline">
            {strings.view}
          </Link>,
          submissions.length === 0 ? (
            <p className="p-5 text-sm text-slate-400">{strings.empty}</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {submissions.map((submission) => (
                <li key={submission.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                  <span
                    className={
                      'h-1.5 w-1.5 shrink-0 rounded-full ' +
                      (submission.status === 'new' ? 'bg-primary-500' : 'bg-transparent')
                    }
                  />
                  <Link to="/admin/submissions" className="min-w-0 flex-1 truncate font-medium text-slate-700 hover:underline">
                    {formName(submission.form_id) || pickLocalized(submission.payload, locale) || '—'}
                  </Link>
                  <span className="shrink-0 text-xs text-slate-400">{formatDate(submission.created_at, locale)}</span>
                </li>
              ))}
            </ul>
          ),
        )}

        {panel(
          Clock,
          label('آخر ما عُدّل', 'Son düzenlenenler', 'Recently edited'),
          null,
          recent.length === 0 ? (
            <p className="p-5 text-sm text-slate-400">{strings.empty}</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((edit) => (
                <li key={edit.to} className="flex items-center gap-3 px-5 py-3 text-sm">
                  <Link to={edit.to} className="min-w-0 flex-1 truncate font-medium text-slate-700 hover:underline">
                    {edit.title}
                  </Link>
                  <span className="hidden shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 sm:inline">
                    {edit.area}
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">{formatDate(edit.updatedAt, locale)}</span>
                </li>
              ))}
            </ul>
          ),
        )}
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link
          to="/admin/media"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:border-slate-300"
        >
          <Images size={16} className="text-slate-400" />
          {strings.mediaLibrary}
        </Link>
        <Link
          to="/admin/restore"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:border-slate-300"
        >
          <Database size={16} className="text-slate-400" />
          {strings.restoreContent}
        </Link>
      </div>
    </div>
  );
}
