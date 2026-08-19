import type { Metadata } from 'next'
import { t } from '@/i18n'
import './globals.css'

export const metadata: Metadata = {
  title: t('comum', 'app.nome'),
  description: t('comum', 'app.descricao')
}

export default function RootLayout ({
  children
}: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <html lang='pt-BR'>
      <body>{children}</body>
    </html>
  )
}
