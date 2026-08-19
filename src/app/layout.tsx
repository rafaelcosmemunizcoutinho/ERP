import type { Metadata, Viewport } from 'next'
import { t } from '@/i18n'
import { CHAVE_TEMA } from '@/lib/tema'
import './globals.css'

export const metadata: Metadata = {
  title: t('comum', 'app.nome'),
  description: t('comum', 'app.descricao'),
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'ERP', statusBarStyle: 'default' }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f7f9' },
    { media: '(prefers-color-scheme: dark)', color: '#101319' }
  ]
}

// Roda antes da primeira pintura. Sem isso, quem escolheu tema escuro ve um
// lampejo branco a cada carregamento, e num sistema usado o dia inteiro no
// balcao esse lampejo cansa.
const ANTI_FLASH = `
(function () {
  try {
    var escolha = localStorage.getItem('${CHAVE_TEMA}');
    var escuro = escolha === 'escuro' ||
      ((escolha === null || escolha === 'sistema') &&
       window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (escuro) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`

export default function RootLayout ({
  children
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <html lang='pt-BR' suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ANTI_FLASH }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
