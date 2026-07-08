import { cn } from '@/lib/utils';

export type DepartmentTabKey = 'overview' | 'faculty' | 'students' | 'courses' | 'analytics';

const tabs: Array<{ key: DepartmentTabKey; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'faculty', label: 'Faculty' },
  { key: 'students', label: 'Students' },
  { key: 'courses', label: 'Courses' },
  { key: 'analytics', label: 'Analytics' },
];

export function DepartmentTabs({ value, onChange }: { value: DepartmentTabKey; onChange: (tab: DepartmentTabKey) => void }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-[16px] border border-border bg-white p-2 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            'focus-ring rounded-2xl px-4 py-2 text-sm font-semibold transition',
            value === tab.key ? 'bg-primary-soft text-primary' : 'text-text hover:bg-hover hover:text-heading',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
