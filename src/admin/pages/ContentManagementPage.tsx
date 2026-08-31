// The old /admin/content/:pageKey/:locale editor address. Page texts are now
// edited inside the site-page hubs, so this only redirects — old bookmarks,
// dashboard links and search results keep landing on the right editor.
// `?section=` deep links survive the redirect.

import { Navigate, useLocation, useParams } from 'react-router-dom';
import { LOCALES, type Locale } from '@/lib/types';
import { areaForPage, hubPath } from '../lib/siteMap';

export default function ContentManagementPage() {
  const params = useParams<{ pageKey?: string; locale?: string }>();
  const location = useLocation();
  const found = areaForPage(params.pageKey ?? 'home') ?? areaForPage('home');
  if (!found) return <Navigate to="/admin" replace />;
  const locale =
    params.locale && (LOCALES as readonly string[]).includes(params.locale)
      ? (params.locale as Locale)
      : undefined;
  return (
    <Navigate
      to={{ pathname: hubPath(found.area, found.part, locale), search: location.search }}
      replace
    />
  );
}
