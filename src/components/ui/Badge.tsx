import { cn } from '@/lib/utils';

export function Badge({ children, tone = 'neutral' }: { children: string; tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'primary' }) {
  const classes = {
    neutral: 'bg-surface-lilac text-text',
    success: 'bg-success-soft text-success',
    warning: 'bg-warning-soft text-warning',
    danger: 'bg-danger-soft text-danger',
    primary: 'bg-primary-soft text-primary',
  }[tone];

  return <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', classes)}>{children}</span>;
}
