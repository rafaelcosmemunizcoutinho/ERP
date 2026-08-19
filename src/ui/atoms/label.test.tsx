import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Label } from './label'

describe('Label', () => {
  it('renderiza o texto', () => {
    render(<Label>E-mail</Label>)
    expect(screen.getByText('E-mail')).toBeInTheDocument()
  })

  it('associa ao campo por htmlFor', () => {
    render(<><Label htmlFor='email'>E-mail</Label><input id='email' /></>)
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })

  it('nao mostra asterisco por padrao', () => {
    const { container } = render(<Label>Apelido</Label>)
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument()
  })

  it('mostra asterisco quando obrigatorio', () => {
    const { container } = render(<Label obrigatorio>E-mail</Label>)
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('*')
  })

  it('esconde o asterisco do leitor de tela, que ja recebe required no campo', () => {
    const { container } = render(<Label obrigatorio>E-mail</Label>)
    expect(container.querySelector('span')).toHaveAttribute('aria-hidden', 'true')
  })

  it('mescla className', () => {
    render(<Label className='sr-only'>Oculto</Label>)
    expect(screen.getByText('Oculto').className).toContain('sr-only')
  })
})
