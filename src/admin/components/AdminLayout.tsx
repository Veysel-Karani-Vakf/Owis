import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Inbox,
  Mail,
  FileCog,
  Database,
  ExternalLink,
} from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { LOCALES, type Locale } from '@/lib/types';
import { useAuth } from '../AuthProvider';
import { useAdminStrings } from '../hooks/useAdmin';
import { RESOURCES } from '../lib/resources';
import { adminStrings } from '../i18n';

const localeName: Record<Locale, string> = { ar: 'ع', tr: 'TR', en: 'EN' };

const sectionOrder: Array<'content' | 'library' | 'engagement' | 'site'> = [
  'content',
  'library',
  'engagement',
  'site',
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const s = useAdminStrings();
  const { locale, setLocale } = useI18n();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ' +
    (isActive ? 'bg-primary-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white');

  const bySection = (sec: string) => RESOURCES.filter((r) => r.section === sec);

  const nav = (
    <nav className="flex h-full flex-col gap-6 p-4">
      <div>
        <NavLink to="/admin" end className={linkClass} onClick={() => setOpen(false)}>
          <LayoutDashboard size={18} /> {s.dashboard}
        </NavLink>
      </div>

      {sectionOrder.map((sec) => {
        const items = bySection(sec);
        const extras: ReactNode[] = [];
        if (sec === 'engagement') {
          extras.push(
            <NavLink key="submissions" to="/admin/submissions" className={linkClass} onClick={() => setOpen(false)}>
              <Inbox size={18} /> {s.sections.submissions}
            </NavLink>,
            <NavLink key="subscribers" to="/admin/subscribers" className={linkClass} onClick={() => setOpen(false)}>
              <Mail size={18} /> {s.sections.subscribers}
            </NavLink>,
          );
        }
        if (sec === 'site') {
          extras.push(
            <NavLink key="pages" to="/admin/pages" className={linkClass} onClick={() => setOpen(false)}>
              <FileCog size={18} /> {s.sections.pages}
            </NavLink>,
            <NavLink key="seed" to="/admin/seed" className={linkClass} onClick={() => setOpen(false)}>
              <Database size={18} /> {locale === 'ar' ? 'استيراد المحتوى' : locale === 'tr' ? 'İçe aktar' : 'Import'}
            </NavLink>,
          );
        }
        if (items.length === 0 && extras.length === 0) return null;
        return (
          <div key={sec}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {s.sections[sec]}
            </p>
            <div className="space-y-1">
              {items.map((r) => {
                const Icon = r.icon;
                return (
                  <NavLink key={r.key} to={`/admin/r/${r.key}`} className={linkClass} onClick={() => setOpen(false)}>
                    <Icon size={18} /> {adminStrings[locale].sections[r.labelKey] ?? r.key}
                  </NavLink>
                );
              })}
              {extras}
            </div>
          </div>
        );
      })}

      <div className="mt-auto space-y-3 border-t border-slate-800 pt-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3 text-xs text-slate-400 hover:text-white"
        >
          <ExternalLink size={14} /> {locale === 'ar' ? 'زيارة الموقع' : locale === 'tr' ? 'Siteyi görüntüle' : 'View site'}
        </a>
        <p className="truncate px-3 text-xs text-slate-500" dir="ltr">
          {user?.email}
        </p>
        <button
          onClick={async () => {
            await signOut();
            navigate('/admin/login', { replace: true });
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <LogOut size={16} /> {s.signOut}
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 z-30 hidden w-64 bg-slate-900 md:block ltr:left-0 rtl:right-0">
        <div className="flex h-14 items-center gap-2 border-b border-slate-800 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white text-sm font-bold">
            و
          </div>
          <span className="text-sm font-semibold text-white">{s.dashboard}</span>
        </div>
        <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">{nav}</div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 w-64 bg-slate-900 ltr:left-0 rtl:right-0">
            <div className="flex h-14 items-center justify-between border-b border-slate-800 px-4">
              <span className="text-sm font-semibold text-white">{s.dashboard}</span>
              <button onClick={() => setOpen(false)} className="text-slate-400">
                <X size={20} />
              </button>
            </div>
            <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">{nav}</div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="md:ms-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
          <button className="md:hidden" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="flex-1" />
          <div className="flex gap-1">
            {LOCALES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                className={
                  'flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold transition ' +
                  (locale === l ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')
                }
              >
                {localeName[l]}
              </button>
            ))}
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
