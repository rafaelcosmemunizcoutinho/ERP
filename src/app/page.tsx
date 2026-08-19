import { db } from '@/db/client'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

type Status = {
  conectado: boolean
  migrations: string[]
  papeis: number
  permissoes: number
  erro?: string
}

async function carregarStatus(): Promise<Status> {
  try {
    const migrations = await db.execute<{ nome: string }>(
      sql`SELECT nome FROM _migration ORDER BY nome`,
    )
    const papeis = await db.execute<{ n: number }>(
      sql`SELECT count(*)::int AS n FROM papel WHERE tenant_id IS NULL`,
    )
    const permissoes = await db.execute<{ n: number }>(
      sql`SELECT count(*)::int AS n FROM permissao`,
    )
    return {
      conectado: true,
      migrations: migrations.map((m) => m.nome),
      papeis: papeis[0]?.n ?? 0,
      permissoes: permissoes[0]?.n ?? 0,
    }
  } catch (erro) {
    return {
      conectado: false,
      migrations: [],
      papeis: 0,
      permissoes: 0,
      erro: erro instanceof Error ? erro.message : String(erro),
    }
  }
}

export default async function Home() {
  const status = await carregarStatus()

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>ERP Web</h1>
      <p style={{ color: 'var(--muted)', marginTop: 0 }}>
        ERP SaaS multi-tenant para pequenos comercios do varejo alimentar.
      </p>

      <section
        style={{
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '1.25rem',
          marginTop: '2rem',
        }}
      >
        <h2 style={{ fontSize: '1rem', marginTop: 0 }}>Ambiente</h2>

        <p style={{ color: status.conectado ? 'var(--ok)' : 'var(--erro)', fontWeight: 600 }}>
          {status.conectado ? 'Banco conectado' : 'Banco indisponivel'}
        </p>

        {status.erro && (
          <pre
            style={{
              background: 'var(--border)',
              padding: '0.75rem',
              borderRadius: 6,
              overflowX: 'auto',
              fontSize: '0.8rem',
            }}
          >
            {status.erro}
          </pre>
        )}

        {status.conectado && (
          <ul style={{ paddingLeft: '1.1rem', color: 'var(--muted)' }}>
            <li>
              Migrations aplicadas: <strong>{status.migrations.length}</strong>
            </li>
            <li>
              Papeis do sistema: <strong>{status.papeis}</strong>
            </li>
            <li>
              Permissoes catalogadas: <strong>{status.permissoes}</strong>
            </li>
          </ul>
        )}
      </section>

      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '2rem' }}>
        Fundacao (Fase 1) instalada. Proximas fases em <code>docs/plano-de-fases.md</code>.
      </p>
    </main>
  )
}
