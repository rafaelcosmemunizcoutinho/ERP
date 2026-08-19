// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { verificarCodigo } from './verificar_codigo'
import { gerarSegredo } from './gerar_segredo'
import { montarUri } from './montar_uri'
import { _codificarBase32, _decodificarBase32, _hotp } from './_hotp'

const SEGREDO_RFC = _codificarBase32(Buffer.from('12345678901234567890', 'ascii'))

describe('_hotp — vetores da RFC 4226', () => {
  const esperados = ['755224', '287082', '359152', '969429', '338314',
    '254676', '287922', '162583', '399871', '520489']
  const chave = Buffer.from('12345678901234567890', 'ascii')

  it.each(esperados.map((c, i) => [i, c]))('contador %i gera %s', (contador, codigo) => {
    expect(_hotp(chave, Number(contador), 6)).toBe(codigo)
  })
})

describe('base32', () => {
  it('faz ida e volta', () => {
    const original = Buffer.from('12345678901234567890', 'ascii')
    expect(_decodificarBase32(_codificarBase32(original))).toEqual(original)
  })

  it('ignora padding e espaco', () => {
    expect(_decodificarBase32('GEZDGNBV GY3TQOJQ====')).toEqual(_decodificarBase32('GEZDGNBVGY3TQOJQ'))
  })

  it('rejeita caractere fora do alfabeto', () => {
    expect(() => _decodificarBase32('GEZD1NBV')).toThrow(/Caractere invalido/)
  })

  it('codifica buffer vazio como string vazia', () => {
    expect(_codificarBase32(Buffer.alloc(0))).toBe('')
  })

  it('decodifica string vazia como buffer vazio', () => {
    expect(_decodificarBase32('')).toHaveLength(0)
  })
})

describe('verificarCodigo — vetores da RFC 6238', () => {
  it.each([
    [59, '287082'],
    [1111111109, '081804'],
    [1111111111, '050471'],
    [1234567890, '005924'],
    [2000000000, '279037']
  ])('aceita o codigo valido em t=%i', (segundos, codigo) => {
    expect(verificarCodigo(SEGREDO_RFC, codigo, segundos * 1000)).toBe(true)
  })

  it('aceita o periodo anterior, tolerando relogio atrasado', () => {
    expect(verificarCodigo(SEGREDO_RFC, '287082', (59 + 30) * 1000)).toBe(true)
  })

  it('aceita o periodo seguinte, tolerando relogio adiantado', () => {
    expect(verificarCodigo(SEGREDO_RFC, '287082', (59 - 30) * 1000)).toBe(true)
  })

  it('recusa codigo de dois periodos atras', () => {
    expect(verificarCodigo(SEGREDO_RFC, '287082', (59 + 90) * 1000)).toBe(false)
  })

  it('recusa codigo errado', () => {
    expect(verificarCodigo(SEGREDO_RFC, '000000', 59000)).toBe(false)
  })

  it.each(['12345', '1234567', 'abcdef', '', '12 34 5'])('recusa formato invalido: %s', (codigo) => {
    expect(verificarCodigo(SEGREDO_RFC, codigo, 59000)).toBe(false)
  })

  it('aceita codigo digitado com espaco', () => {
    expect(verificarCodigo(SEGREDO_RFC, '287 082', 59000)).toBe(true)
  })

  it('recusa quando o segredo nao e base32', () => {
    expect(verificarCodigo('!!!!', '287082', 59000)).toBe(false)
  })

  it('recusa quando o segredo e vazio', () => {
    expect(verificarCodigo('', '287082', 59000)).toBe(false)
  })
})

describe('gerarSegredo', () => {
  it('gera 160 bits em base32', () => {
    expect(_decodificarBase32(gerarSegredo())).toHaveLength(20)
  })

  it('nao repete', () => {
    expect(gerarSegredo()).not.toBe(gerarSegredo())
  })

  it('gera segredo utilizavel', () => {
    const segredo = gerarSegredo()
    const chave = _decodificarBase32(segredo)
    const agora = 1700000000000
    const codigo = _hotp(chave, Math.floor(agora / 1000 / 30), 6)
    expect(verificarCodigo(segredo, codigo, agora)).toBe(true)
  })
})

describe('montarUri', () => {
  it('monta uri otpauth com emissor e conta', () => {
    const uri = montarUri('ERP Web', 'dono@padaria.com.br', 'ABCDEF')
    expect(uri).toContain('otpauth://totp/ERP%20Web%3Adono%40padaria.com.br')
    expect(uri).toContain('secret=ABCDEF')
    expect(uri).toContain('issuer=ERP+Web')
    expect(uri).toContain('digits=6')
    expect(uri).toContain('period=30')
  })
})

describe('borda do contador', () => {
  it('nao estoura quando a janela anterior cairia em contador negativo', () => {
    expect(() => verificarCodigo(SEGREDO_RFC, '000000', 0)).not.toThrow()
    expect(verificarCodigo(SEGREDO_RFC, '000000', 0)).toBe(false)
  })

  it('valida normalmente no primeiro periodo', () => {
    const chave = _decodificarBase32(SEGREDO_RFC)
    expect(verificarCodigo(SEGREDO_RFC, _hotp(chave, 0, 6), 0)).toBe(true)
  })
})
