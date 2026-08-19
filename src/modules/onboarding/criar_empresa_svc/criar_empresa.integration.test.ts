// @vitest-environment node
import { randomUUID } from 'node:crypto'
import { sql } from 'drizzle-orm'
import { afterAll, describe, expect, it } from 'vitest'
import { comTenant, db } from '@/db/client'
import { CnpjJaCadastrado, CredenciaisInvalidas, EntradaInvalida } from '@/lib/erros'
import { autenticar } from '@/modules/auth/login_svc/autenticar'
import { criarEmpresa } from './criar_empresa'
import { PLANO_DE_CONTAS, TEMPLATES } from '../templates'

const SENHA = 'senha-de-teste-123'
const criados: string[] = []

async function novaEmpresa (
  extra: Partial<Parameters<typeof criarEmpresa>[0]> = {}
): Promise<{ tenantId: string, usuarioId: string, email: string, marca: string }> {
  const marca = randomUUID().slice(0, 8)
  const resultado = await criarEmpresa({
    razaoSocial: `Padaria ${marca} Ltda`,
    nomeFantasia: `Padaria ${marca}`,
    segmento: 'padaria',
    responsavelNome: 'Ana Souza',
    responsavelEmail: `ana-${marca}@exemplo.com.br`,
    senha: SENHA,
    ...extra
  })
  criados.push(resultado.tenantId)
  return { tenantId: resultado.tenantId, usuarioId: resultado.usuarioId, email: `ana-${marca}@exemplo.com.br`, marca }
}

afterAll(async () => {
  // Duas armadilhas aqui. Sob RLS, DELETE sem contexto de tenant e um no-op
  // SILENCIOSO. E as FKs de empresa/usuario sao ON DELETE RESTRICT de proposito,
  // entao os filhos saem primeiro - inclusive as contas folha antes das raizes.
  for (const tenantId of criados) {
    await comTenant(tenantId, async (tx) => {
      await tx.execute(sql`DELETE FROM usuario_papel WHERE usuario_id IN (SELECT id FROM usuario)`)
      await tx.execute(sql`DELETE FROM auditoria`)
      await tx.execute(sql`DELETE FROM categoria`)
      await tx.execute(sql`DELETE FROM conta_contabil WHERE pai_id IS NOT NULL`)
      await tx.execute(sql`DELETE FROM conta_contabil`)
      await tx.execute(sql`DELETE FROM usuario`)
      await tx.execute(sql`DELETE FROM empresa`)
      await tx.execute(sql`DELETE FROM tenant WHERE id = ${tenantId}::uuid`)
    })
  }
})

describe('criarEmpresa', () => {
  it('provisiona tenant, empresa, usuario e papel DONO', async () => {
    const { tenantId, usuarioId } = await novaEmpresa()

    await comTenant(tenantId, async (tx) => {
      const [empresa] = await tx.execute<{ n: number }>(
        sql`SELECT count(*)::int AS n FROM empresa`
      )
      const [papeis] = await tx.execute<{ codigo: string }>(sql`
        SELECT p.codigo FROM usuario_papel up
        JOIN papel p ON p.id = up.papel_id
        WHERE up.usuario_id = ${usuarioId}::uuid
      `)
      expect(empresa.n).toBe(1)
      expect(papeis.codigo).toBe('DONO')
    })
  })

  it('semeia as categorias do segmento com as faixas de validade', async () => {
    const { tenantId } = await novaEmpresa({ segmento: 'padaria' })

    await comTenant(tenantId, async (tx) => {
      const categorias = await tx.execute<{ nome: string, dias_alerta_critico: number | null }>(
        sql`SELECT nome, dias_alerta_critico FROM categoria ORDER BY ordem`
      )
      expect(categorias).toHaveLength(TEMPLATES.padaria.categorias.length)
      expect(categorias[0].nome).toBe('Pães')
      expect(categorias[0].dias_alerta_critico).toBe(1)
    })
  })

  it('semeia categorias diferentes para segmentos diferentes', async () => {
    const { tenantId } = await novaEmpresa({ segmento: 'hortifruti' })

    await comTenant(tenantId, async (tx) => {
      const [primeira] = await tx.execute<{ nome: string }>(
        sql`SELECT nome FROM categoria ORDER BY ordem LIMIT 1`
      )
      expect(primeira.nome).toBe('Verduras')
    })
  })

  it('monta o plano de contas com a hierarquia ligada', async () => {
    const { tenantId } = await novaEmpresa()

    await comTenant(tenantId, async (tx) => {
      const [total] = await tx.execute<{ n: number }>(
        sql`SELECT count(*)::int AS n FROM conta_contabil`
      )
      const [filha] = await tx.execute<{ codigo_pai: string }>(sql`
        SELECT pai.codigo AS codigo_pai
        FROM conta_contabil c JOIN conta_contabil pai ON pai.id = c.pai_id
        WHERE c.codigo = '7.1'
      `)
      const [raiz] = await tx.execute<{ pai_id: string | null }>(
        sql`SELECT pai_id FROM conta_contabil WHERE codigo = '3'`
      )
      expect(total.n).toBe(PLANO_DE_CONTAS.length)
      expect(filha.codigo_pai).toBe('7')
      expect(raiz.pai_id).toBeNull()
    })
  })

  it('registra a criacao na auditoria', async () => {
    const { tenantId } = await novaEmpresa()

    await comTenant(tenantId, async (tx) => {
      const [registro] = await tx.execute<{ acao: string, entidade: string }>(
        sql`SELECT acao, entidade FROM auditoria WHERE entidade = 'tenant'`
      )
      expect(registro.acao).toBe('CRIACAO')
    })
  })

  it('recusa CNPJ com tamanho invalido', async () => {
    await expect(novaEmpresa({ cnpj: '123' })).rejects.toBeInstanceOf(EntradaInvalida)
  })

  it('aceita CNPJ formatado e guarda so digitos', async () => {
    const { tenantId } = await novaEmpresa({ cnpj: '12.345.678/0001-95' })

    await comTenant(tenantId, async (tx) => {
      const [empresa] = await tx.execute<{ cnpj: string }>(sql`SELECT cnpj FROM empresa`)
      expect(empresa.cnpj).toBe('12345678000195')
    })
  })

  it('recusa CNPJ ja cadastrado em outra empresa', async () => {
    await novaEmpresa({ cnpj: '98.765.432/0001-10' })
    await expect(novaEmpresa({ cnpj: '98765432000110' })).rejects.toBeInstanceOf(CnpjJaCadastrado)
  })

  it('recusa segmento desconhecido', async () => {
    await expect(
      novaEmpresa({ segmento: 'inexistente' as never })
    ).rejects.toBeInstanceOf(EntradaInvalida)
  })
})

describe('isolamento entre empresas criadas', () => {
  it('uma empresa nao enxerga a categoria da outra', async () => {
    const a = await novaEmpresa({ segmento: 'padaria' })
    const b = await novaEmpresa({ segmento: 'adega' })

    await comTenant(a.tenantId, async (tx) => {
      const nomes = await tx.execute<{ nome: string }>(sql`SELECT nome FROM categoria`)
      expect(nomes.map((n) => n.nome)).toContain('Pães')
      expect(nomes.map((n) => n.nome)).not.toContain('Cervejas')
    })

    await comTenant(b.tenantId, async (tx) => {
      const nomes = await tx.execute<{ nome: string }>(sql`SELECT nome FROM categoria`)
      expect(nomes.map((n) => n.nome)).toContain('Cervejas')
      expect(nomes.map((n) => n.nome)).not.toContain('Pães')
    })
  })

  it('sem contexto de tenant o banco nao devolve categoria alguma', async () => {
    await novaEmpresa()
    const vazio = await db.execute<{ n: number }>(sql`SELECT count(*)::int AS n FROM categoria`)
    expect(vazio[0].n).toBe(0)
  })
})

describe('autenticar apos o onboarding', () => {
  it('entra com o e-mail e a senha cadastrados', async () => {
    const { email, tenantId } = await novaEmpresa()
    const resultado = await autenticar({ email, senha: SENHA })

    expect(resultado.sessao).not.toBeNull()
    expect(resultado.sessao?.tenantId).toBe(tenantId)
    expect(resultado.sessao?.permissoes).toContain('RELATORIO_DRE')
    expect(resultado.sessao?.permissoes).toContain('USUARIO_GERENCIAR')
  })

  it('aceita e-mail com caixa diferente', async () => {
    const { email } = await novaEmpresa()
    const resultado = await autenticar({ email: email.toUpperCase(), senha: SENHA })
    expect(resultado.sessao).not.toBeNull()
  })

  it('recusa senha errada', async () => {
    const { email } = await novaEmpresa()
    await expect(autenticar({ email, senha: 'errada' })).rejects.toBeInstanceOf(CredenciaisInvalidas)
  })

  it('recusa e-mail inexistente', async () => {
    await expect(
      autenticar({ email: 'ninguem@exemplo.com.br', senha: SENHA })
    ).rejects.toBeInstanceOf(CredenciaisInvalidas)
  })

  it('recusa usuario desativado', async () => {
    const { email, tenantId, usuarioId } = await novaEmpresa()
    await comTenant(tenantId, async (tx) => {
      await tx.execute(sql`UPDATE usuario SET ativo = false WHERE id = ${usuarioId}::uuid`)
    })
    await expect(autenticar({ email, senha: SENHA })).rejects.toBeInstanceOf(CredenciaisInvalidas)
  })

  it('registra o ultimo login', async () => {
    const { email, tenantId, usuarioId } = await novaEmpresa()
    await autenticar({ email, senha: SENHA })

    await comTenant(tenantId, async (tx) => {
      const [usuario] = await tx.execute<{ ultimo_login_em: string | null }>(
        sql`SELECT ultimo_login_em FROM usuario WHERE id = ${usuarioId}::uuid`
      )
      expect(usuario.ultimo_login_em).not.toBeNull()
    })
  })

  it('pede escolha de empresa quando o e-mail existe em duas', async () => {
    const marca = randomUUID().slice(0, 8)
    const email = `dupla-${marca}@exemplo.com.br`
    await novaEmpresa({ responsavelEmail: email, razaoSocial: 'Padaria Um' })
    await novaEmpresa({ responsavelEmail: email, razaoSocial: 'Adega Dois', segmento: 'adega' })

    const resultado = await autenticar({ email, senha: SENHA })
    expect(resultado.sessao).toBeNull()
    expect(resultado.empresas).toHaveLength(2)
  })

  it('entra na empresa escolhida quando o e-mail existe em duas', async () => {
    const marca = randomUUID().slice(0, 8)
    const email = `dupla2-${marca}@exemplo.com.br`
    const primeira = await novaEmpresa({ responsavelEmail: email })
    await novaEmpresa({ responsavelEmail: email, segmento: 'adega' })

    const resultado = await autenticar({ email, senha: SENHA, tenantId: primeira.tenantId })
    expect(resultado.sessao?.tenantId).toBe(primeira.tenantId)
  })
})
