import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from './input'

const meta = {
  title: 'Atoms/Input',
  component: Input,
  parameters: { layout: 'centered' },
  args: { 'aria-label': 'E-mail', placeholder: 'dono@padaria.com.br' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}
export const Invalido: Story = { args: { invalido: true, defaultValue: 'dono@' } }
export const Desabilitado: Story = { args: { disabled: true, defaultValue: 'bloqueado' } }
export const Numerico: Story = {
  args: { 'aria-label': 'Quantidade', placeholder: '0,000', inputMode: 'decimal' },
}
