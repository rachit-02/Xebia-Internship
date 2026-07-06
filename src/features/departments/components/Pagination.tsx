import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type PaginationProps = {
  current: number;
  total: number;
  onChange: (page: number) => void;
};

export function Pagination({ current, total, onChange }: PaginationProps) {
  if (total <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
      <p className="text-sm text-text">Page {current} of {total}</p>
      <div className="flex gap-2">
        <Button variant="secondary" disabled={current === 1} icon={<ChevronLeft className="h-4 w-4" />} onClick={() => onChange(current - 1)}>Prev</Button>
        <Button variant="secondary" disabled={current === total} icon={<ChevronRight className="h-4 w-4" />} onClick={() => onChange(current + 1)}>Next</Button>
      </div>
    </div>
  );
}
