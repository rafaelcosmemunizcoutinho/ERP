import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renderiza o rotulo', () => {
    render(<Button>Salvar</Button>)
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
  })

  it('nasce como type button para nao submeter formulario sem querer', () => {
    render(<Button>Cancelar</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('aceita type submit explicito', () => {
    render(<Button type='submit'>Entrar</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('dispara o clique', async () => {
    const aoClicar = vi.fn()
    render(<Button onClick={aoClicar}>Confirmar</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(aoClicar).toHaveBeenCalledOnce()
  })

  it('nao dispara o clique quando desabilitado', async () => {
    const aoClicar = vi.fn()
    render(<Button disabled onClick={aoClicar}>Confirmar</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(aoClicar).not.toHaveBeenCalled()
  })

  it('e alcancavel por teclado', async () => {
    render(<Button>Foco</Button>)
    await userEvent.tab()
    expect(screen.getByRole('button')).toHaveFocus()
  })

  it.each(['primaria', 'secundaria', 'fantasma', 'perigo'] as const)(
    'aplica a variante %s',
    (variante) => {
      const { container } = render(<Button variante={variante}>Acao</Button>)
      expect(container.firstElementChild?.className).toBeTruthy()
    }
  )

  it.each(['pequeno', 'medio', 'grande'] as const)('aplica o tamanho %s', (tamanho) => {
    render(<Button tamanho={tamanho}>Acao</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('delega a renderizacao com asChild', () => {
    render(<Button asChild><a href='/painel'>Ir ao painel</a></Button>)
    expect(screen.getByRole('link', { name: 'Ir ao painel' })).toHaveAttribute('href', '/painel')
  })

  it('mescla className sem perder o estilo da variante', () => {
    render(<Button className='w-full'>Largo</Button>)
    expect(screen.getByRole('button').className).toContain('w-full')
  })
})
