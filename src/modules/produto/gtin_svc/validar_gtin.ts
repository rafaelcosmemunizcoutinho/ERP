const TAMANHOS_VALIDOS = [8, 12, 13, 14]

export function digitoVerificadorGtin (semDigito: string): number {
  let soma = 0
  // Da direita para a esquerda, pesos alternam 3 e 1. O peso 3 sempre cai na
  // posicao imediatamente a esquerda do digito verificador, entao a contagem
  // parte do fim - e por isso que a regra vale para EAN-8, 12, 13 e 14 igual.
  for (let i = semDigito.length - 1, peso = 3; i >= 0; i--, peso = peso === 3 ? 1 : 3) {
    soma += Number(semDigito[i]) * peso
  }
  return (10 - (soma % 10)) % 10
}

export function validarGtin (codigo: string): boolean {
  const limpo = codigo.trim()
  if (!/^\d+$/.test(limpo)) return false
  if (!TAMANHOS_VALIDOS.includes(limpo.length)) return false

  return digitoVerificadorGtin(limpo.slice(0, -1)) === Number(limpo.slice(-1))
}

export function completarGtin (semDigito: string): string {
  const limpo = semDigito.trim()
  if (!/^\d+$/.test(limpo)) throw new Error('Código de barras deve conter apenas dígitos.')
  if (!TAMANHOS_VALIDOS.includes(limpo.length + 1)) {
    throw new Error(`Código de barras com ${limpo.length + 1} dígitos não é um GTIN válido.`)
  }
  return limpo + String(digitoVerificadorGtin(limpo))
}
