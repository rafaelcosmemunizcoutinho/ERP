import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './badge'

describe('Badge', () => {
  it('renderiza o rotulo', () => {
    render(<Badge>Vencido</Badge>)
    expect(screen.getByText('Vencido')).toBeInTheDocument()
  })

  it('mostra ponto por padrao, cumprindo a regra do estado tri-canal', () => {
    const { container } = render(<Badge tom='perigo'>Vencido</Badge>)
    expect(container.querySelector('[data-slot="badge-ponto"]')).toBeInTheDocument()
  })

  it('esconde o ponto do leitor de tela porque o rotulo ja informa', () => {
    const { container } = render(<Badge>Em dia</Badge>)
    expect(container.querySelector('[data-slot="badge-ponto"]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('permite desligar o ponto', () => {
    const { container } = render(<Badge comPonto={false}>Sem ponto</Badge>)
    expect(container.querySelector('[data-slot="badge-ponto"]')).not.toBeInTheDocument()
  })

  it.each(['neutro', 'primario', 'sucesso', 'aviso', 'perigo'] as const)(
    'aplica o tom %s no rotulo e no ponto',
    (tom) => {
      const { container } = render(<Badge tom={tom}>Estado</Badge>)
      expect(container.querySelector('[data-slot="badge-ponto"]')?.className).toBeTruthy()
    }
  )

  it('usa tom neutro quando nenhum e informado', () => {
    const { container } = render(<Badge>Padrao</Badge>)
    expect(container.querySelector('[data-slot="badge-ponto"]')?.className).toContain('bg-on-surface-muted')
  })

  it('mescla className', () => {
    render(<Badge className='uppercase'>Chip</Badge>)
    expect(screen.getByText('Chip').className).toContain('uppercase')
  })
})
