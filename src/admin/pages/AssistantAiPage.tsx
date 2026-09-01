import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Check, KeyRound, Loader2, Save, Send } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { supabase } from '@/lib/supabase';
import { useToast } from '../components/Toast';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';

/**
 * Picks which AI answers the site assistant. Only the provider id + model
 * name are stored (in the `site_pages` row `assistant-ai`); the API keys stay
 * in the server env — this page merely shows whether each key is configured.
 */

type ProviderId = 'deepseek' | 'openai' | 'anthropic' | 'gemini';

type ConfigResponse = {
  active: { provider: ProviderId; model: string };
  providers: { id: ProviderId; defaultModel: string; hasKey: boolean }[];
};

const ROW_KEY = 'assistant-ai';

const PROVIDER_META: { id: ProviderId; name: string; envVar: string; models: string[] }[] = [
  // deepseek-reasoner is deliberately absent: it rejects JSON-output mode
  // and consecutive same-role turns, so it cannot serve this endpoint.
  { id: 'deepseek', name: 'DeepSeek', envVar: 'DEEPSEEK_API_KEY', models: ['deepseek-chat'] },
  {
    id: 'anthropic',
    name: 'Claude — Anthropic',
    envVar: 'ANTHROPIC_API_KEY',
    models: ['claude-opus-5', 'claude-sonnet-5', 'claude-haiku-4-5'],
  },
  { id: 'openai', name: 'ChatGPT — OpenAI', envVar: 'OPENAI_API_KEY', models: ['gpt-5-mini', 'gpt-5', 'gpt-4o-mini'] },
  { id: 'gemini', name: 'Gemini — Google', envVar: 'GEMINI_API_KEY', models: ['gemini-2.5-flash', 'gemini-2.5-pro'] },
];

/**
 * API keys are never entered on this page — they live in the server env only.
 * People still paste one into the model input (it is the only text box), so
 * catch anything key-shaped: vendor prefixes, or a long mixed-case token that
 * no model id looks like (model ids are lowercase with dots/dashes).
 */
const KEY_PREFIXES = /^(sk-|AIza|gsk_|xai-)/i;
function looksLikeApiKey(value: string): boolean {
  const v = value.trim();
  return KEY_PREFIXES.test(v) || (v.length >= 32 && /^[A-Za-z0-9_-]+$/.test(v) && /[A-Z]/.test(v) && /[a-z]/.test(v));
}

export default function AssistantAiPage() {
  const { locale } = useI18n();
  const toast = useToast();
  const label = (ar: string, tr: string, en: string) => (locale === 'ar' ? ar : locale === 'tr' ? tr : en);

  const [provider, setProvider] = useState<ProviderId>('deepseek');
  const [model, setModel] = useState('deepseek-chat');
  const [keyStatus, setKeyStatus] = useState<Partial<Record<ProviderId, boolean>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; text: string; ms: number } | null>(null);

  const meta = useMemo(() => PROVIDER_META.find((entry) => entry.id === provider) ?? PROVIDER_META[0], [provider]);
  const isKnownModel = meta.models.includes(model);

  useEffect(() => {
    let active = true;
    // The stored row is the source of truth for the selection…
    supabase
      .from('site_pages')
      .select('data')
      .eq('key', ROW_KEY)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          // A failed read is not "no row yet": say so instead of presenting
          // the defaults as the live config.
          toast.error(label('تعذر تحميل الإعدادات الحالية', 'Mevcut ayarlar yüklenemedi', 'Could not load the current settings'));
        } else {
          const raw = (data?.data ?? null) as { provider?: ProviderId; model?: string } | null;
          if (raw?.provider && PROVIDER_META.some((entry) => entry.id === raw.provider)) {
            setProvider(raw.provider);
            const storedModel = typeof raw.model === 'string' ? raw.model.trim() : '';
            if (storedModel && looksLikeApiKey(storedModel)) {
              // A key was saved into the model field earlier: show the
              // provider default instead and let the admin re-save; the key
              // itself must be rotated since the row is publicly readable.
              const fallback = PROVIDER_META.find((entry) => entry.id === raw.provider)?.models[0] ?? '';
              setModel(fallback);
              setDirty(true);
              toast.error(
                label(
                  'الحقل المحفوظ يحتوي مفتاح API وليس اسم نموذج — احفظ التصحيح ثم استبدل هذا المفتاح لدى المزود.',
                  'Kayıtlı alanda model adı değil bir API anahtarı var — düzeltmeyi kaydedin, sonra bu anahtarı sağlayıcıda yenileyin.',
                  'The saved field holds an API key, not a model name — save the correction, then rotate that key at the provider.',
                ),
              );
            } else if (storedModel) {
              setModel(storedModel);
            }
          }
        }
        setLoading(false);
      });
    // …the API tells us which keys exist in the server env (booleans only).
    fetch('/api/assistant/config')
      .then((response) => (response.ok ? (response.json() as Promise<ConfigResponse>) : null))
      .then((config) => {
        if (!active || !config) return;
        const status: Partial<Record<ProviderId, boolean>> = {};
        for (const entry of config.providers) status[entry.id] = entry.hasKey;
        setKeyStatus(status);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  // Remember what the admin typed per provider, so clicking another card and
  // back does not destroy a hand-entered model id.
  const modelByProvider = useRef<Partial<Record<ProviderId, string>>>({});

  const pickProvider = (id: ProviderId) => {
    if (id === provider) return;
    modelByProvider.current[provider] = model;
    setProvider(id);
    const nextMeta = PROVIDER_META.find((entry) => entry.id === id);
    setModel(modelByProvider.current[id] ?? nextMeta?.models[0] ?? '');
    setDirty(true);
    setTestResult(null);
  };

  const save = async (): Promise<boolean> => {
    if (looksLikeApiKey(model)) {
      toast.error(
        label(
          'هذا مفتاح API وليس اسم نموذج — المفاتيح تُضاف في Vercel وليس هنا',
          'Bu bir API anahtarı, model adı değil — anahtarlar buraya değil Vercel’e eklenir',
          'That is an API key, not a model name — keys go in Vercel, not here',
        ),
      );
      return false;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from('site_pages').upsert(
        {
          key: ROW_KEY,
          label: { ar: 'ذكاء المساعد', tr: 'Asistan yapay zekâsı', en: 'Assistant AI' },
          data: { provider, model: model.trim() },
        },
        { onConflict: 'key' },
      );
      if (error) throw error;
      setDirty(false);
      toast.success(label('تم حفظ إعدادات المساعد', 'Asistan ayarları kaydedildi', 'Assistant settings saved'));
      return true;
    } catch {
      toast.error(label('تعذر الحفظ', 'Kaydedilemedi', 'Save failed'));
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Sidebar links, back button, tab close and sign-out all ask before
  // discarding an unsaved provider switch, like every other editor.
  useUnsavedChanges(dirty, save);

  const runTest = async () => {
    setTesting(true);
    setTestResult(null);
    const startedAt = performance.now();
    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          message: label('ما هو وقف أويس القرني؟', 'Veysel Karani Vakfı nedir?', 'What is the Veysel Karani Waqf?'),
          history: [],
          context: [],
          // Skip the server's 30s config cache so the test exercises the
          // provider that was just saved, not a stale one.
          fresh: true,
        }),
      });
      const ms = Math.round(performance.now() - startedAt);
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setTestResult({
          ok: false,
          ms,
          text:
            response.status === 503
              ? label('المفتاح غير مضبوط في الخادم', 'Sunucuda anahtar yok', 'No key configured on the server')
              : `${label('فشل الاختبار', 'Test başarısız', 'Test failed')} (${payload?.error ?? response.status})`,
        });
        return;
      }
      const payload = (await response.json()) as { answer?: string };
      setTestResult({ ok: true, ms, text: payload.answer ?? '' });
    } catch {
      setTestResult({ ok: false, ms: 0, text: label('تعذر الوصول للخادم', 'Sunucuya ulaşılamadı', 'Server unreachable') });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
          <Bot size={20} />
        </span>
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            {label('ذكاء المساعد', 'Asistan yapay zekâsı', 'Assistant AI')}
          </h1>
          <p className="text-sm text-slate-500">
            {label(
              'اختر المزود والنموذج اللذين يجيبان زوار الموقع؛ المفاتيح تبقى في إعدادات الخادم.',
              'Ziyaretçilere yanıt veren sağlayıcı ve modeli seçin; anahtarlar sunucuda kalır.',
              'Choose the provider and model that answer site visitors; the keys stay on the server.',
            )}
          </p>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {PROVIDER_META.map((entry) => {
          const selected = entry.id === provider;
          const hasKey = keyStatus?.[entry.id];
          return (
            <button
              key={entry.id}
              type="button"
              disabled={loading}
              onClick={() => pickProvider(entry.id)}
              className={
                'rounded-xl border p-4 text-start transition ' +
                (selected
                  ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400')
              }
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold" dir="ltr">
                  {entry.name}
                </span>
                {selected && <Check size={16} />}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs">
                <KeyRound size={12} className={selected ? 'text-white/70' : 'text-slate-400'} />
                {keyStatus === null ? (
                  <span className={selected ? 'text-white/70' : 'text-slate-400'}>
                    {label('حالة المفتاح غير معروفة', 'Anahtar durumu bilinmiyor', 'Key status unknown')}
                  </span>
                ) : hasKey ? (
                  <span className={selected ? 'text-emerald-300' : 'text-emerald-600'}>
                    {label('المفتاح مضبوط', 'Anahtar hazır', 'Key configured')}
                  </span>
                ) : (
                  <span className={selected ? 'text-amber-300' : 'text-amber-600'} dir="ltr">
                    {entry.envVar}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs leading-relaxed text-slate-400">
        {label(
          'المفاتيح لا تُدخل في هذه الصفحة: تُضاف في Vercel ← Settings ← Environment Variables بالاسم الظاهر على بطاقة كل مزود، ثم يُعاد النشر.',
          'Anahtarlar bu sayfaya girilmez: Vercel → Settings → Environment Variables bölümüne her sağlayıcı kartındaki adla eklenir, sonra yeniden yayınlanır.',
          'Keys are not entered on this page: add them in Vercel → Settings → Environment Variables under the name on each provider card, then redeploy.',
        )}
      </p>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <label className="mb-1 block text-sm font-semibold text-slate-800">
          {label('النموذج', 'Model', 'Model')}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <select
            dir="ltr"
            disabled={loading}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none"
            value={isKnownModel ? model : '__custom'}
            onChange={(event) => {
              if (event.target.value !== '__custom') {
                setModel(event.target.value);
                setDirty(true);
                setTestResult(null);
              }
            }}
          >
            {meta.models.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
            {!isKnownModel && <option value="__custom">{model}</option>}
          </select>
          <input
            dir="ltr"
            disabled={loading}
            className="min-w-[220px] flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-[13px] text-slate-700 focus:border-primary-500 focus:bg-white focus:outline-none"
            value={model}
            onChange={(event) => {
              setModel(event.target.value);
              setDirty(true);
              setTestResult(null);
            }}
            placeholder={label('اسم النموذج، مثل claude-opus-5', 'Model adı, örn. claude-opus-5', 'Model name, e.g. claude-opus-5')}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        {looksLikeApiKey(model) ? (
          <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-800">
            <p className="font-semibold">
              {label(
                'يبدو أنك ألصقت مفتاح API — هذا الحقل لاسم النموذج فقط.',
                'Bir API anahtarı yapıştırmışsınız gibi görünüyor — bu alan yalnızca model adı içindir.',
                'This looks like a pasted API key — this field is for the model name only.',
              )}
            </p>
            <p className="mt-1">
              {label(
                'المفاتيح لا تُدخل في لوحة التحكم أبداً (حمايةً لها). أضِفها في Vercel ← Settings ← Environment Variables بالاسم الظاهر على بطاقة المزود، ثم أعد النشر.',
                'Anahtarlar panele asla girilmez (güvenlik için). Vercel → Settings → Environment Variables bölümüne, sağlayıcı kartındaki adla ekleyin ve yeniden yayınlayın.',
                'Keys are never entered in the dashboard (for their own safety). Add them in Vercel → Settings → Environment Variables under the name shown on the provider card, then redeploy.',
              )}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-xs text-slate-400">
            {label(
              'اسم النموذج فقط (مثل claude-opus-5) — ليس مفتاح API. يمكن كتابة اسم نموذج أحدث يدوياً عند صدوره.',
              'Yalnızca model adı (örn. claude-opus-5) — API anahtarı değil. Yeni bir model çıktığında adı elle yazılabilir.',
              'Model name only (e.g. claude-opus-5) — not an API key. A newer model id can be typed manually when one ships.',
            )}
          </p>
        )}
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving || loading || !dirty}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {label('حفظ', 'Kaydet', 'Save')}
        </button>
        <button
          type="button"
          onClick={runTest}
          disabled={testing || dirty || loading}
          title={dirty ? label('احفظ أولاً', 'Önce kaydedin', 'Save first') : undefined}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary-400 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {testing ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          {label('اختبار المساعد', 'Asistanı test et', 'Test the assistant')}
        </button>
        <p className="text-xs text-slate-400">
          {dirty
            ? label('احفظ أولاً ثم اختبر.', 'Önce kaydedin, sonra test edin.', 'Save first, then test.')
            : label(
                'الاختبار يستخدم الإعداد المحفوظ؛ سريان التغيير للزوار خلال دقيقة.',
                'Test kayıtlı ayarı kullanır; ziyaretçiler için bir dakika içinde etkinleşir.',
                'The test uses the saved settings; visitors see the change within a minute.',
              )}
        </p>
      </div>

      {testResult && (
        <div
          className={
            'rounded-xl border p-4 text-sm leading-relaxed ' +
            (testResult.ok
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-red-200 bg-red-50 text-red-800')
          }
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-70">
            {testResult.ok
              ? `${label('نجح الاختبار', 'Test başarılı', 'Test passed')} · ${testResult.ms}ms`
              : label('فشل الاختبار', 'Test başarısız', 'Test failed')}
          </p>
          <p>{testResult.text}</p>
        </div>
      )}
    </div>
  );
}
