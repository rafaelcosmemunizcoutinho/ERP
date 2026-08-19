import { EntradaInvalida } from '@/lib/erros'

export interface DadosCategoria {
  nome: string
  perecivel: boolean
  diasAlertaCritico: number | null
  diasAlertaAtencao: number | null
  ativo?: boolean
}

/**
 * Espelha as CHECK categoria_faixas_ck e categoria_perecivel_tem_faixa_ck.
 * O banco e a ultima palavra; validar aqui existe para o comerciante receber
 * uma frase em portugues em vez de um erro de constraint.
 */
export function _validarCategoria (dados: DadosCategoria): DadosCategoria {
  const nome = dados.nome.trim()
  if (nome.length < 2) throw new EntradaInvalida('O nome precisa ter pelo menos 2 letras.')
  if (nome.length > 80) throw new EntradaInvalida('O nome pode ter no máximo 80 letras.')

  const critico = dados.perecivel ? dados.diasAlertaCritico : null
  const atencao = dados.perecivel ? dados.diasAlertaAtencao : null

  if (dados.perecivel) {
    if (critico === null || !Number.isInteger(critico) || critico <= 0) {
      throw new EntradaInvalida('Produto perecível precisa de um alerta crítico em dias.')
    }
    if (atencao === null || !Number.isInteger(atencao)) {
      throw new EntradaInvalida('Produto perecível precisa de um alerta de atenção em dias.')
    }
    if (atencao <= critico) {
      throw new EntradaInvalida('O alerta de atenção precisa vir antes do crítico.')
    }
  }

  return { nome, perecivel: dados.perecivel, diasAlertaCritico: critico, diasAlertaAtencao: atencao, ativo: dados.ativo }
}
