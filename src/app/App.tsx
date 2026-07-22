import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { DepartmentCreatePage } from '../features/departments/pages/DepartmentCreatePage';
import { DepartmentDetailsPage } from '../features/departments/pages/DepartmentDetailsPage';
import { DepartmentEditPage } from '../features/departments/pages/DepartmentEditPage';
import { DepartmentListPage } from '../features/departments/pages/DepartmentListPage';
import { DepartmentUsersPage } from '../features/departments/pages/DepartmentUsersPage';
import { LoginPage } from '../features/auth/pages/LoginPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Redirect to the /login page, but save the current location they were
    // trying to go to when they were redirected.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <AppShell>
              <Routes>
                <Route path="/" element={<Navigate to="/departments" replace />} />
                <Route path="/departments" element={<DepartmentListPage />} />
                <Route path="/departments/users" element={<DepartmentUsersPage />} />
                <Route path="/departments/new" element={<DepartmentCreatePage />} />
                <Route path="/departments/:departmentId" element={<DepartmentDetailsPage />} />
                <Route path="/departments/:departmentId/edit" element={<DepartmentEditPage />} />
                <Route path="*" element={<Navigate to="/departments" replace />} />
              </Routes>
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
