import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Label } from './label'

const meta = {
  title: 'Atoms/Label',
  component: Label,
  parameters: { layout: 'centered' },
  args: { children: 'E-mail' }
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}
export const Obrigatorio: Story = { args: { obrigatorio: true } }
