import Preloader from '@/components/ui/Preloader';
import ScrollProgress from '@/components/ui/ScrollProgress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollRestoration from '@/components/internal/ScrollRestoration';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import WaqfAboutPage from '@/pages/WaqfAboutPage';
import GovernancePage from '@/pages/GovernancePage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';

function App() {
  return (
    <>
      <Preloader />
      <ScrollProgress />
      <ScrollRestoration />
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about/waqf" element={<WaqfAboutPage />} />
        <Route path="/about/governance" element={<GovernancePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
