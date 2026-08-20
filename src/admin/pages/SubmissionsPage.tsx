import { useEffect, useState } from 'react';
import { Check, Archive, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAdminStrings } from '../hooks/useAdmin';
import { listRows, deleteRow } from '../lib/api';
import type { SubmissionRow } from '@/lib/types';

const statusStyle: Record<SubmissionRow['status'], string> = {
  new: 'bg-primary-100 text-primary-700',
  read: 'bg-slate-100 text-slate-600',
  archived: 'bg-amber-100 text-amber-700',
};

export default function SubmissionsPage() {
  const s = useAdminStrings();
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<SubmissionRow | null>(null);

  const load = () => {
    setLoading(true);
    listRows('participate_submissions', { sort: { column: 'created_at', ascending: false } })
      .then((data) => setRows(data as SubmissionRow[]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const setStatus = async (id: string, status: SubmissionRow['status']) => {
    await supabase.from('participate_submissions').update({ status }).eq('id', id);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const remove = async (id: string) => {
    if (!window.confirm(s.confirmDelete)) return;
    await deleteRow('participate_submissions', id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold text-slate-900">{s.sections.submissions}</h1>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-6 text-center text-sm text-slate-400">{s.loading}</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-400">{s.empty}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">{s.status}</th>
                <th className="px-4 py-3 text-start font-semibold">Form</th>
                <th className="px-4 py-3 text-start font-semibold">{s.date}</th>
                <th className="px-4 py-3 text-end font-semibold">{s.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className={'rounded-full px-2.5 py-0.5 text-xs font-medium ' + statusStyle[r.status]}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">{r.form_id || '—'}</td>
                  <td className="px-4 py-3 text-slate-400" dir="ltr">
                    {r.created_at.slice(0, 16).replace('T', ' ')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button className="icon-btn" title={s.view} onClick={() => { setOpen(r); if (r.status === 'new') setStatus(r.id, 'read'); }}>
                        <Eye size={15} />
                      </button>
                      <button className="icon-btn" title={s.markRead} onClick={() => setStatus(r.id, 'read')}>
                        <Check size={15} />
                      </button>
                      <button className="icon-btn" title={s.archive} onClick={() => setStatus(r.id, 'archived')}>
                        <Archive size={15} />
                      </button>
                      <button className="icon-btn text-red-500" title={s.delete} onClick={() => remove(r.id)}>
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

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(null)}>
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-bold text-slate-900">{open.form_id || '—'}</h2>
            <pre className="whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-4 text-xs text-slate-700" dir="ltr">
              {JSON.stringify(open.payload, null, 2)}
            </pre>
            <button
              onClick={() => setOpen(null)}
              className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
            >
              {s.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
