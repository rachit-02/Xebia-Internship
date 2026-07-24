import type { UserRole } from '@/types/user';
import type { Department } from '@/types/department';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  departmentId?: string; // Assigned department ID for Department Head & Faculty (e.g., 'cs-001')
};

export function canCreateDepartment(role: UserRole): boolean {
  return role === 'super_admin' || role === 'university_admin';
}

export function canImportExportCsv(role: UserRole): boolean {
  return role === 'super_admin' || role === 'university_admin';
}

export function canDeleteDepartment(role: UserRole): boolean {
  return role === 'super_admin' || role === 'university_admin';
}

export function canEditDepartment(role: UserRole, departmentId: string, userDepartmentId?: string): boolean {
  if (role === 'super_admin' || role === 'university_admin') {
    return true;
  }
  if (role === 'department_head') {
    // Can edit only their assigned department
    const targetDeptId = userDepartmentId || 'cs-001';
    return departmentId === targetDeptId;
  }
  return false;
}

export function filterDepartmentsForUser(departments: Department[], role: UserRole, userDepartmentId?: string): Department[] {
  if (role === 'super_admin' || role === 'university_admin' || role === 'student') {
    return departments;
  }
  if (role === 'department_head' || role === 'faculty') {
    const targetDeptId = userDepartmentId || 'cs-001';
    return departments.filter(
      (dept) => dept.id === targetDeptId || dept.code.toLowerCase() === targetDeptId.toLowerCase()
    );
  }
  return departments;
}
