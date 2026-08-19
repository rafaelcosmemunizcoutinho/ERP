import { describe, expect, it } from 'vitest'
import { t } from './index'

describe('t', () => {
  it('resolve chave rasa', () => {
    expect(t('comum', 'app.nome')).toBe('ERP Web')
  })

  it('resolve chave aninhada', () => {
    expect(t('comum', 'ambiente.bancoConectado')).toBe('Banco conectado')
  })

  it('falha alto quando a chave nao existe', () => {
    // @ts-expect-error chave inexistente e barrada em tempo de compilacao
    expect(() => t('comum', 'ambiente.inexistente')).toThrow(/Chave de traducao ausente/)
  })

  it('falha alto quando a chave aponta para um objeto', () => {
    // @ts-expect-error caminho intermediario nao e uma string traduzivel
    expect(() => t('comum', 'ambiente')).toThrow(/Chave de traducao ausente/)
  })
})
