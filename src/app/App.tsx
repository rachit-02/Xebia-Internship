import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DepartmentCreatePage } from './features/departments/pages/DepartmentCreatePage';
import { DepartmentDetailsPage } from './features/departments/pages/DepartmentDetailsPage';
import { DepartmentEditPage } from './features/departments/pages/DepartmentEditPage';
import { DepartmentListPage } from './features/departments/pages/DepartmentListPage';
import { DepartmentUsersPage } from './features/departments/pages/DepartmentUsersPage';

export default function App() {
	return (
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
	);
}
