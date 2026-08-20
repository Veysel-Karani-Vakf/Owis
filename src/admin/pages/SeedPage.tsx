import { useState } from 'react';
import { Database, Play } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { runSeed } from '../lib/seed';

const copy = {
  ar: {
    title: 'استيراد المحتوى',
    desc: 'ينقل هذا الإجراء كل المحتوى الحالي من ملفات الموقع إلى قاعدة البيانات (آمن للتكرار — يحدّث الموجود).',
    run: 'بدء الاستيراد',
    running: 'جارٍ الاستيراد…',
  },
  tr: {
    title: 'İçeriği içe aktar',
    desc: 'Mevcut tüm site içeriğini veritabanına aktarır (tekrar çalıştırmak güvenlidir).',
    run: 'İçe aktarmayı başlat',
    running: 'İçe aktarılıyor…',
  },
  en: {
    title: 'Import content',
    desc: 'Migrates all existing site content into the database (safe to re-run — upserts existing rows).',
    run: 'Run import',
    running: 'Importing…',
  },
};

export default function SeedPage() {
  const { locale } = useI18n();
  const t = copy[locale];
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    setLog([]);
    try {
      await runSeed((line) => setLog((prev) => [...prev, line]));
    } catch {
      /* errors are already appended to the log */
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          <Database size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
          <p className="text-sm text-slate-500">{t.desc}</p>
        </div>
      </div>

      <button
        onClick={run}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
      >
        <Play size={16} /> {busy ? t.running : t.run}
      </button>

      {log.length > 0 && (
        <pre className="mt-5 max-h-[400px] overflow-y-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100" dir="ltr">
          {log.join('\n')}
        </pre>
      )}
    </div>
  );
}
