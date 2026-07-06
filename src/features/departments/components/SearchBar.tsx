import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Field';

export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
      <Search className="h-4 w-4 text-muted" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search departments, code, head, building..."
        aria-label="Search departments"
        className="border-0 bg-transparent p-0 shadow-none focus:border-0 focus:ring-0"
      />
    </label>
  );
}
