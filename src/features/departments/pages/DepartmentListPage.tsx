import { useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DepartmentHeader } from '../components/DepartmentHeader';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { DepartmentTable } from '../components/DepartmentTable';
import { DepartmentCard } from '../components/DepartmentCard';
import { DepartmentStats } from '../components/DepartmentStats';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { DeleteDialog } from '../components/DeleteDialog';
import { Pagination } from '../components/Pagination';
import { deleteDepartment, exportDepartmentsToCsv, getDepartmentFilters, getDepartments, importDepartmentsFromCsv } from '../api/departments';
import type { Department, DepartmentFilters } from '@/types/department';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const PAGE_SIZE = 6;

export function DepartmentListPage() {
  const [filters, setFilters] = useState<DepartmentFilters>({ query: '', status: 'all', building: '' });
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const summaryQuery = useQuery({ queryKey: ['department-summary'], queryFn: async () => getDepartmentFilters() });
  const departmentsQuery = useQuery({ queryKey: ['departments', filters], queryFn: async () => getDepartments(filters) });

  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['departments'] });
      await queryClient.invalidateQueries({ queryKey: ['department-summary'] });
      setDeleteTarget(null);
    },
  });

  const pagedDepartments = useMemo(() => {
    const items = departmentsQuery.data ?? [];
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [departmentsQuery.data, page]);

  const totalPages = Math.max(1, Math.ceil((departmentsQuery.data?.length ?? 0) / PAGE_SIZE));

  const cards = summaryQuery.data
    ? [
        { label: 'Total Departments', value: summaryQuery.data.total },
        { label: 'Active Departments', value: summaryQuery.data.active },
        { label: 'Total Faculty', value: summaryQuery.data.faculty },
        { label: 'Total Students', value: summaryQuery.data.students },
      ]
    : [];

  const handleExport = () => {
    const csv = exportDepartmentsToCsv(departmentsQuery.data ?? []);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = downloadUrl;
    anchor.download = `departments-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();

    window.URL.revokeObjectURL(downloadUrl);
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    try {
      const csvText = await file.text();
      const result = await importDepartmentsFromCsv(csvText);
      await queryClient.invalidateQueries({ queryKey: ['departments'] });
      await queryClient.invalidateQueries({ queryKey: ['department-summary'] });
      setPage(1);
      window.alert(`Imported ${result.imported} department${result.imported === 1 ? '' : 's'}. Total records: ${result.total}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to import the selected CSV file.';
      window.alert(message);
    }
  };

  return (
    <div className="space-y-6">
      <DepartmentHeader
        title="Departments"
        subtitle="Manage academic departments and organizational structure."
        onImport={handleImportClick}
        onExport={handleExport}
      />

      <input ref={importInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleImportFile} />

      {summaryQuery.data ? <DepartmentStats items={cards} /> : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <SearchBar value={filters.query} onChange={(query) => { setPage(1); setFilters((current) => ({ ...current, query })); }} />
      </div>

      {summaryQuery.data ? <FilterPanel filters={filters} buildings={summaryQuery.data.buildings} onChange={(next) => { setPage(1); setFilters(next); }} onReset={() => setFilters({ query: '', status: 'all', building: '' })} /> : null}

      {departmentsQuery.isLoading ? <LoadingSkeleton /> : null}
      {departmentsQuery.isError ? <ErrorState message="The department list could not be loaded from the mock store." onRetry={() => departmentsQuery.refetch()} /> : null}
      {!departmentsQuery.isLoading && !departmentsQuery.isError && pagedDepartments.length === 0 ? <EmptyState title="No departments found" description="Try a different filter or create a new department from scratch." /> : null}

      {!departmentsQuery.isLoading && !departmentsQuery.isError && pagedDepartments.length > 0 ? (
        <>
          <div className="xl:hidden grid gap-4 sm:grid-cols-2">
            {pagedDepartments.map((department) => <DepartmentCard key={department.id} department={department} />)}
          </div>
          <div className="hidden xl:block">
            <DepartmentTable departments={pagedDepartments} onDelete={setDeleteTarget} />
          </div>
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </>
      ) : null}

      <DeleteDialog open={Boolean(deleteTarget)} name={deleteTarget?.name ?? 'department'} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)} />
    </div>
  );
}
