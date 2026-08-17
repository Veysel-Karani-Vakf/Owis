import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HEADER_OFFSET = 96;

export default function ScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    const targetId = decodeURIComponent(location.hash.slice(1));
    const target = document.getElementById(targetId);

    if (!target) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    if (target.hasAttribute('data-governance-policy')) {
      return;
    }

    window.requestAnimationFrame(() => {
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
    });
  }, [location.pathname, location.hash]);

  return null;
}
