import { randomUUID } from 'node:crypto'
import { sql } from 'drizzle-orm'
import { comTenant } from '@/db/client'
import { violouUnicidade } from '@/lib/erro_postgres'
import { CnpjJaCadastrado, EntradaInvalida } from '@/lib/erros'
import { criarHash } from '@/modules/auth/senha_svc/criar_hash'
import { PLANO_DE_CONTAS, TEMPLATES, type Segmento } from '../templates'

interface DadosEmpresa {
  razaoSocial: string
  nomeFantasia?: string
  cnpj?: string
  segmento: Segmento
  responsavelNome: string
  responsavelEmail: string
  senha: string
}

interface EmpresaCriada {
  tenantId: string
  usuarioId: string
  categorias: number
  contas: number
}

function _codigoPai (codigo: string): string | null {
  const partes = codigo.split('.')
  return partes.length === 1 ? null : partes.slice(0, -1).join('.')
}

function _soDigitos (valor: string): string {
  return valor.replace(/\D/g, '')
}

export async function criarEmpresa (dados: DadosEmpresa): Promise<EmpresaCriada> {
  const template = TEMPLATES[dados.segmento]
  if (template === undefined) throw new EntradaInvalida('Segmento não reconhecido.')

  const cnpj = dados.cnpj === undefined || dados.cnpj === '' ? null : _soDigitos(dados.cnpj)
  if (cnpj !== null && cnpj.length !== 14) {
    throw new EntradaInvalida('O CNPJ precisa ter 14 dígitos.')
  }

  const tenantId = randomUUID()
  const senhaHash = await criarHash(dados.senha)
  const email = dados.responsavelEmail.trim().toLowerCase()

  try {
    return await comTenant(tenantId, async (tx) => {
      await tx.execute(sql`
        INSERT INTO tenant (id, nome, segmento)
        VALUES (${tenantId}::uuid, ${dados.nomeFantasia ?? dados.razaoSocial}, ${dados.segmento})
      `)

      await tx.execute(sql`
        INSERT INTO empresa (tenant_id, razao_social, nome_fantasia, cnpj)
        VALUES (${tenantId}::uuid, ${dados.razaoSocial}, ${dados.nomeFantasia ?? null}, ${cnpj})
      `)

      const [usuario] = await tx.execute<{ id: string }>(sql`
        INSERT INTO usuario (tenant_id, nome, email, senha_hash)
        VALUES (${tenantId}::uuid, ${dados.responsavelNome}, ${email}, ${senhaHash})
        RETURNING id
      `)

      await tx.execute(sql`
        INSERT INTO usuario_papel (usuario_id, papel_id)
        SELECT ${usuario.id}::uuid, p.id
        FROM papel p
        WHERE p.tenant_id IS NULL AND p.codigo = 'DONO'
      `)

      for (const [ordem, categoria] of template.categorias.entries()) {
        await tx.execute(sql`
          INSERT INTO categoria
            (tenant_id, nome, perecivel, dias_alerta_critico, dias_alerta_atencao, ordem)
          VALUES (
            ${tenantId}::uuid, ${categoria.nome}, ${categoria.perecivel},
            ${categoria.diasAlertaCritico}, ${categoria.diasAlertaAtencao}, ${ordem}
          )
        `)
      }

      const idPorCodigo = new Map<string, string>()
      for (const conta of PLANO_DE_CONTAS) {
        const codigoPai = _codigoPai(conta.codigo)
        const paiId = codigoPai === null ? null : idPorCodigo.get(codigoPai) ?? null
        const [criada] = await tx.execute<{ id: string }>(sql`
          INSERT INTO conta_contabil
            (tenant_id, pai_id, codigo, nome, natureza, grupo_dre, lancavel)
          VALUES (
            ${tenantId}::uuid, ${paiId}, ${conta.codigo}, ${conta.nome},
            ${conta.natureza}, ${conta.grupoDre}, ${conta.lancavel}
          )
          RETURNING id
        `)
        idPorCodigo.set(conta.codigo, criada.id)
      }

      await tx.execute(sql`
        INSERT INTO auditoria (tenant_id, usuario_id, entidade, entidade_id, acao, dados_novos)
        VALUES (
          ${tenantId}::uuid, ${usuario.id}::uuid, 'tenant', ${tenantId}, 'CRIACAO',
          ${JSON.stringify({ segmento: dados.segmento, razaoSocial: dados.razaoSocial })}::jsonb
        )
      `)

      return {
        tenantId,
        usuarioId: usuario.id,
        categorias: template.categorias.length,
        contas: PLANO_DE_CONTAS.length
      }
    })
  } catch (erro) {
    if (violouUnicidade(erro, 'empresa_cnpj_uq')) throw new CnpjJaCadastrado()
    throw erro
  }
}
