import { useEffect, useState } from 'react';

export function useScrolled(threshold: number = 80) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateScrolled = () => {
      setScrolled(window.scrollY > threshold);
    };

    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateScrolled);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScrolled();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);

  return scrolled;
}
