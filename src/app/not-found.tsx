import Link from 'next/link'
import { t } from '@/i18n'
import { Button } from '@/ui/atoms/button'

export default function NaoEncontrado (): React.JSX.Element {
  return (
    <main className='mx-auto flex max-w-md flex-col items-start gap-4 px-6 py-24'>
      <p className='font-mono text-fs12 tabular-nums text-on-surface-muted'>404</p>
      <h1 className='text-fs24 font-semibold tracking-tight text-on-surface'>
        {t('comum', 'naoEncontrado.titulo')}
      </h1>
      <p className='text-on-surface-variant'>{t('comum', 'naoEncontrado.descricao')}</p>
      <Button asChild variante='secundaria'>
        <Link href='/'>{t('comum', 'naoEncontrado.voltar')}</Link>
      </Button>
    </main>
  )
}
