import { Badge } from '@/components/ui/Badge';
import type { DepartmentStatus } from '@/types/department';

export function StatusBadge({ status }: { status: DepartmentStatus }) {
  return <Badge tone={status === 'active' ? 'success' : 'warning'}>{status === 'active' ? 'Active' : 'Inactive'}</Badge>;
}
