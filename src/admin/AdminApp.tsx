import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthProvider';
import { useAdminStrings } from './hooks/useAdmin';
import AdminLayout from './components/AdminLayout';
import { ToastProvider } from './components/Toast';
import { ConfirmProvider } from './components/ConfirmDialog';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SitePageHub from './pages/SitePageHub';
import ResourceListPage from './pages/ResourceListPage';
import ResourceEditPage from './pages/ResourceEditPage';
import SubmissionsPage from './pages/SubmissionsPage';
import SubscribersPage from './pages/SubscribersPage';
import PaymentsPage from './pages/PaymentsPage';
import ContentManagementPage from './pages/ContentManagementPage';
import MediaLibraryPage from './pages/MediaLibraryPage';
import SeedPage from './pages/SeedPage';
import HelpPage from './pages/HelpPage';

function Protected({ children }: { children: React.ReactNode }) {
  const { session, isAdmin, loading, user, networkError } = useAuth();
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
    return <Navigate to="/admin/login" replace state={{ from: location.pathname + location.search }} />;
  }
  if (!isAdmin) {
    // A database that cannot be reached is not a permission problem; say so
    // instead of telling an admin they have no access.
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 px-4 text-center">
        <p className="text-sm text-slate-600">{networkError ? s.connectionMissing : s.noAccess}</p>
        {!networkError && <p className="max-w-sm text-xs text-slate-500">{s.noAccessHint}</p>}
        {user?.email && (
          <p className="text-xs text-slate-400" dir="ltr">
            {user.email}
          </p>
        )}
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
      <Route path="reset-password" element={<LoginPage mode="reset" />} />
      <Route
        index
        element={
          <Protected>
            <DashboardPage />
          </Protected>
        }
      />
      {/* One hub per public page: its record lists and its texts as tabs. */}
      <Route
        path="site/:areaKey/:part?/:locale?"
        element={
          <Protected>
            <SitePageHub />
          </Protected>
        }
      />
      {/* Old list address — redirects into the hub that owns the list. */}
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
        path="payments"
        element={
          <Protected>
            <PaymentsPage />
          </Protected>
        }
      />
      {/* Page, language and open section live in the URL so links can point
          at "edit the donate page in Turkish" and the back button works. */}
      <Route
        path="content/:pageKey?/:locale?"
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
      <Route path="seed" element={<Navigate to="/admin/restore" replace />} />
      <Route
        path="restore"
        element={
          <Protected>
            <SeedPage />
          </Protected>
        }
      />
      <Route
        path="help"
        element={
          <Protected>
            <HelpPage />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default function AdminApp() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AuthProvider>
          <AdminRoutes />
        </AuthProvider>
      </ConfirmProvider>
    </ToastProvider>
  );
}
