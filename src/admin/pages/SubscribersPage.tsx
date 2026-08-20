import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useAdminStrings } from '../hooks/useAdmin';
import { listRows, deleteRow } from '../lib/api';
import type { SubscriberRow } from '@/lib/types';

export default function SubscribersPage() {
  const s = useAdminStrings();
  const [rows, setRows] = useState<SubscriberRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listRows('newsletter_subscribers', { sort: { column: 'created_at', ascending: false } })
      .then((data) => setRows(data as SubscriberRow[]))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (id: string) => {
    if (!window.confirm(s.confirmDelete)) return;
    await deleteRow('newsletter_subscribers', id);
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold text-slate-900">{s.sections.subscribers}</h1>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-6 text-center text-sm text-slate-400">{s.loading}</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-400">{s.empty}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">{s.email}</th>
                <th className="px-4 py-3 text-start font-semibold">{s.date}</th>
                <th className="px-4 py-3 text-end font-semibold">{s.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-700" dir="ltr">
                    {r.email}
                  </td>
                  <td className="px-4 py-3 text-slate-400" dir="ltr">
                    {r.created_at.slice(0, 16).replace('T', ' ')}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <button className="icon-btn text-red-500" title={s.delete} onClick={() => remove(r.id)}>
                      <Trash2 size={15} />
                    </button>
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
