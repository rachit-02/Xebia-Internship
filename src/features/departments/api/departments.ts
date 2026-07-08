import rawDepartments from '../data/departments.json';
import type { Department, DepartmentFilters } from '@/types/department';

const delay = (ms = 240) => new Promise((resolve) => window.setTimeout(resolve, ms));
const storageKey = 'department-dashboard.departments';

type CsvRow = Record<string, string>;

const csvColumns = [
  'id',
  'name',
  'code',
  'hod',
  'email',
  'phone',
  'building',
  'description',
  'facultyCount',
  'studentCount',
  'programs',
  'courses',
  'status',
  'createdAt',
  'updatedAt',
  'researchProjects',
  'upcomingEvents',
  'announcements',
  'activity',
] as const;

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function cloneDepartments(items: Department[]) {
  return items.map((department) => ({
    ...department,
    upcomingEvents: department.upcomingEvents.map((event) => ({ ...event })),
    announcements: department.announcements.map((announcement) => ({ ...announcement })),
    activity: department.activity.map((activityItem) => ({ ...activityItem })),
  }));
}

function readStoredDepartments() {
  try {
    if (!canUseStorage()) return null;

    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as Department[];
    return Array.isArray(parsed) ? cloneDepartments(parsed) : null;
  } catch {
    return null;
  }
}

function persistDepartments(items: Department[]) {
  try {
    if (!canUseStorage()) return;

    window.localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {
    // Ignore storage failures and keep the in-memory store working.
  }
}

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

function toCsvRow(department: Department) {
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
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (inQuotes) {
      if (character === '"' && nextCharacter === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        inQuotes = false;
      } else {
        cell += character;
      }

      continue;
    }

    if (character === '"') {
      inQuotes = true;
      continue;
    }

    if (character === ',') {
      row.push(cell);
      cell = '';
      continue;
    }

    if (character === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    if (character === '\r') {
      continue;
    }

    cell += character;
  }

  row.push(cell);
  rows.push(row);

  return rows.filter((items) => items.some((item) => item.trim().length > 0));
}

function parseNumber(value: string, field: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid numeric value for ${field}.`);
  }

  return parsed;
}

function parseJsonArray<T>(value: string, fallback: T[]) {
  if (!value.trim()) return fallback;

  try {
    const parsed = JSON.parse(value) as T[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function createDepartmentFromRow(row: CsvRow): Department {
  const now = new Date().toISOString();

  return {
    id: row.id?.trim() || `${row.code?.trim().toLowerCase() || 'department'}-${Date.now()}`,
    name: row.name.trim(),
    code: row.code.trim().toUpperCase(),
    hod: row.hod.trim(),
    email: row.email.trim(),
    phone: row.phone.trim(),
    building: row.building.trim(),
    description: row.description.trim(),
    facultyCount: parseNumber(row.facultyCount, 'facultyCount'),
    studentCount: parseNumber(row.studentCount, 'studentCount'),
    programs: parseNumber(row.programs, 'programs'),
    courses: parseNumber(row.courses, 'courses'),
    status: row.status === 'inactive' ? 'inactive' : 'active',
    createdAt: row.createdAt?.trim() || now,
    updatedAt: row.updatedAt?.trim() || now,
    researchProjects: parseNumber(row.researchProjects, 'researchProjects'),
    upcomingEvents: parseJsonArray(row.upcomingEvents, []),
    announcements: parseJsonArray(row.announcements, []),
    activity: parseJsonArray(row.activity, []),
  };
}

function normalizeDepartments(items: Department[]) {
  const merged = new Map<string, Department>();

  for (const department of items) {
    merged.set(department.code.toLowerCase(), department);
  }

  return Array.from(merged.values());
}

let departments = readStoredDepartments() ?? cloneDepartments(rawDepartments as Department[]);

persistDepartments(departments);

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
  persistDepartments(departments);
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

  persistDepartments(departments);
  return departments.find((department) => department.id === departmentId) ?? existing;
}

export async function deleteDepartment(departmentId: string) {
  await delay(200);
  departments = departments.filter((department) => department.id !== departmentId);
  persistDepartments(departments);
  return true;
}

export function exportDepartmentsToCsv(items: Department[] = departments) {
  return [csvColumns.join(','), ...items.map(toCsvRow)].join('\n');
}

export async function importDepartmentsFromCsv(csvText: string) {
  await delay(240);

  const rows = parseCsv(csvText);
  if (rows.length < 2) {
    throw new Error('The CSV file does not contain any department records.');
  }

  const [headerRow, ...dataRows] = rows;
  const normalizedHeaders = headerRow.map((header) => header.trim());

  const importedDepartments = dataRows.map((row) => {
    const rowObject: CsvRow = {};

    normalizedHeaders.forEach((header, index) => {
      rowObject[header] = row[index] ?? '';
    });

    return createDepartmentFromRow({
      id: rowObject.id ?? '',
      name: rowObject.name ?? '',
      code: rowObject.code ?? '',
      hod: rowObject.hod ?? '',
      email: rowObject.email ?? '',
      phone: rowObject.phone ?? '',
      building: rowObject.building ?? '',
      description: rowObject.description ?? '',
      facultyCount: rowObject.facultyCount ?? '0',
      studentCount: rowObject.studentCount ?? '0',
      programs: rowObject.programs ?? '0',
      courses: rowObject.courses ?? '0',
      status: rowObject.status ?? 'active',
      createdAt: rowObject.createdAt ?? '',
      updatedAt: rowObject.updatedAt ?? '',
      researchProjects: rowObject.researchProjects ?? '0',
      upcomingEvents: rowObject.upcomingEvents ?? '[]',
      announcements: rowObject.announcements ?? '[]',
      activity: rowObject.activity ?? '[]',
    });
  });

  const importedByCode = new Map(importedDepartments.map((department) => [department.code.toLowerCase(), department]));
  const mergedDepartments = departments.map((department) => importedByCode.get(department.code.toLowerCase()) ?? department);
  const remainingImports = importedDepartments.filter((department) => !departments.some((existing) => existing.code.toLowerCase() === department.code.toLowerCase()));

  departments = normalizeDepartments([...remainingImports, ...mergedDepartments]);
  persistDepartments(departments);

  return { imported: importedDepartments.length, total: departments.length };
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
