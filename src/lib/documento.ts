type TipoParceiro = 'PF' | 'PJ'

export function limparDocumento (valor: string): string {
  return valor.replace(/[^0-9A-Za-z]/g, '').toUpperCase()
}

function _digitosVerificadores (base: string, pesoInicial: number): string {
  let resultado = ''

  for (let rodada = 0; rodada < 2; rodada++) {
    const corpo = base + resultado
    let peso = pesoInicial + rodada
    let soma = 0

    for (const caractere of corpo) {
      // O CNPJ alfanumerico usa o valor ASCII menos 48. Para digito isso da o
      // proprio numero, o que mantem o algoritmo compativel com o formato antigo.
      soma += (caractere.charCodeAt(0) - 48) * peso
      peso = peso === 2 ? 9 : peso - 1
    }

    const resto = soma % 11
    resultado += resto < 2 ? '0' : String(11 - resto)
  }

  return resultado
}

export function validarCpf (valor: string): boolean {
  const cpf = limparDocumento(valor)
  if (!/^\d{11}$/.test(cpf)) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false

  return _digitosVerificadores(cpf.slice(0, 9), 10) === cpf.slice(9)
}

export function validarCnpj (valor: string): boolean {
  const cnpj = limparDocumento(valor)
  if (!/^[0-9A-Z]{12}\d{2}$/.test(cnpj)) return false
  if (/^(\d)\1{13}$/.test(cnpj)) return false

  return _digitosVerificadores(cnpj.slice(0, 12), 5) === cnpj.slice(12)
}

export function validarDocumento (tipo: TipoParceiro, valor: string): boolean {
  return tipo === 'PF' ? validarCpf(valor) : validarCnpj(valor)
}

export function formatarDocumento (tipo: TipoParceiro, valor: string): string {
  const documento = limparDocumento(valor)

  if (tipo === 'PF' && documento.length === 11) {
    return documento.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
  }

  if (tipo === 'PJ' && documento.length === 14) {
    return documento.replace(
      /^([0-9A-Z]{2})([0-9A-Z]{3})([0-9A-Z]{3})([0-9A-Z]{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    )
  }

  return documento
}
