// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SignJWT } from 'jose'
import { _assinar, _verificar, type Sessao } from './_token'

const SESSAO: Sessao = {
  sub: '11111111-1111-1111-1111-111111111111',
  tenantId: '22222222-2222-2222-2222-222222222222',
  nome: 'Ana da Padaria',
  email: 'ana@padaria.com.br',
  permissoes: ['VENDA_CRIAR', 'RELATORIO_DRE']
}

const chave = (): Uint8Array => new TextEncoder().encode(process.env.AUTH_SECRET as string)

beforeEach(() => {
  process.env.AUTH_SECRET = 'segredo-de-teste-com-tamanho-suficiente'
})

afterEach(() => {
  vi.useRealTimers()
})

describe('_assinar e _verificar', () => {
  it('faz ida e volta preservando o conteudo', async () => {
    expect(await _verificar(await _assinar(SESSAO))).toMatchObject(SESSAO)
  })

  it('carrega o tenantId, que nunca vem do cliente', async () => {
    const lida = await _verificar(await _assinar(SESSAO))
    expect(lida?.tenantId).toBe(SESSAO.tenantId)
  })

  it('recusa token adulterado', async () => {
    const token = await _assinar(SESSAO)
    const adulterado = token.slice(0, -4) + 'aaaa'
    expect(await _verificar(adulterado)).toBeNull()
  })

  it('recusa token assinado com outro segredo', async () => {
    const token = await _assinar(SESSAO)
    process.env.AUTH_SECRET = 'outro-segredo-completamente-diferente'
    expect(await _verificar(token)).toBeNull()
  })

  it('recusa lixo', async () => {
    expect(await _verificar('nao-e-um-jwt')).toBeNull()
  })

  it('recusa token expirado', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const token = await _assinar(SESSAO)
    vi.setSystemTime(new Date('2026-01-01T08:00:01Z'))
    expect(await _verificar(token)).toBeNull()
  })

  it('aceita token dentro da validade', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const token = await _assinar(SESSAO)
    vi.setSystemTime(new Date('2026-01-01T07:59:00Z'))
    expect(await _verificar(token)).toMatchObject(SESSAO)
  })

  it('recusa token de outro emissor', async () => {
    const token = await new SignJWT({ ...SESSAO })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer('outro-sistema')
      .setAudience('erp-web/app')
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(chave())
    expect(await _verificar(token)).toBeNull()
  })

  it('recusa token de outra audiencia', async () => {
    const token = await new SignJWT({ ...SESSAO })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer('erp-web')
      .setAudience('outra-audiencia')
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(chave())
    expect(await _verificar(token)).toBeNull()
  })

  it('recusa token valido cujo conteudo nao tem o formato esperado', async () => {
    const token = await new SignJWT({ sub: 'nao-e-uuid' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer('erp-web')
      .setAudience('erp-web/app')
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(chave())
    expect(await _verificar(token)).toBeNull()
  })

  it.each([undefined, '', 'curto'])('recusa assinar com AUTH_SECRET invalido: %s', async (valor) => {
    if (valor === undefined) delete process.env.AUTH_SECRET
    else process.env.AUTH_SECRET = valor
    await expect(_assinar(SESSAO)).rejects.toThrow(/AUTH_SECRET/)
  })

  it('nao vaza detalhe quando o segredo some na verificacao', async () => {
    const token = await _assinar(SESSAO)
    delete process.env.AUTH_SECRET
    expect(await _verificar(token)).toBeNull()
  })
})
