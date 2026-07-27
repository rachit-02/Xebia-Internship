import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const fieldClassName =
  'focus-ring w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-heading shadow-sm placeholder:text-muted transition focus:border-primary';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClassName, props.className)} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldClassName, 'min-h-32 resize-y', props.className)} {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldClassName, props.className)} {...props} />;
}
