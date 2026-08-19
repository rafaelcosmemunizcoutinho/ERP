import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const FUNDO = [0x2a, 0x4b, 0xc4]
const MARCA = [0xff, 0xff, 0xff]

function crc32 (buf) {
  let c = ~0
  for (const byte of buf) {
    c ^= byte
    for (let i = 0; i < 8; i++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return ~c >>> 0
}

function bloco (tipo, dados) {
  const corpo = Buffer.concat([Buffer.from(tipo, 'ascii'), dados])
  const tamanho = Buffer.alloc(4)
  tamanho.writeUInt32BE(dados.length)
  const soma = Buffer.alloc(4)
  soma.writeUInt32BE(crc32(corpo))
  return Buffer.concat([tamanho, corpo, soma])
}

function png (lado, pixel) {
  const linhas = []
  for (let y = 0; y < lado; y++) {
    const linha = Buffer.alloc(1 + lado * 4)
    for (let x = 0; x < lado; x++) {
      const [r, g, b, a] = pixel(x, y, lado)
      linha[1 + x * 4] = r
      linha[2 + x * 4] = g
      linha[3 + x * 4] = b
      linha[4 + x * 4] = a
    }
    linhas.push(linha)
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(lado, 0)
  ihdr.writeUInt32BE(lado, 4)
  ihdr[8] = 8
  ihdr[9] = 6

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    bloco('IHDR', ihdr),
    bloco('IDAT', deflateSync(Buffer.concat(linhas), { level: 9 })),
    bloco('IEND', Buffer.alloc(0))
  ])
}

// Marca: fundo da cor primaria com tres barras brancas de larguras
// decrescentes - a leitura de um cupom, que e o que o comerciante ve o dia
// inteiro. Formas simples porque o icone e visto a 48px na barra de tarefas.
function marca (x, y, lado) {
  const u = lado / 16
  const raio = 3 * u

  const dx = Math.max(raio - x, x - (lado - raio), 0)
  const dy = Math.max(raio - y, y - (lado - raio), 0)
  if (Math.hypot(dx, dy) > raio) return [0, 0, 0, 0]

  const barras = [
    { topo: 4.5, altura: 1.3, largura: 8 },
    { topo: 7.2, altura: 1.3, largura: 6 },
    { topo: 9.9, altura: 1.3, largura: 4 }
  ]

  for (const barra of barras) {
    const dentroY = y >= barra.topo * u && y < (barra.topo + barra.altura) * u
    const dentroX = x >= 4 * u && x < (4 + barra.largura) * u
    if (dentroY && dentroX) return [...MARCA, 255]
  }

  return [...FUNDO, 255]
}

const destino = join(process.cwd(), 'public', 'icones')
mkdirSync(destino, { recursive: true })

for (const lado of [192, 512]) {
  const arquivo = join(destino, `icone-${lado}.png`)
  writeFileSync(arquivo, png(lado, marca))
  console.log(`${arquivo} (${lado}x${lado})`)
}
