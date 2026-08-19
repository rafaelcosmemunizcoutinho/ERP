import type { Preview, Decorator } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

const comTema: Decorator = (Story, contexto) => {
  const escuro = contexto.globals.tema === 'escuro'
  return (
    <div className={escuro ? 'dark' : ''}>
      <div className='bg-surface text-on-surface p-8'>
        <Story />
      </div>
    </div>
  )
}

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'error' },
  },
  globalTypes: {
    tema: {
      description: 'Tema da interface',
      defaultValue: 'claro',
      toolbar: {
        title: 'Tema',
        icon: 'circlehollow',
        items: [
          { value: 'claro', title: 'Claro' },
          { value: 'escuro', title: 'Escuro' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [comTema],
}

export default preview
