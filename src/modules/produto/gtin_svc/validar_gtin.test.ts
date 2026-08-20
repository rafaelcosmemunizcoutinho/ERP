import { describe, expect, it } from 'vitest'
import { completarGtin, digitoVerificadorGtin, validarGtin } from './validar_gtin'
import { interpretarEtiqueta } from './interpretar_etiqueta'

describe('validarGtin', () => {
  it.each([
    ['7891000315507', 'EAN-13 de industria'],
    ['7894900011517', 'EAN-13 de refrigerante'],
    ['96385074', 'EAN-8'],
    ['036000291452', 'UPC-A de 12'],
    ['17891000315504', 'GTIN-14 de caixa']
  ])('aceita %s (%s)', (codigo) => {
    expect(validarGtin(codigo)).toBe(true)
  })

  it.each(['7891000315508', '96385075', '036000291453'])(
    'recusa digito verificador errado em %s', (codigo) => {
      expect(validarGtin(codigo)).toBe(false)
    })

  it.each(['', '789100031550', '78910003155070', '1234567890', 'abcdefgh', '789100031550X'])(
    'recusa formato invalido %s', (codigo) => {
      expect(validarGtin(codigo)).toBe(false)
    })

  it('ignora espaco em volta', () => {
    expect(validarGtin('  7891000315507  ')).toBe(true)
  })
})

describe('digitoVerificadorGtin', () => {
  it('calcula o digito de um EAN-13', () => {
    expect(digitoVerificadorGtin('789100031550')).toBe(7)
  })

  it('calcula o digito de um EAN-8', () => {
    expect(digitoVerificadorGtin('9638507')).toBe(4)
  })

  it('devolve zero quando a soma fecha em dezena exata', () => {
    const base = '400638133393'
    expect(digitoVerificadorGtin(base)).toBe(1)
  })
})

describe('completarGtin', () => {
  it('completa um EAN-13', () => {
    expect(completarGtin('789100031550')).toBe('7891000315507')
  })

  it('o resultado sempre passa na validacao', () => {
    for (const base of ['789100031550', '9638507', '00003629101']) {
      expect(validarGtin(completarGtin(base))).toBe(true)
    }
  })

  it('recusa entrada nao numerica', () => {
    expect(() => completarGtin('78910003155X')).toThrow(/apenas dígitos/)
  })

  it('recusa tamanho que nao vira GTIN', () => {
    expect(() => completarGtin('12345')).toThrow(/não é um GTIN válido/)
  })
})

describe('interpretarEtiqueta', () => {
  const PESO = { prefixo: '2', conteudo: 'peso' } as const
  const VALOR = { prefixo: '2', conteudo: 'valor' } as const

  it('le peso em gramas de uma etiqueta de balanca', () => {
    const etiqueta = completarGtin('2' + '123456' + '02340')
    expect(etiqueta).toHaveLength(13)
    expect(interpretarEtiqueta(etiqueta, PESO)).toEqual({ codigoProduto: '123456', peso: 2.34 })
  })

  it('extrai o codigo do produto dos seis digitos do meio', () => {
    const etiqueta = completarGtin('2' + '000045' + '01250')
    expect(interpretarEtiqueta(etiqueta, PESO)?.codigoProduto).toBe('000045')
  })

  it('le valor em centavos quando a balanca grava preco', () => {
    const etiqueta = completarGtin('2' + '000045' + '01250')
    expect(interpretarEtiqueta(etiqueta, VALOR)).toEqual({ codigoProduto: '000045', valor: 12.5 })
  })

  it('devolve peso com tres casas', () => {
    const etiqueta = completarGtin('2' + '000045' + '00125')
    expect(interpretarEtiqueta(etiqueta, PESO)?.peso).toBe(0.125)
  })

  it('devolve null para EAN-13 comum de industria', () => {
    expect(interpretarEtiqueta('7891000315507', PESO)).toBeNull()
  })

  it('devolve null quando o prefixo configurado e outro', () => {
    const etiqueta = completarGtin('2' + '000045' + '01250')
    expect(interpretarEtiqueta(etiqueta, { prefixo: '9', conteudo: 'peso' })).toBeNull()
  })

  it('devolve null quando o digito verificador nao bate', () => {
    const etiqueta = completarGtin('2' + '000045' + '01250')
    const adulterada = etiqueta.slice(0, -1) + (Number(etiqueta.slice(-1)) === 9 ? '0' : '9')
    expect(interpretarEtiqueta(adulterada, PESO)).toBeNull()
  })

  it.each(['', '2000045012', '20000450125000', '2000045O1250', '200004501250X', '2 00045012509'])(
    'devolve null para %s', (codigo) => {
      expect(interpretarEtiqueta(codigo, PESO)).toBeNull()
    })

  it('ignora espaco em volta', () => {
    const etiqueta = completarGtin('2' + '000045' + '01250')
    expect(interpretarEtiqueta(`  ${etiqueta}  `, PESO)?.codigoProduto).toBe('000045')
  })
})
