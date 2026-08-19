import { NaoAutenticado, SemPermissao } from '@/lib/erros'
import { lerSessao } from '../sessao_svc/ler_sessao'
import type { Sessao } from '../sessao_svc/_token'

export async function exigirSessao (permissao?: string): Promise<Sessao> {
  const sessao = await lerSessao()
  if (sessao === null) throw new NaoAutenticado()
  if (permissao !== undefined && !sessao.permissoes.includes(permissao)) {
    throw new SemPermissao()
  }
  return sessao
}
