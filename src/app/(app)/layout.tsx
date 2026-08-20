import { protegerPagina } from '@/modules/auth/permissao_svc/proteger_pagina'
import { BotaoSair } from '@/modules/auth/components/botao-sair'
import { carregarResumo } from '@/modules/painel/resumo_svc/carregar_resumo'
import { t } from '@/i18n'
import { AppShell, type ItemNavegacao } from '@/ui/templates/app-shell'

export const dynamic = 'force-dynamic'

function montarNavegacao (permissoes: string[]): ItemNavegacao[] {
  const itens: ItemNavegacao[] = [
    { href: '/painel', rotulo: t('cadastros', 'nav.painel') }
  ]

  if (permissoes.includes('PRODUTO_VISUALIZAR')) {
    itens.push({
      href: '/categorias',
      rotulo: t('cadastros', 'nav.categorias'),
      secao: t('cadastros', 'nav.secaoCadastros')
    })
  }

  return itens
}

export default async function LayoutApp ({
  children
}: Readonly<{ children: React.ReactNode }>): Promise<React.JSX.Element> {
  const sessao = await protegerPagina()
  const resumo = await carregarResumo(sessao.tenantId)

  return (
    <AppShell
      empresa={resumo.empresa}
      segmento={resumo.segmento}
      usuario={sessao.nome}
      itens={montarNavegacao(sessao.permissoes)}
      acoesCabecalho={<BotaoSair />}
    >
      {children}
    </AppShell>
  )
}
