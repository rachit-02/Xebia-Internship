import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, MapPin, Phone, Shield, Users } from 'lucide-react';
import { DepartmentHeader } from '../components/DepartmentHeader';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { getDepartments } from '../api/departments';
import type { Department } from '@/types/department';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

type DepartmentUser = {
  id: string;
  department: string;
  name: string;
  email: string;
  phone: string;
  building: string;
  role: string;
  status: Department['status'];
};

export function DepartmentUsersPage() {
  const query = useQuery({ queryKey: ['department-users'], queryFn: async () => getDepartments({ query: '', status: 'all', building: '' }) });

  const users = useMemo<DepartmentUser[]>(() => {
    const departments = query.data ?? [];

    return departments.map((department, index) => ({
      id: department.id,
      department: department.name,
      name: department.hod,
      email: department.email,
      phone: department.phone,
      building: department.building,
      role: index === 0 ? 'Academic Lead' : 'Department Head',
      status: department.status,
    }));
  }, [query.data]);

  if (query.isLoading) return <LoadingSkeleton />;
  if (query.isError) return <ErrorState message="The department users view could not be loaded from the mock store." onRetry={() => query.refetch()} />;

  return (
    <div className="space-y-6 animate-page-fade">
      <DepartmentHeader
        title="Department Users"
        subtitle="Monitor academic leaders and contact details across all departments in one place."
        showActions={false}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Department users" value={users.length} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Active leaders" value={users.filter((user) => user.status === 'active').length} icon={<Shield className="h-4 w-4" />} />
        <StatCard label="Buildings" value={new Set(users.map((user) => user.building)).size} icon={<MapPin className="h-4 w-4" />} />
        <StatCard label="Total contact points" value={users.length * 2} icon={<Mail className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="animate-card-hover p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{user.department}</p>
                <h3 className="mt-1 text-xl font-bold text-heading">{user.name}</h3>
                <p className="mt-2 text-sm text-text">{user.role}</p>
              </div>
              <Badge tone={user.status === 'active' ? 'success' : 'warning'}>{user.status === 'active' ? 'Active' : 'Inactive'}</Badge>
            </div>

            <div className="mt-5 space-y-3 text-sm text-text">
              <Row icon={<Mail className="h-4 w-4" />} label={user.email} />
              <Row icon={<Phone className="h-4 w-4" />} label={user.phone} />
              <Row icon={<MapPin className="h-4 w-4" />} label={user.building} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 text-muted">
        {icon}
        <span className="text-xs font-medium uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-heading">{value}</p>
    </Card>
  );
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted">{icon}</span>
      <span className="min-w-0 truncate">{label}</span>
    </div>
  );
}