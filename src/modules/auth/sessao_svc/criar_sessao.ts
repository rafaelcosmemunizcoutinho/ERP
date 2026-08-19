import { cookies } from 'next/headers'
import { NOME_COOKIE, _assinar, type Sessao } from './_token'

const OITO_HORAS_EM_SEGUNDOS = 8 * 60 * 60

export async function criarSessao (sessao: Sessao): Promise<void> {
  const token = await _assinar(sessao)
  const armazem = await cookies()
  armazem.set(NOME_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: OITO_HORAS_EM_SEGUNDOS
  })
}
