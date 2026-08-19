import { sql } from 'drizzle-orm'
import { comTenant, type Contexto } from '@/db/client'
import { violouUnicidade } from '@/lib/erro_postgres'
import { Conflito, NaoEncontrado } from '@/lib/erros'
import { _validarCategoria, type DadosCategoria } from './_validar'

export async function atualizarCategoria (
  contexto: Contexto,
  id: string,
  dados: DadosCategoria
): Promise<void> {
  const valido = _validarCategoria(dados)

  try {
    await comTenant(contexto, async (tx) => {
      const alteradas = await tx.execute<{ id: string }>(sql`
        UPDATE categoria
        SET nome = ${valido.nome},
            perecivel = ${valido.perecivel},
            dias_alerta_critico = ${valido.diasAlertaCritico},
            dias_alerta_atencao = ${valido.diasAlertaAtencao},
            ativo = ${valido.ativo ?? true},
            updated_at = now()
        WHERE id = ${id}::uuid
        RETURNING id
      `)

      // Sob RLS, um id de outro tenant nao levanta erro: simplesmente nao
      // encontra linha. Sem esta checagem o usuario veria "salvo" sem ter salvo.
      if (alteradas.length === 0) throw new NaoEncontrado('Categoria não encontrada.')
    })
  } catch (erro) {
    if (violouUnicidade(erro, 'categoria_tenant_nome_uq')) {
      throw new Conflito('Já existe uma categoria com este nome.')
    }
    throw erro
  }
}
