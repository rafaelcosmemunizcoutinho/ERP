import { describe, expect, it } from 'vitest'
import { PLANO_DE_CONTAS, SEGMENTOS, TEMPLATES } from './templates'

const GRUPOS_DRE = [
  'receita_bruta', 'deducoes', 'cmv', 'despesa_operacional', 'despesa_pessoal',
  'despesa_administrativa', 'despesa_financeira', 'outras_receitas', 'perdas'
]

describe('SEGMENTOS', () => {
  it('tem um template para cada segmento', () => {
    for (const segmento of SEGMENTOS) {
      expect(TEMPLATES[segmento]).toBeDefined()
    }
  })

  it('nao tem template orfao sem segmento', () => {
    expect(Object.keys(TEMPLATES).sort()).toEqual([...SEGMENTOS].sort())
  })
})

describe.each(SEGMENTOS)('template %s', (segmento) => {
  const template = TEMPLATES[segmento]

  it('tem rotulo e descricao', () => {
    expect(template.rotulo.length).toBeGreaterThan(0)
    expect(template.descricao.length).toBeGreaterThan(0)
  })

  it('tem pelo menos tres categorias', () => {
    expect(template.categorias.length).toBeGreaterThanOrEqual(3)
  })

  it('nao repete nome de categoria', () => {
    const nomes = template.categorias.map((c) => c.nome.toLowerCase())
    expect(new Set(nomes).size).toBe(nomes.length)
  })

  it('respeita categoria_perecivel_tem_faixa_ck: perecivel sempre tem faixa critica', () => {
    for (const categoria of template.categorias) {
      if (categoria.perecivel) expect(categoria.diasAlertaCritico).not.toBeNull()
    }
  })

  it('respeita categoria_faixas_ck: atencao vem antes de critico', () => {
    for (const categoria of template.categorias) {
      if (categoria.diasAlertaCritico === null) {
        expect(categoria.diasAlertaAtencao).toBeNull()
      } else {
        expect(categoria.diasAlertaCritico).toBeGreaterThan(0)
        expect(categoria.diasAlertaAtencao).toBeGreaterThan(categoria.diasAlertaCritico)
      }
    }
  })

  it('nao marca categoria duravel com faixa de vencimento', () => {
    for (const categoria of template.categorias) {
      if (!categoria.perecivel) expect(categoria.diasAlertaCritico).toBeNull()
    }
  })
})

describe('templates por segmento', () => {
  it('padaria alerta pao em um dia', () => {
    const pao = TEMPLATES.padaria.categorias.find((c) => c.nome === 'Pães')
    expect(pao?.diasAlertaCritico).toBe(1)
  })

  it('hortifruti alerta verdura em tres dias', () => {
    const verdura = TEMPLATES.hortifruti.categorias.find((c) => c.nome === 'Verduras')
    expect(verdura?.diasAlertaCritico).toBe(3)
  })

  it('adega trata destilado como duravel', () => {
    const destilado = TEMPLATES.adega.categorias.find((c) => c.nome === 'Destilados')
    expect(destilado?.perecivel).toBe(false)
  })
})

describe('PLANO_DE_CONTAS', () => {
  it('nao repete codigo', () => {
    const codigos = PLANO_DE_CONTAS.map((c) => c.codigo)
    expect(new Set(codigos).size).toBe(codigos.length)
  })

  it('toda conta filha tem o pai declarado antes dela', () => {
    const vistos = new Set<string>()
    for (const conta of PLANO_DE_CONTAS) {
      const partes = conta.codigo.split('.')
      if (partes.length > 1) {
        expect(vistos).toContain(partes.slice(0, -1).join('.'))
      }
      vistos.add(conta.codigo)
    }
  })

  it('respeita conta_grupo_dre_ck', () => {
    for (const conta of PLANO_DE_CONTAS) {
      expect(GRUPOS_DRE).toContain(conta.grupoDre)
    }
  })

  it('respeita conta_natureza_ck', () => {
    for (const conta of PLANO_DE_CONTAS) {
      expect(['receita', 'despesa']).toContain(conta.natureza)
    }
  })

  it('conta sintetica nao e lancavel e analitica e', () => {
    const codigos = new Set(PLANO_DE_CONTAS.map((c) => c.codigo))
    for (const conta of PLANO_DE_CONTAS) {
      const temFilha = [...codigos].some((c) => c.startsWith(`${conta.codigo}.`))
      expect(conta.lancavel).toBe(!temFilha)
    }
  })

  it('cobre o minimo para montar um DRE', () => {
    const grupos = new Set(PLANO_DE_CONTAS.map((c) => c.grupoDre))
    for (const obrigatorio of ['receita_bruta', 'deducoes', 'cmv', 'perdas']) {
      expect(grupos).toContain(obrigatorio)
    }
  })
})
