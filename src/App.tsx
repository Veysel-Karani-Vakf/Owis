import Preloader from '@/components/ui/Preloader';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollRestoration from '@/components/internal/ScrollRestoration';
import { isPreviewFrame } from '@/cms/preview';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const AdminApp = lazy(() => import('@/admin/AdminApp'));
import HomePage from '@/pages/HomePage';
import WaqfAboutPage from '@/pages/WaqfAboutPage';
import GovernancePage from '@/pages/GovernancePage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import ProgramPage from '@/pages/ProgramPage';
import DonatePage from '@/pages/DonatePage';
import NewsIndexPage from '@/pages/NewsIndexPage';
import NewsArticlePage from '@/pages/NewsArticlePage';
import ParticipatePage from '@/pages/ParticipatePage';
import LibraryIndexPage from '@/pages/library/LibraryIndexPage';
import LibraryCollectionPage from '@/pages/library/LibraryCollectionPage';
import LibraryTextPage from '@/pages/library/LibraryTextPage';
import LibraryGalleryPage from '@/pages/library/LibraryGalleryPage';
import LibraryDocumentsPage from '@/pages/library/LibraryDocumentsPage';

function App() {
  const { pathname } = useLocation();

  // The admin dashboard renders its own chrome (no public Header/Footer/Preloader).
  if (pathname.startsWith('/admin')) {
    return (
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-100" />}>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      {/* The splash screen would cover the very content being edited. */}
      {!isPreviewFrame() && <Preloader />}
      <ScrollProgress />
      <ScrollRestoration />
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about/waqf" element={<WaqfAboutPage />} />
        <Route path="/about/governance" element={<GovernancePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/programs/:slug" element={<ProgramPage />} />
        <Route path="/news" element={<NewsIndexPage />} />
        <Route path="/news/:slug" element={<NewsArticlePage />} />
        <Route path="/participate" element={<Navigate to="/participate/share-ideas" replace />} />
        <Route path="/participate/:slug" element={<ParticipatePage />} />
        <Route path="/library" element={<LibraryIndexPage />} />
        <Route path="/library/forum" element={<LibraryCollectionPage collection="forum" />} />
        <Route path="/library/forum/:slug" element={<LibraryTextPage type="forum" />} />
        <Route path="/library/periodic-reports" element={<LibraryDocumentsPage collection="periodic-reports" />} />
        <Route path="/library/waqf-books" element={<LibraryDocumentsPage collection="waqf-books" />} />
        <Route path="/library/waqf-literature" element={<LibraryDocumentsPage collection="waqf-literature" />} />
        <Route path="/library/yemeni-figures" element={<LibraryDocumentsPage collection="yemeni-figures" />} />
        <Route path="/library/success-stories" element={<LibraryCollectionPage collection="success-stories" />} />
        <Route path="/library/success-stories/:slug" element={<LibraryTextPage type="success-stories" />} />
        <Route path="/library/gallery" element={<LibraryGalleryPage />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
