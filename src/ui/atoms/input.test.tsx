import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Input } from './input'

describe('Input', () => {
  it('renderiza acessivel por rotulo', () => {
    render(<Input aria-label='E-mail' />)
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })

  it('aceita digitacao', async () => {
    render(<Input aria-label='E-mail' />)
    const campo = screen.getByLabelText('E-mail')
    await userEvent.type(campo, 'dono@padaria.com')
    expect(campo).toHaveValue('dono@padaria.com')
  })

  it('nao marca aria-invalid quando valido', () => {
    render(<Input aria-label='E-mail' />)
    expect(screen.getByLabelText('E-mail')).not.toHaveAttribute('aria-invalid')
  })

  it('marca aria-invalid quando invalido', () => {
    render(<Input aria-label='E-mail' invalido />)
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true')
  })

  it('troca a borda para danger quando invalido', () => {
    render(<Input aria-label='E-mail' invalido />)
    expect(screen.getByLabelText('E-mail').className).toContain('border-danger')
  })

  it('usa borda outline-strong quando valido, atendendo WCAG 1.4.11', () => {
    render(<Input aria-label='E-mail' />)
    expect(screen.getByLabelText('E-mail').className).toContain('border-outline-strong')
  })

  it('nao aceita digitacao quando desabilitado', async () => {
    render(<Input aria-label='E-mail' disabled />)
    const campo = screen.getByLabelText('E-mail')
    await userEvent.type(campo, 'texto')
    expect(campo).toHaveValue('')
  })

  it('mescla className', () => {
    render(<Input aria-label='E-mail' className='w-40' />)
    expect(screen.getByLabelText('E-mail').className).toContain('w-40')
  })
})
