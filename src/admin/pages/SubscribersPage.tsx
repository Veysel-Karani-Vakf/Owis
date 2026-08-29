import { useEffect, useMemo, useState } from 'react';
import { Copy, Download, Search, Trash2, Users } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import type { Locale, SubscriberRow } from '@/lib/types';
import { useAdminStrings } from '../hooks/useAdmin';
import { listRows, deleteRow } from '../lib/api';
import { translateDbError } from '../lib/errors';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmDialog';

const LANGUAGE_NAMES: Record<string, Record<Locale, string>> = {
  ar: { ar: 'العربية', tr: 'Arapça', en: 'Arabic' },
  tr: { ar: 'التركية', tr: 'Türkçe', en: 'Turkish' },
  en: { ar: 'الإنجليزية', tr: 'İngilizce', en: 'English' },
};

function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const tag = locale === 'ar' ? 'ar' : locale === 'tr' ? 'tr-TR' : 'en-GB';
  return new Intl.DateTimeFormat(tag, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

/**
 * Quote a CSV cell so commas, quotes and newlines survive Excel, and prefix
 * anything a spreadsheet would evaluate as a formula: the list is filled by
 * anonymous visitors, so a cell beginning with = + - @ cannot be trusted.
 */
const csvCell = (value: string) => {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
};

export default function SubscribersPage() {
  const s = useAdminStrings();
  const { locale } = useI18n();
  const toast = useToast();
  const confirm = useConfirm();
  const [rows, setRows] = useState<SubscriberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const label = (ar: string, tr: string, en: string) => (locale === 'ar' ? ar : locale === 'tr' ? tr : en);
  const languageName = (code: string | null) => (code && LANGUAGE_NAMES[code]?.[locale]) || code || '—';

  useEffect(() => {
    listRows('newsletter_subscribers', { sort: { column: 'created_at', ascending: false } })
      .then((data) => setRows(data as SubscriberRow[]))
      .catch((error) => toast.error(translateDbError(error, locale)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.email.toLowerCase().includes(q) || languageName(r.locale).toLowerCase().includes(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- languageName only depends on locale
  }, [rows, query, locale]);

  const remove = async (row: SubscriberRow) => {
    const ok = await confirm({
      title: s.deleteTitle.replace('{name}', row.email),
      body: label(
        'سيُحذف هذا العنوان من قائمة النشرة نهائياً.',
        'Bu adres bülten listesinden kalıcı olarak silinir.',
        'This address will be removed from the newsletter list permanently.',
      ),
      confirmLabel: s.delete,
      destructive: true,
    });
    if (!ok) return;
    try {
      await deleteRow('newsletter_subscribers', row.id);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      toast.success(s.deletedToast);
    } catch (error) {
      toast.error(translateDbError(error, locale));
    }
  };

  const exportCsv = () => {
    const header = [s.email, label('اللغة', 'Dil', 'Language'), s.date];
    const lines = [
      header.map(csvCell).join(','),
      ...filtered.map((r) => [r.email, languageName(r.locale), r.created_at].map(csvCell).join(',')),
    ];
    // The BOM tells Excel the file is UTF-8, otherwise Arabic headers open as garbage.
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success(label('تم تصدير الملف', 'Dosya dışa aktarıldı', 'File exported'));
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(filtered.map((r) => r.email).join(', '));
      toast.success(
        label(`تم نسخ ${filtered.length} عنواناً`, `${filtered.length} adres kopyalandı`, `${filtered.length} addresses copied`),
      );
    } catch {
      toast.error(label('تعذر النسخ', 'Kopyalanamadı', 'Could not copy'));
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">{s.sections.subscribers}</h1>
          {!loading && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              <Users size={12} />
              {rows.length}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyAll}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Copy size={15} />
            {label('نسخ كل العناوين', 'Tüm adresleri kopyala', 'Copy all addresses')}
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={15} />
            {label('تصدير CSV', 'CSV dışa aktar', 'Export CSV')}
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 ltr:left-3 rtl:right-3" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={label('ابحث عن بريد…', 'E-posta ara…', 'Search email…')}
          className="w-full rounded-lg border border-slate-300 bg-white py-2 text-sm ltr:pl-9 ltr:pr-3 rtl:pl-3 rtl:pr-9 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-6 text-center text-sm text-slate-400">{s.loading}</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-400">
            {rows.length === 0
              ? label('لا يوجد مشتركون بعد', 'Henüz abone yok', 'No subscribers yet')
              : label('لا نتائج تطابق البحث', 'Aramayla eşleşen sonuç yok', 'No results match')}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">{s.email}</th>
                  <th className="px-4 py-3 text-start font-semibold">{label('اللغة', 'Dil', 'Language')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{s.date}</th>
                  <th className="px-4 py-3 text-end font-semibold">{s.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">
                      <a href={`mailto:${r.email}`} className="hover:text-primary-700 hover:underline" dir="ltr">
                        {r.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{languageName(r.locale)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-400">{formatDate(r.created_at, locale)}</td>
                    <td className="px-4 py-3 text-end">
                      <button type="button" className="icon-btn text-red-500" title={s.delete} onClick={() => remove(r)}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
