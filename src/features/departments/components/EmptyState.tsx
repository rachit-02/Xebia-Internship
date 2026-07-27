import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="soft-card flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-hover text-primary">
        <Plus className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold text-heading">{title}</h3>
      <p className="mt-2 max-w-lg text-sm text-text">{description}</p>
      <Link to="/departments/new" className="mt-6">
        <Button>Add Department</Button>
      </Link>
    </div>
  );
}
