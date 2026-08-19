import { cookies } from 'next/headers'
import { NOME_COOKIE, _verificar, type Sessao } from './_token'

export async function lerSessao (): Promise<Sessao | null> {
  const token = (await cookies()).get(NOME_COOKIE)?.value
  if (token === undefined || token === '') return null
  return await _verificar(token)
}
