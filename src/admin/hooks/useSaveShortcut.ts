import { useEffect } from 'react';

/** Ctrl/Cmd+S runs `onSave` instead of the browser's "save page" dialog. */
export function useSaveShortcut(onSave: (() => void) | null | undefined) {
  useEffect(() => {
    if (!onSave) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        onSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onSave]);
}
