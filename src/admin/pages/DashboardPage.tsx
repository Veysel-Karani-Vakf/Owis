import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { useAdminStrings } from '../hooks/useAdmin';
import { adminStrings } from '../i18n';
import { RESOURCES } from '../lib/resources';
import { countRows, listRows } from '../lib/api';
import type { SubmissionRow } from '@/lib/types';

export default function DashboardPage() {
  const s = useAdminStrings();
  const { locale } = useI18n();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all(RESOURCES.map((r) => countRows(r.table).then((c) => [r.key, c] as const))).then((pairs) => {
      if (active) setCounts(Object.fromEntries(pairs));
    });
    listRows('participate_submissions', { sort: { column: 'created_at', ascending: false } })
      .then((rows) => active && setSubmissions((rows as SubmissionRow[]).slice(0, 6)))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">{s.overview}</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {RESOURCES.map((r) => {
          const Icon = r.icon;
          return (
            <Link
              key={r.key}
              to={`/admin/r/${r.key}`}
              className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary-300 hover:shadow-sm"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{counts[r.key] ?? '—'}</p>
              <p className="text-sm text-slate-500">{adminStrings[locale].sections[r.labelKey]}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 className="flex items-center gap-2 font-semibold text-slate-800">
            <Inbox size={18} /> {s.recentSubmissions}
          </h2>
          <Link to="/admin/submissions" className="text-sm text-primary-600 hover:underline">
            {s.view}
          </Link>
        </div>
        {submissions.length === 0 ? (
          <p className="p-5 text-sm text-slate-400">{s.empty}</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {submissions.map((sub) => (
              <li key={sub.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="font-medium text-slate-700">{sub.form_id || '—'}</span>
                <span className="text-slate-400" dir="ltr">
                  {sub.created_at.slice(0, 16).replace('T', ' ')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
