// The "site mirror" editor for one page's texts and images.
//
// The page's sections are listed as calm numbered cards in the exact order a
// visitor meets them on the site — no form fields on this screen at all.
// Pressing "edit" opens ONE section in a focused overlay with only that
// section's fields. The hub around it owns the URL (page, tab, language).

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Eye,
  Pencil,
  RotateCcw,
  Save,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/i18n/useI18n';
import type { Locale } from '@/lib/types';
import { hydrateCms } from '@/cms/hydrate';
import { setPublished } from '@/cms/store';
import type { CmsSnapshot } from '@/cms/store';
import { useAdminStrings } from '../hooks/useAdmin';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { useSaveShortcut } from '../hooks/useSaveShortcut';
import { useTopmostEscape } from '../hooks/useTopmostEscape';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmDialog';
import { LocaleSwitch, localeName } from './EditingLocale';
import { translateDbError } from '../lib/errors';
import { getPageDef, type PageFieldDef, type PageSectionDef } from '../lib/pageSchema';
import { buildPageValue } from '../lib/pageDefaults';
import { getAtPath, setAtPath } from '../lib/paths';
import { normalizePageData } from '../lib/pageData';
import type { AreaTone } from '../lib/siteMap';
import { PageFieldControl, FieldLabel, contentDir } from './PageFields';
import LivePreview from './LivePreview';

type RawPages = Record<string, Record<string, unknown>>;
/** Form state keyed by `pageKey:locale`. */
type Drafts = Record<string, unknown>;

const PREVIEW_PREFERENCE = 'vkv-admin-preview';
/** localStorage prefix for in-progress edits, so a refresh does not lose them. */
const DRAFT_PREFIX = 'vkv-admin-draft:';

const NEUTRAL_TONE: AreaTone = {
  soft: 'bg-slate-100 text-slate-600',
  solid: 'bg-slate-800 text-white',
  bar: 'bg-slate-400',
  hover: 'hover:border-slate-300',
};

export function readPreviewPreference(): boolean {
  try {
    return window.localStorage.getItem(PREVIEW_PREFERENCE) === '1';
  } catch {
    return false;
  }
}

export function writePreviewPreference(next: boolean) {
  try {
    window.localStorage.setItem(PREVIEW_PREFERENCE, next ? '1' : '0');
  } catch {
    // Private browsing: the toggle still works for this session.
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

/**
 * Tracks a media query in state. The preview sits beside the fields only when
 * there is room for both; on a narrower window it opens as an overlay instead.
 */
export function useMediaQuery(query: string): boolean {
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

/** True when any of the section's fields differ between draft and saved value. */
function sectionEdited(section: PageSectionDef, draft: unknown, saved: unknown): boolean {
  return section.fields.some(
    (field) =>
      JSON.stringify(getAtPath(draft, field.path)) !== JSON.stringify(getAtPath(saved, field.path)),
  );
}

type PageContentEditorProps = {
  pageKey: string;
  contentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
  /** Section key from the URL — its editor opens directly. */
  section?: string | null;
  /** Pathname prefix inside which leaving never asks about unsaved edits. */
  allowNavigationWithin: string;
  /** The page's identity colour, from its site area. */
  tone?: AreaTone;
};

export default function PageContentEditor({
  pageKey,
  contentLocale,
  onLocaleChange,
  section: sectionParam = null,
  allowNavigationWithin,
  tone = NEUTRAL_TONE,
}: PageContentEditorProps) {
  const strings = useAdminStrings();
  const { locale: uiLocale } = useI18n();
  const toast = useToast();
  const confirm = useConfirm();

  const [rawPages, setRawPages] = useState<RawPages>({});
  const [drafts, setDrafts] = useState<Drafts>({});
  /** Snapshot of the saved state per draft key, for the "edited" dots. */
  const [savedValues, setSavedValues] = useState<Drafts>({});
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  /** Drafts found in localStorage that differ from the live value, awaiting a decision. */
  const [storedDrafts, setStoredDrafts] = useState<Drafts>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [openSection, setOpenSection] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
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

  const page = useMemo(() => getPageDef(pageKey), [pageKey]);
  const draftKey = `${pageKey}:${contentLocale}`;

  // `?section=` (from search or the dashboard) opens that section's editor
  // directly and scrolls its card into view behind the overlay.
  useEffect(() => {
    if (!page) return;
    const valid = sectionParam && page.sections.some((section) => section.key === sectionParam);
    setOpenSection(valid ? sectionParam : null);
    setHighlight(null);
  }, [page, sectionParam]);

  useEffect(() => {
    if (loading || !sectionParam) return;
    const element = sectionRefs.current[sectionParam];
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      const built = buildPageValue(pageKey, contentLocale);
      setSavedValues((saved) => (draftKey in saved ? saved : { ...saved, [draftKey]: built }));
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
  }, [draftKey, pageKey, contentLocale, loading]);

  const value = drafts[draftKey];
  const savedValue = savedValues[draftKey];

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
    if (!page) return;
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
    const fresh = buildPageValue(pageKey, contentLocale);
    setDrafts((current) => ({ ...current, [draftKey]: fresh }));
    setSavedValues((current) => ({ ...current, [draftKey]: fresh }));
    setDirty((current) => {
      const next = new Set(current);
      next.delete(draftKey);
      return next;
    });
    forgetStoredDraft(draftKey);
  }, [confirm, label, page, contentLocale, draftKey, pageKey, forgetStoredDraft]);

  /** Persists every edited locale of this page. Resolves `true` when nothing is left unsaved. */
  const save = useCallback(async (): Promise<boolean> => {
    if (dirty.size === 0) return true;
    setSaving(true);
    setError(null);

    // A page with no row yet starts from an empty object; other locales stay untouched.
    const data = { ...(rawPages[pageKey] ?? {}) };
    for (const key of dirty) {
      const [, editedLocale] = key.split(':');
      data[editedLocale] = drafts[key] as Record<string, unknown>;
    }
    const row = { key: pageKey, label: page?.label ?? {}, data };

    const { error: saveError } = await supabase.from('site_pages').upsert(row, { onConflict: 'key' });
    if (saveError) {
      const message = translateDbError(saveError, uiLocale);
      setError(message);
      toast.error(message);
      setSaving(false);
      return false;
    }

    setRawPages((current) => ({ ...current, [pageKey]: data }));
    setSavedValues((current) => {
      const next = { ...current };
      for (const key of dirty) next[key] = JSON.parse(JSON.stringify(drafts[key] ?? {}));
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
  }, [dirty, drafts, rawPages, pageKey, page, uiLocale, toast, strings.savedToast, forgetStoredDraft]);

  // Switching tab or language inside the same hub keeps working without a
  // prompt — a draft the switch drops from memory is still in localStorage and
  // offered back. Only leaving the hub altogether asks about unsaved edits.
  const discardAll = useCallback(() => {
    for (const key of dirty) clearStoredDraft(key);
    setDirty(new Set());
    setDrafts({});
  }, [dirty]);
  useUnsavedChanges(dirty.size > 0, save, {
    allow: (next) => next.pathname.startsWith(allowNavigationWithin),
    onDiscard: discardAll,
  });
  useSaveShortcut(dirty.size > 0 && !saving ? save : null);

  const draftSnapshot = useMemo<CmsSnapshot>(
    () => ({
      tables: {},
      pages: { [pageKey]: { ...(rawPages[pageKey] ?? {}), [contentLocale]: value } },
    }),
    [pageKey, contentLocale, rawPages, value],
  );

  if (!page) return null;

  const openSectionDef = page.sections.find((section) => section.key === openSection) ?? null;

  const openEditor = (section: PageSectionDef) => {
    setOpenSection(section.key);
    if (section.anchor) setHighlight(section.anchor);
  };

  // While a section is being edited, the preview spotlights it: everything
  // else on the page is hidden, so the editor sees only the part they change.
  // A section living on another route (a program page, one of the participate
  // pages) also swaps the previewed route to where it actually appears.
  const activeAnchor = openSectionDef ? (openSectionDef.anchor ?? null) : highlight;
  const previewNode = showPreview ? (
    <LivePreview
      route={openSectionDef?.route ?? page.route}
      draft={draftSnapshot}
      contentLocale={contentLocale}
      highlight={activeAnchor}
      isolate={Boolean(openSectionDef?.anchor)}
      onClose={togglePreview}
    />
  ) : null;

  const pendingDraft = storedDrafts[draftKey] !== undefined;

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar ----------------------------------------------------------- */}
      <div className="flex flex-wrap items-center gap-3">
        <p className="min-w-0 flex-1 truncate text-sm text-slate-500">
          {label(
            'الأقسام معروضة بترتيب ظهورها الفعلي في الموقع',
            'Bölümler sitedeki gerçek sıralarıyla listelenir',
            'Sections are listed in the order they actually appear on the site',
          )}
        </p>
        <LocaleSwitch value={contentLocale} onChange={onLocaleChange} size="md" />
        <button
          type="button"
          onClick={togglePreview}
          className={
            'inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition ' +
            (showPreview
              ? 'border-primary-200 bg-primary-50 text-primary-700'
              : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800')
          }
        >
          <Eye size={16} />
          {label('معاينة الموقع', 'Site önizlemesi', 'Site preview')}
        </button>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

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
            className="rounded-lg bg-amber-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-amber-700"
          >
            {label('استعادة', 'Geri getir', 'Restore')}
          </button>
          <button
            type="button"
            onClick={() => forgetStoredDraft(draftKey)}
            className="rounded-lg px-3 py-1 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
          >
            {label('تجاهل', 'Yok say', 'Discard')}
          </button>
        </div>
      )}

      {/* Section cards, mirroring the site top-to-bottom ------------------- */}
      <div
        className={
          'grid items-start gap-5 ' + (showPreview && roomForColumn ? 'lg:grid-cols-2' : '')
        }
      >
        <div className={showPreview && roomForColumn ? 'min-w-0' : 'w-full max-w-3xl'}>
          {loading ? (
            <p className="p-4 text-sm text-slate-400">{strings.loading}</p>
          ) : (
            <ol className="relative space-y-3">
              {page.sections.map((section, index) => {
                const Icon = section.icon;
                const edited = value !== undefined && savedValue !== undefined
                  ? sectionEdited(section, value, savedValue)
                  : false;
                return (
                  <li
                    key={section.key}
                    ref={(element) => {
                      sectionRefs.current[section.key] = element;
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => openEditor(section)}
                      className={
                        'group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-start shadow-sm transition hover:shadow-md ' +
                        tone.hover
                      }
                    >
                      <span
                        className={
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ' +
                          tone.soft
                        }
                      >
                        {(index + 1).toLocaleString(uiLocale === 'ar' ? 'ar-EG' : uiLocale)}
                      </span>
                      <span className={'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ' + tone.soft}>
                        <Icon size={19} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 font-bold text-slate-900">
                          <span className="truncate">{section.label[uiLocale]}</span>
                          {edited && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                              {label('غير محفوظ', 'kaydedilmedi', 'unsaved')}
                            </span>
                          )}
                        </span>
                        {section.description && (
                          <span className="mt-0.5 block text-sm leading-relaxed text-slate-500">
                            {section.description[uiLocale]}
                          </span>
                        )}
                      </span>
                      <span
                        className={
                          'inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition ' +
                          'bg-slate-100 text-slate-600 group-hover:bg-primary-600 group-hover:text-white'
                        }
                      >
                        <Pencil size={14} />
                        {strings.edit}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {/* Page-level preview: a live copy of the page beside the list. */}
        {previewNode && !openSectionDef &&
          (roomForColumn ? (
            <div className="min-w-0 lg:sticky lg:top-[4.5rem] lg:h-[calc(100vh-6rem)]">{previewNode}</div>
          ) : (
            <div className="fixed inset-0 z-40 bg-slate-900/40 p-3" onClick={togglePreview}>
              <div className="h-full" onClick={(event) => event.stopPropagation()}>
                {previewNode}
              </div>
            </div>
          ))}
      </div>

      {/* Sticky save bar --------------------------------------------------- */}
      {dirty.size > 0 && !openSectionDef && (
        <div className="sticky bottom-4 z-30 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
          <span className="min-w-0 flex-1 text-sm font-medium text-slate-700">
            {label('لديك تعديلات لم تُنشر بعد', 'Henüz yayınlanmamış değişiklikleriniz var', 'You have changes not yet published')}
          </span>
          <button
            type="button"
            onClick={revert}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-600 transition hover:text-slate-900"
          >
            <RotateCcw size={15} /> {label('تراجع', 'Geri al', 'Revert')}
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-700 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? strings.saving : label('حفظ ونشر', 'Kaydet ve yayınla', 'Save & publish')}
          </button>
        </div>
      )}
      {lastSaved && dirty.size === 0 && (
        <p className="text-center text-xs text-slate-400">
          {strings.lastSaved} {lastSaved}
        </p>
      )}

      {/* Focused single-section editor ------------------------------------- */}
      {openSectionDef && (
        <SectionEditorOverlay
          section={openSectionDef}
          tone={tone}
          value={value}
          onChange={updateField}
          contentLocale={contentLocale}
          onLocaleChange={onLocaleChange}
          dirty={dirty.size > 0}
          saving={saving}
          onSave={save}
          onClose={() => setOpenSection(null)}
          previewNode={previewNode}
          roomForColumn={roomForColumn}
          togglePreview={togglePreview}
          showPreview={showPreview}
        />
      )}
    </div>
  );
}

// --- Single-section overlay --------------------------------------------------

type OverlayProps = {
  section: PageSectionDef;
  tone: AreaTone;
  value: unknown;
  onChange: (path: string, next: unknown) => void;
  contentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
  dirty: boolean;
  saving: boolean;
  onSave: () => Promise<boolean>;
  onClose: () => void;
  previewNode: React.ReactNode;
  roomForColumn: boolean;
  togglePreview: () => void;
  showPreview: boolean;
};

function SectionEditorOverlay({
  section,
  tone,
  value,
  onChange,
  contentLocale,
  onLocaleChange,
  dirty,
  saving,
  onSave,
  onClose,
  previewNode,
  roomForColumn,
  togglePreview,
  showPreview,
}: OverlayProps) {
  const { locale } = useI18n();
  const strings = useAdminStrings();
  const [showAdvanced, setShowAdvanced] = useState(false);
  useTopmostEscape(onClose, true);

  const label = (ar: string, tr: string, en: string) =>
    locale === 'ar' ? ar : locale === 'tr' ? tr : en;

  const Icon = section.icon;
  const dir = contentDir[contentLocale];
  const mainFields = section.fields.filter((field) => !field.advanced);
  const advancedFields = section.fields.filter((field) => field.advanced);
  const withPreview = showPreview && roomForColumn;

  const renderField = (field: PageFieldDef) => {
    const wide =
      field.full || ['textarea', 'paragraphs', 'list', 'repeater', 'image'].includes(field.type);
    return (
      <div key={field.path || section.key} className={wide ? 'md:col-span-2' : ''}>
        <label className="mb-1.5 block">
          <FieldLabel field={field} />
        </label>
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
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-slate-900/50 p-2 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={
          'flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ' +
          (withPreview ? 'max-w-7xl' : 'max-w-3xl')
        }
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 sm:px-5">
          <span className={'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ' + tone.soft}>
            <Icon size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-bold text-slate-900">{section.label[locale]}</h2>
            {section.description && (
              <p className="truncate text-xs text-slate-500">{section.description[locale]}</p>
            )}
          </div>
          <LocaleSwitch value={contentLocale} onChange={onLocaleChange} />
          <button
            type="button"
            onClick={togglePreview}
            title={label('معاينة الموقع', 'Site önizlemesi', 'Site preview')}
            className={
              'rounded-xl border p-2 transition ' +
              (showPreview
                ? 'border-primary-200 bg-primary-50 text-primary-700'
                : 'border-slate-200 text-slate-400 hover:text-slate-700')
            }
          >
            <Eye size={16} />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={strings.cancel}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className={'min-h-0 flex-1 ' + (withPreview ? 'grid lg:grid-cols-[minmax(0,1fr)_minmax(0,44%)]' : '')}>
          <div className="min-h-0 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{mainFields.map(renderField)}</div>

            {advancedFields.length > 0 && (
              <div className="mt-5 rounded-xl border border-dashed border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAdvanced((current) => !current)}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-start text-xs font-medium text-slate-500 transition hover:text-slate-800"
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

          {withPreview && (
            <div className="hidden min-h-0 border-slate-200 p-3 lg:block ltr:border-l rtl:border-r">
              {previewNode}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 bg-slate-50/60 px-4 py-3 sm:px-5">
          <p className="min-w-0 flex-1 text-xs text-slate-500">
            {dirty
              ? label('التغييرات لا تظهر على الموقع إلا بعد الحفظ', 'Değişiklikler ancak kaydedince sitede görünür', 'Changes reach the site only after saving')
              : strings.noChanges}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            {label('إغلاق', 'Kapat', 'Close')}
          </button>
          <button
            type="button"
            onClick={() => void onSave()}
            disabled={saving || !dirty}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-700 disabled:opacity-40"
          >
            <Save size={16} />
            {saving ? strings.saving : label('حفظ ونشر', 'Kaydet ve yayınla', 'Save & publish')}
          </button>
        </div>
      </div>
    </div>
  );
}
