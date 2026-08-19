import { NextResponse } from 'next/server'
import { verificarBanco } from '@/db/client'

export const dynamic = 'force-dynamic'

/**
 * Healthcheck usado pelo Docker e, mais tarde, pelo load balancer.
 * Retorna 503 quando o banco esta fora, para o orquestrador nao mandar
 * trafego para uma instancia que nao consegue atender.
 */
export async function GET() {
  const banco = await verificarBanco()

  return NextResponse.json(
    {
      status: banco ? 'ok' : 'degradado',
      banco: banco ? 'up' : 'down',
      versao: process.env.npm_package_version ?? '0.1.0',
    },
    { status: banco ? 200 : 503 },
  )
}
