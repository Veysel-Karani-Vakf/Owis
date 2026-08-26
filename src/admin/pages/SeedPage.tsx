import { useState } from 'react';
import { Database, PlusCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { useAdminStrings } from '../hooks/useAdmin';
import { adminStrings } from '../i18n';
import { runSeed, seedTargets, type SeedMode } from '../lib/seed';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmDialog';

/** Table → the name the editor knows it by in the sidebar. */
const TABLE_LABEL_KEY: Record<string, string> = {
  news: 'news',
  projects: 'projects',
  programs: 'programs',
  library_articles: 'library_articles',
  library_documents: 'library_documents',
  gallery_images: 'gallery',
  donation_opportunities: 'donations',
  partners: 'partners',
  stat_indicators: 'statistics',
  site_pages: 'pages',
};

export default function SeedPage() {
  const { locale } = useI18n();
  const s = useAdminStrings();
  const toast = useToast();
  const confirm = useConfirm();
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState<SeedMode | null>(null);

  const label = (ar: string, tr: string, en: string) => (locale === 'ar' ? ar : locale === 'tr' ? tr : en);
  const sectionName = (table: string) => adminStrings[locale].sections[TABLE_LABEL_KEY[table] ?? ''] ?? table;

  const execute = async (mode: SeedMode) => {
    setBusy(mode);
    setLog([]);
    try {
      await runSeed((line) => setLog((prev) => [...prev, line]), mode);
      toast.success(
        mode === 'fill'
          ? label('تمت إضافة المحتوى الناقص', 'Eksik içerik eklendi', 'Missing content has been added')
          : label('تمت استعادة النسخة الأصلية', 'Özgün içerik geri yüklendi', 'Original content has been restored'),
      );
    } catch (e) {
      // The line is already in the log; the toast just makes sure it is noticed.
      toast.error(
        label('توقف الإجراء بسبب خطأ — راجع السجل أدناه', 'İşlem bir hata nedeniyle durdu — aşağıdaki günlüğe bakın', 'The action stopped on an error — see the log below') +
          (e instanceof Error && e.message ? ` (${e.message})` : ''),
      );
    } finally {
      setBusy(null);
    }
  };

  const runFill = async () => {
    const ok = await confirm({
      title: label('إضافة ما ينقص فقط؟', 'Sadece eksikler eklensin mi?', 'Add only what is missing?'),
      body: label(
        'يضيف المحتوى المدمج في الموقع حيث لا يوجد شيء في قاعدة البيانات فقط. لن يتغير أي عنصر موجود ولا أي صفحة عدّلتها.',
        'Sitenin yerleşik içeriğini yalnızca veritabanında hiçbir şey olmayan yerlere ekler. Mevcut kayıtlar ve düzenlediğiniz sayfalar değişmez.',
        'Adds the site’s built-in content only where the database has nothing. No existing item or edited page will change.',
      ),
      confirmLabel: label('إضافة', 'Ekle', 'Add'),
    });
    if (ok === true) await execute('fill');
  };

  const runReset = async () => {
    const targets = await seedTargets();
    const ok = await confirm({
      title: label('استبدال كل المحتوى بالنسخة الأصلية؟', 'Tüm içerik özgün sürümle değiştirilsin mi?', 'Replace all content with the original version?'),
      destructive: true,
      typedWord: locale === 'ar' ? 'استعادة' : 'RESET',
      confirmLabel: label('استبدال الكل', 'Tümünü değiştir', 'Replace everything'),
      body: (
        <div className="space-y-3">
          <p>
            {label(
              'سيُحذف كل تعديل قمت به وكل عنصر أضفته، وتعود كل الجداول التالية إلى النسخة المدمجة في الموقع. لا يمكن التراجع عن هذا.',
              'Yaptığınız her düzenleme ve eklediğiniz her öğe silinir; aşağıdaki tabloların tümü sitenin yerleşik sürümüne döner. Bu geri alınamaz.',
              'Every edit you made and every item you added will be deleted; all the tables below go back to the built-in version. This cannot be undone.',
            )}
          </p>
          <ul className="max-h-48 divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-200 text-xs">
            {targets.map((t) => (
              <li key={t.table} className="flex items-center justify-between gap-3 px-3 py-1.5">
                <span className="text-slate-700">{sectionName(t.table)}</span>
                <span className="tabular-nums text-slate-500">
                  {t.rows.toLocaleString(locale)} {s.items}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ),
    });
    if (ok === true) await execute('reset');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          <Database size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{s.restoreContent}</h1>
          <p className="text-sm text-slate-500">
            {label(
              'الموقع يحمل نسخة مدمجة من كل المحتوى. من هنا يمكنك إعادتها إلى قاعدة البيانات بطريقتين.',
              'Site, tüm içeriğin yerleşik bir kopyasını taşır. Buradan iki şekilde veritabanına geri getirebilirsiniz.',
              'The site carries a built-in copy of all its content. From here you can bring it back into the database in two ways.',
            )}
          </p>
        </div>
      </div>

      {/* Safe action — this is the one editors should normally use. */}
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-2 flex items-center gap-2">
          <PlusCircle size={18} className="text-emerald-600" />
          <h2 className="font-semibold text-slate-900">
            {label('إضافة ما ينقص فقط', 'Sadece eksikleri ekle', 'Add only what is missing')}
          </h2>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            {label('آمن', 'Güvenli', 'Safe')}
          </span>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          {label(
            'يضيف المحتوى المدمج حيث لا يوجد شيء في قاعدة البيانات: قائمة فارغة، أو صفحة لم تُحفظ بعد. لا يغيّر أبداً أي عنصر موجود ولا أي صفحة عدّلتها. مناسب عند إعداد الموقع لأول مرة أو عند إضافة صفحة جديدة.',
            'Yerleşik içeriği yalnızca veritabanında hiçbir şey olmayan yerlere ekler: boş bir liste ya da henüz kaydedilmemiş bir sayfa. Mevcut kayıtları veya düzenlediğiniz sayfaları asla değiştirmez. Siteyi ilk kez kurarken veya yeni bir sayfa eklenince uygundur.',
            'Adds the built-in content only where the database has nothing: an empty list, or a page that has never been saved. It never changes an existing item or an edited page. Use it when setting the site up for the first time or after a new page is added.',
          )}
        </p>
        <button
          onClick={runFill}
          disabled={busy !== null}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
        >
          <PlusCircle size={16} />
          {busy === 'fill'
            ? label('جارٍ الإضافة…', 'Ekleniyor…', 'Adding…')
            : label('إضافة ما ينقص', 'Eksikleri ekle', 'Add what is missing')}
        </button>
      </section>

      {/* Danger action — kept visually separate so it is never clicked by habit. */}
      <section className="rounded-xl border border-red-200 bg-red-50/60 p-5">
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-600" />
          <h2 className="font-semibold text-red-900">
            {label('استبدال كل المحتوى بالنسخة الأصلية', 'Tüm içeriği özgün sürümle değiştir', 'Replace all content with the original version')}
          </h2>
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
            {label('خطر', 'Tehlikeli', 'Danger')}
          </span>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-red-900/80">
          {label(
            'يحذف كل تعديل قمت به على أي نص أو صورة أو صفحة، ويحذف كل عنصر أضفته (خبر، مشروع، مستند، صورة…)، ثم يعيد كل شيء كما كان عند إطلاق الموقع. لا يمكن التراجع عنه. استخدمه فقط إن أردت البدء من الصفر.',
            'Herhangi bir metin, görsel veya sayfada yaptığınız her düzenlemeyi ve eklediğiniz her öğeyi (haber, proje, belge, görsel…) siler; ardından her şeyi sitenin ilk halindeki gibi geri getirir. Geri alınamaz. Yalnızca sıfırdan başlamak istiyorsanız kullanın.',
            'Deletes every edit you made to any text, image or page and every item you added (news, project, document, image…), then puts everything back the way it was when the site launched. It cannot be undone. Use it only if you want to start over.',
          )}
        </p>
        <button
          onClick={runReset}
          disabled={busy !== null}
          className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
        >
          <RotateCcw size={16} />
          {busy === 'reset'
            ? label('جارٍ الاستبدال…', 'Değiştiriliyor…', 'Replacing…')
            : label('استبدال كل المحتوى…', 'Tüm içeriği değiştir…', 'Replace all content…')}
        </button>
      </section>

      {log.length > 0 && (
        <pre className="max-h-[400px] overflow-y-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100" dir="ltr">
          {log.join('\n')}
        </pre>
      )}
    </div>
  );
}
