import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import { I18nProvider } from './i18n/LanguageProvider';
import { CmsProvider } from './cms/CmsProvider';
import './index.css';

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
