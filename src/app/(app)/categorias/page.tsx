import { protegerPagina } from '@/modules/auth/permissao_svc/proteger_pagina'
import { listarCategorias } from '@/modules/categoria/categoria_svc/listar_categorias'
import { TelaCategorias } from '@/modules/categoria/components/tela-categorias'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ editar?: string, nova?: string }>
}

export default async function Categorias ({ searchParams }: Props): Promise<React.JSX.Element> {
  const sessao = await protegerPagina('PRODUTO_VISUALIZAR')
  const { editar, nova } = await searchParams

  const categorias = await listarCategorias(sessao.tenantId)
  const podeAlterar = sessao.permissoes.includes('PRODUTO_ALTERAR')

  return (
    <TelaCategorias
      categorias={categorias}
      emEdicao={categorias.find((c) => c.id === editar)}
      criando={nova === '1' && podeAlterar}
      podeAlterar={podeAlterar}
    />
  )
}
