export const AUTH_URL = '/api/v1/auth';

export async function login(email: string, password: string) {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  let data;
  try {
    data = await response.clone().json();
  } catch (err) {
    const text = await response.text();
    console.error('Non-JSON response:', response.status, text);
    throw new Error(`Server returned an invalid response (Status ${response.status}). Are you sure the backend is running?`);
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Login failed');
  }

  return data;
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
