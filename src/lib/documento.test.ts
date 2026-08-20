import { describe, expect, it } from 'vitest'
import {
  formatarDocumento, limparDocumento, validarCnpj, validarCpf, validarDocumento
} from './documento'

describe('limparDocumento', () => {
  it('remove pontuacao', () => {
    expect(limparDocumento('529.982.247-25')).toBe('52998224725')
  })

  it('remove pontuacao de CNPJ', () => {
    expect(limparDocumento('11.222.333/0001-81')).toBe('11222333000181')
  })

  it('normaliza letra para maiuscula', () => {
    expect(limparDocumento('12abc34567890')).toBe('12ABC34567890')
  })
})

describe('validarCpf', () => {
  it.each(['529.982.247-25', '52998224725', '111.444.777-35', '398.912.058-19'])(
    'aceita CPF valido %s', (cpf) => {
      expect(validarCpf(cpf)).toBe(true)
    })

  it.each(['529.982.247-26', '11144477736', '12345678901'])(
    'recusa CPF com digito errado %s', (cpf) => {
      expect(validarCpf(cpf)).toBe(false)
    })

  it.each(['00000000000', '11111111111', '99999999999'])(
    'recusa sequencia repetida %s', (cpf) => {
      expect(validarCpf(cpf)).toBe(false)
    })

  it.each(['', '123', '5299822472', '529982247250', 'abcdefghijk'])(
    'recusa formato invalido %s', (cpf) => {
      expect(validarCpf(cpf)).toBe(false)
    })
})

describe('validarCnpj numerico', () => {
  it.each(['11.222.333/0001-81', '11222333000181', '34.028.316/0001-03'])(
    'aceita CNPJ valido %s', (cnpj) => {
      expect(validarCnpj(cnpj)).toBe(true)
    })

  it.each(['11.222.333/0001-82', '34028316000104'])(
    'recusa CNPJ com digito errado %s', (cnpj) => {
      expect(validarCnpj(cnpj)).toBe(false)
    })

  it('recusa sequencia repetida', () => {
    expect(validarCnpj('00000000000000')).toBe(false)
  })

  it.each(['', '1122233300018', '112223330001812'])(
    'recusa tamanho invalido %s', (cnpj) => {
      expect(validarCnpj(cnpj)).toBe(false)
    })
})

describe('validarCnpj alfanumerico', () => {
  it('aceita CNPJ alfanumerico valido', () => {
    expect(validarCnpj('12ABC34501DE35')).toBe(true)
  })

  it('recusa alfanumerico com digito errado', () => {
    expect(validarCnpj('12ABC34501DE34')).toBe(false)
  })

  it('aceita em caixa baixa, normalizando', () => {
    expect(validarCnpj('12abc34501de35')).toBe(true)
  })

  it('recusa letra nos digitos verificadores', () => {
    expect(validarCnpj('12ABC34501DEAB')).toBe(false)
  })
})

describe('validarDocumento', () => {
  it('usa a regra de CPF para PF', () => {
    expect(validarDocumento('PF', '529.982.247-25')).toBe(true)
    expect(validarDocumento('PF', '11222333000181')).toBe(false)
  })

  it('usa a regra de CNPJ para PJ', () => {
    expect(validarDocumento('PJ', '11.222.333/0001-81')).toBe(true)
    expect(validarDocumento('PJ', '52998224725')).toBe(false)
  })
})

describe('formatarDocumento', () => {
  it('formata CPF', () => {
    expect(formatarDocumento('PF', '52998224725')).toBe('529.982.247-25')
  })

  it('formata CNPJ numerico', () => {
    expect(formatarDocumento('PJ', '11222333000181')).toBe('11.222.333/0001-81')
  })

  it('formata CNPJ alfanumerico', () => {
    expect(formatarDocumento('PJ', '12ABC34501DE35')).toBe('12.ABC.345/01DE-35')
  })

  it('devolve como veio quando o tamanho nao bate', () => {
    expect(formatarDocumento('PF', '123')).toBe('123')
    expect(formatarDocumento('PJ', '123')).toBe('123')
  })
})
