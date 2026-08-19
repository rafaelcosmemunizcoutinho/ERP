import { redirect } from 'next/navigation'
import { NaoAutenticado, SemPermissao } from '@/lib/erros'
import { exigirSessao } from './exigir_sessao'
import type { Sessao } from '../sessao_svc/_token'

export async function protegerPagina (permissao?: string): Promise<Sessao> {
  try {
    return await exigirSessao(permissao)
  } catch (erro) {
    if (erro instanceof NaoAutenticado) redirect('/entrar')
    if (erro instanceof SemPermissao) redirect('/painel')
    throw erro
  }
}
