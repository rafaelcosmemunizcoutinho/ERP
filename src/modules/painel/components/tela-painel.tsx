import { t } from '@/i18n'
import { sairAction } from '@/modules/auth/actions'
import type { Sessao } from '@/modules/auth/sessao_svc/_token'
import { Badge } from '@/ui/atoms/badge'
import { Button } from '@/ui/atoms/button'
import type { Resumo } from '../resumo_svc/carregar_resumo'

interface Props {
  sessao: Sessao
  resumo: Resumo
}

export function TelaPainel ({ sessao, resumo }: Props): React.JSX.Element {
  const numeros = [
    { rotulo: t('auth', 'painel.categorias'), valor: resumo.categorias },
    { rotulo: t('auth', 'painel.contas'), valor: resumo.contas },
    { rotulo: t('auth', 'painel.permissoes'), valor: sessao.permissoes.length }
  ]

  return (
    <div className='min-h-dvh'>
      <header className='border-b border-outline bg-surface-lowest'>
        <div className='mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4'>
          <div className='flex items-center gap-3'>
            <span className='font-semibold text-on-surface'>{resumo.empresa}</span>
            <Badge tom='primario' comPonto={false}>{resumo.segmento}</Badge>
          </div>
          <form action={sairAction}>
            <Button type='submit' variante='fantasma' tamanho='pequeno'>
              {t('auth', 'entrar.sair')}
            </Button>
          </form>
        </div>
      </header>

      <main className='mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10'>
        <div>
          <h1 className='text-fs24 font-semibold tracking-tight text-on-surface'>
            {t('auth', 'painel.boasVindas', { nome: sessao.nome })}
          </h1>
          <p className='mt-1 text-on-surface-variant'>{sessao.email}</p>
        </div>

        <dl className='grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-outline bg-outline'>
          {numeros.map(({ rotulo, valor }) => (
            <div key={rotulo} className='bg-surface-lowest px-4 py-4'>
              <dt className='text-fs11 uppercase tracking-wide text-on-surface-muted'>{rotulo}</dt>
              <dd className='mt-1 font-mono text-fs24 tabular-nums text-on-surface'>{valor}</dd>
            </div>
          ))}
        </dl>

        <section className='rounded-lg border border-outline bg-surface-lowest p-6'>
          <h2 className='text-fs16 font-semibold text-on-surface'>
            {t('auth', 'painel.proximosPassos')}
          </h2>
          <p className='mt-2 max-w-prose text-on-surface-variant'>
            {t('auth', 'painel.proximosPassosDescricao')}
          </p>
        </section>
      </main>
    </div>
  )
}
