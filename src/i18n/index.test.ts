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

describe('t com interpolacao', () => {
  it('substitui a variavel pelo valor', () => {
    expect(t('auth', 'painel.boasVindas', { nome: 'Ana' })).toBe('Olá, Ana')
  })

  it('substitui numero', () => {
    const texto = t('auth', 'comecar.prontoDescricao', { categorias: 7, contas: 28 })
    expect(texto).toContain('7 categorias')
    expect(texto).toContain('28 contas')
  })

  it('mantem o marcador quando a variavel nao foi informada', () => {
    expect(t('auth', 'painel.boasVindas', {})).toContain('{{nome}}')
  })

  it('devolve o texto cru quando nao ha variaveis', () => {
    expect(t('auth', 'entrar.titulo')).toBe('Entrar')
  })
})
