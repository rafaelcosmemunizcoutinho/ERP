import { hash } from '@node-rs/argon2'

const PARAMETROS = { memoryCost: 19456, timeCost: 2, parallelism: 1 }

export async function criarHash (senha: string): Promise<string> {
  return await hash(senha, PARAMETROS)
}
