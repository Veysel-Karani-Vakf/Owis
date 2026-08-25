import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthProvider';
import { useAdminStrings } from './hooks/useAdmin';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ResourceListPage from './pages/ResourceListPage';
import ResourceEditPage from './pages/ResourceEditPage';
import SubmissionsPage from './pages/SubmissionsPage';
import SubscribersPage from './pages/SubscribersPage';
import ContentManagementPage from './pages/ContentManagementPage';
import MediaLibraryPage from './pages/MediaLibraryPage';
import SeedPage from './pages/SeedPage';

function Protected({ children }: { children: React.ReactNode }) {
  const { session, isAdmin, loading } = useAuth();
  const s = useAdminStrings();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm text-slate-400">{s.loginPending}</p>
      </div>
    );
  }
  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 px-4 text-center">
        <p className="text-sm text-slate-600">{s.noAccess}</p>
        <SignOutButton />
      </div>
    );
  }
  return <AdminLayout>{children}</AdminLayout>;
}

function SignOutButton() {
  const { signOut } = useAuth();
  const s = useAdminStrings();
  return (
    <button
      onClick={() => signOut()}
      className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
    >
      {s.signOut}
    </button>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route
        index
        element={
          <Protected>
            <DashboardPage />
          </Protected>
        }
      />
      <Route
        path="r/:key"
        element={
          <Protected>
            <ResourceListPage />
          </Protected>
        }
      />
      <Route
        path="r/:key/:id"
        element={
          <Protected>
            <ResourceEditPage />
          </Protected>
        }
      />
      <Route
        path="submissions"
        element={
          <Protected>
            <SubmissionsPage />
          </Protected>
        }
      />
      <Route
        path="subscribers"
        element={
          <Protected>
            <SubscribersPage />
          </Protected>
        }
      />
      <Route
        path="content"
        element={
          <Protected>
            <ContentManagementPage />
          </Protected>
        }
      />
      <Route
        path="media"
        element={
          <Protected>
            <MediaLibraryPage />
          </Protected>
        }
      />
      <Route path="pages" element={<Navigate to="/admin/content" replace />} />
      <Route
        path="seed"
        element={
          <Protected>
            <SeedPage />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <AdminRoutes />
    </AuthProvider>
  );
}
