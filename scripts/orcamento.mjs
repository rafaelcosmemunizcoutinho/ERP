import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { join } from 'node:path'

const LIMITE_JS_COMPARTILHADO_KB = 120
const LIMITE_ROTA_KB = 40

const raiz = join(process.cwd(), '.next')

function kb (caminho) {
  try {
    return gzipSync(readFileSync(join(raiz, caminho))).length / 1024
  } catch {
    return 0
  }
}

function somar (arquivos) {
  return arquivos.filter((a) => a.endsWith('.js')).reduce((total, a) => total + kb(a), 0)
}

const manifesto = JSON.parse(readFileSync(join(raiz, 'app-build-manifest.json'), 'utf8'))
const rotas = Object.entries(manifesto.pages)

const compartilhados = rotas
  .map(([, arquivos]) => new Set(arquivos))
  .reduce((comum, atual) => new Set([...comum].filter((a) => atual.has(a))))

const jsCompartilhado = somar([...compartilhados])

let falhou = false

function verificar (rotulo, valor, limite) {
  const ok = valor <= limite
  if (!ok) falhou = true
  console.log(
    `${ok ? 'OK   ' : 'FALHA'} ${valor.toFixed(1).padStart(6)} kB / ${limite} kB  ${rotulo}`,
  )
}

verificar('JS compartilhado por todas as rotas', jsCompartilhado, LIMITE_JS_COMPARTILHADO_KB)

for (const [rota, arquivos] of rotas) {
  const proprios = arquivos.filter((a) => !compartilhados.has(a))
  verificar(`rota ${rota}`, somar(proprios), LIMITE_ROTA_KB)
}

if (falhou) {
  console.error(
    '\nOrcamento estourado. O sistema roda em maquina modesta de balcao:\n' +
      'ou o peso volta para dentro do limite, ou o limite sobe com justificativa no PR.',
  )
  process.exit(1)
}

console.log('\nOrcamento de performance respeitado.')
