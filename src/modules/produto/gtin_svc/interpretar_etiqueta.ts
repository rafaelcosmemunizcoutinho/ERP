import { validarGtin } from './validar_gtin'

type ConteudoEtiqueta = 'peso' | 'valor'

interface ConfigEtiqueta {
  prefixo: string
  conteudo: ConteudoEtiqueta
}

interface EtiquetaBalanca {
  codigoProduto: string
  /** Quilos, com tres casas. Presente quando a balanca grava peso. */
  peso?: number
  /** Reais, com duas casas. Presente quando a balanca grava valor. */
  valor?: number
}

const TAMANHO = 13
const INICIO_CODIGO = 1
const FIM_CODIGO = 7

/**
 * Etiqueta pesavel e um EAN-13 que a balanca do setor imprime: o prefixo marca
 * que o codigo e interno da loja, seis digitos identificam o produto e cinco
 * carregam o peso em gramas ou o valor em centavos.
 *
 * Devolve null quando nao e etiqueta de balanca - inclusive para um EAN-13
 * comum de industria, que precisa seguir o caminho normal de busca.
 */
export function interpretarEtiqueta (
  codigo: string,
  config: ConfigEtiqueta
): EtiquetaBalanca | null {
  const limpo = codigo.trim()

  if (limpo.length !== TAMANHO) return null
  if (!/^\d{13}$/.test(limpo)) return null
  if (limpo[0] !== config.prefixo) return null
  if (!validarGtin(limpo)) return null

  const codigoProduto = limpo.slice(INICIO_CODIGO, FIM_CODIGO)
  const bruto = Number(limpo.slice(FIM_CODIGO, TAMANHO - 1))

  return config.conteudo === 'peso'
    ? { codigoProduto, peso: bruto / 1000 }
    : { codigoProduto, valor: bruto / 100 }
}
