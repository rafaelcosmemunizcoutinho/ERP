import { describe, expect, it } from 'vitest'
import {
  ROTULOS_UNIDADE, UNIDADES_COMPRA, UNIDADES_ESTOQUE, arredondarEstoque, casasDecimais,
  deUnidadeEstoque, formatarQuantidade, paraUnidadeEstoque, unidadeEstoquePadrao
} from './converter'

describe('casasDecimais', () => {
  it('pesavel tem tres casas', () => {
    expect(casasDecimais('pesavel')).toBe(3)
  })

  it('unitario nao tem casa decimal', () => {
    expect(casasDecimais('unitario')).toBe(0)
  })
})

describe('arredondarEstoque', () => {
  it('mantem gramas no pesavel', () => {
    expect(arredondarEstoque(2.3456, 'pesavel')).toBe(2.346)
  })

  it('nao deixa meia unidade sobrar no unitario', () => {
    expect(arredondarEstoque(11.6, 'unitario')).toBe(12)
    expect(arredondarEstoque(11.4, 'unitario')).toBe(11)
  })
})

describe('paraUnidadeEstoque', () => {
  it('tres fardos de doze entram como trinta e seis unidades', () => {
    expect(paraUnidadeEstoque(3, 12)).toBe(36)
  })

  it('uma caixa de vinte quilos entra como vinte quilos', () => {
    expect(paraUnidadeEstoque(1, 20, 'pesavel')).toBe(20)
  })

  it('aceita fator fracionario', () => {
    expect(paraUnidadeEstoque(2, 1.5, 'pesavel')).toBe(3)
  })

  it('aceita quantidade zero', () => {
    expect(paraUnidadeEstoque(0, 12)).toBe(0)
  })

  it.each([-1, NaN, Infinity])('recusa quantidade %s', (quantidade) => {
    expect(() => paraUnidadeEstoque(quantidade, 12)).toThrow(/não negativo/)
  })

  it.each([0, -12, NaN, Infinity])('recusa fator %s', (fator) => {
    expect(() => paraUnidadeEstoque(3, fator)).toThrow(/maior que zero/)
  })
})

describe('deUnidadeEstoque', () => {
  it('trinta e seis unidades sao tres fardos de doze', () => {
    expect(deUnidadeEstoque(36, 12)).toBe(3)
  })

  it('faz ida e volta sem perder valor', () => {
    expect(deUnidadeEstoque(paraUnidadeEstoque(5, 24), 24)).toBe(5)
  })

  it.each([0, -1, NaN])('recusa fator %s', (fator) => {
    expect(() => deUnidadeEstoque(36, fator)).toThrow(/maior que zero/)
  })
})

describe('formatarQuantidade', () => {
  it('formata peso com tres casas e virgula', () => {
    expect(formatarQuantidade(2.34, 'KG', 'pesavel')).toBe('2,340 KG')
  })

  it('formata unidade sem casa decimal', () => {
    expect(formatarQuantidade(36, 'UN', 'unitario')).toBe('36 UN')
  })

  it('usa separador de milhar do portugues', () => {
    expect(formatarQuantidade(1234, 'UN', 'unitario')).toBe('1.234 UN')
  })
})

describe('unidadeEstoquePadrao', () => {
  it('pesavel guarda em quilo', () => {
    expect(unidadeEstoquePadrao('pesavel')).toBe('KG')
  })

  it('unitario guarda em unidade', () => {
    expect(unidadeEstoquePadrao('unitario')).toBe('UN')
  })
})

describe('catalogo de unidades', () => {
  it('toda unidade de estoque tem rotulo', () => {
    for (const unidade of UNIDADES_ESTOQUE) {
      expect(ROTULOS_UNIDADE[unidade]).toBeTruthy()
    }
  })

  it('toda unidade de compra tem rotulo', () => {
    for (const unidade of UNIDADES_COMPRA) {
      expect(ROTULOS_UNIDADE[unidade]).toBeTruthy()
    }
  })

  it('unidade de compra nunca e unidade de estoque', () => {
    for (const compra of UNIDADES_COMPRA) {
      expect(UNIDADES_ESTOQUE).not.toContain(compra)
    }
  })
})
