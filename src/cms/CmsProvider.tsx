import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCmsVersion, markCmsSettled, setDraft, setPublished, subscribeCms } from './store';
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
      })
      .finally(() => {
        // Pages holding a redirect for CMS-only content may now decide.
        if (active) markCmsSettled();
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
        // A re-render may recreate DOM nodes and drop the isolation attributes;
        // re-apply after React has committed the new content.
        window.setTimeout(reapplyHighlight, 50);
      } else if (message.type === 'navigate') {
        navigate(message.path);
      } else if (message.type === 'highlight') {
        applyHighlight(message.selector, message.isolate === true);
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
let lastSelector: string | null = null;
let lastIsolate = false;

/** Removes the `data-cms-hidden` markers left by a previous isolation. */
function clearIsolation() {
  document.querySelectorAll('[data-cms-hidden]').forEach((element) => {
    element.removeAttribute('data-cms-hidden');
  });
}

/**
 * Hides everything on the page except `targets` (and their ancestors/children),
 * so a dashboard editor working on one section sees only that section.
 * A comma selector may match several regions — a labels section whose words
 * appear in more than one place keeps all of them visible.
 * Walks from each target to <body>, hiding the unkept siblings at every
 * level — which also removes the fixed header, footer and assistant.
 */
function isolateElements(targets: Element[]) {
  const keep = new Set<Element>();
  for (const target of targets) {
    let node: Element | null = target;
    while (node && node !== document.body) {
      keep.add(node);
      node = node.parentElement;
    }
  }
  for (const element of keep) {
    const parent = element.parentElement;
    if (!parent) continue;
    for (const sibling of Array.from(parent.children)) {
      if (!keep.has(sibling)) sibling.setAttribute('data-cms-hidden', '1');
    }
  }
}

/** Outlines — or, with `isolate`, spotlights — the section being edited. */
function applyHighlight(selector: string | null, isolate = false) {
  lastSelector = selector;
  lastIsolate = isolate;

  if (highlighted) {
    highlighted.classList.remove('cms-preview-highlight');
    highlighted = null;
  }
  clearIsolation();
  if (!selector) return;
  let targets: Element[] = [];
  try {
    targets = Array.from(document.querySelectorAll(selector));
  } catch {
    return; // Malformed selector in a schema anchor: leave the page untouched.
  }
  const [target] = targets;
  if (!target) return;

  if (isolate) {
    isolateElements(targets);
    window.scrollTo({ top: 0 });
  } else {
    target.classList.add('cms-preview-highlight');
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    highlighted = target;
  }
}

/** Re-applies the last highlight/isolation after content re-renders. */
function reapplyHighlight() {
  if (lastSelector && lastIsolate) applyHighlight(lastSelector, true);
}
