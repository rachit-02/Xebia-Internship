import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { DepartmentCreatePage } from '../features/departments/pages/DepartmentCreatePage';
import { DepartmentDetailsPage } from '../features/departments/pages/DepartmentDetailsPage';
import { DepartmentEditPage } from '../features/departments/pages/DepartmentEditPage';
import { DepartmentListPage } from '../features/departments/pages/DepartmentListPage';
import { DepartmentUsersPage } from '../features/departments/pages/DepartmentUsersPage';
import { LoginPage } from '../features/auth/pages/LoginPage';

import { AuthProvider } from '../features/auth/context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = sessionStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <AppShell>
                <Routes>
                  <Route path="/" element={<Navigate to="/login" replace />} />
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
    </AuthProvider>
  );
}
