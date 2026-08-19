import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from './button'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variante: { control: 'select', options: ['primaria', 'secundaria', 'fantasma', 'perigo'] },
    tamanho: { control: 'select', options: ['pequeno', 'medio', 'grande'] },
  },
  args: { children: 'Registrar venda' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primaria: Story = {}
export const Secundaria: Story = { args: { variante: 'secundaria' } }
export const Fantasma: Story = { args: { variante: 'fantasma' } }
export const Perigo: Story = { args: { variante: 'perigo', children: 'Cancelar venda' } }
export const Desabilitada: Story = { args: { disabled: true } }

export const Tamanhos: Story = {
  render: (args) => (
    <div className='flex items-center gap-3'>
      <Button {...args} tamanho='pequeno'>Pequeno</Button>
      <Button {...args} tamanho='medio'>Medio</Button>
      <Button {...args} tamanho='grande'>Grande</Button>
    </div>
  ),
}
