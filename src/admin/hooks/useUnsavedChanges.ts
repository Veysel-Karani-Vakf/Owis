import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';
import { useConfirm } from '../components/ConfirmDialog';
import { useAdminStrings } from './useAdmin';

/**
 * Keeps unsaved edits from being lost.
 *
 * - Closing or refreshing the tab triggers the browser's native prompt.
 * - Navigating inside the dashboard (sidebar, back button, links) opens the
 *   dashboard's own dialog: leave, or save first when `onSave` is given.
 */
export function useUnsavedChanges(isDirty: boolean, onSave?: () => Promise<boolean | void>) {
  const confirm = useConfirm();
  const s = useAdminStrings();
  const blocker = useBlocker(({ currentLocation, nextLocation }) =>
    isDirty && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (!isDirty) return undefined;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Chrome still requires returnValue to be set for the prompt to show.
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    let cancelled = false;
    confirm({
      title: s.unsavedTitle,
      body: s.unsavedBody,
      confirmLabel: s.leaveWithoutSaving,
      cancelLabel: s.stay,
      altLabel: onSave ? s.saveAndLeave : undefined,
      destructive: true,
    }).then(async (result) => {
      if (cancelled) return;
      if (result === 'alt' && onSave) {
        const saved = await onSave();
        if (saved === false) {
          blocker.reset();
          return;
        }
        blocker.proceed();
        return;
      }
      if (result === true) blocker.proceed();
      else blocker.reset();
    });
    return () => {
      cancelled = true;
    };
    // `blocker` identity changes on every state transition; that is the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocker.state]);
}
