import { useEffect, useSyncExternalStore } from 'react';
import { useBlocker, type Location } from 'react-router-dom';
import { useConfirm } from '../components/ConfirmDialog';
import { useAdminStrings } from './useAdmin';

type UnsavedEntry = { dirty: boolean; save?: () => Promise<boolean | void> };

// The currently mounted editor announces its dirty state here so chrome that
// lives outside the editor (the sign-out button) can ask before acting.
let current: UnsavedEntry = { dirty: false };
const listeners = new Set<() => void>();

function publish(next: UnsavedEntry) {
  current = next;
  listeners.forEach((listener) => listener());
}

/** Dirty state of whatever editor is open right now. */
export function useUnsavedState(): UnsavedEntry {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
    () => current,
  );
}

export type UnsavedChangesOptions = {
  /** Navigations for which the editor keeps its state and no dialog is needed. */
  allow?: (next: Location) => boolean;
  /** Called when the user chooses to leave without saving. */
  onDiscard?: () => void;
};

/**
 * Keeps unsaved edits from being lost.
 *
 * - Closing or refreshing the tab triggers the browser's native prompt.
 * - Navigating inside the dashboard (sidebar, back button, links) opens the
 *   dashboard's own dialog: leave, or save first when `onSave` is given.
 */
export function useUnsavedChanges(
  isDirty: boolean,
  onSave?: () => Promise<boolean | void>,
  options: UnsavedChangesOptions = {},
) {
  const confirm = useConfirm();
  const s = useAdminStrings();
  const { allow, onDiscard } = options;
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname && !(allow && allow(nextLocation)),
  );

  useEffect(() => {
    publish({ dirty: isDirty, save: onSave });
    return () => publish({ dirty: false });
  }, [isDirty, onSave]);

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
      if (result === true) {
        onDiscard?.();
        blocker.proceed();
      } else {
        blocker.reset();
      }
    });
    return () => {
      cancelled = true;
    };
    // `blocker` identity changes on every state transition; that is the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocker.state]);
}
