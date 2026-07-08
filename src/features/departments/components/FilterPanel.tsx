import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Field';
import type { DepartmentFilters } from '@/types/department';

type FilterPanelProps = {
  filters: DepartmentFilters;
  buildings: string[];
  onChange: (next: DepartmentFilters) => void;
  onReset: () => void;
};

export function FilterPanel({ filters, buildings, onChange, onReset }: FilterPanelProps) {
  const setFilter = <K extends keyof DepartmentFilters>(key: K, value: DepartmentFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="grid gap-3 rounded-[16px] border border-border bg-white p-4 shadow-sm md:grid-cols-[1.2fr_1fr_1fr_auto]">
      <Select value={filters.status} onChange={(event) => setFilter('status', event.target.value as DepartmentFilters['status'])} aria-label="Filter by status">
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </Select>
      <Select value={filters.building} onChange={(event) => setFilter('building', event.target.value)} aria-label="Filter by building">
        <option value="">All Buildings</option>
        {buildings.map((building) => (
          <option key={building} value={building}>
            {building}
          </option>
        ))}
      </Select>
      <div className="text-sm text-text">Use department code, head, building, or email to narrow results.</div>
      <Button variant="secondary" onClick={onReset}>Reset Filters</Button>
    </div>
  );
}
