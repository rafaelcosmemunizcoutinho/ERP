import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

const estilos = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  {
    variants: {
      variante: {
        primaria: 'bg-primary text-on-primary hover:bg-on-primary-container',
        secundaria:
          'bg-surface-lowest text-on-surface border border-outline-strong hover:bg-surface-low',
        fantasma: 'bg-transparent text-on-surface hover:bg-surface-low',
        perigo: 'bg-danger text-on-primary hover:bg-on-danger-container'
      },
      tamanho: {
        pequeno: 'h-8 px-3 text-fs12',
        medio: 'h-9 px-4 text-fs14',
        grande: 'h-11 px-6 text-fs16'
      }
    },
    defaultVariants: { variante: 'primaria', tamanho: 'medio' }
  }
)

export type ButtonProps = ComponentProps<'button'> &
VariantProps<typeof estilos> & { asChild?: boolean }

export function Button ({
  className,
  variante,
  tamanho,
  asChild = false,
  type = 'button',
  ...props
}: ButtonProps): React.JSX.Element {
  const Componente = asChild ? Slot : 'button'
  return (
    <Componente
      data-slot='button'
      className={cn(estilos({ variante, tamanho }), className)}
      {...(asChild ? {} : { type })}
      {...props}
    />
  )
}
