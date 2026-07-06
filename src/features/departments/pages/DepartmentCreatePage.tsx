import { useNavigate } from 'react-router-dom';
import { DepartmentHeader } from '../components/DepartmentHeader';
import { DepartmentForm, DepartmentFormValues } from '../components/DepartmentForm';
import { createDepartment } from '../api/departments';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { ConfirmationModal } from '../components/ConfirmationModal';

export function DepartmentCreatePage() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const mutation = useMutation({ mutationFn: createDepartment });

  const handleSubmit = async (values: DepartmentFormValues) => {
    await mutation.mutateAsync({
      ...values,
      facultyCount: 0,
      studentCount: 0,
      programs: 0,
      courses: 0,
      status: values.status,
      description: values.description,
      hod: values.hod,
      email: values.email,
      phone: values.phone,
      building: values.building,
      name: values.name,
      code: values.code,
    });
    setSuccess(true);
  };

  return (
    <div className="space-y-6">
      <DepartmentHeader title="Create Department" subtitle="Add a new academic department with enterprise-grade data hygiene." showActions={false} />
      <DepartmentForm mode="create" onSubmit={handleSubmit} onCancel={() => navigate('/departments')} />
      <ConfirmationModal
        open={success}
        title="Department created"
        description="The new department has been added to the mock frontend store."
        onClose={() => setSuccess(false)}
        onConfirm={() => navigate('/departments')}
        confirmLabel="Back to list"
      />
    </div>
  );
}
