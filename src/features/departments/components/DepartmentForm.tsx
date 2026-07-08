import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Select, Textarea } from '@/components/ui/Field';
import type { DepartmentStatus } from '@/types/department';

export type DepartmentFormValues = {
  name: string;
  code: string;
  hod: string;
  email: string;
  phone: string;
  building: string;
  description: string;
  status: DepartmentStatus;
};

const emptyValues: DepartmentFormValues = {
  name: '',
  code: '',
  hod: '',
  email: '',
  phone: '',
  building: '',
  description: '',
  status: 'active',
};

type DepartmentFormProps = {
  initialValues?: DepartmentFormValues;
  mode: 'create' | 'edit';
  onSubmit: (values: DepartmentFormValues) => Promise<void> | void;
  onCancel: () => void;
  onDelete?: () => void;
  loading?: boolean;
};

export function DepartmentForm({ initialValues = emptyValues, mode, onSubmit, onCancel, onDelete, loading }: DepartmentFormProps) {
  const [values, setValues] = useState<DepartmentFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof DepartmentFormValues, string>>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const update = <K extends keyof DepartmentFormValues>(key: K, value: DepartmentFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof DepartmentFormValues, string>> = {};
    if (!values.name.trim()) nextErrors.name = 'Department name is required.';
    if (!values.code.trim()) nextErrors.code = 'Department code is required.';
    if (!values.hod.trim()) nextErrors.hod = 'Head of department is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = 'Enter a valid email address.';
    if (!/^\d+$/.test(values.phone)) nextErrors.phone = 'Phone number must contain digits only.';
    if (!values.building.trim()) nextErrors.building = 'Building is required.';
    if (!values.description.trim()) nextErrors.description = 'Description is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    await onSubmit(values);
    setSuccess(true);
    window.setTimeout(() => setSuccess(false), 1800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-heading">General Information</h2>
            <p className="mt-1 text-sm text-text">Keep department records accurate and enterprise ready.</p>
          </div>
          {success ? <span className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-2 text-sm font-semibold text-success"><CheckCircle2 className="h-4 w-4" />Saved</span> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Department Name" error={errors.name}><Input value={values.name} onChange={(event) => update('name', event.target.value)} /></Field>
          <Field label="Department Code" error={errors.code}><Input value={values.code} onChange={(event) => update('code', event.target.value.toUpperCase())} maxLength={10} /></Field>
          <Field label="Department Head" error={errors.hod}><Input value={values.hod} onChange={(event) => update('hod', event.target.value)} /></Field>
          <Field label="Status"><Select value={values.status} onChange={(event) => update('status', event.target.value as DepartmentStatus)}><option value="active">Active</option><option value="inactive">Inactive</option></Select></Field>
          <Field label="Email" error={errors.email}><Input type="email" value={values.email} onChange={(event) => update('email', event.target.value)} /></Field>
          <Field label="Phone" error={errors.phone}><Input inputMode="numeric" value={values.phone} onChange={(event) => update('phone', event.target.value.replace(/[^\d]/g, ''))} /></Field>
          <Field label="Building" error={errors.building}><Input value={values.building} onChange={(event) => update('building', event.target.value)} /></Field>
          <div />
          <div className="md:col-span-2"><Field label="Description" error={errors.description}><Textarea value={values.description} onChange={(event) => update('description', event.target.value)} /></Field></div>
        </div>
      </Card>

      <div className="flex flex-wrap justify-between gap-3">
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          {mode === 'edit' && onDelete ? <Button type="button" variant="danger" onClick={onDelete}>Delete Department</Button> : null}
        </div>
        <Button type="submit" disabled={loading}>{mode === 'create' ? 'Create Department' : 'Save Changes'}</Button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-heading">{label}</span>
      {children}
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
}
