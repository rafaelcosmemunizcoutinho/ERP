import { verify } from '@node-rs/argon2'

export async function verificarSenha (hashArmazenado: string, senha: string): Promise<boolean> {
  try {
    return await verify(hashArmazenado, senha)
  } catch {
    return false
  }
}
