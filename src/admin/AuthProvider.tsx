import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

/** Why a sign-in failed, so the login page can say something useful. */
export type AuthErrorKind = 'credentials' | 'network' | 'unknown';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  /** True when Supabase could not be reached while restoring the session. */
  networkError: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null; kind: AuthErrorKind | null }>;
  signOut: () => Promise<void>;
  /** Sends the "reset your password" email pointing back at /admin/reset-password. */
  resetPassword: (email: string) => Promise<{ error: string | null; kind: AuthErrorKind | null }>;
  /** Sets a new password for the signed-in (recovery) session. */
  updatePassword: (password: string) => Promise<{ error: string | null; kind: AuthErrorKind | null }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Supabase reports transport failures as "Failed to fetch" / status 0, while
 * a wrong password is a 400 with "Invalid login credentials". Telling them
 * apart is what lets the login page say "no connection" instead of blaming
 * the user's password.
 */
function classifyAuthError(error: { message?: string; status?: number } | null | undefined): AuthErrorKind | null {
  if (!error) return null;
  const message = (error.message ?? '').toLowerCase();
  if (
    error.status === 0 ||
    message.includes('failed to fetch') ||
    message.includes('networkerror') ||
    message.includes('network request failed') ||
    message.includes('load failed') ||
    message.includes('fetch failed')
  ) {
    return 'network';
  }
  if (error.status === 400 || error.status === 401 || error.status === 422 || message.includes('invalid login')) {
    return 'credentials';
  }
  return 'unknown';
}

async function checkAdmin(userId: string | undefined): Promise<{ isAdmin: boolean; networkError: boolean }> {
  if (!userId) return { isAdmin: false, networkError: false };
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) return { isAdmin: false, networkError: classifyAuthError(error) === 'network' };
    return { isAdmin: Boolean(data), networkError: false };
  } catch {
    // A thrown fetch error means the database is unreachable, not that the
    // user lacks access — surface that instead of a silent "no access".
    return { isAdmin: false, networkError: true };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    let active = true;

    const apply = async (nextSession: Session | null) => {
      const result = await checkAdmin(nextSession?.user?.id);
      if (!active) return;
      setSession(nextSession);
      setIsAdmin(result.isAdmin);
      setNetworkError(result.networkError);
      setLoading(false);
    };

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error && classifyAuthError(error) === 'network') setNetworkError(true);
        return apply(data.session);
      })
      .catch(() => {
        if (!active) return;
        setNetworkError(true);
        setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      void apply(nextSession);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isAdmin,
      loading,
      networkError,
      async signIn(email, password) {
        try {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          return { error: error ? error.message : null, kind: classifyAuthError(error) };
        } catch (e) {
          return { error: e instanceof Error ? e.message : String(e), kind: 'network' };
        }
      },
      async signOut() {
        // Unsaved page drafts are personal; they must not greet the next
        // person who signs in on this browser.
        try {
          Object.keys(window.localStorage)
            .filter((key) => key.startsWith('vkv-admin-draft:'))
            .forEach((key) => window.localStorage.removeItem(key));
        } catch {
          // Storage unavailable (private mode): nothing to clear.
        }
        await supabase.auth.signOut();
      },
      async resetPassword(email) {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/admin/reset-password',
          });
          return { error: error ? error.message : null, kind: classifyAuthError(error) };
        } catch (e) {
          return { error: e instanceof Error ? e.message : String(e), kind: 'network' };
        }
      },
      async updatePassword(password) {
        try {
          const { error } = await supabase.auth.updateUser({ password });
          return { error: error ? error.message : null, kind: classifyAuthError(error) };
        } catch (e) {
          return { error: e instanceof Error ? e.message : String(e), kind: 'network' };
        }
      },
    }),
    [session, isAdmin, loading, networkError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
