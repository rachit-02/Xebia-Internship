import { Card } from '@/components/ui/Card';

export function DepartmentStats({ items }: { items: Array<{ label: string; value: number }> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label} className="p-6">
          <p className="text-sm text-text">{item.label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-heading">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
