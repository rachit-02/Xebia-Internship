import { Building2, GraduationCap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from './StatusBadge';
import type { Department } from '@/types/department';

export function DepartmentCard({ department, canEdit = true }: { department: Department; canEdit?: boolean }) {
  return (
    <Card className="group p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{department.code}</p>
          <h3 className="mt-1 text-xl font-bold text-heading group-hover:text-primary">{department.name}</h3>
          <p className="mt-2 text-sm text-text">{department.hod}</p>
        </div>
        <StatusBadge status={department.status} />
      </div>
      <p className="mt-4 line-clamp-2 text-sm text-text">{department.description}</p>
      <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-text">
        <Stat icon={<Users className="h-4 w-4" />} label="Faculty" value={department.facultyCount} />
        <Stat icon={<GraduationCap className="h-4 w-4" />} label="Students" value={department.studentCount} />
        <Stat icon={<Building2 className="h-4 w-4" />} label="Programs" value={department.programs} />
      </div>
      <div className="mt-5 flex gap-3">
        <Link className="text-sm font-semibold text-primary hover:text-primary-dark" to={`/departments/${department.id}`}>
          View
        </Link>
        {canEdit && (
          <Link className="text-sm font-semibold text-text hover:text-heading" to={`/departments/${department.id}/edit`}>
            Edit
          </Link>
        )}
      </div>
    </Card>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-surface-muted p-3">
      <div className="flex items-center gap-2 text-muted">
        {icon}
        <span className="text-xs font-medium uppercase tracking-[0.16em]">{label}</span>
      </div>
      <p className="mt-2 text-lg font-bold text-heading">{value}</p>
    </div>
  );
}
