import { cn } from '@/lib/utils';

export function Badge({ children, tone = 'neutral' }: { children: string; tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'primary' }) {
  const classes = {
    neutral: 'bg-[#F3F4F6] text-[#4B5563]',
    success: 'bg-[rgba(1,172,159,0.12)] text-success',
    warning: 'bg-[rgba(255,98,0,0.12)] text-warning',
    danger: 'bg-[rgba(239,68,68,0.12)] text-danger',
    primary: 'bg-[rgba(108,29,95,0.12)] text-primary',
  }[tone];

  return <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', classes)}>{children}</span>;
}
