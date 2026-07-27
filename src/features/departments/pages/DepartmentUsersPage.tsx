import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, MapPin, Phone, Shield, Users } from 'lucide-react';
import { DepartmentHeader } from '../components/DepartmentHeader';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { getUsers } from '@/features/users/api/users';
import type { User } from '@/types/user';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function DepartmentUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const query = useQuery({ 
    queryKey: ['users', page, search], 
    queryFn: async () => getUsers({ page, limit: 20, search }) 
  });

  const users = query.data?.data ?? [];
  const meta = query.data?.meta;

  if (query.isLoading) return <LoadingSkeleton />;
  if (query.isError) return <ErrorState message="The users could not be loaded from the backend." onRetry={() => query.refetch()} />;

  const activeUsers = users.filter(u => u.status === 'active').length;

  return (
    <div className="space-y-6 animate-page-fade">
      <DepartmentHeader
        title="University Users"
        subtitle="Monitor academic leaders, staff, and contact details across the university."
        showActions={false}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={meta?.total ?? users.length} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Active Users" value={activeUsers} icon={<Shield className="h-4 w-4" />} />
        <StatCard label="Page" value={page} icon={<MapPin className="h-4 w-4" />} />
        <StatCard label="Total contact points" value={users.length * 2} icon={<Mail className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="animate-card-hover p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{user.department || 'General'}</p>
                <h3 className="mt-1 text-xl font-bold text-heading">{user.firstName} {user.lastName}</h3>
                <p className="mt-2 text-sm text-text capitalize">{user.role?.replace('_', ' ')}</p>
              </div>
              <Badge tone={user.status === 'active' ? 'success' : 'warning'}>{user.status === 'active' ? 'Active' : 'Inactive'}</Badge>
            </div>

            <div className="mt-5 space-y-3 text-sm text-text">
              <Row icon={<Mail className="h-4 w-4" />} label={user.email} />
              {user.phone && <Row icon={<Phone className="h-4 w-4" />} label={user.phone} />}
              {user.building && <Row icon={<MapPin className="h-4 w-4" />} label={user.building} />}
            </div>
          </Card>
        ))}
      </div>
      
      {/* Basic Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border border-border rounded-xl disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 flex items-center">
            Page {page} of {meta.totalPages}
          </span>
          <button 
            disabled={page === meta.totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border border-border rounded-xl disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
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