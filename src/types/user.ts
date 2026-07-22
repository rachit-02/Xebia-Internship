export type UserRole = 'super_admin' | 'university_admin' | 'faculty' | 'student' | 'finance_admin';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  roles?: UserRole[];
  status: 'active' | 'inactive';
  phone?: string;
  department?: string; // Optional depending on role
  building?: string;
  createdAt: string;
  updatedAt: string;
};

export type UserFilters = {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
};

export type PaginatedUsersResponse = {
  success: boolean;
  data: {
    data: User[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
};
