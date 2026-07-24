import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../utils/permissions';
import { logout as authLogout } from '../api/auth';

type AuthContextType = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  loginAsUser: (user: AuthUser, token?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse auth user from sessionStorage', e);
    }
    // Default fallback user if token is set
    const token = sessionStorage.getItem('token');
    if (token) {
      return {
        id: 'usr-1',
        email: 'admin@university.edu',
        name: 'University Admin',
        role: 'university_admin',
      };
    }
    return null;
  });

  const setUser = (newUser: AuthUser | null) => {
    setUserState(newUser);
    if (newUser) {
      sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    } else {
      sessionStorage.removeItem(AUTH_USER_KEY);
    }
  };

  const loginAsUser = (newUser: AuthUser, token: string = 'dummy-jwt-token') => {
    sessionStorage.setItem('token', token);
    setUser(newUser);
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_USER_KEY);
    authLogout();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginAsUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
