import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import { I18nProvider } from './i18n/LanguageProvider';
import { CmsProvider } from './cms/CmsProvider';
import './index.css';
import { localizedContent } from './i18n/content';

// On phones (and with reduced motion) the landing hero shows its poster, so
// start that ~400 KB download now rather than after the content round trip.
// On desktop the poster is only a fallback behind the video, and downloading
// it while the video starts would only take bandwidth from the video, whose
// adaptive quality is chosen from what the connection has to spare.
const heroShowsPoster =
  window.matchMedia('(max-width: 767px)').matches ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (window.location.pathname === '/' && heroShowsPoster) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = localizedContent.ar.hero.posterImage;
  document.head.appendChild(link);
}

// A data router (rather than <BrowserRouter>) so the dashboard can block
// navigation — including the browser's back button — while edits are unsaved.
const router = createBrowserRouter(
  [
    {
      path: '*',
      element: (
        <CmsProvider>
          <I18nProvider>
            <App />
          </I18nProvider>
        </CmsProvider>
      ),
    },
  ],
  { future: { v7_relativeSplatPath: true } },
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  </StrictMode>
);
