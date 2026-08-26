import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, ArrowUp, ArrowDown, X, ExternalLink } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { LOCALES, type Locale } from '@/lib/types';
import { useAdminStrings } from '../hooks/useAdmin';
import { adminStrings } from '../i18n';
import { getResource, type FullResourceDef } from '../lib/resources';
import { listRows, deleteRow, updateRow, pickLocalized } from '../lib/api';
import { filledLocales } from '../lib/validate';
import { translateDbError } from '../lib/errors';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmDialog';

type Row = Record<string, unknown>;

const CHIP_LABEL: Record<Locale, string> = { ar: 'ع', tr: 'TR', en: 'EN' };

/** Public URL of a row, or null when the resource has no page per record. */
function publicUrlFor(resource: FullResourceDef, row: Row): string | null {
  if (!resource.publicRoute || typeof row.slug !== 'string' || !row.slug) return null;
  let url = resource.publicRoute.replace(':slug', row.slug);
  if (url.includes(':collection')) {
    if (typeof row.collection !== 'string' || !row.collection) return null;
    url = url.replace(':collection', row.collection);
  }
  return url;
}

function formatUpdated(value: unknown, locale: Locale): string {
  if (typeof value !== 'string' || !value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(locale === 'ar' ? 'ar-EG' : locale === 'tr' ? 'tr-TR' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ResourceListPage() {
  const { key = '' } = useParams();
  const resource = getResource(key);
  const s = useAdminStrings();
  const { locale } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  // Filters live in the URL so "Back" from an edit page lands on the same view
  // and the dashboard can deep-link to e.g. ?status=draft.
  const [params, setParams] = useSearchParams();
  const search = params.get('q') ?? '';
  const statusFilter = params.get('status') ?? '';
  const filterValue = params.get(resource?.filter?.column ?? 'filter') ?? '';

  const setParam = (name: string, value: string) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(name, value);
        else next.delete(name);
        return next;
      },
      { replace: true },
    );
  };

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resource) return;
    let active = true;
    setLoading(true);
    setError(null);
    listRows(resource.table, {
      sort: resource.defaultSort,
      filterColumn: resource.filter && filterValue ? resource.filter.column : undefined,
      filterValue: filterValue || undefined,
    })
      .then((data) => {
        if (active) setRows(data);
      })
      .catch((e) => active && setError(translateDbError(e, locale)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [resource, filterValue, locale]);

  const filtered = useMemo(() => {
    let result = rows;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        pickLocalized(r[resource!.titleField], locale).toLowerCase().includes(q) ||
        String(r.slug ?? '').toLowerCase().includes(q),
      );
    }

    if (statusFilter) {
      const isPublished = statusFilter === 'published';
      result = result.filter((r) => (r.is_published === isPublished));
    }

    return result;
  }, [rows, search, statusFilter, locale, resource]);

  if (!resource) return <p className="text-slate-500">{s.noAccess}</p>;

  const title = adminStrings[locale].sections[resource.labelKey] ?? resource.key;
  const label = (ar: string, tr: string, en: string) => (locale === 'ar' ? ar : locale === 'tr' ? tr : en);
  const Icon = resource.icon;

  // Reordering only makes sense while the list shows a whole ordered set. For
  // resources split into sections (collection / stat group) the site orders
  // each section on its own, so arrows appear only inside one section.
  const sortable = resource.defaultSort?.column === 'sort_order';
  const needsSection = Boolean(resource.filter) && !filterValue;
  const canReorder = sortable && !search.trim() && !statusFilter && !needsSection;

  const move = async (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= filtered.length) return;

    // `filtered` equals `rows` here (no search/status), but work by id so the
    // written positions never depend on array indices.
    const ordered = [...filtered];
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    const position = new Map(ordered.map((row, i) => [String(row.id), i]));
    const changed = ordered.filter((row) => Number(row.sort_order) !== position.get(String(row.id)));

    const previous = rows;
    setRows(ordered.map((row) => ({ ...row, sort_order: position.get(String(row.id)) })));

    try {
      await Promise.all(
        changed.map((row) => updateRow(resource.table, String(row.id), { sort_order: position.get(String(row.id)) })),
      );
    } catch (e) {
      setRows(previous);
      toast.error(translateDbError(e, locale));
    }
  };

  const togglePublished = async (row: Row) => {
    const next = !row.is_published;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_published: next } : r)));
    try {
      await updateRow(resource.table, String(row.id), { is_published: next });
      toast.success(next ? s.published : s.draft);
    } catch (e) {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_published: !next } : r)));
      toast.error(translateDbError(e, locale));
    }
  };

  const handleDelete = async (row: Row) => {
    const name = pickLocalized(row[resource.titleField], locale) || s.newItem;
    const ok = await confirm({
      title: s.deleteTitle.replace('{name}', name),
      body: s.deleteBody,
      confirmLabel: s.delete,
      destructive: true,
    });
    if (ok !== true) return;
    try {
      await deleteRow(resource.table, String(row.id));
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      toast.success(s.deletedToast);
    } catch (e) {
      toast.error(translateDbError(e, locale));
    }
  };

  const clearFilters = () => setParams(new URLSearchParams(), { replace: true });
  const hasFilters = Boolean(search || statusFilter || filterValue);
  const newHref = `/admin/r/${resource.key}/new`;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {resource.description && (
            <p className="mt-1 text-sm text-slate-500">{resource.description[locale]}</p>
          )}
        </div>
        <Link
          to={newHref}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          <Plus size={16} /> {s.create}
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="pointer-events-none absolute inset-y-0 my-auto ms-3 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setParam('q', e.target.value)}
            placeholder={s.search}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 ps-9 pe-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setParam('status', e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
        >
          <option value="">{s.all}</option>
          <option value="published">{s.published}</option>
          <option value="draft">{s.draft}</option>
        </select>

        {resource.filter && (
          <select
            value={filterValue}
            onChange={(e) => setParam(resource.filter!.column, e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
          >
            <option value="">{label('كل الأقسام', 'Tüm bölümler', 'All sections')}</option>
            {resource.filter.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label[locale]}
              </option>
            ))}
          </select>
        )}

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
            title={s.clear}
          >
            <X size={16} />
            {s.clear}
          </button>
        )}
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span>
          {filtered.length} {s.items}
        </span>
        {sortable && needsSection && !search.trim() && rows.length > 0 && (
          <span>{label('اختر قسماً لترتيب عناصره', 'Öğeleri sıralamak için bir bölüm seçin', 'Choose a section to reorder its items')}</span>
        )}
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-6 text-center text-sm text-slate-400">{s.loading}</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Icon size={22} />
            </span>
            <p className="text-sm font-medium text-slate-700">{s.empty}</p>
            {resource.description && (
              <p className="max-w-md text-xs text-slate-500">{resource.description[locale]}</p>
            )}
            {hasFilters ? (
              <button onClick={clearFilters} className="text-sm font-medium text-primary-700 hover:underline">
                {s.clear}
              </button>
            ) : (
              <Link
                to={newHref}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              >
                <Plus size={16} /> {s.addFirst}
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">{s.edit}</th>
                  <th className="px-4 py-3 text-start font-semibold">{s.status}</th>
                  <th className="px-4 py-3 text-start font-semibold">{s.translations}</th>
                  <th className="hidden px-4 py-3 text-start font-semibold md:table-cell">{s.updatedAt}</th>
                  {canReorder && (
                    <th className="px-4 py-3 text-start font-semibold">{s.order}</th>
                  )}
                  <th className="px-4 py-3 text-end font-semibold">{s.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row, index) => {
                  const filled = filledLocales(row[resource.titleField]);
                  const siteUrl = row.is_published ? publicUrlFor(resource, row) : null;
                  return (
                    <tr key={String(row.id)} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/admin/r/${resource.key}/${row.id}`)}
                          className="flex items-center gap-3 text-start"
                        >
                          {typeof row.image === 'string' && row.image && (
                            <img src={row.image} alt="" className="h-9 w-9 rounded object-cover" />
                          )}
                          {typeof row.logo === 'string' && row.logo && (
                            <img src={row.logo} alt="" className="h-9 w-9 rounded bg-slate-50 object-contain p-0.5" />
                          )}
                          <span className="font-medium text-slate-800">
                            {pickLocalized(row[resource.titleField], locale) || <span className="text-slate-400">—</span>}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => togglePublished(row)}
                          title={row.is_published ? s.unpublish : s.publish}
                          className={
                            'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium transition hover:ring-2 hover:ring-offset-1 ' +
                            (row.is_published
                              ? 'bg-emerald-100 text-emerald-700 hover:ring-emerald-200'
                              : 'bg-amber-100 text-amber-700 hover:ring-amber-200')
                          }
                        >
                          {row.is_published ? s.published : s.draft}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1" title={s.translations}>
                          {LOCALES.map((l) => (
                            <span
                              key={l}
                              className={
                                'inline-flex min-w-[1.75rem] justify-center rounded px-1 py-0.5 text-[10px] font-semibold leading-none ' +
                                (filled.includes(l) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400')
                              }
                            >
                              {CHIP_LABEL[l]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-xs text-slate-500 md:table-cell">
                        {formatUpdated(row.updated_at, locale)}
                      </td>
                      {canReorder && (
                        <td className="px-4 py-3">
                          <div className="flex gap-0.5">
                            <button
                              type="button"
                              onClick={() => move(index, -1)}
                              disabled={index === 0}
                              title={s.moveUp}
                              className="icon-btn disabled:opacity-30"
                            >
                              <ArrowUp size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => move(index, 1)}
                              disabled={index === filtered.length - 1}
                              title={s.moveDown}
                              className="icon-btn disabled:opacity-30"
                            >
                              <ArrowDown size={15} />
                            </button>
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          {siteUrl && (
                            <a
                              href={siteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="icon-btn"
                              title={s.openOnSite}
                            >
                              <ExternalLink size={15} />
                            </a>
                          )}
                          <button
                            onClick={() => navigate(`/admin/r/${resource.key}/${row.id}`)}
                            className="icon-btn"
                            title={s.edit}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(row)}
                            className="icon-btn text-red-500"
                            title={s.delete}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
