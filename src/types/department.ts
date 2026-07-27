export type DepartmentStatus = 'active' | 'inactive';

export type Department = {
  id: string;
  name: string;
  code: string;
  hod: string;
  email: string;
  phone: string;
  building: string;
  description: string;
  facultyCount: number;
  studentCount: number;
  programs: number;
  courses: number;
  status: DepartmentStatus;
  createdAt: string;
  updatedAt: string;
  researchProjects: number;
  upcomingEvents: Array<{ title: string; date: string; location: string }>;
  announcements: Array<{ title: string; body: string; date: string }>;
  activity: Array<{ label: string; detail: string; time: string }>;
};

export type DepartmentFilters = {
  query: string;
  status: 'all' | DepartmentStatus;
  building: string;
};
