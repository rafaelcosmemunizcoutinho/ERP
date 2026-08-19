import { NextResponse } from 'next/server'
import { verificarBanco } from '@/db/client'

export const dynamic = 'force-dynamic'

export async function GET (): Promise<NextResponse> {
  const banco = await verificarBanco()

  return NextResponse.json(
    {
      status: banco ? 'ok' : 'degradado',
      banco: banco ? 'up' : 'down',
      versao: process.env.npm_package_version ?? '0.1.0'
    },
    { status: banco ? 200 : 503 }
  )
}
