import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export type LabelProps = ComponentProps<'label'> & { obrigatorio?: boolean }

export function Label ({
  className,
  obrigatorio = false,
  children,
  ...props
}: LabelProps): React.JSX.Element {
  return (
    <label
      data-slot='label'
      className={cn('block text-fs13 font-medium text-on-surface', className)}
      {...props}
    >
      {children}
      {obrigatorio && (
        <span className='ml-0.5 text-danger' aria-hidden='true'>*</span>
      )}
    </label>
  )
}
