import { timingSafeEqual } from 'node:crypto'
import { _decodificarBase32, _hotp } from './_hotp'

const PERIODO_SEGUNDOS = 30
const DIGITOS = 6
const JANELA = 1

export function verificarCodigo (segredo: string, codigo: string, agoraMs = Date.now()): boolean {
  const informado = codigo.replace(/\s/g, '')
  if (!/^\d{6}$/.test(informado)) return false

  let chave: Buffer
  try {
    chave = _decodificarBase32(segredo)
  } catch {
    return false
  }
  if (chave.length === 0) return false

  const contador = Math.floor(agoraMs / 1000 / PERIODO_SEGUNDOS)

  for (let passo = -JANELA; passo <= JANELA; passo++) {
    const alvo = contador + passo
    if (alvo < 0) continue
    const esperado = _hotp(chave, alvo, DIGITOS)
    if (timingSafeEqual(Buffer.from(esperado), Buffer.from(informado))) return true
  }
  return false
}
