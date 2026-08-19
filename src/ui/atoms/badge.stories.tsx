import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Badge } from './badge'

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  argTypes: {
    tom: { control: 'select', options: ['neutro', 'primario', 'sucesso', 'aviso', 'perigo'] },
  },
  args: { children: 'Em dia' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Neutro: Story = { args: { tom: 'neutro', children: 'Rascunho' } }
export const Sucesso: Story = { args: { tom: 'sucesso', children: 'Em dia' } }
export const Aviso: Story = { args: { tom: 'aviso', children: 'Vence em 3 dias' } }
export const Perigo: Story = { args: { tom: 'perigo', children: 'Vencido' } }

export const EstadosDeLote: Story = {
  name: 'Estados de lote',
  render: () => (
    <div className='flex flex-wrap items-center gap-2'>
      <Badge tom='sucesso'>Disponivel</Badge>
      <Badge tom='aviso'>Vence em 3 dias</Badge>
      <Badge tom='perigo'>Vencido</Badge>
      <Badge tom='neutro'>Em quarentena</Badge>
    </div>
  ),
}
