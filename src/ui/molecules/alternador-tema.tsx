'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { CHAVE_TEMA, TEMAS, ehTema, resolverEscuro, type Tema } from '@/lib/tema'

const ROTULOS: Record<Tema, string> = {
  sistema: 'Automático',
  claro: 'Claro',
  escuro: 'Escuro'
}

function aplicar (tema: Tema): void {
  const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.toggle('dark', resolverEscuro(tema, prefereEscuro))
}

export function AlternadorTema (): React.JSX.Element {
  const [tema, setTema] = useState<Tema>('sistema')

  useEffect(() => {
    const salvo = window.localStorage.getItem(CHAVE_TEMA)
    if (ehTema(salvo)) setTema(salvo)
  }, [])

  useEffect(() => {
    aplicar(tema)
    const midia = window.matchMedia('(prefers-color-scheme: dark)')
    const aoMudar = (): void => { aplicar(tema) }
    midia.addEventListener('change', aoMudar)
    return () => { midia.removeEventListener('change', aoMudar) }
  }, [tema])

  function escolher (novo: Tema): void {
    window.localStorage.setItem(CHAVE_TEMA, novo)
    setTema(novo)
  }

  return (
    <div
      role='radiogroup'
      aria-label='Tema da interface'
      className='inline-flex rounded-md border border-outline bg-surface-lowest p-0.5'
    >
      {TEMAS.map((valor) => (
        <button
          key={valor}
          type='button'
          role='radio'
          aria-checked={tema === valor}
          onClick={() => { escolher(valor) }}
          className={cn(
            'rounded-sm px-2.5 py-1 text-fs12 font-medium transition-colors',
            tema === valor
              ? 'bg-primary-container text-on-primary-container'
              : 'text-on-surface-variant hover:bg-surface-low'
          )}
        >
          {ROTULOS[valor]}
        </button>
      ))}
    </div>
  )
}
