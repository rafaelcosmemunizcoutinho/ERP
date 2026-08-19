import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AppShell, type ItemNavegacao } from './app-shell'

vi.mock('next/navigation', () => ({ usePathname: () => '/painel' }))

const ITENS: ItemNavegacao[] = [
  { href: '/painel', rotulo: 'Painel' },
  { href: '/categorias', rotulo: 'Categorias', secao: 'Cadastros' },
  { href: '/produtos', rotulo: 'Produtos', secao: 'Cadastros' }
]

function montar (itens = ITENS): void {
  render(
    <AppShell
      empresa='Padaria do Zé'
      segmento='padaria'
      usuario='Ana Souza'
      itens={itens}
      acoesCabecalho={<button type='button'>Sair</button>}
    >
      <p>Conteúdo</p>
    </AppShell>
  )
}

describe('AppShell', () => {
  it('mostra empresa, segmento e usuario', () => {
    montar()
    expect(screen.getByText('Padaria do Zé')).toBeInTheDocument()
    expect(screen.getByText('padaria')).toBeInTheDocument()
    expect(screen.getByText('Ana Souza')).toBeInTheDocument()
  })

  it('renderiza o conteudo da pagina', () => {
    montar()
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('expoe a navegacao com nome acessivel', () => {
    montar()
    expect(screen.getByRole('navigation', { name: 'Menu principal' })).toBeInTheDocument()
  })

  it('agrupa itens por secao', () => {
    montar()
    expect(screen.getByText('Cadastros')).toBeInTheDocument()
  })

  it('marca a rota atual com aria-current', () => {
    montar()
    expect(screen.getByRole('link', { name: 'Painel' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Categorias' })).not.toHaveAttribute('aria-current')
  })

  it('mostra so os itens recebidos, respeitando permissao', () => {
    montar([{ href: '/painel', rotulo: 'Painel' }])
    expect(screen.getByRole('link', { name: 'Painel' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Categorias' })).not.toBeInTheDocument()
  })

  it('oferece atalho para pular direto ao conteudo', () => {
    montar()
    expect(screen.getByRole('link', { name: 'Ir para o conteúdo' })).toHaveAttribute('href', '#conteudo')
  })

  it('abre e fecha o menu no celular', async () => {
    montar()
    const botao = screen.getByRole('button', { name: 'Abrir menu' })
    expect(botao).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(botao)
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('fecha o menu ao navegar', async () => {
    montar()
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }))
    await userEvent.click(screen.getByRole('link', { name: 'Categorias' }))
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('liga o botao ao menu por aria-controls', () => {
    montar()
    const botao = screen.getByRole('button', { name: 'Abrir menu' })
    const menu = screen.getByRole('navigation', { name: 'Menu principal' })
    expect(botao.getAttribute('aria-controls')).toBe(menu.id)
  })

  it('mantem o botao de sair no cabecalho', () => {
    montar()
    const cabecalho = screen.getByRole('banner')
    expect(within(cabecalho).getByRole('button', { name: 'Sair' })).toBeInTheDocument()
  })
})
