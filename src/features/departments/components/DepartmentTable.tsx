import { ArrowRight, Edit3, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from './StatusBadge';
import type { Department } from '@/types/department';

type DepartmentTableProps = {
  departments: Department[];
  onDelete: (department: Department) => void;
  canEdit?: (department: Department) => boolean;
  canDelete?: boolean;
};

export function DepartmentTable({ departments, onDelete, canEdit = () => true, canDelete = true }: DepartmentTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="hidden xl:grid xl:grid-cols-[1.4fr_0.7fr_1.1fr_0.7fr_0.8fr_0.7fr_0.8fr_0.9fr_0.9fr] border-b border-border px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        <span>Department</span><span>Code</span><span>Head of Department</span><span>Faculty</span><span>Students</span><span>Programs</span><span>Status</span><span>Updated</span><span>Actions</span>
      </div>
      <div className="divide-y divide-border">
        {departments.map((department) => {
          const isEditable = canEdit(department);
          return (
            <div key={department.id} className="grid gap-4 px-6 py-5 transition hover:bg-hover xl:grid-cols-[1.4fr_0.7fr_1.1fr_0.7fr_0.8fr_0.7fr_0.8fr_0.9fr_0.9fr] xl:items-center">
              <div>
                <p className="font-semibold text-heading">{department.name}</p>
                <p className="mt-1 text-sm text-text">{department.building}</p>
              </div>
              <div className="text-sm text-text">{department.code}</div>
              <div className="text-sm text-text">{department.hod}</div>
              <div className="text-sm text-text">{department.facultyCount}</div>
              <div className="text-sm text-text">{department.studentCount}</div>
              <div className="text-sm text-text">{department.programs}</div>
              <div><StatusBadge status={department.status} /></div>
              <div className="text-sm text-text">{new Date(department.updatedAt).toLocaleDateString()}</div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/departments/${department.id}`} className="focus-ring inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-semibold text-heading hover:bg-hover">
                  View <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                {isEditable && (
                  <Link to={`/departments/${department.id}/edit`} className="focus-ring inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-semibold text-heading hover:bg-hover">
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </Link>
                )}
                {canDelete && (
                  <Button variant="secondary" className="rounded-full px-3 py-2 text-xs" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => onDelete(department)}>
                    Delete
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
