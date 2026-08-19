import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export type InputProps = ComponentProps<'input'> & { invalido?: boolean }

export function Input ({ className, invalido = false, ...props }: InputProps): React.JSX.Element {
  return (
    <input
      data-slot='input'
      aria-invalid={invalido || undefined}
      className={cn(
        'h-9 w-full rounded-md border bg-surface-lowest px-3 text-fs14 text-on-surface',
        'placeholder:text-on-surface-muted',
        'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary',
        'disabled:cursor-not-allowed disabled:bg-surface-low disabled:text-on-surface-muted',
        invalido ? 'border-danger' : 'border-outline-strong',
        className
      )}
      {...props}
    />
  )
}
