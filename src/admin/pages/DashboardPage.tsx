import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Inbox, LayoutTemplate, Images, Database } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { useAdminStrings } from '../hooks/useAdmin';
import { adminStrings } from '../i18n';
import { RESOURCES } from '../lib/resources';
import { SITE_PAGES, countPageFields } from '../lib/pageSchema';
import { countRows, listRows, pickLocalized } from '../lib/api';
import type { SubmissionRow } from '@/lib/types';

export default function DashboardPage() {
  const strings = useAdminStrings();
  const { locale, isRtl } = useI18n();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [newCount, setNewCount] = useState(0);

  const label = (ar: string, tr: string, en: string) =>
    locale === 'ar' ? ar : locale === 'tr' ? tr : en;

  useEffect(() => {
    let active = true;

    Promise.all(
      RESOURCES.map((resource) => countRows(resource.table).then((count) => [resource.key, count] as const)),
    ).then((pairs) => {
      if (active) setCounts(Object.fromEntries(pairs));
    });

    listRows('participate_submissions', { sort: { column: 'created_at', ascending: false } })
      .then((rows) => {
        if (!active) return;
        const typed = rows as SubmissionRow[];
        setSubmissions(typed.slice(0, 6));
        setNewCount(typed.filter((row) => row.status === 'new').length);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const editableFields = SITE_PAGES.reduce((sum, page) => sum + countPageFields(page), 0);
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const shortcuts = [
    {
      to: '/admin/content',
      icon: LayoutTemplate,
      title: label('إدارة المحتوى', 'İçerik yönetimi', 'Content management'),
      body: label(
        `${SITE_PAGES.length} صفحات و ${editableFields} حقلاً قابلاً للتحرير مع معاينة مباشرة`,
        `${SITE_PAGES.length} sayfa, ${editableFields} düzenlenebilir alan`,
        `${SITE_PAGES.length} pages, ${editableFields} editable fields with live preview`,
      ),
    },
    {
      to: '/admin/media',
      icon: Images,
      title: label('مكتبة الوسائط', 'Medya kütüphanesi', 'Media library'),
      body: label(
        'ارفع الصور والملفات واحصل على روابطها',
        'Görselleri yükleyin ve bağlantılarını alın',
        'Upload images and files, copy their links',
      ),
    },
    {
      to: '/admin/seed',
      icon: Database,
      title: label('استيراد المحتوى', 'İçeriği içe aktar', 'Import content'),
      body: label(
        'انسخ محتوى الموقع الأصلي إلى قاعدة البيانات',
        'Sitenin özgün içeriğini veritabanına aktarın',
        "Copy the site's original content into the database",
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{strings.overview}</h1>
        <p className="text-sm text-slate-500">
          {label(
            'كل ما يظهر على الموقع يُدار من هنا',
            'Sitede görünen her şey buradan yönetilir',
            'Everything on the site is managed from here',
          )}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {shortcuts.map((shortcut) => {
          const Icon = shortcut.icon;
          return (
            <Link
              key={shortcut.to}
              to={shortcut.to}
              className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                  <Icon size={18} />
                </span>
                <span className="font-semibold text-slate-800">{shortcut.title}</span>
                <Arrow
                  size={16}
                  className="ms-auto text-slate-300 transition group-hover:text-slate-600"
                />
              </div>
              <p className="text-sm leading-relaxed text-slate-500">{shortcut.body}</p>
            </Link>
          );
        })}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
          {label('سجلات المحتوى', 'İçerik kayıtları', 'Content records')}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {RESOURCES.map((resource) => {
            const Icon = resource.icon;
            return (
              <Link
                key={resource.key}
                to={`/admin/r/${resource.key}`}
                className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
              >
                <Icon size={17} className="mb-3 text-slate-400" />
                <p className="text-2xl font-bold tabular-nums text-slate-900">
                  {counts[resource.key] ?? '—'}
                </p>
                <p className="truncate text-sm text-slate-500">
                  {adminStrings[locale].sections[resource.labelKey]}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
          <Inbox size={17} className="text-slate-400" />
          <h2 className="font-semibold text-slate-800">{strings.recentSubmissions}</h2>
          {newCount > 0 && (
            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">
              {newCount} {strings.sections.submissions}
            </span>
          )}
          <Link to="/admin/submissions" className="ms-auto text-sm text-primary-600 hover:underline">
            {strings.view}
          </Link>
        </div>
        {submissions.length === 0 ? (
          <p className="p-5 text-sm text-slate-400">{strings.empty}</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {submissions.map((submission) => (
              <li key={submission.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                {submission.status === 'new' && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                )}
                <span className="truncate font-medium text-slate-700">
                  {submission.form_id || pickLocalized(submission.payload, locale) || '—'}
                </span>
                <span className="ms-auto shrink-0 text-slate-400" dir="ltr">
                  {submission.created_at.slice(0, 16).replace('T', ' ')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
