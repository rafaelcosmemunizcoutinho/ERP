// @vitest-environment node
import { randomUUID } from 'node:crypto'
import { sql } from 'drizzle-orm'
import { afterAll, describe, expect, it } from 'vitest'
import { comTenant } from '@/db/client'
import { autenticar } from '@/modules/auth/login_svc/autenticar'
import { criarEmpresa } from '@/modules/onboarding/criar_empresa_svc/criar_empresa'

const SENHA = 'senha-de-teste-forte-123'
const criados: string[] = []

type Registro = Record<string, unknown> & {
  entidade: string
  acao: string
  usuario_id: string | null
  dados_anteriores: Record<string, unknown> | null
  dados_novos: Record<string, unknown> | null
}

async function novaEmpresa (): Promise<{ tenantId: string, usuarioId: string, email: string }> {
  const marca = randomUUID().slice(0, 8)
  const email = `audit-${marca}@exemplo.com.br`
  const criada = await criarEmpresa({
    razaoSocial: `Mercearia ${marca} Ltda`,
    segmento: 'mercearia',
    responsavelNome: 'Joana Lima',
    responsavelEmail: email,
    senha: SENHA
  })
  criados.push(criada.tenantId)
  return { tenantId: criada.tenantId, usuarioId: criada.usuarioId, email }
}

afterAll(async () => {
  for (const tenantId of criados) {
    await comTenant(tenantId, async (tx) => {
      await tx.execute(sql`DELETE FROM usuario_papel WHERE usuario_id IN (SELECT id FROM usuario)`)
      await tx.execute(sql`DELETE FROM categoria`)
      await tx.execute(sql`DELETE FROM conta_contabil WHERE pai_id IS NOT NULL`)
      await tx.execute(sql`DELETE FROM conta_contabil`)
      await tx.execute(sql`DELETE FROM usuario`)
      await tx.execute(sql`DELETE FROM empresa`)
      await tx.execute(sql`DELETE FROM tenant WHERE id = ${tenantId}::uuid`)
    })
  }
})

describe('auditoria automatica', () => {
  it('registra a criacao da empresa sem ninguem pedir', async () => {
    const { tenantId } = await novaEmpresa()

    await comTenant(tenantId, async (tx) => {
      const [registro] = await tx.execute<Registro>(
        sql`SELECT * FROM auditoria WHERE entidade = 'empresa' AND acao = 'CRIACAO'`
      )
      expect(registro).toBeDefined()
      expect(registro.dados_novos?.razao_social).toContain('Mercearia')
    })
  })

  it('registra as categorias semeadas pelo template', async () => {
    const { tenantId } = await novaEmpresa()

    await comTenant(tenantId, async (tx) => {
      const [contagem] = await tx.execute<{ n: number }>(
        sql`SELECT count(*)::int AS n FROM auditoria WHERE entidade = 'categoria'`
      )
      expect(contagem.n).toBe(7)
    })
  })

  it('guarda apenas os campos que mudaram, com o antes e o depois', async () => {
    const { tenantId, usuarioId } = await novaEmpresa()

    await comTenant({ tenantId, usuarioId }, async (tx) => {
      await tx.execute(sql`UPDATE categoria SET nome = 'Frios especiais' WHERE nome = 'Frios e laticínios'`)
    })

    await comTenant(tenantId, async (tx) => {
      const [registro] = await tx.execute<Registro>(sql`
        SELECT * FROM auditoria
        WHERE entidade = 'categoria' AND acao = 'ALTERACAO'
      `)
      expect(registro.dados_anteriores?.nome).toBe('Frios e laticínios')
      expect(registro.dados_novos?.nome).toBe('Frios especiais')
      expect(Object.keys(registro.dados_novos ?? {})).not.toContain('perecivel')
    })
  })

  it('guarda quem fez a alteracao', async () => {
    const { tenantId, usuarioId } = await novaEmpresa()

    await comTenant({ tenantId, usuarioId }, async (tx) => {
      await tx.execute(sql`UPDATE empresa SET nome_fantasia = 'Mercadinho da Joana'`)
    })

    await comTenant(tenantId, async (tx) => {
      const [registro] = await tx.execute<Registro>(sql`
        SELECT * FROM auditoria WHERE entidade = 'empresa' AND acao = 'ALTERACAO'
      `)
      expect(registro.usuario_id).toBe(usuarioId)
    })
  })

  it('ignora UPDATE que nao altera nada', async () => {
    const { tenantId, usuarioId } = await novaEmpresa()

    await comTenant({ tenantId, usuarioId }, async (tx) => {
      await tx.execute(sql`UPDATE categoria SET nome = nome`)
    })

    await comTenant(tenantId, async (tx) => {
      const [contagem] = await tx.execute<{ n: number }>(sql`
        SELECT count(*)::int AS n FROM auditoria
        WHERE entidade = 'categoria' AND acao = 'ALTERACAO'
      `)
      expect(contagem.n).toBe(0)
    })
  })

  it('registra exclusao com o estado que existia antes', async () => {
    const { tenantId, usuarioId } = await novaEmpresa()

    await comTenant({ tenantId, usuarioId }, async (tx) => {
      await tx.execute(sql`DELETE FROM categoria WHERE nome = 'Higiene'`)
    })

    await comTenant(tenantId, async (tx) => {
      const [registro] = await tx.execute<Registro>(sql`
        SELECT * FROM auditoria WHERE entidade = 'categoria' AND acao = 'EXCLUSAO'
      `)
      expect(registro.dados_anteriores?.nome).toBe('Higiene')
      expect(registro.dados_novos).toBeNull()
    })
  })

  it('NUNCA guarda hash de senha nem segredo de MFA', async () => {
    const { tenantId, usuarioId } = await novaEmpresa()

    await comTenant({ tenantId, usuarioId }, async (tx) => {
      await tx.execute(sql`UPDATE usuario SET nome = 'Joana Lima Souza', mfa_secret = 'ABCDEFGHIJKLMNOP'`)
    })

    await comTenant(tenantId, async (tx) => {
      const registros = await tx.execute<Registro>(
        sql`SELECT * FROM auditoria WHERE entidade = 'usuario'`
      )
      expect(registros.length).toBeGreaterThan(0)
      for (const registro of registros) {
        const campos = [
          ...Object.keys(registro.dados_anteriores ?? {}),
          ...Object.keys(registro.dados_novos ?? {})
        ]
        expect(campos).not.toContain('senha_hash')
        expect(campos).not.toContain('mfa_secret')
      }
    })
  })

  it('nao polui a trilha com o carimbo de ultimo login', async () => {
    const { tenantId, email } = await novaEmpresa()

    await comTenant(tenantId, async (tx) => {
      await tx.execute(sql`DELETE FROM auditoria WHERE entidade = 'usuario'`)
    })

    await autenticar({ email, senha: SENHA })

    await comTenant(tenantId, async (tx) => {
      const [contagem] = await tx.execute<{ n: number }>(sql`
        SELECT count(*)::int AS n FROM auditoria WHERE entidade = 'usuario'
      `)
      expect(contagem.n).toBe(0)
    })
  })

  it('a trilha de um tenant nao vaza para o outro', async () => {
    const a = await novaEmpresa()
    const b = await novaEmpresa()

    const registrosDeA = await comTenant(a.tenantId, async (tx) =>
      await tx.execute<{ tenant_id: string }>(sql`SELECT tenant_id FROM auditoria`)
    )

    expect(registrosDeA.length).toBeGreaterThan(0)
    for (const registro of registrosDeA) {
      expect(registro.tenant_id).toBe(a.tenantId)
      expect(registro.tenant_id).not.toBe(b.tenantId)
    }
  })
})
