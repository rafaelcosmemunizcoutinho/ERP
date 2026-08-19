import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Campo } from './campo'

describe('Campo', () => {
  it('associa rotulo ao campo sem precisar de id manual', () => {
    render(<Campo rotulo='E-mail' />)
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })

  it('aceita digitacao pelo rotulo', async () => {
    render(<Campo rotulo='E-mail' />)
    await userEvent.type(screen.getByLabelText('E-mail'), 'ana@padaria.com.br')
    expect(screen.getByLabelText('E-mail')).toHaveValue('ana@padaria.com.br')
  })

  it('gera ids distintos para campos irmaos', () => {
    render(<><Campo rotulo='Senha' /><Campo rotulo='Confirmar' /></>)
    expect(screen.getByLabelText('Senha').id).not.toBe(screen.getByLabelText('Confirmar').id)
  })

  it('liga o texto de ajuda por aria-describedby', () => {
    render(<Campo rotulo='CNPJ' ajuda='Somente números' />)
    const campo = screen.getByLabelText('CNPJ')
    const ajuda = screen.getByText('Somente números')
    expect(campo.getAttribute('aria-describedby')).toContain(ajuda.id)
  })

  it('liga o erro por aria-describedby e anuncia como alerta', () => {
    render(<Campo rotulo='E-mail' erro='E-mail inválido' />)
    const campo = screen.getByLabelText('E-mail')
    const erro = screen.getByRole('alert')
    expect(erro).toHaveTextContent('E-mail inválido')
    expect(campo.getAttribute('aria-describedby')).toContain(erro.id)
  })

  it('marca aria-invalid quando ha erro', () => {
    render(<Campo rotulo='E-mail' erro='E-mail inválido' />)
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('aria-invalid', 'true')
  })

  it('descreve ajuda e erro ao mesmo tempo', () => {
    render(<Campo rotulo='Senha' ajuda='Mínimo de 10 caracteres' erro='Senha curta demais' />)
    const descritos = screen.getByLabelText('Senha').getAttribute('aria-describedby') ?? ''
    expect(descritos.split(' ')).toHaveLength(2)
  })

  it('nao define aria-describedby quando nao ha ajuda nem erro', () => {
    render(<Campo rotulo='Apelido' />)
    expect(screen.getByLabelText('Apelido')).not.toHaveAttribute('aria-describedby')
  })

  it('marca o rotulo como obrigatorio quando o campo e required', () => {
    const { container } = render(<Campo rotulo='E-mail' required />)
    expect(screen.getByLabelText(/E-mail/)).toBeRequired()
    expect(container.querySelector('label span')).toHaveTextContent('*')
  })

  it('mescla className no container', () => {
    const { container } = render(<Campo rotulo='E-mail' className='w-64' />)
    expect(container.firstElementChild?.className).toContain('w-64')
  })
})
