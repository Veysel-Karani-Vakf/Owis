import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HEADER_OFFSET = 96;

function getScrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

export default function ScrollRestoration() {
  const location = useLocation();

  useLayoutEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: getScrollBehavior() });
      return;
    }

    const targetId = decodeURIComponent(location.hash.slice(1));
    const target = document.getElementById(targetId);

    if (!target) {
      window.scrollTo({ top: 0, behavior: getScrollBehavior() });
      return;
    }

    if (target.hasAttribute('data-governance-policy')) {
      return;
    }

    let cancelled = false;

    const align = (behavior?: ScrollBehavior) => {
      if (cancelled) return;
      const element = document.getElementById(targetId);
      if (!element) return;
      const top = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top: Math.max(top, 0), behavior: behavior ?? getScrollBehavior() });
    };

    window.requestAnimationFrame(() => align());

    // Content above the target (images, embeds, sections that measure
    // themselves after mount) keeps shifting the layout for a moment, which
    // would leave the viewport on the wrong section. Re-align a few times
    // until things settle — unless the user has scrolled away themselves.
    const cancel = () => {
      cancelled = true;
    };
    const onLoad = () => align('auto');
    const timers = [800, 1800, 3000].map((delay) => window.setTimeout(() => align('auto'), delay));

    window.addEventListener('load', onLoad, { once: true });
    window.addEventListener('wheel', cancel, { once: true, passive: true });
    window.addEventListener('touchstart', cancel, { once: true, passive: true });

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener('load', onLoad);
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
    };
  }, [location.pathname, location.search, location.hash]);

  return null;
}
