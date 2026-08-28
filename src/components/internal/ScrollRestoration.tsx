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

    window.requestAnimationFrame(() => {
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top: Math.max(top, 0), behavior: getScrollBehavior() });
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}
