import { createHmac } from 'node:crypto'

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

export function _decodificarBase32 (segredo: string): Buffer {
  const limpo = segredo.toUpperCase().replace(/=+$/, '').replace(/\s/g, '')
  let bits = ''
  for (const caractere of limpo) {
    const indice = ALFABETO.indexOf(caractere)
    if (indice === -1) throw new Error(`Caractere invalido em base32: ${caractere}`)
    bits += indice.toString(2).padStart(5, '0')
  }
  const bytes = bits.match(/.{8}/g) ?? []
  return Buffer.from(bytes.map((b) => parseInt(b, 2)))
}

export function _codificarBase32 (dados: Buffer): string {
  let bits = ''
  for (const byte of dados) bits += byte.toString(2).padStart(8, '0')
  const grupos = bits.match(/.{1,5}/g) ?? []
  return grupos.map((g) => ALFABETO[parseInt(g.padEnd(5, '0'), 2)]).join('')
}

export function _hotp (segredo: Buffer, contador: number, digitos: number): string {
  const bloco = Buffer.alloc(8)
  bloco.writeBigUInt64BE(BigInt(contador))
  const digest = createHmac('sha1', segredo).update(bloco).digest()
  const deslocamento = digest[digest.length - 1] & 0x0f
  const binario =
    ((digest[deslocamento] & 0x7f) << 24) |
    ((digest[deslocamento + 1] & 0xff) << 16) |
    ((digest[deslocamento + 2] & 0xff) << 8) |
    (digest[deslocamento + 3] & 0xff)
  return (binario % 10 ** digitos).toString().padStart(digitos, '0')
}
