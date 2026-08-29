import { useEffect, useRef } from 'react';

/**
 * Layers that close on Escape (dialogs, pickers, side panels, overlays)
 * register here in mount order. Only the one on top reacts, so pressing
 * Escape to cancel a confirmation does not also dismiss the panel behind it.
 */
const stack: symbol[] = [];

export function useTopmostEscape(onEscape: () => void, active = true) {
  const handler = useRef(onEscape);
  handler.current = onEscape;

  useEffect(() => {
    if (!active) return undefined;
    const token = Symbol('layer');
    stack.push(token);

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (stack[stack.length - 1] !== token) return;
      event.stopPropagation();
      handler.current();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      const index = stack.indexOf(token);
      if (index !== -1) stack.splice(index, 1);
    };
  }, [active]);
}
