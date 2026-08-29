import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Eye,
  PanelRightClose,
  PanelRightOpen,
  RotateCcw,
  Save,
  SlidersHorizontal,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/i18n/useI18n';
import { LOCALES, type Locale } from '@/lib/types';
import { hydrateCms } from '@/cms/hydrate';
import { setPublished } from '@/cms/store';
import type { CmsSnapshot } from '@/cms/store';
import { useAdminStrings } from '../hooks/useAdmin';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { useSaveShortcut } from '../hooks/useSaveShortcut';
import { useTopmostEscape } from '../hooks/useTopmostEscape';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmDialog';
import { LocaleSwitch, localeName } from '../components/EditingLocale';
import { translateDbError } from '../lib/errors';
import {
  PAGE_GROUPS,
  SITE_PAGES,
  type PageFieldDef,
  type PageSectionDef,
} from '../lib/pageSchema';
import { buildPageValue } from '../lib/pageDefaults';
import { getAtPath, setAtPath } from '../lib/paths';
import { normalizePageData } from '../lib/pageData';
import { PageFieldControl, contentDir } from '../components/PageFields';
import LivePreview from '../components/LivePreview';

type RawPages = Record<string, Record<string, unknown>>;
/** Form state keyed by `pageKey:locale`. */
type Drafts = Record<string, unknown>;

const PREVIEW_PREFERENCE = 'vkv-admin-preview';
/** localStorage prefix for in-progress edits, so a refresh does not lose them. */
const DRAFT_PREFIX = 'vkv-admin-draft:';

function readPreviewPreference(): boolean {
  try {
    return window.localStorage.getItem(PREVIEW_PREFERENCE) === '1';
  } catch {
    return false;
  }
}

function readStoredDraft(draftKey: string): unknown | undefined {
  try {
    const raw = window.localStorage.getItem(DRAFT_PREFIX + draftKey);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function writeStoredDraft(draftKey: string, value: unknown) {
  try {
    window.localStorage.setItem(DRAFT_PREFIX + draftKey, JSON.stringify(value));
  } catch {
    // Storage full or private browsing: the in-memory draft still works.
  }
}

function clearStoredDraft(draftKey: string) {
  try {
    window.localStorage.removeItem(DRAFT_PREFIX + draftKey);
  } catch {
    // Nothing to clean up.
  }
}

function isLocale(value: string | undefined): value is Locale {
  return Boolean(value) && (LOCALES as readonly string[]).includes(value as string);
}

/**
 * Tracks a media query in state.
 *
 * The preview sits beside the form only when there is room for both; on a
 * narrower window — including a wide screen at 125%/150% display scaling — it
 * opens as an overlay instead of silently doing nothing.
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);
    onChange();
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export default function ContentManagementPage() {
  const strings = useAdminStrings();
  const { locale: uiLocale } = useI18n();
  const navigate = useNavigate();
  const params = useParams<{ pageKey?: string; locale?: string }>();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const confirm = useConfirm();

  const [rawPages, setRawPages] = useState<RawPages>({});
  const [drafts, setDrafts] = useState<Drafts>({});
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  /** Drafts found in localStorage that differ from the live value, awaiting a decision. */
  const [storedDrafts, setStoredDrafts] = useState<Drafts>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Page, language and open section are read from the URL so a link can point
  // at "edit the donate page in Turkish" and the back button works.
  const activeKey = SITE_PAGES.some((item) => item.key === params.pageKey)
    ? (params.pageKey as string)
    : SITE_PAGES[0].key;
  const contentLocale: Locale = isLocale(params.locale) ? params.locale : uiLocale;
  const sectionParam = searchParams.get('section');

  useEffect(() => {
    if (params.pageKey !== activeKey || params.locale !== contentLocale) {
      const suffix = sectionParam ? `?section=${sectionParam}` : '';
      navigate(`/admin/content/${activeKey}/${contentLocale}${suffix}`, { replace: true });
    }
  }, [params.pageKey, params.locale, activeKey, contentLocale, sectionParam, navigate]);

  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [highlight, setHighlight] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  // The preview is opt-in: side by side it crowds the form, and most edits are
  // plain text the form already shows. The choice is remembered per browser.
  const [showPreview, setShowPreview] = useState(readPreviewPreference);
  const roomForColumn = useMediaQuery('(min-width: 1100px)');

  const togglePreview = useCallback(() => {
    setShowPreview((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(PREVIEW_PREFERENCE, next ? '1' : '0');
      } catch {
        // Private browsing: the toggle still works for this session.
      }
      return next;
    });
  }, []);

  const page = useMemo(
    () => SITE_PAGES.find((item) => item.key === activeKey) ?? SITE_PAGES[0],
    [activeKey],
  );
  const draftKey = `${activeKey}:${contentLocale}`;

  // Opening a page expands its first section; `?section=` (from search or the
  // dashboard) expands and scrolls to that one instead.
  useEffect(() => {
    const target =
      sectionParam && page.sections.some((section) => section.key === sectionParam)
        ? sectionParam
        : page.sections[0]?.key;
    setOpenSections(target ? new Set([target]) : new Set());
    setHighlight(null);
  }, [page, sectionParam]);

  useEffect(() => {
    if (loading || !sectionParam) return;
    const element = sectionRefs.current[sectionParam];
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [loading, sectionParam, page]);

  useEffect(() => {
    let active = true;
    supabase
      .from('site_pages')
      .select('key, data')
      .then(({ data, error: loadError }) => {
        if (!active) return;
        if (loadError) setError(translateDbError(loadError, uiLocale));
        const next: RawPages = {};
        for (const row of data ?? []) {
          const record = row as { key: string; data: Record<string, unknown> | null };
          if (record.data) next[record.key] = normalizePageData(record.data);
        }
        setRawPages(next);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [uiLocale]);

  // Forms open pre-filled with what the site currently renders. A draft left in
  // localStorage by an earlier session is offered back rather than applied.
  useEffect(() => {
    if (loading) return;
    setDrafts((current) => {
      if (draftKey in current) return current;
      const built = buildPageValue(activeKey, contentLocale);
      const stored = readStoredDraft(draftKey);
      if (stored !== undefined) {
        if (JSON.stringify(stored) !== JSON.stringify(built)) {
          setStoredDrafts((pending) => ({ ...pending, [draftKey]: stored }));
        } else {
          clearStoredDraft(draftKey);
        }
      }
      return { ...current, [draftKey]: built };
    });
  }, [draftKey, activeKey, contentLocale, loading]);

  const value = drafts[draftKey];

  const updateField = useCallback(
    (path: string, next: unknown) => {
      setDrafts((current) => {
        const updated = setAtPath(current[draftKey] ?? {}, path, next);
        writeStoredDraft(draftKey, updated);
        return { ...current, [draftKey]: updated };
      });
      setDirty((current) => new Set(current).add(draftKey));
    },
    [draftKey],
  );

  const forgetStoredDraft = useCallback((key: string) => {
    clearStoredDraft(key);
    setStoredDrafts((pending) => {
      if (!(key in pending)) return pending;
      const next = { ...pending };
      delete next[key];
      return next;
    });
  }, []);

  const restoreStoredDraft = useCallback(() => {
    const stored = storedDrafts[draftKey];
    if (stored === undefined) return;
    setDrafts((current) => ({ ...current, [draftKey]: stored }));
    setDirty((current) => new Set(current).add(draftKey));
    setStoredDrafts((pending) => {
      const next = { ...pending };
      delete next[draftKey];
      return next;
    });
  }, [draftKey, storedDrafts]);

  const label = useCallback(
    (ar: string, tr: string, en: string) => (uiLocale === 'ar' ? ar : uiLocale === 'tr' ? tr : en),
    [uiLocale],
  );

  const revert = useCallback(async () => {
    const ok = await confirm({
      title: label('التراجع عن التعديلات؟', 'Değişiklikler geri alınsın mı?', 'Discard the edits?'),
      body: label(
        `ستعود صفحة «${page.label.ar}» (${localeName[contentLocale]}) إلى آخر نسخة محفوظة.`,
        `«${page.label.tr}» (${localeName[contentLocale]}) son kaydedilen hâline dönecek.`,
        `“${page.label.en}” (${localeName[contentLocale]}) will return to its last saved version.`,
      ),
      confirmLabel: label('تراجع', 'Geri al', 'Discard'),
      destructive: true,
    });
    if (ok !== true) return;
    setDrafts((current) => ({ ...current, [draftKey]: buildPageValue(activeKey, contentLocale) }));
    setDirty((current) => {
      const next = new Set(current);
      next.delete(draftKey);
      return next;
    });
    forgetStoredDraft(draftKey);
  }, [confirm, label, page, contentLocale, draftKey, activeKey, forgetStoredDraft]);

  /** Persists every edited page/locale pair. Resolves `true` when nothing is left unsaved. */
  const save = useCallback(async (): Promise<boolean> => {
    if (dirty.size === 0) return true;
    setSaving(true);
    setError(null);

    const byPage = new Map<string, Record<string, unknown>>();
    for (const key of dirty) {
      const [pageKey, editedLocale] = key.split(':');
      // A page with no row yet starts from an empty object; other locales stay untouched.
      const existing = byPage.get(pageKey) ?? { ...(rawPages[pageKey] ?? {}) };
      existing[editedLocale] = drafts[key];
      byPage.set(pageKey, existing);
    }

    const rows = [...byPage.entries()].map(([pageKey, data]) => {
      const definition = SITE_PAGES.find((item) => item.key === pageKey);
      return { key: pageKey, label: definition?.label ?? {}, data };
    });

    const { error: saveError } = await supabase.from('site_pages').upsert(rows, { onConflict: 'key' });
    if (saveError) {
      const message = translateDbError(saveError, uiLocale);
      setError(message);
      toast.error(message);
      setSaving(false);
      return false;
    }

    setRawPages((current) => {
      const next = { ...current };
      for (const [pageKey, data] of byPage) next[pageKey] = data;
      return next;
    });
    for (const key of dirty) forgetStoredDraft(key);
    setDirty(new Set());
    // Refresh the shared snapshot so the dashboard reads back what it wrote.
    hydrateCms().then(setPublished).catch(() => undefined);
    setSaving(false);
    setLastSaved(
      new Date().toLocaleTimeString(uiLocale === 'ar' ? 'ar-EG' : uiLocale, {
        hour: '2-digit',
        minute: '2-digit',
      }),
    );
    toast.success(strings.savedToast);
    return true;
  }, [dirty, drafts, rawPages, uiLocale, toast, strings.savedToast, forgetStoredDraft]);

  // Drafts survive switching page or language inside this editor — however
  // that switch happens (page list, search palette, dashboard link) — so
  // only leaving the editor altogether asks about unsaved edits. Choosing to
  // leave drops the drafts too, so the dialog is not shown twice for nothing.
  const discardAll = useCallback(() => {
    for (const key of dirty) clearStoredDraft(key);
    setDirty(new Set());
    setDrafts({});
  }, [dirty]);
  useUnsavedChanges(dirty.size > 0, save, {
    allow: (next) => next.pathname.startsWith('/admin/content'),
    onDiscard: discardAll,
  });
  useSaveShortcut(dirty.size > 0 && !saving ? save : null);

  const goTo = useCallback(
    (pageKey: string, locale: Locale, section?: string | null) => {
      const suffix = section ? `?section=${section}` : '';
      navigate(`/admin/content/${pageKey}/${locale}${suffix}`);
    },
    [navigate],
  );

  const draftSnapshot = useMemo<CmsSnapshot>(
    () => ({
      tables: {},
      pages: { [activeKey]: { ...(rawPages[activeKey] ?? {}), [contentLocale]: value } },
    }),
    [activeKey, contentLocale, rawPages, value],
  );

  const previewAsOverlay = showPreview && !roomForColumn;
  useTopmostEscape(togglePreview, previewAsOverlay);

  const toggleSection = (key: string) =>
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const focusSection = (section: PageSectionDef) => {
    if (!section.anchor) return;
    if (!showPreview) togglePreview();
    setHighlight(section.anchor);
  };

  const dirtyList = [...dirty].map((key) => {
    const [pageKey, locale] = key.split(':');
    const definition = SITE_PAGES.find((item) => item.key === pageKey);
    return `${definition?.label[uiLocale] ?? pageKey} (${localeName[locale as Locale] ?? locale})`;
  });

  const pendingDraft = storedDrafts[draftKey] !== undefined;
  const allOpen = page.sections.every((section) => openSections.has(section.key));

  return (
    <div className="flex flex-col gap-4 lg:h-[calc(100vh-7rem)]">
      {/* Header ------------------------------------------------------------ */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{strings.sitePages}</h1>
          <p className="text-sm text-slate-500">
            {label(
              'نصوص الصفحات وصورها وأزرارها — القوائم المتجددة (الأخبار، المشاريع…) لها صفحاتها الخاصة في القائمة الجانبية',
              'Sayfa metinleri, görselleri ve butonları — güncellenen listeler (haberler, projeler…) kenar çubuğunda kendi sayfalarına sahiptir',
              'Page texts, images and buttons — growing lists (news, projects…) have their own pages in the sidebar',
            )}
          </p>
        </div>

        <LocaleSwitch value={contentLocale} onChange={(next) => goTo(activeKey, next)} size="md" />

        <button
          type="button"
          onClick={togglePreview}
          className={
            'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition ' +
            (showPreview
              ? 'border-slate-300 bg-slate-100 text-slate-800'
              : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800')
          }
        >
          {showPreview ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
          {label('المعاينة', 'Önizleme', 'Preview')}
        </button>

        {dirty.has(draftKey) && (
          <button
            type="button"
            onClick={revert}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:text-slate-900"
          >
            <RotateCcw size={15} /> {label('تراجع', 'Geri al', 'Revert')}
          </button>
        )}

        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            onClick={save}
            disabled={saving || dirty.size === 0}
            title={dirty.size > 0 ? dirtyList.join('\n') : strings.noChanges}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40"
          >
            <Save size={16} />
            {saving ? strings.saving : strings.save}
            {dirty.size > 0 && !saving && <span className="tabular-nums">· {dirty.size}</span>}
          </button>
          {lastSaved && dirty.size === 0 && (
            <span className="text-[11px] text-slate-400">
              {strings.lastSaved} {lastSaved}
            </span>
          )}
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      {/* Body -------------------------------------------------------------- */}
      <div
        className={
          'grid gap-4 lg:min-h-0 lg:flex-1 ' +
          (showPreview && roomForColumn
            ? 'lg:grid-cols-[210px_minmax(0,1fr)_minmax(0,1fr)]'
            : 'lg:grid-cols-[210px_minmax(0,1fr)]')
        }
      >
        <PageList
          activeKey={activeKey}
          onSelect={(key) => goTo(key, contentLocale)}
          dirty={dirty}
        />

        {/* Without the preview beside it the form would stretch the full width
            of a large screen, which makes long lines hard to scan. */}
        <div
          className={
            'lg:min-h-0 lg:overflow-y-auto lg:pe-1 ' +
            (showPreview && roomForColumn ? '' : 'w-full max-w-4xl')
          }
        >
          {loading ? (
            <p className="p-4 text-sm text-slate-400">{strings.loading}</p>
          ) : (
            <div className="space-y-3">
              {pendingDraft && (
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
                  <span className="min-w-0 flex-1">
                    {label(
                      'لديك مسودة غير محفوظة من قبل',
                      'Daha önce kaydedilmemiş bir taslağınız var',
                      'You have an unsaved draft from earlier',
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={restoreStoredDraft}
                    className="rounded-md bg-amber-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-amber-700"
                  >
                    {label('استعادة', 'Geri getir', 'Restore')}
                  </button>
                  <button
                    type="button"
                    onClick={() => forgetStoredDraft(draftKey)}
                    className="rounded-md px-3 py-1 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
                  >
                    {label('تجاهل', 'Yok say', 'Discard')}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 px-1">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{page.label[uiLocale]}</p>
                  {page.description && (
                    <p className="truncate text-xs text-slate-400">{page.description[uiLocale]}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenSections(allOpen ? new Set() : new Set(page.sections.map((s) => s.key)))
                  }
                  className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  {allOpen ? <ChevronsDownUp size={14} /> : <ChevronsUpDown size={14} />}
                  {allOpen
                    ? label('طيّ الكل', 'Tümünü daralt', 'Collapse all')
                    : label('فتح الكل', 'Tümünü aç', 'Expand all')}
                </button>
              </div>

              {page.sections.map((section) => (
                <SectionCard
                  key={section.key}
                  sectionRef={(element) => {
                    sectionRefs.current[section.key] = element;
                  }}
                  section={section}
                  open={openSections.has(section.key)}
                  onToggle={() => toggleSection(section.key)}
                  onFocus={() => focusSection(section)}
                  focused={Boolean(section.anchor) && showPreview && highlight === section.anchor}
                  value={value}
                  onChange={updateField}
                  contentLocale={contentLocale}
                />
              ))}
            </div>
          )}
        </div>

        {showPreview &&
          (() => {
            const preview = (
              <LivePreview
                route={page.route}
                draft={draftSnapshot}
                contentLocale={contentLocale}
                highlight={highlight}
                onClose={togglePreview}
              />
            );

            return roomForColumn ? (
              <div className="min-h-0">{preview}</div>
            ) : (
              <div className="fixed inset-0 z-40 bg-slate-900/40 p-3" onClick={togglePreview}>
                <div className="h-full" onClick={(event) => event.stopPropagation()}>
                  {preview}
                </div>
              </div>
            );
          })()}
      </div>
    </div>
  );
}

/** Pages grouped exactly as they appear in the site's navigation. */
function PageList({
  activeKey,
  onSelect,
  dirty,
}: {
  activeKey: string;
  onSelect: (key: string) => void;
  dirty: Set<string>;
}) {
  const { locale } = useI18n();
  const hasEdits = (pageKey: string) => [...dirty].some((key) => key.startsWith(`${pageKey}:`));
  const groups = PAGE_GROUPS.map((group) => ({
    group,
    items: SITE_PAGES.filter((page) => page.group === group.key),
  })).filter(({ items }) => items.length > 0);

  return (
    <>
      {/* A phone has no room for a sidebar column; a select does the same job. */}
      <select
        value={activeKey}
        onChange={(event) => onSelect(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 lg:hidden"
      >
        {groups.map(({ group, items }) => (
          <optgroup key={group.key} label={group.label[locale]}>
            {items.map((page) => (
              <option key={page.key} value={page.key}>
                {page.label[locale]}
                {hasEdits(page.key) ? ' •' : ''}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <div className="hidden min-h-0 space-y-5 overflow-y-auto lg:block">
        {groups.map(({ group, items }) => (
          <div key={group.key}>
            <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {group.label[locale]}
            </p>
            <div className="space-y-0.5">
              {items.map((page) => {
                const Icon = page.icon;
                const active = page.key === activeKey;
                return (
                  <button
                    key={page.key}
                    type="button"
                    onClick={() => onSelect(page.key)}
                    title={page.description?.[locale]}
                    className={
                      'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start text-sm transition ' +
                      (active
                        ? 'bg-slate-900 font-medium text-white'
                        : 'text-slate-600 hover:bg-slate-100')
                    }
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{page.label[locale]}</span>
                      {page.description && (
                        <span
                          className={
                            'block truncate text-[11px] font-normal ' +
                            (active ? 'text-white/60' : 'text-slate-400')
                          }
                        >
                          {page.description[locale]}
                        </span>
                      )}
                    </span>
                    {hasEdits(page.key) && (
                      <span
                        className="h-2 w-2 shrink-0 rounded-full bg-amber-400"
                        title={locale === 'ar' ? 'تعديلات غير محفوظة' : locale === 'tr' ? 'Kaydedilmemiş değişiklikler' : 'Unsaved edits'}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

type SectionCardProps = {
  section: PageSectionDef;
  open: boolean;
  onToggle: () => void;
  onFocus: () => void;
  focused: boolean;
  value: unknown;
  onChange: (path: string, next: unknown) => void;
  contentLocale: Locale;
  /** Lets the page scroll to this card when `?section=` names it. */
  sectionRef?: (element: HTMLElement | null) => void;
};

function SectionCard({
  section,
  open,
  onToggle,
  onFocus,
  focused,
  value,
  onChange,
  contentLocale,
  sectionRef,
}: SectionCardProps) {
  const { locale } = useI18n();
  const strings = useAdminStrings();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const Icon = section.icon;
  const dir = contentDir[contentLocale];
  const mainFields = section.fields.filter((field) => !field.advanced);
  const advancedFields = section.fields.filter((field) => field.advanced);

  const renderField = (field: PageFieldDef) => {
    const wide =
      field.full || ['textarea', 'paragraphs', 'list', 'repeater', 'image'].includes(field.type);
    return (
      <div key={field.path || section.key} className={wide ? 'md:col-span-2' : ''}>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">{field.label[locale]}</label>
        <PageFieldControl
          field={field}
          dir={dir}
          value={getAtPath(value, field.path)}
          onChange={(next) => onChange(field.path, next)}
        />
        {field.help && <p className="mt-1 text-xs text-slate-400">{field.help[locale]}</p>}
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id={`section-${section.key}`}
      className="scroll-mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white"
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Icon size={16} />
        </span>
        <button type="button" onClick={onToggle} className="min-w-0 flex-1 text-start">
          <span className="block truncate font-semibold text-slate-800">{section.label[locale]}</span>
          {section.description && (
            <span className="block text-xs text-slate-400">{section.description[locale]}</span>
          )}
        </button>

        {section.anchor && (
          <button
            type="button"
            onClick={onFocus}
            title={
              locale === 'ar'
                ? 'إظهار هذا القسم في المعاينة'
                : locale === 'tr'
                  ? 'Bu bölümü önizlemede göster'
                  : 'Show this section in the preview'
            }
            className={
              'rounded-md p-1.5 transition ' +
              (focused ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-slate-600')
            }
          >
            <Eye size={16} />
          </button>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="rounded-md p-1.5 text-slate-400 transition hover:text-slate-600"
        >
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} className="rtl:rotate-180" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 p-4">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{mainFields.map(renderField)}</div>

          {advancedFields.length > 0 && (
            <div className="mt-4 rounded-lg border border-dashed border-slate-200">
              <button
                type="button"
                onClick={() => setShowAdvanced((current) => !current)}
                className="flex w-full items-center gap-2 px-3 py-2 text-start text-xs font-medium text-slate-500 transition hover:text-slate-800"
              >
                <SlidersHorizontal size={14} />
                <span className="flex-1">{strings.moreSettings}</span>
                {showAdvanced ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} className="rtl:rotate-180" />
                )}
              </button>
              {showAdvanced && (
                <div className="grid grid-cols-1 gap-5 border-t border-dashed border-slate-200 p-3 md:grid-cols-2">
                  {advancedFields.map(renderField)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
