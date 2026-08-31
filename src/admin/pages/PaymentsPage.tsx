import { useEffect, useMemo, useState } from 'react';
import { CreditCard, Download, Search } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import type { Locale } from '@/lib/types';
import { useAdminStrings } from '../hooks/useAdmin';
import { listRows } from '../lib/api';
import { translateDbError } from '../lib/errors';
import { useToast } from '../components/Toast';

type PaymentRow = {
  id: string;
  oid: string;
  opportunity_slug: string | null;
  opportunity_title: string | null;
  donor_name: string;
  donor_email: string | null;
  donor_phone: string | null;
  amount: number | string;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  gateway_mode: 'mock' | 'test' | 'production';
  auth_code: string | null;
  error_message: string | null;
  masked_pan: string | null;
  created_at: string;
};

function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const tag = locale === 'ar' ? 'ar' : locale === 'tr' ? 'tr-TR' : 'en-GB';
  return new Intl.DateTimeFormat(tag, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function formatAmount(row: PaymentRow, locale: Locale): string {
  const tag = locale === 'ar' ? 'ar' : locale === 'tr' ? 'tr-TR' : 'en-US';
  const amount = Number(row.amount);
  try {
    return new Intl.NumberFormat(tag, { style: 'currency', currency: row.currency || 'TRY' }).format(amount);
  } catch {
    return `${amount} ${row.currency}`;
  }
}

/** See SubscribersPage: visitor-entered cells must not execute in Excel. */
const csvCell = (value: string) => {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
};

const STATUS_STYLES: Record<PaymentRow['status'], string> = {
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  pending: 'bg-amber-100 text-amber-700',
};

const MODE_STYLES: Record<PaymentRow['gateway_mode'], string> = {
  mock: 'bg-amber-100 text-amber-700',
  test: 'bg-sky-100 text-sky-700',
  production: 'bg-slate-100 text-slate-600',
};

export default function PaymentsPage() {
  const s = useAdminStrings();
  const { locale } = useI18n();
  const toast = useToast();
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentRow['status']>('all');

  const label = (ar: string, tr: string, en: string) => (locale === 'ar' ? ar : locale === 'tr' ? tr : en);

  const statusName = (status: PaymentRow['status']) =>
    status === 'paid'
      ? label('مدفوعة', 'Ödendi', 'Paid')
      : status === 'failed'
        ? label('فاشلة', 'Başarısız', 'Failed')
        : label('معلّقة', 'Beklemede', 'Pending');

  const modeName = (mode: PaymentRow['gateway_mode']) =>
    mode === 'production'
      ? label('إنتاج', 'Canlı', 'Live')
      : mode === 'test'
        ? label('اختبار البنك', 'Banka testi', 'Bank test')
        : label('محاكاة', 'Simülasyon', 'Mock');

  useEffect(() => {
    listRows('donation_payments', { sort: { column: 'created_at', ascending: false } })
      .then((data) => setRows(data as PaymentRow[]))
      .catch((error) => toast.error(translateDbError(error, locale)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false;
      if (!q) return true;
      return [row.donor_name, row.donor_email ?? '', row.opportunity_title ?? '', row.oid]
        .some((value) => value.toLowerCase().includes(q));
    });
  }, [rows, query, statusFilter]);

  const exportCsv = () => {
    const header = [
      s.date,
      label('المتبرع', 'Bağışçı', 'Donor'),
      s.email,
      label('الفرصة', 'Fırsat', 'Opportunity'),
      label('المبلغ', 'Tutar', 'Amount'),
      label('الحالة', 'Durum', 'Status'),
      label('الوضع', 'Mod', 'Mode'),
      label('رقم التفويض', 'Onay kodu', 'Auth code'),
      label('رقم العملية', 'İşlem no', 'Order id'),
    ];
    const lines = [
      header.map(csvCell).join(','),
      ...filtered.map((row) =>
        [
          row.created_at,
          row.donor_name,
          row.donor_email ?? '',
          row.opportunity_title ?? row.opportunity_slug ?? '',
          `${Number(row.amount)} ${row.currency}`,
          statusName(row.status),
          modeName(row.gateway_mode),
          row.auth_code ?? '',
          row.oid,
        ]
          .map(csvCell)
          .join(','),
      ),
    ];
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success(label('تم تصدير الملف', 'Dosya dışa aktarıldı', 'File exported'));
  };

  const statusFilters: { value: 'all' | PaymentRow['status']; text: string }[] = [
    { value: 'all', text: label('الكل', 'Tümü', 'All') },
    { value: 'paid', text: statusName('paid') },
    { value: 'failed', text: statusName('failed') },
    { value: 'pending', text: statusName('pending') },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">{s.sections.payments}</h1>
          {!loading && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              <CreditCard size={12} />
              {rows.length}
            </span>
          )}
        </div>
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

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search size={16} className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 ltr:left-3 rtl:right-3" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={label('ابحث باسم المتبرع أو البريد أو رقم العملية…', 'Bağışçı, e-posta veya işlem no ara…', 'Search donor, email or order id…')}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 text-sm ltr:pl-9 ltr:pr-3 rtl:pl-3 rtl:pr-9 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <div className="flex gap-1.5">
          {statusFilters.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatusFilter(option.value)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                statusFilter === option.value
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-6 text-center text-sm text-slate-400">{s.loading}</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-400">
            {rows.length === 0
              ? label('لا توجد عمليات دفع بعد', 'Henüz ödeme işlemi yok', 'No payments yet')
              : label('لا نتائج تطابق البحث', 'Aramayla eşleşen sonuç yok', 'No results match')}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">{s.date}</th>
                  <th className="px-4 py-3 text-start font-semibold">{label('المتبرع', 'Bağışçı', 'Donor')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{label('الفرصة', 'Fırsat', 'Opportunity')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{label('المبلغ', 'Tutar', 'Amount')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{label('الحالة', 'Durum', 'Status')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{label('الوضع', 'Mod', 'Mode')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{label('التفاصيل', 'Ayrıntı', 'Details')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row.id} className="align-top hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-400">{formatDate(row.created_at, locale)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700">{row.donor_name}</p>
                      {row.donor_email && (
                        <a href={`mailto:${row.donor_email}`} className="text-xs text-slate-400 hover:text-primary-700 hover:underline" dir="ltr">
                          {row.donor_email}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.opportunity_title ?? row.opportunity_slug ?? '—'}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-800">{formatAmount(row, locale)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[row.status]}`}>
                        {statusName(row.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${MODE_STYLES[row.gateway_mode]}`}>
                        {modeName(row.gateway_mode)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {row.status === 'paid' && row.auth_code && (
                        <p dir="ltr">{label('رقم التفويض', 'Onay kodu', 'Auth code')}: {row.auth_code}</p>
                      )}
                      {row.status === 'failed' && row.error_message && <p dir="ltr">{row.error_message}</p>}
                      {row.masked_pan && (
                        <p className="text-slate-400" dir="ltr">
                          {row.masked_pan}
                        </p>
                      )}
                      <p className="font-mono text-[10px] text-slate-300" dir="ltr">
                        {row.oid}
                      </p>
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
