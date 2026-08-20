'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import { t } from '@/i18n'
import { Badge } from '../atoms/badge'
import { Button } from '../atoms/button'
import { AlternadorTema } from '../molecules/alternador-tema'

export interface ItemNavegacao {
  href: string
  rotulo: string
  secao?: string
}

interface Props {
  empresa: string
  segmento: string
  usuario: string
  itens: ItemNavegacao[]
  acoesCabecalho?: React.ReactNode
  children: React.ReactNode
}

export function AppShell ({
  empresa,
  segmento,
  usuario,
  itens,
  acoesCabecalho,
  children
}: Props): React.JSX.Element {
  const [aberto, setAberto] = useState(false)
  const caminho = usePathname()

  const secoes = itens.reduce<Map<string, ItemNavegacao[]>>((mapa, item) => {
    const chave = item.secao ?? ''
    mapa.set(chave, [...(mapa.get(chave) ?? []), item])
    return mapa
  }, new Map())

  return (
    <div className='min-h-dvh lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]'>
      <a
        href='#conteudo'
        className='sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-on-primary'
      >
        Ir para o conteúdo
      </a>

      <aside
        className={cn(
          'border-outline bg-surface-lowest lg:border-r',
          'lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto'
        )}
      >
        <div className='flex items-center justify-between gap-2 border-b border-outline px-4 py-3 lg:border-b-0'>
          <div className='min-w-0'>
            <p className='truncate font-semibold text-on-surface'>{empresa}</p>
            <Badge tom='primario' comPonto={false} className='mt-1'>{segmento}</Badge>
          </div>
          <Button
            variante='fantasma'
            tamanho='pequeno'
            className='lg:hidden'
            aria-expanded={aberto}
            aria-controls='navegacao'
            onClick={() => { setAberto(!aberto) }}
          >
            {aberto ? t('cadastros', 'nav.fecharMenu') : t('cadastros', 'nav.abrirMenu')}
          </Button>
        </div>

        <nav
          id='navegacao'
          aria-label={t('cadastros', 'nav.menu')}
          className={cn('px-2 pb-4 lg:block', aberto ? 'block' : 'hidden')}
        >
          {[...secoes.entries()].map(([secao, doGrupo]) => (
            <div key={secao} className='mt-3 flex flex-col gap-0.5'>
              {secao !== '' && (
                <p className='px-2 pb-1 text-fs11 font-medium uppercase tracking-wide text-on-surface-muted'>
                  {secao}
                </p>
              )}
              {doGrupo.map((item) => {
                const ativo = caminho === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={ativo ? 'page' : undefined}
                    onClick={() => { setAberto(false) }}
                    className={cn(
                      'rounded-md px-2 py-1.5 text-fs14 transition-colors',
                      ativo
                        ? 'bg-primary-container font-medium text-on-primary-container'
                        : 'text-on-surface-variant hover:bg-surface-low'
                    )}
                  >
                    {item.rotulo}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </aside>

      <div className='flex min-w-0 flex-col'>
        <header className='flex items-center justify-end gap-3 border-b border-outline bg-surface-lowest px-6 py-3'>
          <span className='truncate text-fs13 text-on-surface-variant'>{usuario}</span>
          <AlternadorTema />
          {acoesCabecalho}
        </header>

        <main id='conteudo' className='mx-auto w-full max-w-5xl flex-1 px-6 py-8'>
          {children}
        </main>
      </div>
    </div>
  )
}
