import { sql } from 'drizzle-orm'
import { db } from '@/db/client'
import { t } from '@/i18n'
import { Badge } from '@/ui/atoms/badge'

export const dynamic = 'force-dynamic'

interface Status {
  conectado: boolean
  migrations: number
  papeis: number
  permissoes: number
}

async function carregarStatus (): Promise<Status> {
  try {
    const [migrations] = await db.execute<{ n: number }>(
      sql`SELECT count(*)::int AS n FROM _migration`
    )
    const [papeis] = await db.execute<{ n: number }>(
      sql`SELECT count(*)::int AS n FROM papel WHERE tenant_id IS NULL`
    )
    const [permissoes] = await db.execute<{ n: number }>(
      sql`SELECT count(*)::int AS n FROM permissao`
    )
    return {
      conectado: true,
      migrations: migrations?.n ?? 0,
      papeis: papeis?.n ?? 0,
      permissoes: permissoes?.n ?? 0
    }
  } catch {
    return { conectado: false, migrations: 0, papeis: 0, permissoes: 0 }
  }
}

export default async function Home (): Promise<React.JSX.Element> {
  const status = await carregarStatus()

  const linhas = [
    { rotulo: t('comum', 'ambiente.migrations'), valor: status.migrations },
    { rotulo: t('comum', 'ambiente.papeis'), valor: status.papeis },
    { rotulo: t('comum', 'ambiente.permissoes'), valor: status.permissoes }
  ]

  return (
    <main className='mx-auto max-w-2xl px-6 py-16'>
      <h1 className='text-fs24 font-semibold tracking-tight text-on-surface'>
        {t('comum', 'app.nome')}
      </h1>
      <p className='mt-1 text-on-surface-variant'>{t('comum', 'app.descricao')}</p>

      <section className='mt-10 rounded-lg border border-outline bg-surface-lowest p-6'>
        <div className='flex items-center justify-between gap-4'>
          <h2 className='text-fs16 font-semibold text-on-surface'>
            {t('comum', 'ambiente.titulo')}
          </h2>
          <Badge tom={status.conectado ? 'sucesso' : 'perigo'}>
            {status.conectado
              ? t('comum', 'ambiente.bancoConectado')
              : t('comum', 'ambiente.bancoIndisponivel')}
          </Badge>
        </div>

        {status.conectado && (
          <dl className='mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-outline bg-outline'>
            {linhas.map(({ rotulo, valor }) => (
              <div key={rotulo} className='bg-surface-lowest px-4 py-3'>
                <dt className='text-fs11 uppercase tracking-wide text-on-surface-muted'>
                  {rotulo}
                </dt>
                <dd className='mt-1 font-mono text-fs18 tabular-nums text-on-surface'>{valor}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <p className='mt-8 text-fs12 text-on-surface-muted'>{t('comum', 'ambiente.rodape')}</p>
    </main>
  )
}
