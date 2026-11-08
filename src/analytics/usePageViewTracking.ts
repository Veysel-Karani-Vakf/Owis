import { useEffect } from 'react';
import { isAdminPath, stopAnalytics, trackPageView } from './googleAnalytics';

function decode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** False once a <Navigate> redirect has replaced the entry this render was for. */
function isStillCurrent(pathname: string, search: string): boolean {
  return (
    decode(window.location.pathname) === decode(pathname) && decode(window.location.search) === decode(search)
  );
}

/**
 * Reports a page_view for each public route the visitor actually lands on.
 * Call it from App with the router location and whether the CMS has settled
 * (before that only the splash is on screen).
 *
 * The report waits one animation frame: by then PageSeo has set the page's
 * title (it re-applies it in a frame of its own) and any redirect rendered by
 * the route has already replaced the URL, so only its target is counted. The
 * timer covers background tabs, where frames do not run.
 */
export function usePageViewTracking(pathname: string, search: string, ready: boolean): void {
  useEffect(() => {
    if (isAdminPath(pathname)) {
      stopAnalytics();
      return undefined;
    }
    if (!ready) return undefined;

    let frame = 0;
    let fallback = 0;
    let pending = true;
    const report = () => {
      if (!pending) return;
      pending = false;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
      if (isStillCurrent(pathname, search)) trackPageView();
    };
    frame = window.requestAnimationFrame(report);
    fallback = window.setTimeout(report, 1000);

    return () => {
      pending = false;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
    };
  }, [pathname, search, ready]);
}
