import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DepartmentHeader } from '../components/DepartmentHeader';
import { DepartmentForm } from '../components/DepartmentForm';
import type { DepartmentFormValues } from '../components/DepartmentForm';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { DeleteDialog } from '../components/DeleteDialog';
import { getDepartmentById, deleteDepartment, updateDepartment } from '../api/departments';
import type { Department } from '@/types/department';
import { useAuth } from '@/features/auth/context/AuthContext';
import { canEditDepartment, canDeleteDepartment } from '@/features/auth/utils/permissions';

export function DepartmentEditPage() {
  const { departmentId = '' } = useParams();
  const navigate = useNavigate();
  const [showDiscard, setShowDiscard] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();
  const role = user?.role || 'student';

  const departmentQuery = useQuery({ queryKey: ['department', departmentId], queryFn: async () => getDepartmentById(departmentId) });
  const updateMutation = useMutation({ mutationFn: ({ id, values }: { id: string; values: Partial<Department> }) => updateDepartment(id, values) });
  const deleteMutation = useMutation({ mutationFn: deleteDepartment });

  const department = departmentQuery.data;

  const isEditable = department ? canEditDepartment(role, department.id, user?.departmentId) : false;
  const isDeletable = canDeleteDepartment(role);

  useEffect(() => {
    if (!departmentQuery.isLoading && !department) {
      navigate('/departments', { replace: true });
    }
  }, [department, departmentQuery.isLoading, navigate]);

  // Redirect if user does not have edit permissions for this department
  useEffect(() => {
    if (!departmentQuery.isLoading && department && !isEditable) {
      navigate(`/departments/${department.id}`, { replace: true });
    }
  }, [department, departmentQuery.isLoading, isEditable, navigate]);

  const handleSubmit = async (values: DepartmentFormValues) => {
    if (!department) return;
    await updateMutation.mutateAsync({
      id: department.id,
      values: {
        ...department,
        ...values,
      },
    });
    setSaved(true);
  };

  return department && isEditable ? (
    <div className="space-y-6">
      <DepartmentHeader title="Edit Department" subtitle="Update the department with the same layout and validation as the create form." showActions={false} />
      <DepartmentForm
        mode="edit"
        initialValues={{
          name: department.name,
          code: department.code,
          hod: department.hod,
          email: department.email,
          phone: department.phone,
          building: department.building,
          description: department.description,
          status: department.status,
        }}
        onSubmit={handleSubmit}
        onCancel={() => setShowDiscard(true)}
        onDelete={isDeletable ? () => setShowDelete(true) : undefined}
      />
      <ConfirmationModal
        open={showDiscard}
        title="Discard unsaved changes?"
        description="Any edits since the last save will be lost."
        onClose={() => setShowDiscard(false)}
        onConfirm={() => navigate(`/departments/${department.id}`)}
        confirmLabel="Discard Changes"
      />
      {isDeletable && (
        <DeleteDialog
          open={showDelete}
          name={department.name}
          onClose={() => setShowDelete(false)}
          onConfirm={async () => {
            await deleteMutation.mutateAsync(department.id);
            navigate('/departments');
          }}
        />
      )}
      <ConfirmationModal
        open={saved}
        title="Changes saved"
        description="The department has been updated successfully in the mock store."
        onClose={() => setSaved(false)}
        onConfirm={() => navigate(`/departments/${department.id}`)}
        confirmLabel="View Details"
      />
    </div>
  ) : null;
}

