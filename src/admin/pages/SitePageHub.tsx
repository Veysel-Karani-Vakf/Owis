// One hub per public page of the site (from SITE_AREAS): everything an editor
// can change about that page — its texts AND its record lists — behind tabs,
// so nothing about a page has to be hunted down elsewhere.
//
// URL: /admin/site/:areaKey/:part?/:locale?  (+ ?section= inside the texts tab)

import { useEffect } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ExternalLink, Inbox, Mail, CreditCard, type LucideIcon } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { LOCALES, type Locale } from '@/lib/types';
import { useAdminStrings } from '../hooks/useAdmin';
import { getResource } from '../lib/resources';
import { getArea, hubPath, partKey, type AreaPart, type InboxKey, type SiteArea } from '../lib/siteMap';
import PageContentEditor from '../components/PageContentEditor';
import ResourceCollection from '../components/ResourceCollection';

const INBOX_META: Record<InboxKey, { to: string; icon: LucideIcon }> = {
  submissions: { to: '/admin/submissions', icon: Inbox },
  subscribers: { to: '/admin/subscribers', icon: Mail },
  payments: { to: '/admin/payments', icon: CreditCard },
};

function isLocale(value: string | undefined): value is Locale {
  return Boolean(value) && (LOCALES as readonly string[]).includes(value as string);
}

export default function SitePageHub() {
  const params = useParams<{ areaKey?: string; part?: string; locale?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { locale: uiLocale } = useI18n();
  const strings = useAdminStrings();

  const area = getArea(params.areaKey);
  const activePart = area
    ? (area.parts.find((part) => partKey(part) === params.part) ?? area.parts[0])
    : undefined;
  const activeKey = activePart ? partKey(activePart) : '';
  const section = searchParams.get('section');

  // A hub link without a tab (sidebar, dashboard) lands on the first tab.
  useEffect(() => {
    if (!area || !activePart) return;
    if (params.part !== activeKey) {
      navigate(hubPath(area, activePart), { replace: true });
    }
  }, [area, activePart, activeKey, params.part, navigate]);

  if (!area || !activePart) return <Navigate to="/admin" replace />;

  const contentLocale: Locale = isLocale(params.locale) ? params.locale : uiLocale;
  const label = (ar: string, tr: string, en: string) =>
    uiLocale === 'ar' ? ar : uiLocale === 'tr' ? tr : en;

  const partLabel = (part: AreaPart): string => {
    if (part.label) return part.label[uiLocale];
    if (part.type === 'content') return strings.pageTexts;
    const resource = getResource(part.resourceKey);
    return (resource && strings.sections[resource.labelKey]) ?? part.resourceKey;
  };

  const Icon = area.icon;

  return (
    <div>
      {/* Header ------------------------------------------------------------ */}
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <span className={'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ' + area.tone.solid}>
          <Icon size={26} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{area.label[uiLocale]}</h1>
          <p className="truncate text-sm text-slate-500">{area.description[uiLocale]}</p>
        </div>

        {(area.inbox ?? []).map((key) => {
          const meta = INBOX_META[key];
          const InboxIcon = meta.icon;
          return (
            <Link
              key={key}
              to={meta.to}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              <InboxIcon size={15} className="text-slate-400" />
              {strings.sections[key] ?? key}
            </Link>
          );
        })}

        <a
          href={area.route}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          <ExternalLink size={15} className="text-slate-400" />
          {label('عرض الصفحة في الموقع', 'Sayfayı sitede gör', 'View the page on the site')}
        </a>
      </div>

      {/* Tabs -------------------------------------------------------------- */}
      {area.parts.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
          {area.parts.map((part) => {
            const key = partKey(part);
            const active = key === activeKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => navigate(hubPath(area, part))}
                className={
                  'rounded-xl px-4 py-2.5 text-sm font-semibold transition ' +
                  (active ? area.tone.solid + ' shadow-sm' : 'text-slate-600 hover:bg-slate-100')
                }
              >
                {partLabel(part)}
              </button>
            );
          })}
        </div>
      )}

      {/* Active tab -------------------------------------------------------- */}
      {activePart.type === 'content' ? (
        <PageContentEditor
          key={activePart.pageKey}
          pageKey={activePart.pageKey}
          contentLocale={contentLocale}
          onLocaleChange={(next) => {
            const suffix = section ? `?section=${section}` : '';
            navigate(`${hubPath(area, activePart)}/${next}${suffix}`);
          }}
          section={section}
          allowNavigationWithin={`/admin/site/${area.key}`}
          tone={area.tone}
        />
      ) : (
        <CollectionTab area={area} part={activePart} />
      )}
    </div>
  );
}

function CollectionTab({ area, part }: { area: SiteArea; part: AreaPart & { type: 'collection' } }) {
  const resource = getResource(part.resourceKey);
  if (!resource) return <Navigate to={hubPath(area)} replace />;
  return <ResourceCollection key={resource.key} resource={resource} />;
}
