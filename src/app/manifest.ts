import type { MetadataRoute } from 'next'

export default function manifest (): MetadataRoute.Manifest {
  return {
    name: 'ERP Web',
    short_name: 'ERP',
    description: 'Gestão para pequenos comércios do varejo alimentar',
    start_url: '/painel',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    lang: 'pt-BR',
    background_color: '#f6f7f9',
    theme_color: '#2a4bc4',
    icons: [
      { src: '/icones/icone-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icones/icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icones/icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  }
}
