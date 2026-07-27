import { useState } from 'react';
import type { ReactNode } from 'react';
import { Bell, Grid3X3, Menu, Search, LogOut } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/context/AuthContext';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const formattedRole = user?.role ? user.role.replace('_', ' ').toUpperCase() : 'ADMIN';

  return (
    <div className="min-h-screen bg-background text-heading xl:grid xl:grid-cols-[280px_1fr]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="min-w-0">
        <header className="sticky top-0 z-30 h-[72px] border-b border-border bg-white/90 backdrop-blur-sm">
          <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Open navigation"
                className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-white text-heading shadow-sm xl:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted">University ERP</p>
                <p className="text-sm font-semibold text-heading">Department Module</p>
              </div>
            </div>

            <div className="hidden flex-1 items-center justify-center px-8 md:flex">
              <div className="flex w-full max-w-xl items-center gap-3 rounded-full border border-border bg-surface-soft px-4 py-2.5 shadow-sm">
                <Search className="h-4 w-4 text-muted" />
                <input
                  aria-label="Search"
                  placeholder="Search departments, programs, faculty..."
                  className="w-full bg-transparent text-sm text-heading placeholder:text-muted focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ActionIcon ariaLabel="Notifications" icon={<Bell className="h-4 w-4" />} />
              <ActionIcon ariaLabel="Grid menu" icon={<Grid3X3 className="h-4 w-4" />} />
              <button
                type="button"
                onClick={logout}
                title="Click to Log Out"
                className="flex items-center gap-3 rounded-full border border-border bg-white px-3 py-2 shadow-sm hover:bg-surface-muted transition-colors text-left"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6C1D5F,#84117C)] text-sm font-semibold text-white">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AU'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-heading">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-primary font-medium">{formattedRole}</p>
                </div>
                <LogOut className="h-4 w-4 text-muted hover:text-danger transition-colors" />
              </button>
            </div>
          </div>
        </header>

        <main className={cn('p-4 sm:p-6 lg:p-8', 'xl:pl-0')}>{children}</main>
      </div>
    </div>
  );
}

function ActionIcon({ icon, ariaLabel }: { icon: ReactNode; ariaLabel: string }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-white text-heading shadow-sm transition hover:bg-hover"
    >
      {icon}
    </button>
  );
}
