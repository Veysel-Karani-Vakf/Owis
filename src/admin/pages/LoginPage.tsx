import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, Globe, KeyRound, MailCheck, WifiOff } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { LOCALES, type Locale } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useAuth, type AuthErrorKind } from '../AuthProvider';
import { useAdminStrings } from '../hooks/useAdmin';

const localeName: Record<Locale, string> = { ar: 'ع', tr: 'TR', en: 'EN' };

type LoginPageProps = {
  /** "reset": the page reached from the password-reset email (/admin/reset-password). */
  mode?: 'login' | 'reset';
};

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100';

export default function LoginPage({ mode = 'login' }: LoginPageProps) {
  const s = useAdminStrings();
  const { locale, setLocale } = useI18n();
  const { signIn, resetPassword, updatePassword, networkError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const label = (ar: string, tr: string, en: string) => (locale === 'ar' ? ar : locale === 'tr' ? tr : en);

  // Distinguishing "wrong password" from "no connection" is the whole point:
  // blaming the password when the database is unreachable sends the editor
  // down the wrong path.
  const errorText = (kind: AuthErrorKind | null, fallback: string) => {
    if (kind === 'network') return s.connectionMissing;
    if (kind === 'credentials') return s.loginError;
    return fallback;
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [resetSent, setResetSent] = useState(false);

  // Reset-password mode: Supabase turns the email link's hash into a
  // recovery session and fires PASSWORD_RECOVERY; only then can we set a new one.
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  useEffect(() => {
    if (mode !== 'reset') return;
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active && data.session) setRecoveryReady(true);
      })
      .catch(() => undefined);
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) setRecoveryReady(true);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [mode]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err, kind } = await signIn(email.trim(), password);
    setBusy(false);
    if (err) {
      setError(errorText(kind, s.loginError));
      return;
    }
    navigate(from, { replace: true });
  };

  const submitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err, kind } = await resetPassword(email.trim());
    setBusy(false);
    if (err) {
      setError(errorText(kind, label('تعذر إرسال رسالة الاستعادة', 'Sıfırlama e-postası gönderilemedi', 'Could not send the reset email')));
      return;
    }
    setResetSent(true);
  };

  const submitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 8) {
      setError(label('كلمة المرور يجب أن تكون 8 أحرف على الأقل', 'Şifre en az 8 karakter olmalı', 'The password must be at least 8 characters'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(label('كلمتا المرور غير متطابقتين', 'Şifreler eşleşmiyor', 'The passwords do not match'));
      return;
    }
    setBusy(true);
    const { error: err, kind } = await updatePassword(newPassword);
    setBusy(false);
    if (err) {
      setError(errorText(kind, label('تعذر تغيير كلمة المرور', 'Şifre değiştirilemedi', 'Could not change the password')));
      return;
    }
    navigate('/admin', { replace: true });
  };

  const header = (title: string, subtitle: string, Icon: typeof Globe) => (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white">
        <Icon size={22} />
      </div>
      <div>
        <h1 className="text-lg font-bold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );

  const submitButton = (Icon: typeof LogIn, text: string, busyText: string) => (
    <button
      type="submit"
      disabled={busy}
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
    >
      <Icon size={16} />
      {busy ? busyText : text}
    </button>
  );

  const errorLine = error && <p className="mb-3 mt-1 text-sm text-red-600">{error}</p>;

  let card: React.ReactNode;

  if (mode === 'reset') {
    card = (
      <form onSubmit={submitNewPassword} className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/60">
        {header(
          label('كلمة مرور جديدة', 'Yeni şifre', 'New password'),
          label('اختر كلمة مرور جديدة لحسابك', 'Hesabınız için yeni bir şifre seçin', 'Choose a new password for your account'),
          KeyRound,
        )}
        {recoveryReady ? (
          <>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {label('كلمة المرور الجديدة', 'Yeni şifre', 'New password')}
            </label>
            <input
              type="password"
              dir="ltr"
              required
              minLength={8}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass + ' mb-4'}
            />
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {label('تأكيد كلمة المرور', 'Şifreyi doğrula', 'Confirm password')}
            </label>
            <input
              type="password"
              dir="ltr"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass + ' mb-2'}
            />
            {errorLine}
            {submitButton(KeyRound, label('حفظ كلمة المرور', 'Şifreyi kaydet', 'Save password'), s.saving)}
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-slate-600">
              {label(
                'افتح رابط الاستعادة من رسالة البريد الإلكتروني للوصول إلى هذه الصفحة. إن انتهت صلاحية الرابط فاطلب رسالة جديدة.',
                'Bu sayfaya e-postadaki sıfırlama bağlantısından ulaşın. Bağlantının süresi dolduysa yeni bir e-posta isteyin.',
                'Open the reset link from the email to reach this page. If the link has expired, request a new one.',
              )}
            </p>
            <Link to="/admin/login" className="block text-sm font-medium text-primary-600 hover:underline">
              {label('العودة إلى تسجيل الدخول', 'Girişe dön', 'Back to sign in')}
            </Link>
          </div>
        )}
      </form>
    );
  } else if (view === 'forgot') {
    card = (
      <form onSubmit={submitForgot} className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/60">
        {header(
          label('استعادة كلمة المرور', 'Şifre sıfırlama', 'Reset password'),
          label('سنرسل رابط الاستعادة إلى بريدك', 'Sıfırlama bağlantısını e-postanıza göndereceğiz', 'We will email you a reset link'),
          KeyRound,
        )}
        {resetSent ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              <MailCheck size={18} className="mt-0.5 shrink-0" />
              <p>
                {label(
                  'أُرسلت رسالة إلى بريدك. افتح الرابط فيها لاختيار كلمة مرور جديدة.',
                  'E-postanıza bir mesaj gönderildi. Yeni şifre seçmek için bağlantıyı açın.',
                  'An email has been sent. Open the link in it to choose a new password.',
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setView('login');
                setResetSent(false);
                setError(null);
              }}
              className="text-sm font-medium text-primary-600 hover:underline"
            >
              {label('العودة إلى تسجيل الدخول', 'Girişe dön', 'Back to sign in')}
            </button>
          </div>
        ) : (
          <>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">{s.email}</label>
            <input
              type="email"
              dir="ltr"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass + ' mb-2'}
            />
            {errorLine}
            {submitButton(MailCheck, label('إرسال رابط الاستعادة', 'Bağlantıyı gönder', 'Send reset link'), s.loading)}
            <button
              type="button"
              onClick={() => {
                setView('login');
                setError(null);
              }}
              className="mt-4 block w-full text-center text-sm text-slate-500 hover:text-slate-800 hover:underline"
            >
              {label('العودة إلى تسجيل الدخول', 'Girişe dön', 'Back to sign in')}
            </button>
          </>
        )}
      </form>
    );
  } else {
    card = (
      <form onSubmit={submit} className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/60">
        {header(s.brand, s.loginSubtitle, Globe)}

        {networkError && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <WifiOff size={16} className="mt-0.5 shrink-0" />
            <span>{s.connectionMissing}</span>
          </div>
        )}

        <label className="mb-1.5 block text-sm font-medium text-slate-700">{s.email}</label>
        <input
          type="email"
          dir="ltr"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass + ' mb-4'}
        />

        <label className="mb-1.5 block text-sm font-medium text-slate-700">{s.password}</label>
        <input
          type="password"
          dir="ltr"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass + ' mb-2'}
        />

        {errorLine}

        {submitButton(LogIn, s.signIn, s.signingIn)}

        <button
          type="button"
          onClick={() => {
            setView('forgot');
            setError(null);
          }}
          className="mt-4 block w-full text-center text-sm text-slate-500 hover:text-slate-800 hover:underline"
        >
          {label('نسيت كلمة المرور؟', 'Şifremi unuttum', 'Forgot your password?')}
        </button>
      </form>
    );
  }

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
        {card}
      </div>
    </div>
  );
}
