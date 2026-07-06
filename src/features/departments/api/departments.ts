import rawDepartments from '../data/departments.json';
import type { Department, DepartmentFilters, DepartmentStatus } from '@/types/department';

const delay = (ms = 240) => new Promise((resolve) => window.setTimeout(resolve, ms));

let departments = rawDepartments as Department[];

export async function getDepartments(filters: DepartmentFilters) {
  await delay();
  const query = filters.query.trim().toLowerCase();

  return departments.filter((department) => {
    const matchesQuery = !query || [department.name, department.code, department.hod, department.email, department.building].some((value) => value.toLowerCase().includes(query));
    const matchesStatus = filters.status === 'all' || department.status === filters.status;
    const matchesBuilding = !filters.building || department.building === filters.building;
    return matchesQuery && matchesStatus && matchesBuilding;
  });
}

export async function getDepartmentById(departmentId: string) {
  await delay(180);
  return departments.find((department) => department.id === departmentId) ?? null;
}

export async function createDepartment(input: Omit<Department, 'id' | 'createdAt' | 'updatedAt' | 'researchProjects' | 'upcomingEvents' | 'announcements' | 'activity'>) {
  await delay(220);
  if (departments.some((department) => department.code.toLowerCase() === input.code.toLowerCase())) {
    throw new Error('Department code must be unique.');
  }

  const nextDepartment: Department = {
    ...input,
    id: `${input.code.toLowerCase()}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    researchProjects: 0,
    upcomingEvents: [],
    announcements: [],
    activity: [],
  };

  departments = [nextDepartment, ...departments];
  return nextDepartment;
}

export async function updateDepartment(departmentId: string, input: Partial<Department>) {
  await delay(220);
  const existing = departments.find((department) => department.id === departmentId);
  if (!existing) throw new Error('Department not found.');

  if (input.code && departments.some((department) => department.id !== departmentId && department.code.toLowerCase() === input.code?.toLowerCase())) {
    throw new Error('Department code must be unique.');
  }

  departments = departments.map((department) =>
    department.id === departmentId ? { ...department, ...input, updatedAt: new Date().toISOString() } : department,
  );

  return departments.find((department) => department.id === departmentId) ?? existing;
}

export async function deleteDepartment(departmentId: string) {
  await delay(200);
  departments = departments.filter((department) => department.id !== departmentId);
  return true;
}

export function getDepartmentFilters() {
  return {
    buildings: Array.from(new Set(departments.map((department) => department.building))),
    total: departments.length,
    active: departments.filter((department) => department.status === 'active').length,
    faculty: departments.reduce((sum, department) => sum + department.facultyCount, 0),
    students: departments.reduce((sum, department) => sum + department.studentCount, 0),
  };
}

export function getSeededDepartment(id: string) {
  return departments.find((department) => department.id === id) ?? null;
}

export function getDepartmentStats(department: Department) {
  return [
    { label: 'Faculty', value: department.facultyCount },
    { label: 'Students', value: department.studentCount },
    { label: 'Programs', value: department.programs },
    { label: 'Courses', value: department.courses },
    { label: 'Research Projects', value: department.researchProjects },
  ];
}

export function getDepartmentSeries(department: Department) {
  return [
    { month: 'Jan', enrollment: department.studentCount * 0.78, faculty: department.facultyCount * 0.88, performance: 72 },
    { month: 'Feb', enrollment: department.studentCount * 0.8, faculty: department.facultyCount * 0.9, performance: 75 },
    { month: 'Mar', enrollment: department.studentCount * 0.82, faculty: department.facultyCount * 0.95, performance: 77 },
    { month: 'Apr', enrollment: department.studentCount * 0.85, faculty: department.facultyCount * 0.97, performance: 79 },
    { month: 'May', enrollment: department.studentCount * 0.88, faculty: department.facultyCount, performance: 81 },
    { month: 'Jun', enrollment: department.studentCount * 0.91, faculty: department.facultyCount * 1.02, performance: 84 },
  ];
}
