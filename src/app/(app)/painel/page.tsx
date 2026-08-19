import { TelaPainel } from '@/modules/painel/components/tela-painel'
import { protegerPagina } from '@/modules/auth/permissao_svc/proteger_pagina'
import { carregarResumo } from '@/modules/painel/resumo_svc/carregar_resumo'

export const dynamic = 'force-dynamic'

export default async function Painel (): Promise<React.JSX.Element> {
  const sessao = await protegerPagina()
  const resumo = await carregarResumo(sessao.tenantId)

  return <TelaPainel sessao={sessao} resumo={resumo} />
}
