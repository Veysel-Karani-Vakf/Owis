import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCmsVersion, setDraft, setPublished, subscribeCms } from './store';
import { hydrateCms } from './hydrate';
import {
  ADMIN_SOURCE,
  PREVIEW_SOURCE,
  isPreviewFrame,
  type AdminMessage,
  type PreviewMessage,
} from './preview';

/**
 * Re-renders the caller whenever CMS content changes.
 *
 * `I18nProvider` folds this into its context value, so every component that
 * reads site content (all of which need a locale) picks up new content without
 * each one subscribing individually.
 */
export function useCmsVersion(): number {
  return useSyncExternalStore(subscribeCms, getCmsVersion, getCmsVersion);
}

function postToParent(message: PreviewMessage) {
  if (typeof window === 'undefined' || window.parent === window) return;
  window.parent.postMessage(message, window.location.origin);
}

/**
 * Hydrates published content on boot and, inside the dashboard's preview frame,
 * accepts unsaved drafts over postMessage.
 *
 * Children render immediately against the static defaults so the first paint is
 * never blocked on the network; hydration swaps content in when it lands.
 */
export function CmsProvider({ children }: { children: ReactNode }) {
  const preview = isPreviewFrame();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  useEffect(() => {
    let active = true;
    hydrateCms()
      .then((snapshot) => {
        if (active) setPublished(snapshot);
      })
      .catch(() => {
        // Offline or misconfigured Supabase: the static content already shown
        // stays in place rather than blanking the site.
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!preview) return undefined;
    document.documentElement.dataset.cmsPreview = '1';

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const message = event.data as AdminMessage | undefined;
      if (!message || message.source !== ADMIN_SOURCE) return;

      if (message.type === 'draft') {
        setDraft(message.snapshot);
      } else if (message.type === 'navigate') {
        navigate(message.path);
      } else if (message.type === 'highlight') {
        applyHighlight(message.selector);
      }
    };

    window.addEventListener('message', onMessage);
    postToParent({ source: PREVIEW_SOURCE, type: 'ready' });

    return () => {
      window.removeEventListener('message', onMessage);
      delete document.documentElement.dataset.cmsPreview;
      setDraft(null);
    };
  }, [preview, navigate]);

  useEffect(() => {
    if (!preview) return;
    postToParent({ source: PREVIEW_SOURCE, type: 'navigated', path: pathname + search });
  }, [preview, pathname, search]);

  return <>{children}</>;
}

let highlighted: Element | null = null;

/** Outlines the section a dashboard editor is focused on. */
function applyHighlight(selector: string | null) {
  if (highlighted) {
    highlighted.classList.remove('cms-preview-highlight');
    highlighted = null;
  }
  if (!selector) return;
  const target = document.querySelector(selector);
  if (!target) return;
  target.classList.add('cms-preview-highlight');
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  highlighted = target;
}
