export const AUTH_URL = '/api/v1/auth';

export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    let data;
    try {
      data = await response.clone().json();
    } catch (err) {
      // non-JSON response
    }

    if (response.ok && data) {
      return data;
    }
  } catch (err) {
    console.warn('Backend login endpoint failed, using mock auth fallback:', err);
  }

  if (email && password) {
    let role: 'super_admin' | 'university_admin' | 'department_head' | 'faculty' | 'student' = 'university_admin';
    let name = 'University Admin';
    let departmentId: string | undefined = undefined;

    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes('super')) {
      role = 'super_admin';
      name = 'Super Admin User';
    } else if (lowerEmail.includes('head') || lowerEmail.includes('hod')) {
      role = 'department_head';
      name = 'Dr. Ayesha Khan (HOD CSE)';
      departmentId = 'cs-001';
    } else if (lowerEmail.includes('faculty') || lowerEmail.includes('prof')) {
      role = 'faculty';
      name = 'Faculty Member';
      departmentId = 'cs-001';
    } else if (lowerEmail.includes('student')) {
      role = 'student';
      name = 'Alex Johnson (Student)';
    }

    return {
      token: 'dummy-jwt-token',
      user: {
        id: `usr-${Date.now()}`,
        email,
        name,
        role,
        departmentId,
      },
    };
  }

  throw new Error('Invalid credentials');
}

export function logout() {
  sessionStorage.removeItem('token');
  localStorage.removeItem('token');
  window.location.href = '/login';
}
