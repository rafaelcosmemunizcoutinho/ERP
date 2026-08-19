// @vitest-environment node
import { randomUUID } from 'node:crypto'
import { sql } from 'drizzle-orm'
import { afterAll, describe, expect, it } from 'vitest'
import { comTenant } from '@/db/client'
import { limparTenants } from '@/testes/limpar_tenant'
import { Conflito, EntradaInvalida, NaoEncontrado } from '@/lib/erros'
import { criarEmpresa } from '@/modules/onboarding/criar_empresa_svc/criar_empresa'
import { atualizarCategoria } from './atualizar_categoria'
import { criarCategoria } from './criar_categoria'
import { listarCategorias } from './listar_categorias'

const criados: string[] = []

async function novaEmpresa (segmento: 'padaria' | 'adega' = 'padaria'): Promise<{
  tenantId: string
  usuarioId: string
}> {
  const marca = randomUUID().slice(0, 8)
  const criada = await criarEmpresa({
    razaoSocial: `Loja ${marca}`,
    segmento,
    responsavelNome: 'Teste',
    responsavelEmail: `cat-${marca}@exemplo.com.br`,
    senha: 'senha-de-teste-forte-123'
  })
  criados.push(criada.tenantId)
  return { tenantId: criada.tenantId, usuarioId: criada.usuarioId }
}

afterAll(async () => { await limparTenants(criados) })

describe('listarCategorias', () => {
  it('devolve as categorias do template na ordem semeada', async () => {
    const { tenantId } = await novaEmpresa()
    const categorias = await listarCategorias(tenantId)

    expect(categorias).toHaveLength(7)
    expect(categorias[0].nome).toBe('Pães')
    expect(categorias[0].dias_alerta_critico).toBe(1)
  })

  it('conta os produtos de cada categoria', async () => {
    const { tenantId } = await novaEmpresa()
    const [categorias] = await listarCategorias(tenantId)

    await comTenant(tenantId, async (tx) => {
      await tx.execute(sql`
        INSERT INTO produto (tenant_id, categoria_id, codigo, nome)
        VALUES (app_tenant_id(), ${categorias.id}::uuid, 'P001', 'Pão francês')
      `)
    })

    const depois = await listarCategorias(tenantId)
    expect(depois.find((c) => c.id === categorias.id)?.produtos).toBe(1)
  })

  it('nao devolve categoria de outro tenant', async () => {
    const a = await novaEmpresa('padaria')
    const b = await novaEmpresa('adega')

    const deA = await listarCategorias(a.tenantId)
    expect(deA.map((c) => c.nome)).toContain('Pães')
    expect(deA.map((c) => c.nome)).not.toContain('Cervejas')

    const deB = await listarCategorias(b.tenantId)
    expect(deB.map((c) => c.nome)).toContain('Cervejas')
    expect(deB.map((c) => c.nome)).not.toContain('Pães')
  })
})

describe('criarCategoria', () => {
  it('cria e devolve o id', async () => {
    const contexto = await novaEmpresa()
    const id = await criarCategoria(contexto, {
      nome: 'Sorvetes',
      perecivel: true,
      diasAlertaCritico: 60,
      diasAlertaAtencao: 120
    })

    const categorias = await listarCategorias(contexto.tenantId)
    expect(categorias.find((c) => c.id === id)?.nome).toBe('Sorvetes')
  })

  it('coloca a nova categoria no fim da ordem', async () => {
    const contexto = await novaEmpresa()
    const id = await criarCategoria(contexto, {
      nome: 'Descartáveis', perecivel: false, diasAlertaCritico: null, diasAlertaAtencao: null
    })

    const categorias = await listarCategorias(contexto.tenantId)
    expect(categorias[categorias.length - 1].id).toBe(id)
  })

  it('recusa nome repetido, sem diferenciar maiuscula', async () => {
    const contexto = await novaEmpresa()
    await expect(criarCategoria(contexto, {
      nome: 'pÃes', perecivel: false, diasAlertaCritico: null, diasAlertaAtencao: null
    })).rejects.toBeInstanceOf(Conflito)
  })

  it('permite o mesmo nome em tenants diferentes', async () => {
    const a = await novaEmpresa()
    const b = await novaEmpresa('adega')

    await criarCategoria(a, {
      nome: 'Sorvetes', perecivel: false, diasAlertaCritico: null, diasAlertaAtencao: null
    })
    await expect(criarCategoria(b, {
      nome: 'Sorvetes', perecivel: false, diasAlertaCritico: null, diasAlertaAtencao: null
    })).resolves.toBeTruthy()
  })

  it('recusa perecivel sem faixa, antes de tocar o banco', async () => {
    const contexto = await novaEmpresa()
    await expect(criarCategoria(contexto, {
      nome: 'Iogurtes', perecivel: true, diasAlertaCritico: null, diasAlertaAtencao: null
    })).rejects.toBeInstanceOf(EntradaInvalida)
  })

  it('registra a criacao na auditoria', async () => {
    const contexto = await novaEmpresa()
    const id = await criarCategoria(contexto, {
      nome: 'Sorvetes', perecivel: false, diasAlertaCritico: null, diasAlertaAtencao: null
    })

    await comTenant(contexto.tenantId, async (tx) => {
      const [registro] = await tx.execute<{ usuario_id: string }>(sql`
        SELECT usuario_id FROM auditoria
        WHERE entidade = 'categoria' AND entidade_id = ${id} AND acao = 'CRIACAO'
      `)
      expect(registro.usuario_id).toBe(contexto.usuarioId)
    })
  })
})

describe('atualizarCategoria', () => {
  it('altera a faixa de vencimento', async () => {
    const contexto = await novaEmpresa()
    const [pao] = await listarCategorias(contexto.tenantId)

    await atualizarCategoria(contexto, pao.id, {
      nome: 'Pães', perecivel: true, diasAlertaCritico: 2, diasAlertaAtencao: 5, ativo: true
    })

    const depois = await listarCategorias(contexto.tenantId)
    expect(depois.find((c) => c.id === pao.id)?.dias_alerta_critico).toBe(2)
  })

  it('limpa as faixas ao deixar de ser perecivel', async () => {
    const contexto = await novaEmpresa()
    const [pao] = await listarCategorias(contexto.tenantId)

    await atualizarCategoria(contexto, pao.id, {
      nome: 'Pães', perecivel: false, diasAlertaCritico: 1, diasAlertaAtencao: 2, ativo: true
    })

    const atualizada = (await listarCategorias(contexto.tenantId)).find((c) => c.id === pao.id)
    expect(atualizada?.perecivel).toBe(false)
    expect(atualizada?.dias_alerta_critico).toBeNull()
  })

  it('desativa sem apagar', async () => {
    const contexto = await novaEmpresa()
    const [pao] = await listarCategorias(contexto.tenantId)

    await atualizarCategoria(contexto, pao.id, {
      nome: 'Pães', perecivel: true, diasAlertaCritico: 1, diasAlertaAtencao: 2, ativo: false
    })

    expect((await listarCategorias(contexto.tenantId)).find((c) => c.id === pao.id)?.ativo).toBe(false)
  })

  it('avisa quando o id nao existe, em vez de fingir que salvou', async () => {
    const contexto = await novaEmpresa()
    await expect(atualizarCategoria(contexto, randomUUID(), {
      nome: 'Qualquer', perecivel: false, diasAlertaCritico: null, diasAlertaAtencao: null
    })).rejects.toBeInstanceOf(NaoEncontrado)
  })

  it('NAO altera categoria de outro tenant, e avisa', async () => {
    const a = await novaEmpresa('padaria')
    const b = await novaEmpresa('adega')
    const [deB] = await listarCategorias(b.tenantId)

    await expect(atualizarCategoria(a, deB.id, {
      nome: 'Invadida', perecivel: false, diasAlertaCritico: null, diasAlertaAtencao: null
    })).rejects.toBeInstanceOf(NaoEncontrado)

    expect((await listarCategorias(b.tenantId)).find((c) => c.id === deB.id)?.nome).toBe(deB.nome)
  })

  it('registra a alteracao com o antes e o depois', async () => {
    const contexto = await novaEmpresa()
    const [pao] = await listarCategorias(contexto.tenantId)

    await atualizarCategoria(contexto, pao.id, {
      nome: 'Pães e broas', perecivel: true, diasAlertaCritico: 1, diasAlertaAtencao: 2, ativo: true
    })

    await comTenant(contexto.tenantId, async (tx) => {
      const [registro] = await tx.execute<{
        dados_anteriores: Record<string, unknown>
        dados_novos: Record<string, unknown>
      }>(sql`
        SELECT dados_anteriores, dados_novos FROM auditoria
        WHERE entidade = 'categoria' AND entidade_id = ${pao.id} AND acao = 'ALTERACAO'
      `)
      expect(registro.dados_anteriores.nome).toBe('Pães')
      expect(registro.dados_novos.nome).toBe('Pães e broas')
    })
  })
})
