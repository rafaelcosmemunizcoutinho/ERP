import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // standalone gera um bundle minimo para a imagem de producao
  output: 'standalone',
}

export default nextConfig
