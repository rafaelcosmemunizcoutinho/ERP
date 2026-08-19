import { cookies } from 'next/headers'
import { NOME_COOKIE } from './_token'

export async function encerrarSessao (): Promise<void> {
  (await cookies()).delete(NOME_COOKIE)
}
