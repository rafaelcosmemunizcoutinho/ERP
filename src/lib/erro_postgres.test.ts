import { describe, expect, it } from 'vitest'
import { violouUnicidade } from './erro_postgres'

describe('violouUnicidade', () => {
  it('reconhece erro direto do postgres', () => {
    expect(violouUnicidade({ code: '23505', constraint_name: 'empresa_cnpj_uq' }, 'empresa_cnpj_uq')).toBe(true)
  })

  it('reconhece erro embrulhado pelo driver', () => {
    const causa = { code: '23505', constraint_name: 'empresa_cnpj_uq' }
    const externo = new Error('Failed query')
    ;(externo as { cause?: unknown }).cause = causa
    expect(violouUnicidade(externo, 'empresa_cnpj_uq')).toBe(true)
  })

  it('reconhece pela mensagem quando o driver so deixa o texto', () => {
    expect(violouUnicidade(new Error('duplicate key value violates empresa_cnpj_uq'), 'empresa_cnpj_uq')).toBe(true)
  })

  it('ignora outra constraint', () => {
    expect(violouUnicidade({ code: '23505', constraint_name: 'usuario_tenant_email_uq' }, 'empresa_cnpj_uq')).toBe(false)
  })

  it('ignora outro codigo de erro', () => {
    expect(violouUnicidade({ code: '23503', constraint_name: 'empresa_cnpj_uq' }, 'empresa_cnpj_uq')).toBe(false)
  })

  it('ignora valores que nao sao erro', () => {
    expect(violouUnicidade(null, 'x')).toBe(false)
    expect(violouUnicidade(undefined, 'x')).toBe(false)
    expect(violouUnicidade('texto', 'x')).toBe(false)
  })

  it('nao entra em laco infinito com cause circular', () => {
    const a = new Error('a')
    const b = new Error('b')
    ;(a as { cause?: unknown }).cause = b
    ;(b as { cause?: unknown }).cause = a
    expect(violouUnicidade(a, 'nao-existe')).toBe(false)
  })
})
