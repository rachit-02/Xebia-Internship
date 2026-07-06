import { ReactNode } from 'react';
import { GraduationCap, Hash, Users, Shield, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

const items = [
  { label: 'Departments', icon: GraduationCap, href: '/departments' },
  { label: 'Department Users', icon: Users, href: '/departments' },
  { label: 'Import Data', icon: Hash, href: '/departments/new' },
  { label: 'Security', icon: Shield, href: '/departments' },
];

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-[280px] border-r border-border bg-white transition-transform xl:sticky xl:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0',
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-border px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-[#F7F1F7] text-primary shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold text-heading">Academix ERP</p>
                <p className="text-sm font-medium text-text">Admin Portal</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <p className="px-2 text-[11px] font-bold uppercase tracking-[0.28em] text-heading/80">Navigation</p>
            <nav className="mt-4 space-y-2">
              {items.map((item, index) => (
                <SidebarItem
                  key={item.label}
                  icon={<item.icon className="h-4 w-4" />}
                  label={item.label}
                  href={item.href}
                  active={index === 0}
                />
              ))}
            </nav>
          </div>

          <div className="border-t border-border px-4 py-5">
            <div className="mb-4 flex items-center gap-3 px-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-heading/80">Online now (12)</p>
            </div>
            <div className="mb-4 flex items-center gap-2 px-2">
              <div className="flex -space-x-2">
                {['SA', 'RC', 'PP'].map((initials, index) => (
                  <div
                    key={initials}
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-sm',
                      index === 0 ? 'bg-[#8A2C7A]' : index === 1 ? 'bg-[#5DBE7A]' : 'bg-[#8C4D9A]',
                    )}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EDE7F1] text-[11px] font-semibold text-heading">
                +9
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-border bg-[#FAFAFD] px-3 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6C1D5F,#4A1E47)] text-sm font-semibold text-white">
                AU
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-heading">Admin User</p>
                <p className="truncate text-xs text-text">admin@university.edu</p>
              </div>
              <UserRound className="h-4 w-4 text-muted" />
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen ? <button type="button" aria-label="Close sidebar overlay" className="fixed inset-0 z-30 bg-black/20 xl:hidden" onClick={onClose} /> : null}
    </>
  );
}

function SidebarItem({ icon, label, href, active = false }: { icon: ReactNode; label: string; href: string; active?: boolean }) {
  return (
    <NavLink
      to={href}
      className={cn(
        'group relative flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition',
        active
          ? 'border-transparent bg-[#F4ECF6] text-primary shadow-sm'
          : 'border-transparent text-text hover:border-border hover:bg-[#FAFAFD] hover:text-heading',
      )}
    >
      {active ? <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-primary" /> : null}
      <span className={cn('inline-flex h-8 w-8 items-center justify-center rounded-xl', active ? 'bg-white text-primary' : 'bg-[#faf7fb] text-text')}>
        {icon}
      </span>
      <span className="flex-1">{label}</span>
    </NavLink>
  );
}
