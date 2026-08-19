import auth from './locales/pt/auth.json'
import comum from './locales/pt/comum.json'

const LOCALE_PADRAO = 'pt' as const

const dicionarios = { auth, comum } as const

type Dicionarios = typeof dicionarios
type Namespace = keyof Dicionarios

type Caminhos<T> = T extends string
  ? []
  : { [K in keyof T]: [K, ...Caminhos<T[K]>] }[keyof T]

type Junta<T extends readonly unknown[]> = T extends readonly [infer A, ...infer R]
  ? R extends readonly []
    ? `${A & string}`
    : `${A & string}.${Junta<R>}`
  : never

type Chave<N extends Namespace> = Junta<Caminhos<Dicionarios[N]>>

export function t<N extends Namespace> (
  namespace: N,
  chave: Chave<N>,
  valores?: Record<string, string | number>
): string {
  const valor = chave
    .split('.')
    .reduce<unknown>((atual, parte) => (atual as Record<string, unknown>)?.[parte], dicionarios[namespace])

  if (typeof valor !== 'string') {
    throw new Error(`Chave de traducao ausente: ${namespace}.${chave} (${LOCALE_PADRAO})`)
  }

  if (valores === undefined) return valor

  return valor.replace(/\{\{(\w+)\}\}/g, (original, nome: string) =>
    nome in valores ? String(valores[nome]) : original
  )
}
