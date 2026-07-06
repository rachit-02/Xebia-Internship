import { Navigate, Route, Routes } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { DepartmentListPage } from '@/features/departments/pages/DepartmentListPage';
import { DepartmentCreatePage } from '@/features/departments/pages/DepartmentCreatePage';
import { DepartmentDetailsPage } from '@/features/departments/pages/DepartmentDetailsPage';
import { DepartmentEditPage } from '@/features/departments/pages/DepartmentEditPage';

function PageMotion({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22, ease: 'easeOut' }} className="min-h-full">
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/departments" replace />} />
      <Route
        path="/departments"
        element={
          <AppShell>
            <AnimatePresence mode="wait">
              <PageMotion>
                <DepartmentListPage />
              </PageMotion>
            </AnimatePresence>
          </AppShell>
        }
      />
      <Route
        path="/departments/new"
        element={
          <AppShell>
            <PageMotion>
              <DepartmentCreatePage />
            </PageMotion>
          </AppShell>
        }
      />
      <Route
        path="/departments/:departmentId"
        element={
          <AppShell>
            <PageMotion>
              <DepartmentDetailsPage />
            </PageMotion>
          </AppShell>
        }
      />
      <Route
        path="/departments/:departmentId/edit"
        element={
          <AppShell>
            <PageMotion>
              <DepartmentEditPage />
            </PageMotion>
          </AppShell>
        }
      />
    </Routes>
  );
}