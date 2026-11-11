import { useLocation } from 'react-router-dom';
import { isAwardRoute } from '@/data/award/routes';

/**
 * Routes whose pages open on a light stage rather than a dark photo hero (the
 * volunteer award section): the floating header starts in its solid glass
 * state there, so its dark text and logo stay legible from the first frame.
 */
export function useLightTopChrome() {
  const { pathname } = useLocation();
  return isAwardRoute(pathname);
}
