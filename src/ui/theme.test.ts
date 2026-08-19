import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(join(process.cwd(), 'src/ui/theme.css'), 'utf8')

function tokens (bloco: 'claro' | 'escuro'): Record<string, string> {
  const marcador = bloco === 'claro' ? '@theme {' : '.dark {'
  const inicio = css.indexOf(marcador)
  const trecho = css.slice(inicio, css.indexOf('\n}', inicio))
  const mapa: Record<string, string> = {}
  for (const [, nome, valor] of trecho.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6});/g)) {
    mapa[nome] = valor
  }
  return mapa
}

function luminancia (cor: string): number {
  const canais = [1, 3, 5].map((i) => parseInt(cor.slice(i, i + 2), 16) / 255)
  const [r, g, b] = canais.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contraste (frente: string, fundo: string): number {
  const [claro, escuro] = [luminancia(frente), luminancia(fundo)].sort((a, b) => b - a)
  return (claro + 0.05) / (escuro + 0.05)
}

const PARES_TEXTO: Array<[string, string]> = [
  ['on-surface', 'surface'],
  ['on-surface', 'surface-lowest'],
  ['on-surface', 'surface-high'],
  ['on-surface-variant', 'surface'],
  ['on-surface-variant', 'surface-lowest'],
  ['on-surface-muted', 'surface-lowest'],
  ['on-primary', 'primary'],
  ['on-primary-container', 'primary-container'],
  ['on-success-container', 'success-container'],
  ['on-warning-container', 'warning-container'],
  ['on-danger-container', 'danger-container']
]

const PARES_NAO_TEXTO: Array<[string, string]> = [
  ['primary', 'surface'],
  ['primary', 'surface-lowest'],
  ['primary', 'surface-high'],
  ['outline-strong', 'surface'],
  ['outline-strong', 'surface-lowest']
]

describe.each(['claro', 'escuro'] as const)('tema %s', (tema) => {
  const t = tokens(tema)

  it('define todos os tokens de cor do tema claro', () => {
    expect(Object.keys(t).sort()).toEqual(Object.keys(tokens('claro')).sort())
  })

  it.each(PARES_TEXTO)('%s sobre %s atinge 4.5:1 (WCAG AA texto)', (frente, fundo) => {
    expect(contraste(t[frente], t[fundo])).toBeGreaterThanOrEqual(4.5)
  })

  it.each(PARES_NAO_TEXTO)('%s sobre %s atinge 3:1 (WCAG 1.4.11)', (frente, fundo) => {
    expect(contraste(t[frente], t[fundo])).toBeGreaterThanOrEqual(3)
  })
})

describe('acento', () => {
  it('nao colide com nenhuma cor semantica', () => {
    const t = tokens('claro')
    const matiz = (cor: string): number => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(cor.slice(i, i + 2), 16) / 255)
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      if (max === min) return 0
      const d = max - min
      const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
      return (h * 60 + 360) % 360
    }
    for (const semantica of ['success', 'warning', 'danger']) {
      const distancia = Math.abs(matiz(t.primary) - matiz(t[semantica]))
      expect(Math.min(distancia, 360 - distancia)).toBeGreaterThan(60)
    }
  })
})
