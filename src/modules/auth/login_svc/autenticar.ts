import { sql } from 'drizzle-orm'
import { comTenant, db } from '@/db/client'
import { ContaDesativada, CredenciaisInvalidas, SegundoFatorInvalido } from '@/lib/erros'
import { verificarSenha } from '../senha_svc/verificar_senha'
import { verificarCodigo } from '../totp_svc/verificar_codigo'
import type { Sessao } from '../sessao_svc/_token'

type Candidato = Record<string, unknown> & {
  id: string
  tenant_id: string
  nome: string
  email: string
  senha_hash: string
  mfa_ativo: boolean
  mfa_secret: string | null
  empresa: string | null
}

interface Credenciais {
  email: string
  senha: string
  codigoMfa?: string
  tenantId?: string
}

interface ResultadoLogin {
  sessao: Sessao | null
  exigeMfa: boolean
  empresas: Array<{ tenantId: string, nome: string }>
}

export async function autenticar (credenciais: Credenciais): Promise<ResultadoLogin> {
  const email = credenciais.email.trim().toLowerCase()

  const candidatos = await db.execute<Candidato>(
    sql`SELECT * FROM auth_buscar_por_email(${email})`
  )

  if (candidatos.length === 0) throw new CredenciaisInvalidas()

  const compativeis: Candidato[] = []
  for (const candidato of candidatos) {
    if (await verificarSenha(candidato.senha_hash, credenciais.senha)) {
      compativeis.push(candidato)
    }
  }

  if (compativeis.length === 0) throw new CredenciaisInvalidas()

  const escolhidos =
    credenciais.tenantId === undefined
      ? compativeis
      : compativeis.filter((c) => c.tenant_id === credenciais.tenantId)

  if (escolhidos.length === 0) throw new CredenciaisInvalidas()

  if (escolhidos.length > 1) {
    return {
      sessao: null,
      exigeMfa: false,
      empresas: escolhidos.map((c) => ({
        tenantId: c.tenant_id,
        nome: c.empresa ?? c.email
      }))
    }
  }

  const usuario = escolhidos[0]

  if (usuario.mfa_ativo) {
    if (usuario.mfa_secret === null) throw new ContaDesativada()
    if (credenciais.codigoMfa === undefined || credenciais.codigoMfa === '') {
      return { sessao: null, exigeMfa: true, empresas: [] }
    }
    if (!verificarCodigo(usuario.mfa_secret, credenciais.codigoMfa)) {
      throw new SegundoFatorInvalido()
    }
  }

  const permissoes = await db.execute<{ codigo: string }>(
    sql`SELECT codigo FROM auth_permissoes(${usuario.id}::uuid)`
  )

  await comTenant(usuario.tenant_id, async (tx) => {
    await tx.execute(
      sql`UPDATE usuario SET ultimo_login_em = now() WHERE id = ${usuario.id}::uuid`
    )
  })

  return {
    sessao: {
      sub: usuario.id,
      tenantId: usuario.tenant_id,
      nome: usuario.nome,
      email: usuario.email,
      permissoes: permissoes.map((p) => p.codigo)
    },
    exigeMfa: false,
    empresas: []
  }
}
