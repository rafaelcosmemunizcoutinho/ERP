'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ErroDominio } from '@/lib/erros'
import { _ouUndefined } from '@/lib/form'
import { t } from '@/i18n'
import { exigirSessao } from '@/modules/auth/permissao_svc/exigir_sessao'
import { atualizarCategoria } from './categoria_svc/atualizar_categoria'
import { criarCategoria } from './categoria_svc/criar_categoria'
import type { EstadoCategoria } from './estado'

function _inteiroOuNulo (valor: FormDataEntryValue | null): number | null {
  const texto = _ouUndefined(valor)
  return texto === undefined ? null : Number(texto)
}

export async function salvarCategoriaAction (
  _anterior: EstadoCategoria,
  dados: FormData
): Promise<EstadoCategoria> {
  const id = _ouUndefined(dados.get('id'))

  try {
    const sessao = await exigirSessao('PRODUTO_ALTERAR')
    const contexto = { tenantId: sessao.tenantId, usuarioId: sessao.sub }

    const entrada = {
      nome: String(dados.get('nome') ?? ''),
      perecivel: dados.get('perecivel') === 'on',
      diasAlertaCritico: _inteiroOuNulo(dados.get('diasAlertaCritico')),
      diasAlertaAtencao: _inteiroOuNulo(dados.get('diasAlertaAtencao')),
      ativo: dados.get('ativo') === 'on'
    }

    if (id === undefined) {
      await criarCategoria(contexto, entrada)
    } else {
      await atualizarCategoria(contexto, id, entrada)
    }
  } catch (erro) {
    if (erro instanceof ErroDominio) return { erro: erro.mensagem }
    return { erro: t('auth', 'erro.generico') }
  }

  revalidatePath('/categorias')
  redirect('/categorias')
}
