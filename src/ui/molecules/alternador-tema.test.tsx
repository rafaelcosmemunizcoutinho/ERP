import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CHAVE_TEMA } from '@/lib/tema'
import { AlternadorTema } from './alternador-tema'

let ouvintes: Array<() => void> = []
let prefereEscuro = false

function simularPreferencia (escuro: boolean): void {
  prefereEscuro = escuro
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((consulta: string) => ({
      get matches () { return prefereEscuro },
      media: consulta,
      addEventListener: (_evento: string, ouvinte: () => void) => { ouvintes.push(ouvinte) },
      removeEventListener: (_evento: string, ouvinte: () => void) => {
        ouvintes = ouvintes.filter((o) => o !== ouvinte)
      }
    }))
  })
}

function aparelhoTrocaPara (escuro: boolean): void {
  prefereEscuro = escuro
  for (const ouvinte of ouvintes) ouvinte()
}

beforeEach(() => {
  ouvintes = []
  window.localStorage.clear()
  document.documentElement.classList.remove('dark')
  simularPreferencia(false)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('AlternadorTema', () => {
  it('expoe as tres opcoes como grupo de radio acessivel', () => {
    render(<AlternadorTema />)
    expect(screen.getByRole('radiogroup', { name: 'Tema da interface' })).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('comeca em automatico quando nada foi escolhido', () => {
    render(<AlternadorTema />)
    expect(screen.getByRole('radio', { name: 'Automático' })).toHaveAttribute('aria-checked', 'true')
  })

  it('aplica a classe dark ao escolher escuro', async () => {
    render(<AlternadorTema />)
    await userEvent.click(screen.getByRole('radio', { name: 'Escuro' }))
    expect(document.documentElement).toHaveClass('dark')
  })

  it('remove a classe dark ao escolher claro', async () => {
    render(<AlternadorTema />)
    await userEvent.click(screen.getByRole('radio', { name: 'Escuro' }))
    await userEvent.click(screen.getByRole('radio', { name: 'Claro' }))
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('guarda a escolha para o proximo carregamento', async () => {
    render(<AlternadorTema />)
    await userEvent.click(screen.getByRole('radio', { name: 'Escuro' }))
    expect(window.localStorage.getItem(CHAVE_TEMA)).toBe('escuro')
  })

  it('recupera a escolha salva', () => {
    window.localStorage.setItem(CHAVE_TEMA, 'escuro')
    render(<AlternadorTema />)
    expect(screen.getByRole('radio', { name: 'Escuro' })).toHaveAttribute('aria-checked', 'true')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('ignora valor invalido guardado', () => {
    window.localStorage.setItem(CHAVE_TEMA, 'roxo')
    render(<AlternadorTema />)
    expect(screen.getByRole('radio', { name: 'Automático' })).toHaveAttribute('aria-checked', 'true')
  })

  it('em automatico segue a preferencia escura do aparelho', () => {
    simularPreferencia(true)
    render(<AlternadorTema />)
    expect(document.documentElement).toHaveClass('dark')
  })

  it('em automatico acompanha o aparelho trocando de tema em tempo real', async () => {
    render(<AlternadorTema />)
    expect(document.documentElement).not.toHaveClass('dark')

    await act(async () => { aparelhoTrocaPara(true) })
    expect(document.documentElement).toHaveClass('dark')

    await act(async () => { aparelhoTrocaPara(false) })
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('desliga o ouvinte ao sair da tela', () => {
    const { unmount } = render(<AlternadorTema />)
    expect(ouvintes).toHaveLength(1)
    unmount()
    expect(ouvintes).toHaveLength(0)
  })

  it('escolha explicita de claro vence o aparelho escuro', async () => {
    simularPreferencia(true)
    render(<AlternadorTema />)
    await userEvent.click(screen.getByRole('radio', { name: 'Claro' }))
    expect(document.documentElement).not.toHaveClass('dark')
  })
})
