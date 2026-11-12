// Nominations for the Owais Volunteer Award: who applied, the full application
// behind each row, its review status and notes, the Excel export, and the
// switch + deadline that decide whether the public form accepts applications.

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  CalendarClock,
  Copy,
  CopyPlus,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  Inbox,
  Loader2,
  Mail,
  MessageCircle,
  Paperclip,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { countWords } from '@/components/award/form/applyState';
import { hydrateCms } from '@/cms/hydrate';
import { setPublished } from '@/cms/store';
import { getAwardFormContent } from '@/data/award/form';
import {
  AWARD_SETTINGS_KEY,
  awardWindow,
  formatAwardDeadline,
  parseAwardSettings,
  type AwardSettings,
} from '@/data/award/settings';
import { useI18n } from '@/i18n/useI18n';
import { supabase } from '@/lib/supabase';
import type { AwardApplicationRow, AwardApplicationStatus, Locale } from '@/lib/types';
import { SUBMISSIONS_BUCKET } from '@/services/participateForms';
import { useConfirm } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import { useAdminStrings } from '../hooks/useAdmin';
import { useTopmostEscape } from '../hooks/useTopmostEscape';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import {
  AWARD_APPLICATION_COLUMNS,
  AWARD_STATUSES,
  awardAnswers,
  awardImages,
  awardStatusLabel,
  categoryName,
  findDuplicates,
  formLanguageName,
  governorateName,
  periodLabel,
  searchText,
  socialLinks,
  submittedAt,
  whatsappUrl,
  type AwardStoredImage,
} from '../lib/awardApplications';
import { downloadAwardWorkbook } from '../lib/awardExport';
import { translateDbError } from '../lib/errors';

const TABLE = 'award_applications';
const PAGE_SIZE = 1000;

type Label = (ar: string, tr: string, en: string) => string;

const statusStyle: Record<AwardApplicationStatus, string> = {
  new: 'bg-primary-100 text-primary-700 border border-primary-200',
  reviewing: 'bg-amber-100 text-amber-700 border border-amber-200',
  shortlisted: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  rejected: 'bg-slate-200 text-slate-700 border border-slate-300',
  archived: 'bg-slate-100 text-slate-500 border border-slate-200',
};

/** Card look of each status filter: number colour, and border/fill while active. */
const statusCard: Record<AwardApplicationStatus | 'all', { color: string; active: string }> = {
  all: { color: 'text-slate-900', active: 'border-slate-700 bg-slate-50' },
  new: { color: 'text-primary-600', active: 'border-primary-500 bg-primary-50' },
  reviewing: { color: 'text-amber-600', active: 'border-amber-500 bg-amber-50' },
  shortlisted: { color: 'text-emerald-600', active: 'border-emerald-500 bg-emerald-50' },
  rejected: { color: 'text-slate-600', active: 'border-slate-500 bg-slate-100' },
  archived: { color: 'text-slate-400', active: 'border-slate-400 bg-slate-50' },
};

const inputClass =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100';

/** Every application, newest first (the API pages at 1000 rows). */
async function fetchApplications(): Promise<AwardApplicationRow[]> {
  const rows: AwardApplicationRow[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from(TABLE)
      .select(AWARD_APPLICATION_COLUMNS)
      .order('created_at', { ascending: false })
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    const page = (data ?? []) as unknown as AwardApplicationRow[];
    rows.push(...page);
    if (page.length < PAGE_SIZE) return rows;
  }
}

export default function AwardApplicationsPage() {
  const s = useAdminStrings();
  const { locale } = useI18n();
  const toast = useToast();
  const confirm = useConfirm();

  const [rows, setRows] = useState<AwardApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<AwardApplicationStatus | 'all'>('all');
  const [governorate, setGovernorate] = useState('');
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [exporting, setExporting] = useState(false);

  const label: Label = useCallback(
    (ar, tr, en) => (locale === 'ar' ? ar : locale === 'tr' ? tr : en),
    [locale],
  );

  useEffect(() => {
    let active = true;
    fetchApplications()
      .then((data) => active && setRows(data))
      .catch((error) => active && toast.error(translateDbError(error, locale)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  const duplicates = useMemo(() => findDuplicates(rows), [rows]);

  const counts = useMemo(() => {
    const tally = Object.fromEntries(AWARD_STATUSES.map((status) => [status, 0])) as Record<AwardApplicationStatus, number>;
    for (const row of rows) if (row.status in tally) tally[row.status] += 1;
    return tally;
  }, [rows]);

  // Only the governorates and fields that actually occur are offered as filters.
  const governorateOptions = useMemo(
    () =>
      [...new Set(rows.map((row) => row.governorate))]
        .map((code) => ({ code, name: governorateName(code, locale) }))
        .sort((a, b) => a.name.localeCompare(b.name, locale)),
    [rows, locale],
  );
  const categoryOptions = useMemo(() => {
    const options = getAwardFormContent(locale).fields.category.options;
    return (Object.keys(options) as (keyof typeof options)[])
      .filter((value) => rows.some((row) => row.category === value))
      .map((value) => ({ value, name: options[value] }));
  }, [rows, locale]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter(
      (row) =>
        (statusFilter === 'all' || row.status === statusFilter) &&
        (!governorate || row.governorate === governorate) &&
        (!category || row.category === category) &&
        (!needle || searchText(row, locale).includes(needle)),
    );
  }, [rows, statusFilter, governorate, category, query, locale]);

  const open = openId ? (rows.find((row) => row.id === openId) ?? null) : null;

  /** Saves one field of an application, optimistically; resolves false when the save failed. */
  const patchRow = async (
    id: string,
    patch: Partial<Pick<AwardApplicationRow, 'status' | 'admin_notes'>>,
  ): Promise<boolean> => {
    const previous = rows.find((row) => row.id === id);
    if (!previous) return false;
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
    const { error } = await supabase.from(TABLE).update(patch).eq('id', id);
    if (error) {
      setRows((current) => current.map((row) => (row.id === id ? previous : row)));
      toast.error(translateDbError(error, locale));
      return false;
    }
    return true;
  };

  const setStatus = async (row: AwardApplicationRow, status: AwardApplicationStatus) => {
    if (row.status === status) return;
    if (await patchRow(row.id, { status })) {
      toast.success(
        label('تم تغيير الحالة إلى: ', 'Durum değiştirildi: ', 'Status changed to: ') + awardStatusLabel[status][locale],
      );
    }
  };

  const remove = async (row: AwardApplicationRow) => {
    const ok = await confirm({
      title: s.deleteTitle.replace('{name}', `${row.initiative_name} (${row.reference_no ?? ''})`),
      body: label(
        'سيُحذف الطلب نهائياً مع صوره ولا يمكن استرجاعه. إن أردت إخفاءه فقط فاختر الحالة «مؤرشف».',
        'Başvuru fotoğraflarıyla birlikte kalıcı olarak silinir ve geri alınamaz. Sadece gizlemek için durumu “Arşivlendi” yapın.',
        'The application and its photos will be deleted permanently. To just put it away, set its status to “Archived”.',
      ),
      confirmLabel: s.delete,
      destructive: true,
    });
    if (ok !== true) return;
    const { error } = await supabase.from(TABLE).delete().eq('id', row.id);
    if (error) {
      toast.error(translateDbError(error, locale));
      return;
    }
    // The photos go with the row; a leftover object is harmless (private bucket), so this is best effort.
    const paths = awardImages(row).map((image) => image.path);
    if (paths.length) void supabase.storage.from(SUBMISSIONS_BUCKET).remove(paths);
    setRows((current) => current.filter((entry) => entry.id !== row.id));
    if (openId === row.id) setOpenId(null);
    toast.success(s.deletedToast);
  };

  const exportExcel = async () => {
    if (exporting || filtered.length === 0) return;
    setExporting(true);
    try {
      await downloadAwardWorkbook(filtered, locale, duplicates);
      toast.success(
        label(
          `تم تجهيز ملف Excel (${filtered.length} طلب)`,
          `Excel dosyası hazır (${filtered.length} başvuru)`,
          `Excel file ready (${filtered.length} applications)`,
        ),
      );
    } catch {
      toast.error(label('تعذر إنشاء ملف Excel', 'Excel dosyası oluşturulamadı', 'Could not create the Excel file'));
    } finally {
      setExporting(false);
    }
  };

  const filtersActive = statusFilter !== 'all' || Boolean(governorate || category || query.trim());

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900">{s.sections.award_applications}</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {label(
              'المبادرات المتقدمة لجائزة أويس للأعمال التطوعية عبر استمارة الترشيح في الموقع.',
              'Sitedeki aday gösterme formuyla Owais Gönüllülük Ödülü’ne başvuran girişimler.',
              'Initiatives nominated for the Owais Volunteer Award through the form on the site.',
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void exportExcel()}
          disabled={exporting || filtered.length === 0}
          title={
            filtersActive
              ? label('يُصدَّر ما يظهر في الجدول بعد الفلترة', 'Filtrelenmiş tablo dışa aktarılır', 'Exports what the filtered table shows')
              : undefined
          }
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {exporting ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
          {label('تحميل Excel', 'Excel indir', 'Download Excel')}
          {!loading && filtered.length > 0 && (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{filtered.length}</span>
          )}
        </button>
      </div>

      <ApplicationWindowCard label={label} locale={locale} />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {(['all', ...AWARD_STATUSES] as const).map((status) => {
          const active = statusFilter === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(active ? 'all' : status)}
              aria-pressed={active}
              className={`rounded-lg border-2 px-4 py-3 text-start transition ${
                active ? statusCard[status].active : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className={`text-2xl font-bold ${statusCard[status].color}`}>
                {status === 'all' ? rows.length : counts[status]}
              </div>
              <div className="text-xs font-semibold text-slate-600">
                {status === 'all' ? label('كل الطلبات', 'Tüm başvurular', 'All applications') : awardStatusLabel[status][locale]}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search size={16} className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 ltr:left-3 rtl:right-3" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={label(
              'ابحث باسم المبادرة أو الممثل أو البريد أو رقم الطلب…',
              'Girişim, temsilci, e-posta veya başvuru no ara…',
              'Search initiative, representative, email or application no.…',
            )}
            className={`${inputClass} w-full ltr:pl-9 rtl:pr-9`}
          />
        </div>
        <select
          value={governorate}
          onChange={(event) => setGovernorate(event.target.value)}
          aria-label={label('المحافظة', 'İl', 'Governorate')}
          className={inputClass}
        >
          <option value="">{label('كل المحافظات', 'Tüm iller', 'All governorates')}</option>
          {governorateOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label={label('المجال', 'Alan', 'Field')}
          className={inputClass}
        >
          <option value="">{label('كل المجالات', 'Tüm alanlar', 'All fields')}</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-6 text-center text-sm text-slate-400">{s.loading}</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-12">
            <Inbox size={32} className="text-slate-300" />
            <p className="text-sm text-slate-400">
              {rows.length === 0
                ? label('لم تصل أي طلبات ترشيح بعد', 'Henüz başvuru gelmedi', 'No applications yet')
                : label('لا طلبات تطابق البحث', 'Aramayla eşleşen başvuru yok', 'No applications match')}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">{label('رقم الطلب', 'Başvuru no', 'Application no.')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{label('المبادرة', 'Girişim', 'Initiative')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{label('الممثل', 'Temsilci', 'Representative')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{label('المحافظة', 'İl', 'Governorate')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{label('المجال', 'Alan', 'Field')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{s.date}</th>
                  <th className="px-4 py-3 text-start font-semibold">{s.status}</th>
                  <th className="px-4 py-3 text-end font-semibold">{s.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => {
                  const isNew = row.status === 'new';
                  return (
                    <tr
                      key={row.id}
                      className={`cursor-pointer transition hover:bg-slate-50 ${isNew ? 'bg-primary-50/40' : ''} ${
                        openId === row.id ? 'bg-slate-100' : ''
                      }`}
                      onClick={() => setOpenId(row.id)}
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-600" dir="ltr">
                        {row.reference_no ?? '—'}
                      </td>
                      <td className={`max-w-[260px] px-4 py-3 text-slate-800 ${isNew ? 'font-bold' : 'font-medium'}`}>
                        <span className="line-clamp-2" dir="auto">
                          {row.initiative_name}
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-1.5">
                          {duplicates.has(row.id) && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                              <CopyPlus size={11} />
                              {label('مكرر', 'Yinelenen', 'Duplicate')}
                            </span>
                          )}
                          {awardImages(row).length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                              <Paperclip size={11} />
                              {awardImages(row).length}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="max-w-[180px] truncate px-4 py-3 text-slate-600" dir="auto">
                        {row.representative}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{governorateName(row.governorate, locale)}</td>
                      <td className="max-w-[160px] truncate px-4 py-3 text-slate-600" dir="auto">
                        {categoryName(row, locale)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-400">{submittedAt(row.created_at, locale)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[row.status] ?? ''}`}>
                          {awardStatusLabel[row.status]?.[locale] ?? row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <button type="button" className="icon-btn" title={s.view} onClick={() => setOpenId(row.id)}>
                            <Eye size={15} />
                          </button>
                          <button type="button" className="icon-btn text-red-500" title={s.delete} onClick={() => void remove(row)}>
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

      {open && (
        <DetailPanel
          key={open.id}
          row={open}
          duplicateOf={duplicates.get(open.id) ?? []}
          locale={locale}
          label={label}
          onClose={() => setOpenId(null)}
          onStatus={(status) => void setStatus(open, status)}
          onSaveNotes={(notes) => patchRow(open.id, { admin_notes: notes })}
          onDelete={() => void remove(open)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Application window: master switch + deadline                              */
/* ------------------------------------------------------------------------- */

const SETTINGS_LABEL = { ar: 'إعدادات جائزة أويس', tr: 'Owais Ödülü ayarları', en: 'Owais Award settings' };

function ApplicationWindowCard({ label, locale }: { label: Label; locale: Locale }) {
  const toast = useToast();
  const [saved, setSaved] = useState<AwardSettings | null>(null);
  const [draft, setDraft] = useState<AwardSettings>({ accepting: true, deadline: null });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    supabase
      .from('site_pages')
      .select('data')
      .eq('key', AWARD_SETTINGS_KEY)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          // A failed read is not "no settings yet": never present the defaults as the live state.
          toast.error(label('تعذر تحميل إعدادات استقبال الطلبات', 'Başvuru ayarları yüklenemedi', 'Could not load the application settings'));
          return;
        }
        const settings = parseAwardSettings(data?.data);
        setSaved(settings);
        setDraft(settings);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  const dirty = saved !== null && (saved.accepting !== draft.accepting || saved.deadline !== draft.deadline);

  const save = async (): Promise<boolean> => {
    setSaving(true);
    const { error } = await supabase
      .from('site_pages')
      .upsert({ key: AWARD_SETTINGS_KEY, label: SETTINGS_LABEL, data: draft }, { onConflict: 'key' });
    setSaving(false);
    if (error) {
      toast.error(translateDbError(error, locale));
      return false;
    }
    setSaved(draft);
    // Refresh the shared snapshot so previews inside the dashboard see the new state.
    hydrateCms().then(setPublished).catch(() => undefined);
    toast.success(label('تم حفظ إعدادات استقبال الطلبات', 'Başvuru ayarları kaydedildi', 'Application settings saved'));
    return true;
  };

  useUnsavedChanges(dirty, save);

  const state = awardWindow(saved ?? draft);
  const pill = !saved
    ? { text: '…', style: 'bg-slate-100 text-slate-500' }
    : state.open
      ? { text: label('الاستمارة مفتوحة', 'Form açık', 'Form is open'), style: 'bg-emerald-100 text-emerald-700' }
      : state.reason === 'deadline'
        ? { text: label('انتهى الموعد — الاستمارة مغلقة', 'Süre doldu — form kapalı', 'Deadline passed — form closed'), style: 'bg-slate-200 text-slate-700' }
        : { text: label('الاستمارة مغلقة', 'Form kapalı', 'Form is closed'), style: 'bg-slate-200 text-slate-700' };

  return (
    <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
            <CalendarClock size={18} />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{label('استقبال الطلبات', 'Başvuru kabulü', 'Accepting applications')}</h2>
            <span className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${pill.style}`}>{pill.text}</span>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            role="switch"
            className="peer sr-only"
            checked={draft.accepting}
            disabled={!saved}
            onChange={(event) => setDraft((current) => ({ ...current, accepting: event.target.checked }))}
          />
          <span className="relative h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-300 after:absolute after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all ltr:after:left-0.5 rtl:after:right-0.5 ltr:peer-checked:after:left-[1.375rem] rtl:peer-checked:after:right-[1.375rem]" />
          {label('الاستمارة تستقبل الطلبات', 'Form başvuru kabul ediyor', 'The form accepts applications')}
        </label>

        <label className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700">
          {label('آخر يوم للتقديم', 'Son başvuru günü', 'Last day to apply')}
          <input
            type="date"
            value={draft.deadline ?? ''}
            disabled={!saved}
            onChange={(event) => setDraft((current) => ({ ...current, deadline: event.target.value || null }))}
            className={inputClass}
          />
          {draft.deadline && (
            <button
              type="button"
              onClick={() => setDraft((current) => ({ ...current, deadline: null }))}
              className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline"
            >
              {label('بدون موعد', 'Tarih yok', 'No deadline')}
            </button>
          )}
        </label>

        <button
          type="button"
          onClick={() => void save()}
          disabled={!dirty || saving}
          className="ms-auto inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {label('حفظ', 'Kaydet', 'Save')}
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        {draft.deadline
          ? label(
              `تُغلق الاستمارة تلقائياً بنهاية يوم ${formatAwardDeadline(draft.deadline, locale)} بتوقيت اليمن، وتظهر للزوار رسالة أن باب الترشيح مغلق.`,
              `Form, Yemen saatiyle ${formatAwardDeadline(draft.deadline, locale)} günü sonunda kendiliğinden kapanır; ziyaretçiler başvuruların kapalı olduğunu görür.`,
              `The form closes by itself at the end of ${formatAwardDeadline(draft.deadline, locale)}, Yemen time; visitors then see that applications are closed.`,
            )
          : label(
              'لا يوجد موعد إغلاق: تبقى الاستمارة مفتوحة حتى توقفها من المفتاح أو تحدد آخر يوم للتقديم.',
              'Kapanış tarihi yok: form, anahtarla kapatılana veya son gün belirlenene kadar açık kalır.',
              'No deadline: the form stays open until you switch it off or set a last day.',
            )}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------------- */
/* Detail panel                                                              */
/* ------------------------------------------------------------------------- */

type DetailPanelProps = {
  row: AwardApplicationRow;
  duplicateOf: string[];
  locale: Locale;
  label: Label;
  onClose: () => void;
  onStatus: (status: AwardApplicationStatus) => void;
  onSaveNotes: (notes: string) => Promise<boolean>;
  onDelete: () => void;
};

/** Side panel with the whole application, laid out like the form the applicant filled. */
function DetailPanel({ row, duplicateOf, locale, label, onClose, onStatus, onSaveNotes, onDelete }: DetailPanelProps) {
  const s = useAdminStrings();
  const toast = useToast();
  const form = getAwardFormContent(locale);
  const [notes, setNotes] = useState(row.admin_notes ?? '');
  const [savingNotes, setSavingNotes] = useState(false);

  useTopmostEscape(onClose);

  const links = socialLinks(row, locale);
  const images = awardImages(row);
  const answers = awardAnswers(row, locale);
  const whatsapp = whatsappUrl(row.whatsapp);
  const notesDirty = notes !== (row.admin_notes ?? '');

  const saveNotes = async () => {
    setSavingNotes(true);
    const ok = await onSaveNotes(notes);
    setSavingNotes(false);
    if (ok) toast.success(label('تم حفظ الملاحظات', 'Notlar kaydedildi', 'Notes saved'));
  };

  const copyAll = async () => {
    const lines = [
      `${row.initiative_name} — ${row.reference_no ?? ''}`,
      `${form.fields.representative.label}: ${row.representative}`,
      `${form.fields.phone.label}: ${row.whatsapp}`,
      `${form.fields.email.label}: ${row.email}`,
      `${form.fields.teamSize.label}: ${row.team_size}`,
      `${form.fields.location.label}: ${governorateName(row.governorate, locale)} — ${row.district}`,
      `${form.fields.period.label}: ${periodLabel(row, locale)}`,
      `${form.fields.category.label}: ${categoryName(row, locale)}`,
      ...links.map((link) => `${link.label}: ${link.url}`),
      '',
      ...answers.flatMap((answer) => [`${answer.title}:`, answer.answer, '']),
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      toast.success(label('تم نسخ بيانات الطلب', 'Başvuru bilgileri kopyalandı', 'Application copied'));
    } catch {
      toast.error(label('تعذر النسخ', 'Kopyalanamadı', 'Could not copy'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="award-application-title"
        className="flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <h2 id="award-application-title" className="text-lg font-bold leading-snug text-slate-900" dir="auto">
              {row.initiative_name}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="rounded bg-slate-100 px-2 py-0.5 font-mono font-semibold text-slate-700" dir="ltr">
                {row.reference_no ?? '—'}
              </span>
              <span className={`rounded-full px-2 py-0.5 font-medium ${statusStyle[row.status] ?? ''}`}>
                {awardStatusLabel[row.status]?.[locale] ?? row.status}
              </span>
              <span>{submittedAt(row.created_at, locale)}</span>
              {row.locale && <span>· {formLanguageName[row.locale] ?? row.locale}</span>}
            </div>
          </div>
          <button type="button" onClick={onClose} className="icon-btn shrink-0" aria-label={s.cancel}>
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          {duplicateOf.length > 0 && (
            <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>
                {label(
                  'يوجد طلب آخر بنفس البريد أو رقم الواتساب: ',
                  'Aynı e-posta veya WhatsApp numarasıyla başka başvuru var: ',
                  'Another application uses the same email or WhatsApp number: ',
                )}
                <span className="font-mono font-semibold" dir="ltr">
                  {duplicateOf.join(', ')}
                </span>
              </span>
            </p>
          )}

          <Section title={form.review.sections.basic}>
            <Field label={form.fields.representative.label}>
              <span dir="auto">{row.representative}</span>
            </Field>
            <Field label={form.fields.phone.label}>
              {whatsapp ? (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-primary-700 underline-offset-2 hover:underline"
                  dir="ltr"
                >
                  {row.whatsapp}
                </a>
              ) : (
                <span className="inline-block" dir="ltr">
                  {row.whatsapp}
                </span>
              )}
            </Field>
            <Field label={form.fields.email.label}>
              <a
                href={`mailto:${row.email}`}
                className="inline-block break-all text-primary-700 underline-offset-2 hover:underline"
                dir="ltr"
              >
                {row.email}
              </a>
            </Field>
            <Field label={form.fields.nationality.label}>
              {row.all_members_yemeni ? form.fields.nationality.yes : form.fields.nationality.no}
            </Field>
            <Field label={form.fields.teamSize.label}>{row.team_size}</Field>
          </Section>

          <Section title={form.review.sections.details}>
            <Field label={form.fields.location.label}>
              {governorateName(row.governorate, locale)} — <span dir="auto">{row.district}</span>
            </Field>
            <Field label={form.fields.period.label}>{periodLabel(row, locale)}</Field>
            <Field label={form.fields.category.label}>{categoryName(row, locale)}</Field>
            <Field label={form.fields.social.label}>
              {links.length === 0 ? (
                <span className="text-slate-400">—</span>
              ) : (
                <ul className="space-y-1">
                  {links.map((link) => (
                    <li key={link.url} className="flex flex-wrap items-baseline gap-x-2">
                      <span className="shrink-0 text-xs font-semibold text-slate-500">{link.label}</span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-primary-700 underline-offset-2 hover:underline"
                        dir="ltr"
                      >
                        {link.url}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </Field>
          </Section>

          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">{form.review.sections.impact}</h3>
            <div className="space-y-3">
              {answers.map((answer) => (
                <div key={answer.id} className="rounded-lg border border-slate-200 p-3.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{answer.title}</h4>
                    <span className="text-[11px] text-slate-400" dir="ltr">
                      {countWords(answer.answer)} / {answer.limit}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{answer.question}</p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800" dir="auto">
                    {answer.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              {form.review.sections.attachments} ({images.length})
            </h3>
            {images.length === 0 ? (
              <p className="text-sm text-slate-400">{form.review.noImages}</p>
            ) : (
              <PhotoGrid images={images} label={label} />
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-bold text-slate-900">{label('متابعة الطلب', 'Başvuru takibi', 'Review')}</h3>
            <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label={s.status}>
              {AWARD_STATUSES.map((status) => {
                const active = row.status === status;
                return (
                  <button
                    key={status}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onStatus(status)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? statusStyle[status] + ' ring-2 ring-slate-900/10'
                        : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {awardStatusLabel[status][locale]}
                  </button>
                );
              })}
            </div>
            <label className="mt-4 block text-xs font-semibold text-slate-600" htmlFor="award-admin-notes">
              {label('ملاحظات داخلية (لا تظهر للمتقدم)', 'Dahili notlar (başvurana gösterilmez)', 'Internal notes (never shown to the applicant)')}
            </label>
            <textarea
              id="award-admin-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              dir="auto"
              className={`${inputClass} mt-1.5 w-full resize-y`}
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => void saveNotes()}
                disabled={!notesDirty || savingNotes}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {savingNotes ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                {label('حفظ الملاحظات', 'Notları kaydet', 'Save notes')}
              </button>
            </div>
          </section>
        </div>

        <footer className="flex flex-wrap items-center gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <MessageCircle size={15} />
              {label('واتساب', 'WhatsApp', 'WhatsApp')}
            </a>
          )}
          <a
            href={`mailto:${row.email}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
          >
            <Mail size={15} />
            {label('بريد', 'E-posta', 'Email')}
          </a>
          <button
            type="button"
            onClick={() => void copyAll()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
          >
            <Copy size={15} />
            {label('نسخ البيانات', 'Bilgileri kopyala', 'Copy details')}
          </button>
          <span className="flex-1" />
          <button type="button" className="icon-btn text-red-500" title={s.delete} onClick={onDelete}>
            <Trash2 size={16} />
          </button>
        </footer>
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">{title}</h3>
      <dl className="divide-y divide-slate-100">{children}</dl>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-2.5 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4">
      <dt className="text-xs font-semibold text-slate-500">{label}</dt>
      <dd className="min-w-0 break-words text-sm text-slate-800">{children}</dd>
    </div>
  );
}

/** The supporting photos, opened through short-lived signed links (the bucket is private). */
function PhotoGrid({ images, label }: { images: AwardStoredImage[]; label: Label }) {
  const [urls, setUrls] = useState<Record<string, string> | null>(null);
  const paths = images.map((image) => image.path).join('|');

  useEffect(() => {
    let active = true;
    supabase.storage
      .from(SUBMISSIONS_BUCKET)
      .createSignedUrls(paths.split('|'), 60 * 60)
      .then(({ data }) => {
        if (!active) return;
        const next: Record<string, string> = {};
        for (const entry of data ?? []) if (entry.path && entry.signedUrl) next[entry.path] = entry.signedUrl;
        setUrls(next);
      });
    return () => {
      active = false;
    };
  }, [paths]);

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((image) => {
        const url = urls?.[image.path];
        return (
          <li key={image.path} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            {url ? (
              <a href={url} target="_blank" rel="noreferrer" className="group relative block aspect-[4/3]">
                <img src={url} alt={image.name} loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                  <ExternalLink size={18} />
                </span>
              </a>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center text-xs text-slate-400">
                {urls ? label('تعذر فتح الصورة', 'Fotoğraf açılamadı', 'Could not open the photo') : '…'}
              </div>
            )}
            <p className="truncate px-2 py-1.5 text-[11px] text-slate-500" dir="auto" title={image.name}>
              {image.name}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
