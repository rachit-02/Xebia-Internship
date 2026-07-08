import { ArrowDownToLine, ArrowUpFromLine, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

type DepartmentHeaderProps = {
  title: string;
  subtitle: string;
  showActions?: boolean;
  onImport?: () => void;
  onExport?: () => void;
};

export function DepartmentHeader({ title, subtitle, showActions = true, onImport, onExport }: DepartmentHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">Academic Affairs</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-heading">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-text">{subtitle}</p>
      </div>

      {showActions ? (
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" icon={<ArrowUpFromLine className="h-4 w-4" />} onClick={onImport} disabled={!onImport}>
            Import CSV
          </Button>
          <Button type="button" variant="secondary" icon={<ArrowDownToLine className="h-4 w-4" />} onClick={onExport} disabled={!onExport}>
            Export CSV
          </Button>
          <Link
            to="/departments/new"
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </Link>
        </div>
      ) : null}
    </div>
  );
}
