import { describe, expect, it } from 'vitest'
import { CHAVE_TEMA, TEMAS, ehTema, resolverEscuro } from './tema'

describe('ehTema', () => {
  it.each(TEMAS)('aceita %s', (tema) => {
    expect(ehTema(tema)).toBe(true)
  })

  it.each(['', 'dark', 'CLARO', null, undefined, 7, {}])('recusa %s', (valor) => {
    expect(ehTema(valor)).toBe(false)
  })
})

describe('resolverEscuro', () => {
  it('escolha explicita vence a preferencia do sistema', () => {
    expect(resolverEscuro('escuro', false)).toBe(true)
    expect(resolverEscuro('claro', true)).toBe(false)
  })

  it('sistema segue a preferencia do aparelho', () => {
    expect(resolverEscuro('sistema', true)).toBe(true)
    expect(resolverEscuro('sistema', false)).toBe(false)
  })
})

describe('CHAVE_TEMA', () => {
  it('e a mesma usada pelo script anti-flash do layout', () => {
    expect(CHAVE_TEMA).toBe('erp-tema')
  })
})
