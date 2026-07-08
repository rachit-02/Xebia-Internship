import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="soft-card flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-danger-soft text-danger">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold text-heading">Unable to load data</h3>
      <p className="mt-2 max-w-lg text-sm text-text">{message}</p>
      <Button className="mt-6" onClick={onRetry}>Retry</Button>
    </div>
  );
}
