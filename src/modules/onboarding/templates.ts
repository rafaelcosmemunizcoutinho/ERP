export type Segmento = 'padaria' | 'hortifruti' | 'mercearia' | 'adega' | 'outro'

interface CategoriaModelo {
  nome: string
  perecivel: boolean
  diasAlertaCritico: number | null
  diasAlertaAtencao: number | null
}

interface ContaModelo {
  codigo: string
  nome: string
  natureza: 'receita' | 'despesa'
  grupoDre: string
  lancavel: boolean
}

interface Template {
  rotulo: string
  descricao: string
  categorias: CategoriaModelo[]
}

const DIARIO = { perecivel: true, diasAlertaCritico: 1, diasAlertaAtencao: 2 } as const
const CURTO = { perecivel: true, diasAlertaCritico: 3, diasAlertaAtencao: 7 } as const
const MEDIO = { perecivel: true, diasAlertaCritico: 15, diasAlertaAtencao: 30 } as const
const LONGO = { perecivel: true, diasAlertaCritico: 30, diasAlertaAtencao: 90 } as const
const DURAVEL = { perecivel: false, diasAlertaCritico: null, diasAlertaAtencao: null } as const

export const SEGMENTOS: Segmento[] = ['padaria', 'hortifruti', 'mercearia', 'adega', 'outro']

export const TEMPLATES: Record<Segmento, Template> = {
  padaria: {
    rotulo: 'Padaria',
    descricao: 'Pães e confeitaria com validade de horas, mais mercearia de apoio.',
    categorias: [
      { nome: 'Pães', ...DIARIO },
      { nome: 'Confeitaria', ...DIARIO },
      { nome: 'Salgados', ...DIARIO },
      { nome: 'Frios e laticínios', ...CURTO },
      { nome: 'Insumos de produção', ...MEDIO },
      { nome: 'Bebidas', ...LONGO },
      { nome: 'Mercearia', ...LONGO }
    ]
  },
  hortifruti: {
    rotulo: 'Hortifrúti',
    descricao: 'Frutas, verduras e legumes vendidos por peso, com perda diária alta.',
    categorias: [
      { nome: 'Verduras', ...CURTO },
      { nome: 'Legumes', ...CURTO },
      { nome: 'Frutas', ...CURTO },
      { nome: 'Ovos', ...MEDIO },
      { nome: 'Temperos', ...MEDIO },
      { nome: 'Mercearia', ...LONGO },
      { nome: 'Embalagens', ...DURAVEL }
    ]
  },
  mercearia: {
    rotulo: 'Mercearia',
    descricao: 'Industrializados de giro médio, com frios e bebidas.',
    categorias: [
      { nome: 'Padaria', ...DIARIO },
      { nome: 'Frios e laticínios', ...CURTO },
      { nome: 'Mercearia seca', ...LONGO },
      { nome: 'Congelados', ...LONGO },
      { nome: 'Bebidas', ...LONGO },
      { nome: 'Limpeza', ...DURAVEL },
      { nome: 'Higiene', ...DURAVEL }
    ]
  },
  adega: {
    rotulo: 'Adega',
    descricao: 'Bebidas em fardo e unidade, com gelo e petiscos.',
    categorias: [
      { nome: 'Cervejas', ...LONGO },
      { nome: 'Refrigerantes', ...LONGO },
      { nome: 'Águas e sucos', ...LONGO },
      { nome: 'Petiscos', ...LONGO },
      { nome: 'Destilados', ...DURAVEL },
      { nome: 'Vinhos', ...DURAVEL },
      { nome: 'Gelo', ...DURAVEL }
    ]
  },
  outro: {
    rotulo: 'Outro comércio',
    descricao: 'Estrutura mínima, para montar as categorias do seu jeito.',
    categorias: [
      { nome: 'Geral', ...DURAVEL },
      { nome: 'Perecíveis', ...CURTO },
      { nome: 'Bebidas', ...LONGO }
    ]
  }
}

export const PLANO_DE_CONTAS: ContaModelo[] = [
  { codigo: '3', nome: 'Receitas', natureza: 'receita', grupoDre: 'receita_bruta', lancavel: false },
  { codigo: '3.1', nome: 'Vendas de mercadorias', natureza: 'receita', grupoDre: 'receita_bruta', lancavel: true },
  { codigo: '3.2', nome: 'Outras receitas', natureza: 'receita', grupoDre: 'outras_receitas', lancavel: true },
  { codigo: '4', nome: 'Deduções da receita', natureza: 'despesa', grupoDre: 'deducoes', lancavel: false },
  { codigo: '4.1', nome: 'Simples Nacional', natureza: 'despesa', grupoDre: 'deducoes', lancavel: true },
  { codigo: '4.2', nome: 'Devoluções e descontos', natureza: 'despesa', grupoDre: 'deducoes', lancavel: true },
  { codigo: '5', nome: 'Custo das mercadorias vendidas', natureza: 'despesa', grupoDre: 'cmv', lancavel: false },
  { codigo: '5.1', nome: 'CMV', natureza: 'despesa', grupoDre: 'cmv', lancavel: true },
  { codigo: '5.2', nome: 'Perdas de estoque', natureza: 'despesa', grupoDre: 'perdas', lancavel: true },
  { codigo: '6', nome: 'Despesas com pessoal', natureza: 'despesa', grupoDre: 'despesa_pessoal', lancavel: false },
  { codigo: '6.1', nome: 'Salários', natureza: 'despesa', grupoDre: 'despesa_pessoal', lancavel: true },
  { codigo: '6.2', nome: 'Encargos e benefícios', natureza: 'despesa', grupoDre: 'despesa_pessoal', lancavel: true },
  { codigo: '6.3', nome: 'Pró-labore', natureza: 'despesa', grupoDre: 'despesa_pessoal', lancavel: true },
  { codigo: '7', nome: 'Despesas operacionais', natureza: 'despesa', grupoDre: 'despesa_operacional', lancavel: false },
  { codigo: '7.1', nome: 'Aluguel', natureza: 'despesa', grupoDre: 'despesa_operacional', lancavel: true },
  { codigo: '7.2', nome: 'Energia elétrica', natureza: 'despesa', grupoDre: 'despesa_operacional', lancavel: true },
  { codigo: '7.3', nome: 'Água', natureza: 'despesa', grupoDre: 'despesa_operacional', lancavel: true },
  { codigo: '7.4', nome: 'Gás', natureza: 'despesa', grupoDre: 'despesa_operacional', lancavel: true },
  { codigo: '7.5', nome: 'Internet e telefone', natureza: 'despesa', grupoDre: 'despesa_operacional', lancavel: true },
  { codigo: '7.6', nome: 'Manutenção', natureza: 'despesa', grupoDre: 'despesa_operacional', lancavel: true },
  { codigo: '7.7', nome: 'Embalagens e descartáveis', natureza: 'despesa', grupoDre: 'despesa_operacional', lancavel: true },
  { codigo: '8', nome: 'Despesas administrativas', natureza: 'despesa', grupoDre: 'despesa_administrativa', lancavel: false },
  { codigo: '8.1', nome: 'Contabilidade', natureza: 'despesa', grupoDre: 'despesa_administrativa', lancavel: true },
  { codigo: '8.2', nome: 'Software e assinaturas', natureza: 'despesa', grupoDre: 'despesa_administrativa', lancavel: true },
  { codigo: '9', nome: 'Despesas financeiras', natureza: 'despesa', grupoDre: 'despesa_financeira', lancavel: false },
  { codigo: '9.1', nome: 'Taxas de cartão', natureza: 'despesa', grupoDre: 'despesa_financeira', lancavel: true },
  { codigo: '9.2', nome: 'Tarifas bancárias', natureza: 'despesa', grupoDre: 'despesa_financeira', lancavel: true },
  { codigo: '9.3', nome: 'Juros e multas', natureza: 'despesa', grupoDre: 'despesa_financeira', lancavel: true }
]
