import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Inbox,
  Mail,
  LayoutTemplate,
  Database,
  ExternalLink,
  Images,
  ChevronDown,
} from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { LOCALES, type Locale } from '@/lib/types';
import { useAuth } from '../AuthProvider';
import { useAdminStrings } from '../hooks/useAdmin';
import { RESOURCES } from '../lib/resources';
import { adminStrings } from '../i18n';

const localeShort: Record<Locale, string> = { ar: 'ع', tr: 'TR', en: 'EN' };

type NavEntry = { to: string; label: string; icon: typeof Inbox; end?: boolean };

export default function AdminLayout({ children }: { children: ReactNode }) {
  const strings = useAdminStrings();
  const { locale, setLocale } = useI18n();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const label = (ar: string, tr: string, en: string) =>
    locale === 'ar' ? ar : locale === 'tr' ? tr : en;

  const resourceEntries = (section: string): NavEntry[] =>
    RESOURCES.filter((resource) => resource.section === section).map((resource) => ({
      to: `/admin/r/${resource.key}`,
      label: adminStrings[locale].sections[resource.labelKey] ?? resource.key,
      icon: resource.icon,
    }));

  const groups: { title: string; entries: NavEntry[] }[] = [
    {
      title: label('المحتوى', 'İçerik', 'Content'),
      entries: [
        {
          to: '/admin/content',
          label: label('إدارة المحتوى', 'İçerik yönetimi', 'Content management'),
          icon: LayoutTemplate,
        },
        ...resourceEntries('content'),
      ],
    },
    {
      title: label('الأخبار والمكتبة', 'Haberler ve kütüphane', 'News & library'),
      entries: resourceEntries('library'),
    },
    {
      title: label('التفاعل', 'Etkileşim', 'Engagement'),
      entries: [
        { to: '/admin/submissions', label: strings.sections.submissions, icon: Inbox },
        { to: '/admin/subscribers', label: strings.sections.subscribers, icon: Mail },
      ],
    },
    {
      title: label('التشغيل', 'Operasyon', 'Operations'),
      entries: [
        {
          to: '/admin/media',
          label: label('مكتبة الوسائط', 'Medya kütüphanesi', 'Media library'),
          icon: Images,
        },
        {
          to: '/admin/seed',
          label: label('استيراد المحتوى', 'İçe aktar', 'Import content'),
          icon: Database,
        },
      ],
    },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ' +
    (isActive
      ? 'bg-slate-900 font-medium text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900');

  const nav = (
    <nav className="flex h-full flex-col gap-5 p-3">
      <NavLink to="/admin" end className={linkClass} onClick={() => setOpen(false)}>
        <LayoutDashboard size={17} /> {strings.dashboard}
      </NavLink>

      {groups.map((group) =>
        group.entries.length === 0 ? null : (
          <div key={group.title}>
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.entries.map((entry) => {
                const Icon = entry.icon;
                return (
                  <NavLink
                    key={entry.to}
                    to={entry.to}
                    className={linkClass}
                    onClick={() => setOpen(false)}
                  >
                    <Icon size={17} className="shrink-0" />
                    <span className="truncate">{entry.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ),
      )}

      <div className="mt-auto border-t border-slate-200 pt-3">
        <button
          type="button"
          onClick={async () => {
            await signOut();
            navigate('/admin/login', { replace: true });
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={17} /> {strings.signOut}
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 z-30 hidden w-60 border-slate-200 bg-white md:block ltr:left-0 ltr:border-r rtl:right-0 rtl:border-l">
        <div className="flex h-14 items-center gap-2.5 border-b border-slate-200 px-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
            و
          </span>
          <span className="truncate text-sm font-semibold">{strings.brand}</span>
        </div>
        <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">{nav}</div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 w-64 bg-white ltr:left-0 rtl:right-0">
            <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
              <span className="truncate text-sm font-semibold">{strings.brand}</span>
              <button type="button" onClick={() => setOpen(false)} className="text-slate-400">
                <X size={20} />
              </button>
            </div>
            <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">{nav}</div>
          </aside>
        </div>
      )}

      <div className="md:ms-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4">
          <button type="button" className="md:hidden" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="flex-1" />

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:text-slate-900"
          >
            <ExternalLink size={15} />
            <span className="hidden sm:inline">
              {label('زيارة الموقع', 'Siteyi gör', 'View site')}
            </span>
          </a>

          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {LOCALES.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLocale(option)}
                className={
                  'h-7 w-8 rounded-md text-xs font-semibold transition ' +
                  (locale === option ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500')
                }
              >
                {localeShort[option]}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-100"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold uppercase text-white">
                {user?.email?.[0] ?? 'A'}
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {menuOpen && (
              <div
                className="absolute top-full z-30 mt-1 w-56 rounded-lg border border-slate-200 bg-white p-1 shadow-lg ltr:right-0 rtl:left-0"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <p className="truncate px-3 py-2 text-xs text-slate-500" dir="ltr">
                  {user?.email}
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    navigate('/admin/login', { replace: true });
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={15} /> {strings.signOut}
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
