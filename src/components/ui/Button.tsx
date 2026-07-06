import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: ReactNode;
};

export function Button({ className, variant = 'primary', icon, children, ...props }: ButtonProps) {
  const styles = {
    primary: 'bg-primary text-white hover:bg-primary-dark border-transparent shadow-sm',
    secondary: 'bg-white text-heading hover:bg-hover border-border shadow-sm',
    ghost: 'bg-transparent text-heading hover:bg-hover border-transparent',
    danger: 'bg-danger text-white hover:opacity-90 border-transparent shadow-sm',
  }[variant];

  return (
    <button
      className={cn(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60',
        styles,
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
