import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Inbox,
  Images,
  Database,
  CheckCircle,
  FileEdit,
  Users,
  Clock,
  Home,
  Landmark,
  FolderKanban,
  GraduationCap,
  Newspaper,
  BookOpen,
  HandHeart,
  MessageSquare,
  Settings2,
  Plus,
  type LucideIcon,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/i18n/useI18n';
import type { Locale, SubmissionRow } from '@/lib/types';
import { getParticipateContent } from '@/data/participate';
import { useAdminStrings } from '../hooks/useAdmin';
import { adminStrings } from '../i18n';
import { RESOURCES, getResource } from '../lib/resources';
import { getPageDef } from '../lib/pageSchema';
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
  /** Sidebar name of the list/page the item belongs to. */
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
      return (data as unknown as Record<string, unknown>[]).map<RecentEdit>((row) => ({
        id: String(row.id),
        title: pickLocalized(row[resource.titleField], locale) || '—',
        updatedAt: String(row.updated_at ?? ''),
        area: strings.sections[resource.labelKey] ?? resource.key,
        to: `/admin/r/${resource.key}/${row.id}`,
      }));
    }),
    (async () => {
      const { data, error } = await supabase
        .from('site_pages')
        .select('key, updated_at')
        .order('updated_at', { ascending: false })
        .limit(6);
      if (error || !data) return [] as RecentEdit[];
      return (data as { key: string; updated_at: string }[]).map<RecentEdit>((row) => ({
        id: row.key,
        title: getPageDef(row.key)?.label[locale] ?? row.key,
        updatedAt: row.updated_at ?? '',
        area: strings.sitePages,
        to: `/admin/content/${row.key}/${locale}`,
      }));
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

// --- site map ---------------------------------------------------------------

type AreaLink = { to: string; label: string; title?: string; kind?: 'page' | 'records' | 'inbox' };
type Area = {
  key: string;
  icon: LucideIcon;
  title: string;
  body: string;
  links: AreaLink[];
  /** Section-level links shown as small chips (home + settings). */
  sections?: AreaLink[];
};

export default function DashboardPage() {
  const strings = useAdminStrings();
  const { locale, isRtl } = useI18n();
  const [published, setPublished] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<number | null>(null);
  /** Resource key holding the most drafts — where the drafts tile sends the editor. */
  const [draftsKey, setDraftsKey] = useState<string | null>(null);
  const [newCount, setNewCount] = useState<number | null>(null);
  const [subscribers, setSubscribers] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [recent, setRecent] = useState<RecentEdit[]>([]);

  const label = (ar: string, tr: string, en: string) => (locale === 'ar' ? ar : locale === 'tr' ? tr : en);

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

  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  // Submissions carry the form id ("volunteer"); the editor knows the page by
  // its hero title, which may itself have been edited in the CMS.
  const participatePages = Object.values(getParticipateContent(locale).pages);
  const formName = (formId: string | null) => {
    if (!formId) return '';
    const page = participatePages.find((p) => p.form?.id === formId || p.slug === formId || p.key === formId);
    return page?.hero.title ?? formId;
  };

  const pageLink = (key: string, section?: string): AreaLink | null => {
    const def = getPageDef(key);
    if (!def) return null;
    if (section) {
      const sec = def.sections.find((s) => s.key === section);
      if (!sec) return null;
      return {
        to: `/admin/content/${key}/${locale}?section=${section}`,
        label: sec.label[locale],
        title: sec.description?.[locale],
        kind: 'page',
      };
    }
    return {
      to: `/admin/content/${key}/${locale}`,
      label: label('نصوص الصفحة وصورها', 'Sayfa metinleri ve görselleri', 'Page texts & images'),
      title: def.description?.[locale],
      kind: 'page',
    };
  };
  const recordsLink = (key: string): AreaLink | null => {
    const def = getResource(key);
    if (!def) return null;
    return {
      to: `/admin/r/${key}`,
      label: strings.sections[def.labelKey] ?? key,
      title: def.description?.[locale],
      kind: 'records',
    };
  };
  const compact = (links: (AreaLink | null | undefined | false)[]) => links.filter((l): l is AreaLink => Boolean(l));
  /** Link to a whole site page, named after the page itself. */
  const wholePage = (key: string, text?: string): AreaLink | null => {
    const def = getPageDef(key);
    if (!def) return null;
    return { to: `/admin/content/${key}/${locale}`, label: text ?? def.label[locale], title: def.description?.[locale], kind: 'page' };
  };

  const homeDef = getPageDef('home');
  const settingsDef = getPageDef('settings');

  const areas: Area[] = [
    {
      key: 'home',
      icon: Home,
      title: label('الصفحة الرئيسية', 'Ana sayfa', 'Home page'),
      body: homeDef?.description?.[locale] ?? label('كل أقسام الصفحة الأولى', 'Açılış sayfasının bölümleri', 'Every section of the landing page'),
      links: compact([pageLink('home')]),
      sections: (homeDef?.sections ?? []).map((sec) => ({
        to: `/admin/content/home/${locale}?section=${sec.key}`,
        label: sec.label[locale],
        title: sec.description?.[locale],
      })),
    },
    {
      key: 'about',
      icon: Landmark,
      title: label('عن الوقف', 'Vakıf hakkında', 'About the waqf'),
      body: label(
        'صفحة التعريف بالوقف، صفحة الحوكمة والسياسات، وقائمة "عن الوقف" في رأس الموقع',
        'Vakfı tanıtan sayfa, yönetişim ve politikalar sayfası ve üst menüdeki "Hakkında" listesi',
        'The about page, the governance & policies page, and the "About" menu in the site header',
      ),
      links: compact([wholePage('about-waqf'), wholePage('governance'), wholePage('about-nav')]),
    },
    {
      key: 'projects',
      icon: FolderKanban,
      title: label('المشاريع', 'Projeler', 'Projects'),
      body: label(
        'كل مشروع وقفي بطاقة في صفحة المشاريع وصفحة تفاصيل خاصة به',
        'Her vakıf projesi, projeler sayfasında bir kart ve kendi detay sayfasıdır',
        'Each waqf project is a card on the projects page with its own detail page',
      ),
      links: compact([recordsLink('projects'), pageLink('projects-page')]),
    },
    {
      key: 'programs',
      icon: GraduationCap,
      title: label('البرامج', 'Programlar', 'Programs'),
      body: label(
        'رواد اليمن، بناء القدرات، التطوير المؤسسي، التوعية المجتمعية ووحدة التطوع',
        'Yemen Öncüleri, kapasite geliştirme, kurumsal gelişim, toplumsal farkındalık ve gönüllülük birimi',
        'Yemen Pioneers, capacity building, institutional development, community awareness and the volunteer unit',
      ),
      links: compact([recordsLink('programs'), pageLink('programs-page')]),
    },
    {
      key: 'news',
      icon: Newspaper,
      title: label('الأخبار', 'Haberler', 'News'),
      body: label(
        'الأخبار والأنشطة في صفحة الأخبار وقسم آخر الأخبار في الصفحة الرئيسية',
        'Haberler sayfasındaki ve ana sayfadaki son haberler bölümündeki haberler',
        'Articles on the news page and in the latest-news section of the home page',
      ),
      links: compact([recordsLink('news'), pageLink('news-page')]),
    },
    {
      key: 'library',
      icon: BookOpen,
      title: label('المكتبة', 'Kütüphane', 'Library'),
      body: label(
        'المقالات والقصص، المستندات (PDF)، ومعرض الصور',
        'Makaleler ve hikayeler, belgeler (PDF) ve galeri',
        'Articles & stories, documents (PDF) and the photo gallery',
      ),
      links: compact([
        recordsLink('library_articles'),
        recordsLink('library_documents'),
        recordsLink('gallery_images'),
        pageLink('library-page'),
      ]),
    },
    {
      key: 'donate',
      icon: HandHeart,
      title: label('المساهمة', 'Bağış', 'Donate'),
      body: label(
        'فرص المساهمة (الأسهم الوقفية وغيرها) ونصوص صفحة المساهمة',
        'Bağış fırsatları (vakıf hisseleri vb.) ve bağış sayfasının metinleri',
        'Donation opportunities (waqf shares and more) and the donate page copy',
      ),
      links: compact([recordsLink('donation_opportunities'), pageLink('donate-page')]),
    },
    {
      key: 'participate',
      icon: MessageSquare,
      title: label('شارك معنا', 'Katılım', 'Participate'),
      body: label(
        'نماذج شارك بفكرة والشكاوى والتطوع وصفحة تواصل معنا، والرسائل التي تصل منها',
        'Fikir, şikayet, gönüllü formları ve iletişim sayfası ile gelen mesajlar',
        'The share-idea, complaints, volunteer forms and contact page, and the messages they send',
      ),
      links: compact([
        { to: '/admin/submissions', label: strings.sections.submissions, kind: 'inbox' },
        pageLink('participate'),
        { to: '/admin/subscribers', label: strings.sections.subscribers, kind: 'inbox' },
      ]),
    },
    {
      key: 'settings',
      icon: Settings2,
      title: label('إعدادات الموقع', 'Site ayarları', 'Site settings'),
      body: settingsDef?.description?.[locale] ?? label('ما يتكرر في كل الصفحات', 'Her sayfada tekrarlanan', 'What repeats on every page'),
      links: compact([
        wholePage('settings', label('كل الإعدادات', 'Tüm ayarlar', 'All settings')),
        recordsLink('partners'),
        recordsLink('stat_indicators'),
      ]),
      // sections: the four settings groups the client reaches for most often
      sections: compact(['meta', 'siteConfig', 'navLinks', 'footer'].map((key) => pageLink('settings', key))),
    },
  ];

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
    const cls = 'block rounded-xl border border-slate-200 bg-white p-5 transition';
    return to ? (
      <Link to={to} className={cls + ' hover:border-slate-300 hover:shadow-sm'}>
        {inner}
      </Link>
    ) : (
      <div className={cls}>{inner}</div>
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
        <h1 className="text-2xl font-bold text-slate-900">
          {label('ماذا تريد أن تعدّل؟', 'Neyi düzenlemek istiyorsunuz?', 'What would you like to edit?')}
        </h1>
        <p className="text-sm text-slate-500">
          {label(
            'اختر الجزء من الموقع الذي تريد تعديله. كل ما يظهر على الموقع يُدار من هنا.',
            'Sitenin düzenlemek istediğiniz bölümünü seçin. Sitede görünen her şey buradan yönetilir.',
            'Pick the part of the site you want to change. Everything visitors see is managed from here.',
          )}
        </p>
      </div>

      {/* Site map: one card per public area */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {areas.map((area) => {
          const Icon = area.icon;
          const primary = area.links[0];
          return (
            <div
              key={area.key}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                  <Icon size={18} />
                </span>
                {primary ? (
                  <Link to={primary.to} className="font-semibold text-slate-900 hover:underline">
                    {area.title}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-900">{area.title}</span>
                )}
              </div>
              <p className="mb-3 text-sm leading-relaxed text-slate-500">{area.body}</p>
              <ul className="mt-auto space-y-1">
                {area.links.map((link) => (
                  <li key={link.to} className="flex items-center gap-2">
                    <Link
                      to={link.to}
                      title={link.title}
                      className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:underline"
                    >
                      <Arrow size={14} className="text-slate-300 transition group-hover:text-primary-600" />
                      {link.label}
                    </Link>
                    {link.kind === 'records' && (
                      <Link
                        to={`${link.to}/new`}
                        title={strings.create}
                        aria-label={strings.create}
                        className="rounded-md p-0.5 text-slate-400 transition hover:bg-primary-50 hover:text-primary-700"
                      >
                        <Plus size={14} />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              {area.sections && area.sections.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
                  {area.sections.map((sec) => (
                    <Link
                      key={sec.to}
                      to={sec.to}
                      title={sec.title}
                      className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                    >
                      {sec.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Honest numbers only: each tile is a real query. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      </div>

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
