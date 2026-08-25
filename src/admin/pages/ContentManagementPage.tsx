import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Eye,
  PanelRightClose,
  PanelRightOpen,
  RotateCcw,
  Save,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/i18n/useI18n';
import { LOCALES, type Locale } from '@/lib/types';
import { hydrateCms } from '@/cms/hydrate';
import { setPublished } from '@/cms/store';
import type { CmsSnapshot } from '@/cms/store';
import { useAdminStrings } from '../hooks/useAdmin';
import {
  PAGE_GROUPS,
  SITE_PAGES,
  countPageFields,
  type PageSectionDef,
  type SitePageDef,
} from '../lib/pageSchema';
import { buildPageValue } from '../lib/pageDefaults';
import { getAtPath, setAtPath } from '../lib/paths';
import { normalizePageData } from '../lib/pageData';
import { PageFieldControl, contentDir } from '../components/PageFields';
import LivePreview from '../components/LivePreview';

type RawPages = Record<string, Record<string, unknown>>;
/** Form state keyed by `pageKey:locale`. */
type Drafts = Record<string, unknown>;

const localeName: Record<Locale, string> = { ar: 'العربية', tr: 'Türkçe', en: 'English' };

const PREVIEW_PREFERENCE = 'vkv-admin-preview';

function readPreviewPreference(): boolean {
  try {
    return window.localStorage.getItem(PREVIEW_PREFERENCE) === '1';
  } catch {
    return false;
  }
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

  const [rawPages, setRawPages] = useState<RawPages>({});
  const [drafts, setDrafts] = useState<Drafts>({});
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeKey, setActiveKey] = useState(SITE_PAGES[0].key);
  const [contentLocale, setContentLocale] = useState<Locale>(uiLocale);
  // One section at a time: a page can hold a dozen of them, and having several
  // expanded turns the column into a wall of inputs.
  const [openSection, setOpenSection] = useState<string | null>(SITE_PAGES[0].sections[0].key);
  const [highlight, setHighlight] = useState<string | null>(null);
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

  useEffect(() => {
    let active = true;
    supabase
      .from('site_pages')
      .select('key, data')
      .then(({ data, error: loadError }) => {
        if (!active) return;
        if (loadError) setError(loadError.message);
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
  }, []);

  // Forms open pre-filled with what the site currently renders.
  useEffect(() => {
    if (loading) return;
    setDrafts((current) => {
      if (draftKey in current) return current;
      return { ...current, [draftKey]: buildPageValue(activeKey, contentLocale) };
    });
  }, [draftKey, activeKey, contentLocale, loading]);

  const value = drafts[draftKey];

  const updateField = useCallback(
    (path: string, next: unknown) => {
      setDrafts((current) => ({ ...current, [draftKey]: setAtPath(current[draftKey] ?? {}, path, next) }));
      setDirty((current) => new Set(current).add(draftKey));
      setSavedAt(false);
    },
    [draftKey],
  );

  const revert = useCallback(() => {
    setDrafts((current) => ({ ...current, [draftKey]: buildPageValue(activeKey, contentLocale) }));
    setDirty((current) => {
      const next = new Set(current);
      next.delete(draftKey);
      return next;
    });
  }, [draftKey, activeKey, contentLocale]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);

    // Persist every edited page/locale pair, not just the one on screen.
    const byPage = new Map<string, Record<string, unknown>>();
    for (const key of dirty) {
      const [pageKey, editedLocale] = key.split(':');
      const existing = byPage.get(pageKey) ?? { ...(rawPages[pageKey] ?? {}) };
      existing[editedLocale] = drafts[key];
      byPage.set(pageKey, existing);
    }

    const rows = [...byPage.entries()].map(([pageKey, data]) => {
      const definition = SITE_PAGES.find((item) => item.key === pageKey);
      return { key: pageKey, label: definition?.label ?? {}, data };
    });

    if (rows.length === 0) {
      setSaving(false);
      return;
    }

    const { error: saveError } = await supabase.from('site_pages').upsert(rows, { onConflict: 'key' });
    if (saveError) {
      setError(saveError.message);
      setSaving(false);
      return;
    }

    setRawPages((current) => {
      const next = { ...current };
      for (const [pageKey, data] of byPage) next[pageKey] = data;
      return next;
    });
    setDirty(new Set());
    // Refresh the shared snapshot so the dashboard reads back what it wrote.
    hydrateCms().then(setPublished).catch(() => undefined);
    setSaving(false);
    setSavedAt(true);
    window.setTimeout(() => setSavedAt(false), 2000);
  }, [dirty, drafts, rawPages]);

  const draftSnapshot = useMemo<CmsSnapshot>(
    () => ({
      tables: {},
      pages: { [activeKey]: { ...(rawPages[activeKey] ?? {}), [contentLocale]: value } },
    }),
    [activeKey, contentLocale, rawPages, value],
  );

  const label = (ar: string, tr: string, en: string) =>
    uiLocale === 'ar' ? ar : uiLocale === 'tr' ? tr : en;

  const toggleSection = (key: string) =>
    setOpenSection((current) => (current === key ? null : key));

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col gap-4">
      {/* Header ------------------------------------------------------------ */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-slate-900">
            {label('إدارة المحتوى', 'İçerik yönetimi', 'Content management')}
          </h1>
          <p className="text-sm text-slate-500">
            {label(
              'حرّر كل نص وصورة في الموقع',
              'Sitedeki her metni ve görseli düzenleyin',
              'Edit every text and image on the site',
            )}
          </p>
        </div>

        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {LOCALES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setContentLocale(option)}
              className={
                'rounded-md px-3 py-1.5 text-xs font-semibold transition ' +
                (contentLocale === option
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700')
              }
            >
              {localeName[option]}
            </button>
          ))}
        </div>

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

        <button
          type="button"
          onClick={save}
          disabled={saving || dirty.size === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40"
        >
          <Save size={16} />
          {saving ? strings.saving : savedAt ? strings.saved : strings.save}
          {dirty.size > 0 && !saving && (
            <span className="rounded-full bg-white/20 px-1.5 text-xs">{dirty.size}</span>
          )}
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600" dir="ltr">
          {error}
        </p>
      )}

      {/* Body -------------------------------------------------------------- */}
      <div
        className={
          'grid min-h-0 flex-1 gap-4 ' +
          (showPreview && roomForColumn
            ? 'lg:grid-cols-[210px_minmax(0,1fr)_minmax(0,1fr)]'
            : 'lg:grid-cols-[210px_minmax(0,1fr)]')
        }
      >
        <PageList
          activeKey={activeKey}
          onSelect={(key) => {
            setActiveKey(key);
            const definition = SITE_PAGES.find((item) => item.key === key);
            setOpenSection(definition ? definition.sections[0].key : null);
            setHighlight(null);
          }}
          dirty={dirty}
        />

        {/* Without the preview beside it the form would stretch the full width
            of a large screen, which makes long lines hard to scan. */}
        <div
          className={
            'min-h-0 overflow-y-auto pe-1 ' +
            (showPreview && roomForColumn ? '' : 'w-full max-w-4xl')
          }
        >
          {loading ? (
            <p className="p-4 text-sm text-slate-400">{strings.loading}</p>
          ) : (
            <div className="space-y-3">
              {page.sections.map((section) => (
                <SectionCard
                  key={section.key}
                  section={section}
                  page={page}
                  open={openSection === section.key}
                  onToggle={() => toggleSection(section.key)}
                  onFocus={() => setHighlight(section.anchor ?? null)}
                  focused={Boolean(section.anchor) && highlight === section.anchor}
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
              <div className="fixed inset-0 z-40 bg-slate-900/40 p-3">
                <div className="h-full">{preview}</div>
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

  return (
    <div className="min-h-0 space-y-5 overflow-y-auto">
      {PAGE_GROUPS.map((group) => {
        const items = SITE_PAGES.filter((page) => page.group === group.key);
        if (items.length === 0) return null;

        return (
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
                    className={
                      'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-start text-sm transition ' +
                      (active
                        ? 'bg-slate-900 font-medium text-white'
                        : 'text-slate-600 hover:bg-slate-100')
                    }
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="min-w-0 flex-1 truncate">{page.label[locale]}</span>
                    {hasEdits(page.key) && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    )}
                    <span
                      className={
                        'shrink-0 text-xs tabular-nums ' + (active ? 'text-white/50' : 'text-slate-400')
                      }
                    >
                      {countPageFields(page)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SectionCard({
  section,
  page,
  open,
  onToggle,
  onFocus,
  focused,
  value,
  onChange,
  contentLocale,
}: {
  section: PageSectionDef;
  page: SitePageDef;
  open: boolean;
  onToggle: () => void;
  onFocus: () => void;
  focused: boolean;
  value: unknown;
  onChange: (path: string, next: unknown) => void;
  contentLocale: Locale;
}) {
  const { locale } = useI18n();
  const Icon = section.icon;
  const dir = contentDir[contentLocale];

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Icon size={16} />
        </span>
        <button type="button" onClick={onToggle} className="min-w-0 flex-1 text-start">
          <span className="block truncate font-semibold text-slate-800">{section.label[locale]}</span>
          <span className="text-xs text-slate-400">
            {section.fields.length} {locale === 'ar' ? 'حقل' : locale === 'tr' ? 'alan' : 'fields'}
          </span>
        </button>

        {section.anchor && (
          <button
            type="button"
            onClick={onFocus}
            title={page.route}
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
        <div className="grid grid-cols-1 gap-5 border-t border-slate-100 p-4 md:grid-cols-2">
          {section.fields.map((field) => {
            const wide =
              field.full || ['textarea', 'paragraphs', 'list', 'repeater', 'image'].includes(field.type);
            return (
              <div key={field.path || section.key} className={wide ? 'md:col-span-2' : ''}>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {field.label[locale]}
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
          })}
        </div>
      )}
    </section>
  );
}
