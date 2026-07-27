import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Building2, Loader2, ShieldCheck, UserCheck } from 'lucide-react';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '@/types/user';

const DEMO_ROLES: Array<{ label: string; role: UserRole; email: string; desc: string }> = [
  { label: 'Super Admin', role: 'super_admin', email: 'superadmin@university.edu', desc: 'Full System Control' },
  { label: 'University Admin', role: 'university_admin', email: 'admin@university.edu', desc: 'All Departments CRUD' },
  { label: 'Department Head', role: 'department_head', email: 'head@university.edu', desc: 'CS Dept Only' },
  { label: 'Faculty', role: 'faculty', email: 'faculty@university.edu', desc: 'Read-only CS Dept' },
  { label: 'Student', role: 'student', email: 'student@university.edu', desc: 'Basic Read-only' },
];

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginAsUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/departments';

  const handleAuth = async (targetEmail: string, targetPass: string) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await login(targetEmail, targetPass);
      const token = response.token || response.data?.token || response.accessToken || 'dummy-jwt-token';
      const user = response.user || {
        id: `usr-${Date.now()}`,
        email: targetEmail,
        name: 'User',
        role: 'university_admin' as UserRole,
      };

      loginAsUser(user, token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuth(email, password);
  };

  const selectDemoRole = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    handleAuth(demoEmail, 'password123');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-soft blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-purple/10 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-border flex items-center justify-center">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-heading">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-text">
          Sign in to your university dashboard with Role-Based Access Control
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-card sm:rounded-3xl sm:px-10 border border-white">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-danger-soft border border-danger-soft-border text-danger px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-heading">
                Email address
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 px-3 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary-soft focus:border-primary sm:text-sm bg-surface-soft text-heading transition-shadow"
                  placeholder="admin@university.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-heading">
                Password
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 px-3 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary-soft focus:border-primary sm:text-sm bg-surface-soft text-heading transition-shadow"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[linear-gradient(135deg,#6C1D5F,#84117C)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-opacity disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-border pt-5">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted mb-3">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Demo Quick Sign-In (Select Role)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {DEMO_ROLES.map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => selectDemoRole(demo.email)}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-surface-soft px-3 py-1.5 text-xs font-semibold text-heading hover:bg-primary-soft hover:text-primary transition-colors"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>{demo.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
