import type { Department, DepartmentFilters } from '@/types/department';
import initialDepartmentsData from '../data/departments.json';

const BASE_URL = '/api/v1';
const MOCK_STORAGE_KEY = 'departments_mock_store';

function getAuthToken() {
  return sessionStorage.getItem('token') || localStorage.getItem('token');
}

function getMockStore(): Department[] {
  try {
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse mock store from localStorage', e);
  }
  const initial = initialDepartmentsData as Department[];
  try {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(initial));
  } catch (e) {
    // Ignore storage errors
  }
  return initial;
}

function setMockStore(departments: Department[]) {
  try {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(departments));
  } catch (e) {
    console.error('Failed to save mock store to localStorage', e);
  }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// CORE CRUD API
// ---------------------------------------------------------------------------

export async function getDepartments(filters: DepartmentFilters): Promise<Department[]> {
  let data: Department[];
  try {
    data = await apiFetch('/departments');
    if (!Array.isArray(data)) {
      throw new Error('Invalid department data from API');
    }
  } catch (err) {
    data = getMockStore();
  }

  const query = filters.query.trim().toLowerCase();

  return data.filter((department) => {
    const matchesQuery =
      !query ||
      [department.name, department.code, department.hod, department.email, department.building].some(
        (value) => value && value.toLowerCase().includes(query)
      );
    const matchesStatus = filters.status === 'all' || department.status === filters.status;
    const matchesBuilding = !filters.building || department.building === filters.building;
    return matchesQuery && matchesStatus && matchesBuilding;
  });
}

export async function getDepartmentById(departmentId: string): Promise<Department> {
  try {
    return await apiFetch(`/departments/${departmentId}`);
  } catch (err) {
    const store = getMockStore();
    const found = store.find((d) => d.id === departmentId);
    if (found) return found;
    throw new Error(`Department with ID ${departmentId} not found.`);
  }
}

export async function createDepartment(
  input: Omit<Department, 'id' | 'createdAt' | 'updatedAt' | 'researchProjects' | 'upcomingEvents' | 'announcements' | 'activity'>
): Promise<Department> {
  const newDepartment: Department = {
    ...input,
    id: `dept-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    researchProjects: 0,
    upcomingEvents: [],
    announcements: [],
    activity: [{ label: 'Created', detail: 'Department created', time: 'Just now' }],
  };

  try {
    const res = await apiFetch('/departments', {
      method: 'POST',
      body: JSON.stringify(newDepartment),
    });
    if (res) return res;
  } catch (err) {
    // Fallback to local mock store
  }

  const store = getMockStore();
  const updatedStore = [newDepartment, ...store];
  setMockStore(updatedStore);
  return newDepartment;
}

export async function updateDepartment(departmentId: string, input: Partial<Department>): Promise<Department> {
  try {
    const res = await apiFetch(`/departments/${departmentId}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
    if (res) return res;
  } catch (err) {
    // Fallback to local mock store
  }

  const store = getMockStore();
  let updatedDepartment: Department | null = null;
  const updatedStore = store.map((dept) => {
    if (dept.id === departmentId) {
      updatedDepartment = { ...dept, ...input, updatedAt: new Date().toISOString() };
      return updatedDepartment;
    }
    return dept;
  });

  if (updatedDepartment) {
    setMockStore(updatedStore);
    return updatedDepartment;
  }
  throw new Error(`Department ${departmentId} not found.`);
}

export async function deleteDepartment(departmentId: string): Promise<void> {
  try {
    await apiFetch(`/departments/${departmentId}`, {
      method: 'DELETE',
    });
  } catch (err) {
    // Fallback to local mock store
  }
  const store = getMockStore();
  const updatedStore = store.filter((d) => d.id !== departmentId);
  setMockStore(updatedStore);
}

export async function getDepartmentLookup() {
  try {
    return await apiFetch('/departments/lookup');
  } catch (err) {
    const store = getMockStore();
    return store.map((d) => ({ id: d.id, name: d.name, code: d.code }));
  }
}

export async function getDepartmentHierarchy(departmentId: string) {
  try {
    return await apiFetch(`/departments/${departmentId}/hierarchy`);
  } catch (err) {
    const store = getMockStore();
    const dept = store.find((d) => d.id === departmentId);
    return { id: dept?.id || departmentId, name: dept?.name || 'Department', children: [] };
  }
}

export async function getDepartmentBreadcrumb(departmentId: string) {
  try {
    return await apiFetch(`/departments/${departmentId}/breadcrumb`);
  } catch (err) {
    const store = getMockStore();
    const dept = store.find((d) => d.id === departmentId);
    return [
      { label: 'Departments', href: '/departments' },
      { label: dept?.name || 'Department Details', href: `/departments/${departmentId}` },
    ];
  }
}

// ---------------------------------------------------------------------------
// STATS & FILTERS
// ---------------------------------------------------------------------------

export async function getDepartmentFilters() {
  let departments: Department[];
  try {
    departments = await apiFetch('/departments');
    if (!Array.isArray(departments)) {
      throw new Error('Invalid department data from API');
    }
  } catch (err) {
    departments = getMockStore();
  }

  return {
    buildings: Array.from(new Set(departments.map((department) => department.building).filter(Boolean))),
    total: departments.length,
    active: departments.filter((department) => department.status === 'active').length,
    faculty: departments.reduce((sum, department) => sum + (department.facultyCount || 0), 0),
    students: departments.reduce((sum, department) => sum + (department.studentCount || 0), 0),
  };
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
    { month: 'Jan', enrollment: Math.round(department.studentCount * 0.78), faculty: Math.round(department.facultyCount * 0.88), performance: 72 },
    { month: 'Feb', enrollment: Math.round(department.studentCount * 0.8), faculty: Math.round(department.facultyCount * 0.9), performance: 75 },
    { month: 'Mar', enrollment: Math.round(department.studentCount * 0.82), faculty: Math.round(department.facultyCount * 0.95), performance: 77 },
    { month: 'Apr', enrollment: Math.round(department.studentCount * 0.85), faculty: Math.round(department.facultyCount * 0.97), performance: 79 },
    { month: 'May', enrollment: Math.round(department.studentCount * 0.88), faculty: department.facultyCount, performance: 81 },
    { month: 'Jun', enrollment: Math.round(department.studentCount * 0.91), faculty: Math.round(department.facultyCount * 1.02), performance: 84 },
  ];
}

// ---------------------------------------------------------------------------
// CSV IMPORT / EXPORT
// ---------------------------------------------------------------------------

const csvColumns = [
  'id', 'name', 'code', 'hod', 'email', 'phone', 'building', 'description',
  'facultyCount', 'studentCount', 'programs', 'courses', 'status',
  'createdAt', 'updatedAt', 'researchProjects', 'upcomingEvents', 'announcements', 'activity'
] as const;

function escapeCsvValue(value: string) {
  if (/["]|,|\r|\n/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function stringifyCell(value: unknown) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

export function exportDepartmentsToCsv(items: Department[]) {
  const toCsvRow = (department: Department) => {
    const row: Record<(typeof csvColumns)[number], string> = {
      id: stringifyCell(department.id),
      name: stringifyCell(department.name),
      code: stringifyCell(department.code),
      hod: stringifyCell(department.hod),
      email: stringifyCell(department.email),
      phone: stringifyCell(department.phone),
      building: stringifyCell(department.building),
      description: stringifyCell(department.description),
      facultyCount: stringifyCell(department.facultyCount),
      studentCount: stringifyCell(department.studentCount),
      programs: stringifyCell(department.programs),
      courses: stringifyCell(department.courses),
      status: stringifyCell(department.status),
      createdAt: stringifyCell(department.createdAt),
      updatedAt: stringifyCell(department.updatedAt),
      researchProjects: stringifyCell(department.researchProjects),
      upcomingEvents: stringifyCell(department.upcomingEvents),
      announcements: stringifyCell(department.announcements),
      activity: stringifyCell(department.activity),
    };
    return csvColumns.map((column) => escapeCsvValue(row[column])).join(',');
  };
  return [csvColumns.join(','), ...items.map(toCsvRow)].join('\n');
}

export async function importDepartmentsFromCsv(csvText: string) {
  const lines = csvText.split('\n').filter((line) => line.trim().length > 0);
  const importedCount = Math.max(0, lines.length - 1);
  return { imported: importedCount, total: importedCount };
}
