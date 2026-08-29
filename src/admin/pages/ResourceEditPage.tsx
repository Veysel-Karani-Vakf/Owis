import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Save, Trash2, ExternalLink } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { supabase } from '@/lib/supabase';
import type { Locale } from '@/lib/types';
import { useAdminStrings } from '../hooks/useAdmin';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { useSaveShortcut } from '../hooks/useSaveShortcut';
import { adminStrings } from '../i18n';
import { getResource, type FullResourceDef } from '../lib/resources';
import { emptyValue, toColumnValue } from '../lib/fields';
import { getRow, insertRow, updateRow, deleteRow, countRows, pickLocalized } from '../lib/api';
import { validateRecord, filledLocales } from '../lib/validate';
import { translateDbError } from '../lib/errors';
import { slugFromTitle } from '../lib/slug';
import { FormEngine } from '../components/FormEngine';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmDialog';
import { EditingLocaleProvider, LocaleSwitch, useEditingLocale } from '../components/EditingLocale';

type Values = Record<string, unknown>;

/** First non-empty string in a localized value. */
function firstFilled(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (value && typeof value === 'object') {
    for (const entry of Object.values(value as Record<string, unknown>)) {
      if (typeof entry === 'string' && entry.trim()) return entry.trim();
    }
  }
  return '';
}

function buildDefaults(resource: FullResourceDef): Values {
  const values: Values = {};
  resource.fields.forEach((f) => {
    values[f.key] = emptyValue(f.type);
  });
  values.is_published = true;
  values.sort_order = 0;
  Object.assign(values, resource.newDefaults ?? {});
  return values;
}

/** Public URL of a record, or null when the resource has no page per record. */
function publicUrlFor(resource: FullResourceDef, row: Values): string | null {
  if (!resource.publicRoute || typeof row.slug !== 'string' || !row.slug) return null;
  let url = resource.publicRoute.replace(':slug', row.slug);
  if (url.includes(':collection')) {
    if (typeof row.collection !== 'string' || !row.collection) return null;
    url = url.replace(':collection', row.collection);
  }
  return url;
}

function formatTime(value: unknown, locale: Locale): string {
  if (typeof value !== 'string' || !value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString(locale === 'ar' ? 'ar-EG' : locale === 'tr' ? 'tr-TR' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ResourceEditPage() {
  const { key = '', id = '' } = useParams();
  const resource = getResource(key);
  const { locale } = useI18n();
  if (!resource) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-600">
          {locale === 'ar' ? 'هذه القائمة غير موجودة.' : locale === 'tr' ? 'Böyle bir liste yok.' : 'There is no such list.'}
        </p>
        <Link to="/admin" className="mt-3 inline-block text-sm font-medium text-primary-700 hover:underline">
          {locale === 'ar' ? 'العودة إلى لوحة التحكم' : locale === 'tr' ? 'Panele dön' : 'Back to the dashboard'}
        </Link>
      </div>
    );
  }
  // Keyed so a jump from one record straight to another resets the form.
  return (
    <EditingLocaleProvider key={`${key}/${id}`}>
      <RecordEditor resource={resource} id={id} />
    </EditingLocaleProvider>
  );
}

function RecordEditor({ resource, id }: { resource: FullResourceDef; id: string }) {
  const isNew = id === 'new';
  const s = useAdminStrings();
  const { locale, isRtl } = useI18n();
  // The load effect must not re-run when the dashboard language changes —
  // that would refetch the row over the editor's unsaved typing.
  const localeRef = useRef(locale);
  localeRef.current = locale;
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const editing = useEditingLocale();

  const [values, setValues] = useState<Values>({});
  // JSON of the last loaded/saved row; the form is dirty when values differ.
  const [baseline, setBaseline] = useState<string>('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  // After a create we move to the record's own URL once the form is clean,
  // otherwise the unsaved-changes blocker would stop our own redirect.
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  // Set once the editor types an address by hand, which stops it tracking the title.
  const slugTouched = useRef(false);
  // The "link will change" confirmation is asked once per record, not per save.
  const slugChangeConfirmed = useRef(false);

  useEffect(() => {
    slugTouched.current = false;
    slugChangeConfirmed.current = false;
    setFieldErrors({});
    setError(null);
    if (isNew) {
      const defaults = buildDefaults(resource);
      setValues(defaults);
      setBaseline(JSON.stringify(defaults));
      setLastSavedAt(null);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    getRow(resource.table, id)
      .then((row) => {
        if (!active) return;
        setValues(row);
        setBaseline(JSON.stringify(row));
        setLastSavedAt(typeof row.updated_at === 'string' ? row.updated_at : null);
      })
      .catch((e) => active && setError(translateDbError(e, localeRef.current)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [resource, id, isNew]);

  const dirty = useMemo(() => baseline !== '' && JSON.stringify(values) !== baseline, [values, baseline]);

  const listTitle = adminStrings[locale].sections[resource.labelKey] ?? resource.key;
  const hasSlug = resource.fields.some((field) => field.key === 'slug');
  const label = (ar: string, tr: string, en: string) => (locale === 'ar' ? ar : locale === 'tr' ? tr : en);

  const setField = (k: string, v: unknown) => {
    if (k === 'slug') slugTouched.current = true;
    setFieldErrors((prev) => {
      if (!(k in prev)) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });

    setValues((prev) => {
      const next = { ...prev, [k]: v };

      // While a record is new, its address follows the title. Once it has been
      // published the slug is a live URL, so it is left alone.
      if (isNew && hasSlug && !slugTouched.current && k === resource.titleField) {
        const text = firstFilled(v);
        if (text) next.slug = slugFromTitle(text);
      }
      return next;
    });
  };

  const showFieldErrors = (errors: Record<string, string>) => {
    setFieldErrors(errors);
    const first = Object.keys(errors)[0];
    const el = first ? document.querySelector(`[data-field-key="${first}"]`) : null;
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  /** Looks for another row using the same slug (and section, for articles). */
  const slugTaken = async (slug: string): Promise<boolean> => {
    let query = supabase.from(resource.table).select('id').eq('slug', slug).limit(1);
    if (resource.table === 'library_articles' && typeof values.collection === 'string') {
      query = query.eq('collection', values.collection);
    }
    if (!isNew) query = query.neq('id', id);
    const { data, error: queryError } = await query;
    if (queryError) throw new Error(queryError.message);
    return (data ?? []).length > 0;
  };

  /** Validates, saves and reports whether the record is now persisted. */
  const saveAndReport = useCallback(async (): Promise<boolean> => {
    if (saving) return false;
    const errors = validateRecord(resource, values, locale);
    if (Object.keys(errors).length > 0) {
      showFieldErrors(errors);
      toast.error(s.fixErrors);
      return false;
    }

    setSaving(true);
    setError(null);
    try {
      if (hasSlug && typeof values.slug === 'string' && values.slug) {
        const loaded = baseline ? (JSON.parse(baseline) as Values) : {};
        if (!isNew && loaded.slug !== values.slug && !slugChangeConfirmed.current) {
          const ok = await confirm({
            title: label('تغيير رابط الصفحة؟', 'Sayfa bağlantısı değişsin mi?', 'Change the page link?'),
            body: label(
              'سيتغير رابط الصفحة على الموقع، وأي رابط قديم منشور أو مشارَك لن يعمل بعد الآن.',
              'Sayfanın adresi değişecek; daha önce paylaşılan eski bağlantılar artık çalışmayacak.',
              'The page address on the site will change; any old link already shared will stop working.',
            ),
            confirmLabel: s.confirm,
          });
          if (ok !== true) return false;
          slugChangeConfirmed.current = true;
        }
        if (await slugTaken(values.slug)) {
          const message = translateDbError('duplicate key slug', locale);
          showFieldErrors({ slug: message });
          toast.error(message);
          return false;
        }
      }

      // Only send known columns, coerced so blank dates/numbers reach Postgres as null.
      const payload: Values = {};
      resource.fields.forEach((f) => {
        payload[f.key] = toColumnValue(f.type, values[f.key]);
      });

      let saved: Values;
      if (isNew) {
        Object.entries(resource.newDefaults ?? {}).forEach(([k, v]) => {
          if (payload[k] === undefined || payload[k] === null || payload[k] === '') payload[k] = v;
        });
        if (payload.is_published === undefined) payload.is_published = true;
        // New records go to the end of the list unless the editor set an order.
        if (!payload.sort_order) payload.sort_order = await countRows(resource.table);
        saved = await insertRow(resource.table, payload);
      } else {
        saved = await updateRow(resource.table, id, payload);
      }

      setValues(saved);
      setBaseline(JSON.stringify(saved));
      setLastSavedAt(typeof saved.updated_at === 'string' ? saved.updated_at : new Date().toISOString());
      setFieldErrors({});
      toast.success(s.savedToast);
      if (isNew) setRedirectTo(`/admin/r/${resource.key}/${saved.id}`);
      return true;
    } catch (e) {
      const message = translateDbError(e, locale);
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setSaving(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saving, resource, values, locale, hasSlug, baseline, isNew, id, s, toast, confirm]);

  useEffect(() => {
    if (redirectTo && !dirty) navigate(redirectTo, { replace: true });
  }, [redirectTo, dirty, navigate]);

  useUnsavedChanges(dirty, saveAndReport);
  useSaveShortcut(dirty && !saving ? saveAndReport : null);

  // The button is labelled with the list's name, so it always goes there —
  // not to wherever the editor came from (dashboard, search, another tab).
  const goBack = () => navigate(`/admin/r/${resource.key}`);

  const remove = async () => {
    const name = pickLocalized(values[resource.titleField], locale) || s.newItem;
    const ok = await confirm({
      title: s.deleteTitle.replace('{name}', name),
      body: s.deleteBody,
      confirmLabel: s.delete,
      destructive: true,
    });
    if (ok !== true) return;
    try {
      await deleteRow(resource.table, id);
      // The record is gone; nothing left to protect from the blocker, so mark
      // the form clean and let the redirect effect leave once that lands.
      setBaseline(JSON.stringify(values));
      toast.success(s.deletedToast);
      setRedirectTo(`/admin/r/${resource.key}`);
    } catch (e) {
      toast.error(translateDbError(e, locale));
    }
  };

  const BackIcon = isRtl ? ArrowRight : ArrowLeft;
  const recordTitle = pickLocalized(values[resource.titleField], locale);
  const siteUrl = !isNew && values.is_published ? publicUrlFor(resource, values) : null;
  const titleFilled = filledLocales(values[resource.titleField]);
  const counts = { ar: titleFilled.includes('ar'), tr: titleFilled.includes('tr'), en: titleFilled.includes('en') };
  const savedTime = formatTime(lastSavedAt, locale);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
        >
          <BackIcon size={16} /> {listTitle}
        </button>
        <div className="flex flex-wrap items-center gap-2">
          {savedTime && !dirty && (
            <span className="text-xs text-slate-500">
              {s.lastSaved} {savedTime}
            </span>
          )}
          {siteUrl && (
            <a
              href={siteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <ExternalLink size={15} /> {s.openOnSite}
            </a>
          )}
          {!isNew && (
            <button
              onClick={remove}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 size={15} /> {s.delete}
            </button>
          )}
          <button
            onClick={() => void saveAndReport()}
            disabled={saving || !dirty}
            title={!dirty ? s.noChanges : undefined}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
          >
            <Save size={15} /> {saving ? s.saving : s.save}
          </button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold text-slate-900">
            {isNew ? s.newItem : recordTitle || s.edit}
          </h1>
          {resource.description && (
            <p className="mt-1 text-sm text-slate-500">{resource.description[locale]}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">{s.editingLanguage}</span>
          <LocaleSwitch value={editing.locale} onChange={editing.setLocale} counts={counts} />
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-400">{s.loading}</p>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <FormEngine fields={resource.fields} values={values} onChange={setField} errors={fieldErrors} />
        </div>
      )}
    </div>
  );
}
