import { useEffect, useState } from 'react';
import { Save, FileCog } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/i18n/useI18n';
import { useAdminStrings } from '../hooks/useAdmin';
import { pickLocalized } from '../lib/api';
import { JsonInput } from '../components/FieldControls';
import type { SitePageRow } from '@/lib/types';

export default function SitePagesPage() {
  const s = useAdminStrings();
  const { locale } = useI18n();
  const [pages, setPages] = useState<SitePageRow[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [draft, setDraft] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from('site_pages')
      .select('*')
      .order('key')
      .then(({ data }) => {
        const rows = (data as SitePageRow[]) ?? [];
        setPages(rows);
        if (rows[0]) {
          setActive(rows[0].key);
          setDraft(rows[0].data);
        }
        setLoading(false);
      });
  }, []);

  const select = (key: string) => {
    const page = pages.find((p) => p.key === key);
    setActive(key);
    setDraft(page?.data ?? {});
    setSaved(false);
  };

  const save = async () => {
    if (!active) return;
    setSaving(true);
    await supabase.from('site_pages').update({ data: draft }).eq('key', active);
    setPages((prev) => prev.map((p) => (p.key === active ? { ...p, data: draft as Record<string, unknown> } : p)));
    setSaving(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const activePage = pages.find((p) => p.key === active);

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold text-slate-900">{s.sections.pages}</h1>
      {loading ? (
        <p className="text-sm text-slate-400">{s.loading}</p>
      ) : pages.length === 0 ? (
        <p className="text-sm text-slate-400">{s.empty}</p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
          <div className="space-y-1">
            {pages.map((p) => (
              <button
                key={p.key}
                onClick={() => select(p.key)}
                className={
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm transition ' +
                  (active === p.key ? 'bg-primary-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100')
                }
              >
                <FileCog size={15} />
                <span className="truncate">{pickLocalized(p.label, locale) || p.key}</span>
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">
                {activePage ? pickLocalized(activePage.label, locale) || activePage.key : ''}
              </h2>
              <div className="flex items-center gap-2">
                {saved && <span className="text-sm text-emerald-600">{s.saved}</span>}
                <button
                  onClick={save}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
                >
                  <Save size={15} /> {saving ? s.saving : s.save}
                </button>
              </div>
            </div>
            <JsonInput key={active} value={draft} onChange={setDraft} />
          </div>
        </div>
      )}
    </div>
  );
}
