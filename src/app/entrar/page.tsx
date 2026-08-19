import { redirect } from 'next/navigation'
import { TelaEntrar } from '@/modules/auth/components/tela-entrar'
import { lerSessao } from '@/modules/auth/sessao_svc/ler_sessao'

export const dynamic = 'force-dynamic'

export default async function Entrar (): Promise<React.JSX.Element> {
  if (await lerSessao() !== null) redirect('/painel')
  return (
    <main className='flex min-h-dvh items-center justify-center px-6 py-16'>
      <TelaEntrar />
    </main>
  )
}
