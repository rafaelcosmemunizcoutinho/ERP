import { useId, type ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { Input } from '../atoms/input'
import { Label } from '../atoms/label'

export type CampoProps = Omit<ComponentProps<'input'>, 'id'> & {
  rotulo: string
  ajuda?: string
  erro?: string
  className?: string
}

export function Campo ({
  rotulo,
  ajuda,
  erro,
  className,
  required,
  ...props
}: CampoProps): React.JSX.Element {
  const id = useId()
  const idAjuda = `${id}-ajuda`
  const idErro = `${id}-erro`

  const descritos = [ajuda !== undefined ? idAjuda : null, erro !== undefined ? idErro : null]
    .filter((valor) => valor !== null)
    .join(' ')

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={id} obrigatorio={required}>{rotulo}</Label>

      <Input
        id={id}
        required={required}
        invalido={erro !== undefined}
        aria-describedby={descritos === '' ? undefined : descritos}
        {...props}
      />

      {ajuda !== undefined && (
        <p id={idAjuda} className='text-fs12 text-on-surface-muted'>{ajuda}</p>
      )}

      {erro !== undefined && (
        <p id={idErro} role='alert' className='text-fs12 text-danger'>{erro}</p>
      )}
    </div>
  )
}
