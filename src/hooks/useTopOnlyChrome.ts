import { useLocation } from 'react-router-dom';
import { libraryProfileRoute } from '@/data/library/profile';
import { aboutRoutes } from '@/data/about';

/**
 * Routes where the site chrome (header, library pill nav, assistant) lives at
 * the top of the page only: it scrolls away with the content instead of
 * following the visitor down.
 */
const TOP_ONLY_CHROME_ROUTES: readonly string[] = [
  libraryProfileRoute,
  aboutRoutes.structure,
];

export function isTopOnlyChromeRoute(pathname: string) {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return TOP_ONLY_CHROME_ROUTES.includes(normalized);
}

export function useTopOnlyChrome() {
  const { pathname } = useLocation();
  return isTopOnlyChromeRoute(pathname);
}
