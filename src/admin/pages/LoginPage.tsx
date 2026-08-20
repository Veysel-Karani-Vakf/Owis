import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Globe } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { LOCALES, type Locale } from '@/lib/types';
import { useAuth } from '../AuthProvider';
import { useAdminStrings } from '../hooks/useAdmin';

const localeName: Record<Locale, string> = { ar: 'ع', tr: 'TR', en: 'EN' };

export default function LoginPage() {
  const s = useAdminStrings();
  const { locale, setLocale } = useI18n();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await signIn(email.trim(), password);
    setBusy(false);
    if (err) {
      setError(s.loginError);
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-4 flex justify-end gap-1">
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              className={
                'flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold transition ' +
                (locale === l ? 'bg-primary-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-200')
              }
            >
              {localeName[l]}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/60">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Globe size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">{s.brand}</h1>
              <p className="text-sm text-slate-500">{s.loginSubtitle}</p>
            </div>
          </div>

          <label className="mb-1.5 block text-sm font-medium text-slate-700">{s.email}</label>
          <input
            type="email"
            dir="ltr"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />

          <label className="mb-1.5 block text-sm font-medium text-slate-700">{s.password}</label>
          <input
            type="password"
            dir="ltr"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />

          {error && <p className="mb-3 mt-1 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
          >
            <LogIn size={16} />
            {busy ? s.signingIn : s.signIn}
          </button>
        </form>
      </div>
    </div>
  );
}
