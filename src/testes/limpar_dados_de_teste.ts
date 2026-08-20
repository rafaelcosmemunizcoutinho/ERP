import postgres from 'postgres'

/**
 * ARMADILHA DE SEGURANCA (a que mais cobra pedagio neste projeto): este script
 * conecta com o DONO do banco, nao com erp_app.
 *
 * A primeira versao usava a conexao da aplicacao e reportava "nada a remover"
 * com 27 empresas de teste no banco - sem contexto de tenant o RLS devolve
 * zero linhas, e zero linhas nao levanta erro. Limpeza precisa enxergar todos
 * os tenants de uma vez, o que so o dono consegue.
 */
const url = process.env.DATABASE_ADMIN_URL

if (url === undefined || url === '') {
  console.error(
    '[limpeza] DATABASE_ADMIN_URL nao definida.\n' +
    '          Rode pelo servico migrate, que ja a possui:\n' +
    '          docker compose run --rm migrate npm run db:limpar-teste'
  )
  process.exit(1)
}

const PADRAO_EMAIL_DE_TESTE = '^(cat|dono|audit|ana|tema|dupla2?|curta)-'

const sql = postgres(url, { max: 1, onnotice: () => {} })

async function main (): Promise<void> {
  const alvos = await sql<Array<{ id: string }>>`
    SELECT DISTINCT t.id
    FROM tenant t
    JOIN usuario u ON u.tenant_id = t.id
    WHERE u.email ~ ${PADRAO_EMAIL_DE_TESTE}
  `

  if (alvos.length === 0) {
    console.log('[limpeza] Nada a remover.')
    return
  }

  const ids = alvos.map((a) => a.id)

  // Ordem importa: filho antes do pai, folha antes da raiz.
  await sql.begin(async (tx) => {
    await tx`DELETE FROM produto_codigo_barras WHERE tenant_id = ANY(${ids}::uuid[])`
    await tx`DELETE FROM produto WHERE tenant_id = ANY(${ids}::uuid[])`
    await tx`DELETE FROM parceiro WHERE tenant_id = ANY(${ids}::uuid[])`
    await tx`DELETE FROM usuario_papel WHERE usuario_id IN
             (SELECT id FROM usuario WHERE tenant_id = ANY(${ids}::uuid[]))`
    await tx`DELETE FROM auditoria WHERE tenant_id = ANY(${ids}::uuid[])`
    await tx`DELETE FROM categoria WHERE tenant_id = ANY(${ids}::uuid[])`
    await tx`DELETE FROM conta_contabil WHERE tenant_id = ANY(${ids}::uuid[]) AND pai_id IS NOT NULL`
    await tx`DELETE FROM conta_contabil WHERE tenant_id = ANY(${ids}::uuid[])`
    await tx`DELETE FROM usuario WHERE tenant_id = ANY(${ids}::uuid[])`
    await tx`DELETE FROM empresa WHERE tenant_id = ANY(${ids}::uuid[])`
    await tx`DELETE FROM tenant WHERE id = ANY(${ids}::uuid[])`
  })

  console.log(`[limpeza] ${ids.length} empresa(s) de teste removida(s).`)
}

main()
  .then(async () => { await sql.end() })
  .then(() => process.exit(0))
  .catch(async (erro) => {
    console.error('[limpeza] FALHOU:', erro instanceof Error ? erro.message : erro)
    await sql.end()
    process.exit(1)
  })
