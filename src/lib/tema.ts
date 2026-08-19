export const TEMAS = ['sistema', 'claro', 'escuro'] as const
export type Tema = typeof TEMAS[number]

export const CHAVE_TEMA = 'erp-tema'

export function ehTema (valor: unknown): valor is Tema {
  return typeof valor === 'string' && (TEMAS as readonly string[]).includes(valor)
}

export function resolverEscuro (tema: Tema, prefereEscuro: boolean): boolean {
  if (tema === 'escuro') return true
  if (tema === 'claro') return false
  return prefereEscuro
}
