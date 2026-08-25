import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { useAdminStrings } from '../hooks/useAdmin';
import { adminStrings } from '../i18n';
import { getResource } from '../lib/resources';
import { listRows, deleteRow, updateRow, pickLocalized } from '../lib/api';

export default function ResourceListPage() {
  const { key = '' } = useParams();
  const resource = getResource(key);
  const s = useAdminStrings();
  const { locale } = useI18n();
  const navigate = useNavigate();

  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterValue, setFilterValue] = useState<string>('');

  useEffect(() => {
    setSearch('');
    setFilterValue('');
  }, [key]);

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
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [resource, filterValue]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) =>
      pickLocalized(r[resource!.titleField], locale).toLowerCase().includes(q) ||
      String(r.slug ?? '').toLowerCase().includes(q),
    );
  }, [rows, search, locale, resource]);

  if (!resource) return <p className="text-slate-500">{s.noAccess}</p>;

  const title = adminStrings[locale].sections[resource.labelKey] ?? resource.key;

  // Reordering only makes sense while the list shows every row in its stored
  // order — not while a search or a collection filter is narrowing it.
  const canReorder = resource.defaultSort?.column === 'sort_order' && !search.trim();

  const move = async (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;

    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];

    // Positions are the source of truth; write back only what actually moved.
    const changed = next
      .map((row, position) => ({ row, position }))
      .filter(({ row, position }) => Number(row.sort_order) !== position);

    setRows(next.map((row, position) => ({ ...row, sort_order: position })));

    try {
      await Promise.all(
        changed.map(({ row, position }) =>
          updateRow(resource.table, String(row.id), { sort_order: position }),
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : s.saveError);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(s.confirmDelete)) return;
    try {
      await deleteRow(resource.table, id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      window.alert(e instanceof Error ? e.message : s.saveError);
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <Link
          to={`/admin/r/${resource.key}/new`}
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder={s.search}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 ps-9 pe-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
        {resource.filter && (
          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
          >
            <option value="">—</option>
            {resource.filter.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label[locale]}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-6 text-center text-sm text-slate-400">{s.loading}</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-400">{s.empty}</p>
        ) : (
          <table className="w-full text-start text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">{s.edit}</th>
                <th className="px-4 py-3 text-start font-semibold">{s.status}</th>
                {canReorder && (
                  <th className="px-4 py-3 text-start font-semibold">{s.order}</th>
                )}
                <th className="px-4 py-3 text-end font-semibold">{s.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row, index) => (
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
                    <span
                      className={
                        'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ' +
                        (row.is_published
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700')
                      }
                    >
                      {row.is_published ? s.published : s.draft}
                    </span>
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
                      <button
                        onClick={() => navigate(`/admin/r/${resource.key}/${row.id}`)}
                        className="icon-btn"
                        title={s.edit}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(String(row.id))}
                        className="icon-btn text-red-500"
                        title={s.delete}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
