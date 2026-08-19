import { randomBytes } from 'node:crypto'
import { _codificarBase32 } from './_hotp'

export function gerarSegredo (): string {
  return _codificarBase32(randomBytes(20))
}
