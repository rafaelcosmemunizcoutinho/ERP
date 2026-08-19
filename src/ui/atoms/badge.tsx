import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

const estilos = cva(
  'inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-fs12 font-medium',
  {
    variants: {
      tom: {
        neutro: 'bg-surface-high text-on-surface-variant',
        primario: 'bg-primary-container text-on-primary-container',
        sucesso: 'bg-success-container text-on-success-container',
        aviso: 'bg-warning-container text-on-warning-container',
        perigo: 'bg-danger-container text-on-danger-container'
      }
    },
    defaultVariants: { tom: 'neutro' }
  }
)

const PONTO: Record<string, string> = {
  neutro: 'bg-on-surface-muted',
  primario: 'bg-primary',
  sucesso: 'bg-success',
  aviso: 'bg-warning',
  perigo: 'bg-danger'
}

export type BadgeProps = ComponentProps<'span'> &
VariantProps<typeof estilos> & { comPonto?: boolean }

export function Badge ({
  className,
  tom,
  comPonto = true,
  children,
  ...props
}: BadgeProps): React.JSX.Element {
  return (
    <span data-slot='badge' className={cn(estilos({ tom }), className)} {...props}>
      {comPonto && (
        <span
          aria-hidden='true'
          data-slot='badge-ponto'
          className={cn('size-1.5 shrink-0 rounded-full', PONTO[tom ?? 'neutro'])}
        />
      )}
      {children}
    </span>
  )
}
