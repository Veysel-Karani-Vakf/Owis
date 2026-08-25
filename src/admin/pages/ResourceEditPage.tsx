import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { useAdminStrings } from '../hooks/useAdmin';
import { adminStrings } from '../i18n';
import { getResource } from '../lib/resources';
import { emptyValue } from '../lib/fields';
import { getRow, insertRow, updateRow, deleteRow } from '../lib/api';
import { FormEngine } from '../components/FormEngine';
import { slugFromTitle } from '../lib/slug';

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

function buildDefaults(resource: ReturnType<typeof getResource>): Record<string, unknown> {
  if (!resource) return {};
  const values: Record<string, unknown> = {};
  resource.fields.forEach((f) => {
    values[f.key] = emptyValue(f.type);
  });
  values.is_published = true;
  values.sort_order = 0;
  Object.assign(values, resource.newDefaults ?? {});
  return values;
}

export default function ResourceEditPage() {
  const { key = '', id = '' } = useParams();
  const resource = getResource(key);
  const isNew = id === 'new';
  const s = useAdminStrings();
  const { locale, isRtl } = useI18n();
  const navigate = useNavigate();

  const [values, setValues] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  // Set once the editor types an address by hand, which stops it tracking the title.
  const slugTouched = useRef(false);

  useEffect(() => {
    if (!resource) return;
    if (isNew) {
      setValues(buildDefaults(resource));
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    getRow(resource.table, id)
      .then((row) => active && setValues(row))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [resource, id, isNew]);

  if (!resource) return <p className="text-slate-500">{s.noAccess}</p>;

  const title = adminStrings[locale].sections[resource.labelKey] ?? resource.key;
  const hasSlug = resource.fields.some((field) => field.key === 'slug');

  const setField = (k: string, v: unknown) => {
    if (k === 'slug') slugTouched.current = true;

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

  const save = async () => {
    setSaving(true);
    setError(null);
    // Only send known columns.
    const payload: Record<string, unknown> = {};
    resource.fields.forEach((f) => {
      payload[f.key] = values[f.key] ?? emptyValue(f.type);
    });
    try {
      if (isNew) {
        const created = await insertRow(resource.table, payload);
        navigate(`/admin/r/${resource.key}/${created.id}`, { replace: true });
      } else {
        await updateRow(resource.table, id, payload);
      }
      setError(null);
      flash();
    } catch (e) {
      setError(e instanceof Error ? e.message : s.saveError);
    } finally {
      setSaving(false);
    }
  };

  const flash = () => {
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1800);
  };

  const remove = async () => {
    if (!window.confirm(s.confirmDelete)) return;
    try {
      await deleteRow(resource.table, id);
      navigate(`/admin/r/${resource.key}`, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : s.saveError);
    }
  };

  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate(`/admin/r/${resource.key}`)}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
        >
          <BackIcon size={16} /> {title}
        </button>
        <div className="flex items-center gap-2">
          {savedFlash && <span className="text-sm font-medium text-emerald-600">{s.saved}</span>}
          {!isNew && (
            <button
              onClick={remove}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 size={15} /> {s.delete}
            </button>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
          >
            <Save size={15} /> {saving ? s.saving : s.save}
          </button>
        </div>
      </div>

      <h1 className="mb-5 text-2xl font-bold text-slate-900">{isNew ? s.newItem : s.edit}</h1>

      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-400">{s.loading}</p>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <FormEngine fields={resource.fields} values={values} onChange={setField} />
        </div>
      )}
    </div>
  );
}
