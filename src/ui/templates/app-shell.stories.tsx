import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AppShell } from './app-shell'

const meta = {
  title: 'Templates/AppShell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
  args: {
    empresa: 'Padaria do Zé',
    segmento: 'padaria',
    usuario: 'Ana Souza',
    acoesCabecalho: <button type='button' className='text-fs13 text-on-surface-variant'>Sair</button>,
    itens: [
      { href: '/painel', rotulo: 'Painel' },
      { href: '/categorias', rotulo: 'Categorias', secao: 'Cadastros' },
      { href: '/produtos', rotulo: 'Produtos', secao: 'Cadastros' }
    ],
    children: <p className='text-on-surface-variant'>Conteúdo da página.</p>
  }
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const SomenteLeitura: Story = {
  name: 'Operador sem permissão de cadastro',
  args: { usuario: 'João Vendedor', itens: [{ href: '/painel', rotulo: 'Painel' }] }
}

export const NomeLongo: Story = {
  args: { empresa: 'Panificadora e Confeitaria Sol Nascente Ltda ME' }
}
