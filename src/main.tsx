import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import { I18nProvider } from './i18n/LanguageProvider';
import { CmsProvider } from './cms/CmsProvider';
import './index.css';
import { localizedContent } from './i18n/content';

// The landing hero's poster is the first thing seen once content is in; start
// it now rather than after the content round trip (home only: it is ~400 KB).
if (window.location.pathname === '/') {
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
