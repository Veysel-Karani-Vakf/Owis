import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from 'react';
import {
  Archive,
  ArchiveRestore,
  Check,
  Copy,
  Eye,
  Inbox,
  Mail,
  MailOpen,
  Paperclip,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useI18n } from '@/i18n/useI18n';
import { getParticipateContent, type ParticipateFormField } from '@/data/participate';
import type { Locale, SubmissionRow } from '@/lib/types';
import { useAdminStrings } from '../hooks/useAdmin';
import { listRows, deleteRow } from '../lib/api';
import { translateDbError } from '../lib/errors';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmDialog';

type Status = SubmissionRow['status'];

/** One line of the detail panel: a field label and its (already stringified) value. */
type Entry = { key: string; label: string; value: string; files?: SubmissionFile[] };

/** Shape written by src/services/participateForms.ts into the `files` column. */
type SubmissionFile = { fieldId?: string; name?: string; size?: number; type?: string; url?: string };

type PayloadField = { id?: string; sourceName?: string; label?: string; value?: unknown };

const statusStyle: Record<Status, string> = {
  new: 'bg-primary-100 text-primary-700 border border-primary-200',
  read: 'bg-slate-100 text-slate-600 border border-slate-200',
  archived: 'bg-amber-100 text-amber-700 border border-amber-200',
};

const statusIcon: Record<Status, typeof Mail> = {
  new: Mail,
  read: MailOpen,
  archived: Archive,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s().-]{6,}$/;

/** Stringify any payload value the way a human would read it in the panel. */
function valueToText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        item && typeof item === 'object' && 'name' in item ? String((item as { name: unknown }).name) : valueToText(item),
      )
      .filter(Boolean)
      .join(', ');
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj.name === 'string') return obj.name;
    return JSON.stringify(obj);
  }
  return String(value);
}

function formatSize(bytes: number | undefined): string {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  // Editors read the inbox in their own language; the tag picks digits and month names accordingly.
  const tag = locale === 'ar' ? 'ar' : locale === 'tr' ? 'tr-TR' : 'en-GB';
  return new Intl.DateTimeFormat(tag, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export default function SubmissionsPage() {
  const s = useAdminStrings();
  const { locale } = useI18n();
  const toast = useToast();
  const confirm = useConfirm();
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [query, setQuery] = useState('');

  const label = (ar: string, tr: string, en: string) => (locale === 'ar' ? ar : locale === 'tr' ? tr : en);

  const statusLabel: Record<Status, string> = {
    new: label('جديد', 'Yeni', 'New'),
    read: label('مقروء', 'Okundu', 'Read'),
    archived: label('مؤرشف', 'Arşivlendi', 'Archived'),
  };

  // The participate pages give each form its human name and its field labels,
  // so the inbox can say "تطوع" instead of "volunteer" and "الاسم" instead of "name".
  const forms = useMemo(() => {
    const content = getParticipateContent(locale);
    const byId = new Map<string, { name: string; fields: ParticipateFormField[] }>();
    for (const page of Object.values(content.pages)) {
      if (!page.form) continue;
      const nav = content.nav.find((item) => item.key === page.key);
      byId.set(page.form.id, { name: page.hero.title || nav?.label || page.form.id, fields: page.form.fields });
    }
    return byId;
  }, [locale]);

  const formName = (formId: string | null) => (formId && forms.get(formId)?.name) || formId || '—';

  const load = () => {
    setLoading(true);
    listRows('participate_submissions', { sort: { column: 'created_at', ascending: false } })
      .then((data) => setRows(data as SubmissionRow[]))
      .catch((error) => toast.error(translateDbError(error, locale)))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  useEffect(load, []);

  const setStatus = async (id: string, status: Status, silent = false) => {
    const previous = rows.find((r) => r.id === id)?.status;
    if (previous === status) return;
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    const { error } = await supabase.from('participate_submissions').update({ status }).eq('id', id);
    if (error) {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: previous ?? r.status } : r)));
      toast.error(translateDbError(error.message, locale));
      return;
    }
    if (!silent) {
      toast.success(
        status === 'archived'
          ? label('تمت الأرشفة', 'Arşivlendi', 'Archived')
          : status === 'read'
            ? label('وُضع كمقروء', 'Okundu olarak işaretlendi', 'Marked as read')
            : label('وُضع كجديد', 'Yeni olarak işaretlendi', 'Marked as new'),
      );
    }
  };

  const remove = async (row: SubmissionRow) => {
    const name = `${formName(row.form_id)} — ${formatDate(row.created_at, locale)}`;
    const ok = await confirm({
      title: s.deleteTitle.replace('{name}', name),
      body: label(
        'ستُحذف الرسالة نهائياً مع مرفقاتها ولا يمكن استرجاعها. إن أردت إخفاءها فقط فاختر الأرشفة.',
        'Mesaj ekleriyle birlikte kalıcı olarak silinir ve geri alınamaz. Sadece gizlemek için arşivleyin.',
        'The message and its attachments will be deleted permanently. To just hide it, archive it instead.',
      ),
      confirmLabel: s.delete,
      destructive: true,
    });
    if (!ok) return;
    try {
      await deleteRow('participate_submissions', row.id);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      if (openId === row.id) setOpenId(null);
      toast.success(s.deletedToast);
    } catch (error) {
      toast.error(translateDbError(error, locale));
    }
  };

  const openRow = (row: SubmissionRow) => {
    setOpenId(row.id);
    // Opening counts as reading; do it quietly so the panel is not buried under a toast.
    if (row.status === 'new') void setStatus(row.id, 'read', true);
  };

  /** Turns the stored payload (fields array or flat object) into labelled entries. */
  const entriesFor = (row: SubmissionRow): Entry[] => {
    const defs = row.form_id ? forms.get(row.form_id)?.fields ?? [] : [];
    const files = Array.isArray(row.files) ? (row.files as SubmissionFile[]) : [];
    const findDef = (key: string | undefined) =>
      key ? defs.find((f) => f.id === key || f.sourceName === key) : undefined;
    const filesFor = (key: string | undefined) => (key ? files.filter((f) => f.fieldId === key) : []);

    const payload = row.payload ?? {};
    const rawFields = (payload as { fields?: unknown }).fields;
    const entries: Entry[] = [];

    if (Array.isArray(rawFields)) {
      for (const item of rawFields as PayloadField[]) {
        if (!item || typeof item !== 'object') continue;
        const key = item.id ?? item.sourceName ?? '';
        const def = findDef(item.id) ?? findDef(item.sourceName);
        const attached = filesFor(item.id);
        entries.push({
          key,
          label: def?.label || item.label || key,
          value: attached.length ? '' : valueToText(item.value),
          files: attached.length ? attached : undefined,
        });
      }
    } else {
      for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
        const attached = filesFor(key);
        entries.push({
          key,
          label: findDef(key)?.label || key,
          value: attached.length ? '' : valueToText(value),
          files: attached.length ? attached : undefined,
        });
      }
    }

    // Files not tied to any listed field still deserve a row.
    const shown = new Set(entries.flatMap((e) => e.files ?? []));
    const orphans = files.filter((f) => !shown.has(f));
    if (orphans.length) {
      entries.push({ key: '__files', label: label('المرفقات', 'Ekler', 'Attachments'), value: '', files: orphans });
    }
    return entries;
  };

  const searchText = (row: SubmissionRow) =>
    [formName(row.form_id), row.form_id ?? '', JSON.stringify(row.payload ?? {}), JSON.stringify(row.files ?? [])]
      .join(' ')
      .toLowerCase();

  const stats = useMemo(
    () => ({
      new: rows.filter((r) => r.status === 'new').length,
      read: rows.filter((r) => r.status === 'read').length,
      archived: rows.filter((r) => r.status === 'archived').length,
    }),
    [rows],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => (!statusFilter || r.status === statusFilter) && (!q || searchText(r).includes(q)));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- searchText only depends on `forms`
  }, [rows, statusFilter, query, forms]);

  const open = openId ? rows.find((r) => r.id === openId) ?? null : null;

  const cards: Array<{ status: Status; active: string; color: string; icon: typeof Mail }> = [
    { status: 'new', active: 'border-primary-500 bg-primary-50', color: 'text-primary-600', icon: Mail },
    { status: 'read', active: 'border-slate-400 bg-slate-50', color: 'text-slate-600', icon: MailOpen },
    { status: 'archived', active: 'border-amber-500 bg-amber-50', color: 'text-amber-600', icon: Archive },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">{s.sections.submissions}</h1>
        <p className="text-sm text-slate-500">
          {label('الرسائل المرسلة من نماذج صفحات "شارك معنا".', '"Katılın" sayfalarındaki formlardan gelen mesajlar.', 'Messages sent through the "Participate" page forms.')}
        </p>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {cards.map(({ status, active, color, icon: Icon }) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
            aria-pressed={statusFilter === status}
            className={`flex items-center justify-between rounded-lg border-2 px-4 py-3 text-start transition ${
              statusFilter === status ? active : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div>
              <div className={`text-2xl font-bold ${color}`}>{stats[status]}</div>
              <div className="text-xs font-semibold text-slate-600">{statusLabel[status]}</div>
            </div>
            <Icon size={22} className={`${color} opacity-60`} />
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <Search size={16} className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 ltr:left-3 rtl:right-3" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={label('ابحث في نص الرسائل…', 'Mesaj metninde ara…', 'Search message text…')}
          className="w-full rounded-lg border border-slate-300 bg-white py-2 text-sm ltr:pl-9 ltr:pr-3 rtl:pl-3 rtl:pr-9 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-6 text-center text-sm text-slate-400">{s.loading}</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-12">
            <Inbox size={32} className="text-slate-300" />
            <p className="text-sm text-slate-400">
              {rows.length === 0
                ? label('لم تصل أي رسائل بعد', 'Henüz mesaj gelmedi', 'No messages yet')
                : label('لا رسائل تطابق البحث', 'Aramayla eşleşen mesaj yok', 'No messages match')}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">{s.status}</th>
                  <th className="px-4 py-3 text-start font-semibold">{label('الصفحة', 'Sayfa', 'Page')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{label('المرسل', 'Gönderen', 'Sender')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{s.date}</th>
                  <th className="px-4 py-3 text-end font-semibold">{s.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r) => {
                  const Icon = statusIcon[r.status];
                  const isNew = r.status === 'new';
                  const entries = entriesFor(r);
                  // Best-effort "who sent it" for the list: first name-like field, else first email.
                  const sender =
                    entries.find((e) => /name|اسم|ad/i.test(e.key) && e.value)?.value ||
                    entries.find((e) => EMAIL_RE.test(e.value))?.value ||
                    '';
                  return (
                    <tr
                      key={r.id}
                      className={`cursor-pointer transition hover:bg-slate-50 ${isNew ? 'bg-primary-50/40' : ''} ${
                        openId === r.id ? 'bg-slate-100' : ''
                      }`}
                      onClick={() => openRow(r)}
                    >
                      <td className="px-4 py-3">
                        <span className={'flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ' + statusStyle[r.status]}>
                          <Icon size={12} />
                          {statusLabel[r.status]}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-slate-700 ${isNew ? 'font-bold' : 'font-medium'}`}>{formName(r.form_id)}</td>
                      <td className="max-w-[220px] truncate px-4 py-3 text-slate-600" dir="auto">
                        {sender || '—'}
                        {Array.isArray(r.files) && r.files.length > 0 && (
                          <Paperclip size={12} className="ms-1.5 inline text-slate-400" aria-hidden />
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-400">{formatDate(r.created_at, locale)}</td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <button type="button" className="icon-btn" title={s.view} onClick={() => openRow(r)}>
                            <Eye size={15} />
                          </button>
                          {r.status === 'new' ? (
                            <button type="button" className="icon-btn" title={s.markRead} onClick={() => setStatus(r.id, 'read')}>
                              <Check size={15} />
                            </button>
                          ) : (
                            <button type="button" className="icon-btn" title={s.markNew} onClick={() => setStatus(r.id, 'new')}>
                              <Sparkles size={15} />
                            </button>
                          )}
                          {r.status === 'archived' ? (
                            <button
                              type="button"
                              className="icon-btn"
                              title={label('إلغاء الأرشفة', 'Arşivden çıkar', 'Unarchive')}
                              onClick={() => setStatus(r.id, 'read')}
                            >
                              <ArchiveRestore size={15} />
                            </button>
                          ) : (
                            <button type="button" className="icon-btn" title={s.archive} onClick={() => setStatus(r.id, 'archived')}>
                              <Archive size={15} />
                            </button>
                          )}
                          <button type="button" className="icon-btn text-red-500" title={s.delete} onClick={() => remove(r)}>
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
          row={open}
          title={formName(open.form_id)}
          entries={entriesFor(open)}
          statusLabel={statusLabel}
          locale={locale}
          label={label}
          onClose={() => setOpenId(null)}
          onStatus={(status) => setStatus(open.id, status)}
          onDelete={() => remove(open)}
          onCopied={() => toast.success(label('تم نسخ الرسالة', 'Mesaj kopyalandı', 'Message copied'))}
          onCopyFailed={() => toast.error(label('تعذر النسخ', 'Kopyalanamadı', 'Could not copy'))}
        />
      )}
    </div>
  );
}

type DetailPanelProps = {
  row: SubmissionRow;
  title: string;
  entries: Entry[];
  statusLabel: Record<Status, string>;
  locale: Locale;
  label: (ar: string, tr: string, en: string) => string;
  onClose: () => void;
  onStatus: (status: Status) => void;
  onDelete: () => void;
  onCopied: () => void;
  onCopyFailed: () => void;
};

/**
 * Side panel that shows one message as a readable definition list instead of
 * raw JSON, with reply / copy / status actions close at hand.
 */
function DetailPanel({ row, title, entries, statusLabel, locale, label, onClose, onStatus, onDelete, onCopied, onCopyFailed }: DetailPanelProps) {
  const s = useAdminStrings();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const email = entries.find((e) => EMAIL_RE.test(e.value.trim()))?.value.trim();
  const StatusIcon = statusIcon[row.status];
  const replySubject = `Re: ${title}`;
  const messageLines = [
    `${title} — ${formatDate(row.created_at, locale)}`,
    ...(row.source_url ? [`${s.openOnSite}: ${row.source_url}`] : []),
    '',
    ...entries.map((e) => `${e.label}: ${e.files ? e.files.map((f) => f.url || f.name).join(', ') : e.value}`),
  ];
  const replyBody = [
    '',
    '',
    label('--- الرسالة الأصلية ---', '--- Orijinal mesaj ---', '--- Original message ---'),
    ...messageLines,
  ].join('\n');
  const gmailReplyUrl = email
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`
    : '';
  const mailtoReplyUrl = email
    ? `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`
    : '';
  const handleReplyByEmail = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!email || !gmailReplyUrl || !mailtoReplyUrl) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    const opened = window.open(gmailReplyUrl, '_blank');
    if (opened) {
      opened.opener = null;
      return;
    }
    window.location.href = mailtoReplyUrl;
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(messageLines.join('\n'));
      onCopied();
    } catch {
      onCopyFailed();
    }
  };

  const renderValue = (entry: Entry): ReactNode => {
    if (entry.files) {
      return (
        <ul className="space-y-1">
          {entry.files.map((file, index) => (
            <li key={`${file.url ?? file.name ?? index}`} className="flex items-center gap-1.5">
              <Paperclip size={13} className="shrink-0 text-slate-400" />
              {file.url ? (
                <a href={file.url} target="_blank" rel="noreferrer" className="break-all text-primary-700 underline-offset-2 hover:underline" dir="auto">
                  {file.name || file.url}
                </a>
              ) : (
                <span dir="auto">{file.name || '—'}</span>
              )}
              {file.size ? <span className="text-xs text-slate-400" dir="ltr">({formatSize(file.size)})</span> : null}
            </li>
          ))}
        </ul>
      );
    }
    const value = entry.value.trim();
    if (!value) return <span className="text-slate-400">—</span>;
    if (EMAIL_RE.test(value)) {
      return (
        <a href={`mailto:${value}`} className="break-all text-primary-700 underline-offset-2 hover:underline" dir="ltr">
          {value}
        </a>
      );
    }
    if (PHONE_RE.test(value) && /\d{6,}/.test(value.replace(/\D/g, ''))) {
      return (
        <a href={`tel:${value.replace(/[\s().-]/g, '')}`} className="text-primary-700 underline-offset-2 hover:underline" dir="ltr">
          {value}
        </a>
      );
    }
    return (
      <span className="whitespace-pre-wrap break-words" dir="auto">
        {entry.value}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="submission-title"
        className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <h2 id="submission-title" className="truncate text-lg font-bold text-slate-900">
              {title}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className={'flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ' + statusStyle[row.status]}>
                <StatusIcon size={11} />
                {statusLabel[row.status]}
              </span>
              <span>{formatDate(row.created_at, locale)}</span>
              {row.source_url && (
                <a href={row.source_url} target="_blank" rel="noreferrer" className="text-primary-700 hover:underline">
                  {s.openOnSite}
                </a>
              )}
            </div>
          </div>
          <button type="button" onClick={onClose} className="icon-btn shrink-0" aria-label={s.cancel}>
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {entries.length === 0 ? (
            <p className="text-sm text-slate-400">{s.empty}</p>
          ) : (
            <dl className="divide-y divide-slate-100">
              {entries.map((entry) => (
                <div key={entry.key} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-4">
                  <dt className="text-xs font-semibold text-slate-500" dir="auto">
                    {entry.label}
                  </dt>
                  <dd className="min-w-0 text-sm text-slate-800">{renderValue(entry)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <footer className="flex flex-wrap items-center gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          {email && (
            <a
              href={gmailReplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={label('فتح نافذة رد في Gmail', 'Gmail yanıt penceresini aç', 'Open Gmail reply window')}
              onClick={handleReplyByEmail}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              <Mail size={15} />
              {label('رد بالبريد', 'E-posta ile yanıtla', 'Reply by email')}
            </a>
          )}
          <button
            type="button"
            onClick={copyAll}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
          >
            <Copy size={15} />
            {label('نسخ الرسالة', 'Mesajı kopyala', 'Copy message')}
          </button>
          <span className="flex-1" />
          {row.status === 'new' ? (
            <button type="button" className="icon-btn" title={s.markRead} onClick={() => onStatus('read')}>
              <Check size={16} />
            </button>
          ) : (
            <button type="button" className="icon-btn" title={s.markNew} onClick={() => onStatus('new')}>
              <Sparkles size={16} />
            </button>
          )}
          {row.status === 'archived' ? (
            <button type="button" className="icon-btn" title={label('إلغاء الأرشفة', 'Arşivden çıkar', 'Unarchive')} onClick={() => onStatus('read')}>
              <ArchiveRestore size={16} />
            </button>
          ) : (
            <button type="button" className="icon-btn" title={s.archive} onClick={() => onStatus('archived')}>
              <Archive size={16} />
            </button>
          )}
          <button type="button" className="icon-btn text-red-500" title={s.delete} onClick={onDelete}>
            <Trash2 size={16} />
          </button>
        </footer>
      </aside>
    </div>
  );
}
