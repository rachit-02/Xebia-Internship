import { apiFetch } from '@/features/departments/api/departments';
import type { User, UserFilters, PaginatedUsersResponse } from '@/types/user';

export async function getUsers(filters?: UserFilters): Promise<PaginatedUsersResponse['data']> {
  const queryParams = new URLSearchParams();
  if (filters?.page) queryParams.append('page', filters.page.toString());
  if (filters?.limit) queryParams.append('limit', filters.limit.toString());
  if (filters?.search) queryParams.append('search', filters.search);
  
  const queryString = queryParams.toString();
  const url = `/user-management${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiFetch(url);
  return response.data;
}

export async function getUser(id: string): Promise<User> {
  const response = await apiFetch(`/user-management/${id}`);
  return response.data;
}

export async function createUser(data: Partial<User>): Promise<User> {
  const response = await apiFetch(`/user-management`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const response = await apiFetch(`/user-management/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function activateUser(id: string): Promise<void> {
  await apiFetch(`/user-management/${id}/activate`, { method: 'POST' });
}

export async function deactivateUser(id: string): Promise<void> {
  await apiFetch(`/user-management/${id}/deactivate`, { method: 'POST' });
}

export async function deleteUser(id: string): Promise<void> {
  await apiFetch(`/user-management/${id}`, { method: 'DELETE' });
}
