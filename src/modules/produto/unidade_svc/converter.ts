type TipoProduto = 'unitario' | 'pesavel'

export const UNIDADES_ESTOQUE = ['UN', 'KG'] as const
export const UNIDADES_COMPRA = ['CX', 'FD', 'PC', 'DP', 'SC'] as const

export const ROTULOS_UNIDADE: Record<string, string> = {
  UN: 'Unidade',
  KG: 'Quilo',
  CX: 'Caixa',
  FD: 'Fardo',
  PC: 'Pacote',
  DP: 'Display',
  SC: 'Saco'
}

/** Casas decimais do saldo: peso e fracionario, unidade nao. */
export function casasDecimais (tipo: TipoProduto): number {
  return tipo === 'pesavel' ? 3 : 0
}

export function arredondarEstoque (quantidade: number, tipo: TipoProduto): number {
  const fator = 10 ** casasDecimais(tipo)
  return Math.round(quantidade * fator) / fator
}

/**
 * Converte a quantidade comprada (fardo, caixa) para a unidade em que o
 * estoque e guardado. O estoque vive SEMPRE na menor unidade: comprar 3 fardos
 * de 12 entra como 36 unidades, nunca como 3.
 */
export function paraUnidadeEstoque (
  quantidade: number,
  fatorConversao: number,
  tipo: TipoProduto = 'unitario'
): number {
  if (!Number.isFinite(quantidade) || quantidade < 0) {
    throw new Error('Quantidade precisa ser um número não negativo.')
  }
  if (!Number.isFinite(fatorConversao) || fatorConversao <= 0) {
    throw new Error('Fator de conversão precisa ser maior que zero.')
  }
  return arredondarEstoque(quantidade * fatorConversao, tipo)
}

/** Caminho inverso: quantos fardos equivalem ao saldo guardado. */
export function deUnidadeEstoque (quantidade: number, fatorConversao: number): number {
  if (!Number.isFinite(fatorConversao) || fatorConversao <= 0) {
    throw new Error('Fator de conversão precisa ser maior que zero.')
  }
  return quantidade / fatorConversao
}

export function formatarQuantidade (quantidade: number, unidade: string, tipo: TipoProduto): string {
  const casas = casasDecimais(tipo)
  const numero = quantidade.toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas
  })
  return `${numero} ${unidade}`
}

export function unidadeEstoquePadrao (tipo: TipoProduto): string {
  return tipo === 'pesavel' ? 'KG' : 'UN'
}
