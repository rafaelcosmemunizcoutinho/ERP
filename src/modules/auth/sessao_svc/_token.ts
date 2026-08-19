import { SignJWT, jwtVerify } from 'jose'
import { z } from 'zod'

const EMISSOR = 'erp-web'
const AUDIENCIA = 'erp-web/app'
const VALIDADE = '8h'

export const NOME_COOKIE = 'erp_sessao'

const conteudoSessao = z.object({
  sub: z.guid(),
  tenantId: z.guid(),
  nome: z.string().min(1),
  email: z.email(),
  permissoes: z.array(z.string())
})

export type Sessao = z.infer<typeof conteudoSessao>

function _chave (): Uint8Array {
  const segredo = process.env.AUTH_SECRET
  if (segredo === undefined || segredo.length < 16) {
    throw new Error('AUTH_SECRET ausente ou curto demais (minimo 16 caracteres).')
  }
  return new TextEncoder().encode(segredo)
}

export async function _assinar (sessao: Sessao): Promise<string> {
  return await new SignJWT({ ...sessao })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(EMISSOR)
    .setAudience(AUDIENCIA)
    .setIssuedAt()
    .setExpirationTime(VALIDADE)
    .sign(_chave())
}

export async function _verificar (token: string): Promise<Sessao | null> {
  try {
    const { payload } = await jwtVerify(token, _chave(), {
      issuer: EMISSOR,
      audience: AUDIENCIA
    })
    const resultado = conteudoSessao.safeParse(payload)
    return resultado.success ? resultado.data : null
  } catch {
    return null
  }
}
