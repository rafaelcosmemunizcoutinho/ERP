import { sql } from 'drizzle-orm'
import { comTenant, type Contexto } from '@/db/client'
import { violouUnicidade } from '@/lib/erro_postgres'
import { Conflito } from '@/lib/erros'
import { _validarCategoria, type DadosCategoria } from './_validar'

export async function criarCategoria (contexto: Contexto, dados: DadosCategoria): Promise<string> {
  const valido = _validarCategoria(dados)

  try {
    return await comTenant(contexto, async (tx) => {
      const [criada] = await tx.execute<{ id: string }>(sql`
        INSERT INTO categoria (tenant_id, nome, perecivel, dias_alerta_critico,
                               dias_alerta_atencao, ordem)
        VALUES (
          app_tenant_id(), ${valido.nome}, ${valido.perecivel},
          ${valido.diasAlertaCritico}, ${valido.diasAlertaAtencao},
          (SELECT coalesce(max(ordem), -1) + 1 FROM categoria)
        )
        RETURNING id
      `)
      return criada.id
    })
  } catch (erro) {
    if (violouUnicidade(erro, 'categoria_tenant_nome_uq')) {
      throw new Conflito('Já existe uma categoria com este nome.')
    }
    throw erro
  }
}
