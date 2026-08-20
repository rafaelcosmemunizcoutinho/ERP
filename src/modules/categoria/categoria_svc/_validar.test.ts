import { describe, expect, it } from 'vitest'
import { EntradaInvalida } from '@/lib/erros'
import { _validarCategoria } from './_validar'

const PERECIVEL = { nome: 'Pães', perecivel: true, diasAlertaCritico: 1, diasAlertaAtencao: 2 }
const DURAVEL = { nome: 'Limpeza', perecivel: false, diasAlertaCritico: null, diasAlertaAtencao: null }

describe('_validarCategoria', () => {
  it('aceita categoria perecivel bem formada', () => {
    expect(_validarCategoria(PERECIVEL)).toMatchObject({ nome: 'Pães', diasAlertaCritico: 1 })
  })

  it('aceita categoria duravel', () => {
    expect(_validarCategoria(DURAVEL)).toMatchObject({ perecivel: false, diasAlertaCritico: null })
  })

  it('remove espaco em volta do nome', () => {
    expect(_validarCategoria({ ...DURAVEL, nome: '  Bebidas  ' }).nome).toBe('Bebidas')
  })

  it.each(['', ' ', 'A'])('recusa nome curto demais: %s', (nome) => {
    expect(() => _validarCategoria({ ...DURAVEL, nome })).toThrow(EntradaInvalida)
  })

  it('recusa nome longo demais', () => {
    expect(() => _validarCategoria({ ...DURAVEL, nome: 'x'.repeat(81) })).toThrow(/no máximo 80/)
  })

  it('descarta faixas quando a categoria deixa de ser perecivel', () => {
    const resultado = _validarCategoria({ ...PERECIVEL, perecivel: false })
    expect(resultado.diasAlertaCritico).toBeNull()
    expect(resultado.diasAlertaAtencao).toBeNull()
  })

  it.each([null, 0, -1, 1.5])('recusa alerta critico invalido: %s', (critico) => {
    expect(() => _validarCategoria({ ...PERECIVEL, diasAlertaCritico: critico as number }))
      .toThrow(/alerta crítico/)
  })

  it('recusa perecivel sem alerta de atencao', () => {
    expect(() => _validarCategoria({ ...PERECIVEL, diasAlertaAtencao: null }))
      .toThrow(/alerta de atenção/)
  })

  it.each([1, 0, -3])('recusa atencao que nao vem antes do critico: %s', (atencao) => {
    expect(() => _validarCategoria({ ...PERECIVEL, diasAlertaAtencao: atencao }))
      .toThrow(/antes do crítico/)
  })

  it('aceita atencao bem maior que o critico', () => {
    expect(_validarCategoria({ ...PERECIVEL, diasAlertaCritico: 30, diasAlertaAtencao: 90 }).diasAlertaAtencao).toBe(90)
  })

  it('preserva a situacao informada', () => {
    expect(_validarCategoria({ ...DURAVEL, ativo: false }).ativo).toBe(false)
  })
})
