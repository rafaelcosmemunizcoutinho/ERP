'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { _ouUndefined } from '@/lib/form'
import { ErroDominio } from '@/lib/erros'
import { t } from '@/i18n'
import { ESTADO_LOGIN_INICIAL, type EstadoLogin } from './estado'
import { autenticar } from './login_svc/autenticar'
import { criarSessao } from './sessao_svc/criar_sessao'
import { encerrarSessao } from './sessao_svc/encerrar_sessao'

const entrada = z.object({
  email: z.email({ error: t('auth', 'erro.emailInvalido') }),
  senha: z.string().min(1, { error: t('auth', 'erro.campoObrigatorio') }),
  codigoMfa: z.string().optional(),
  tenantId: z.string().optional()
})

export async function entrarAction (
  _anterior: EstadoLogin,
  dados: FormData
): Promise<EstadoLogin> {
  const bruto = {
    email: String(dados.get('email') ?? ''),
    senha: String(dados.get('senha') ?? ''),
    codigoMfa: _ouUndefined(dados.get('codigoMfa')),
    tenantId: _ouUndefined(dados.get('tenantId'))
  }

  const validado = entrada.safeParse(bruto)
  if (!validado.success) {
    return {
      ...ESTADO_LOGIN_INICIAL,
      email: bruto.email,
      erro: validado.error.issues[0]?.message
    }
  }

  try {
    const resultado = await autenticar(validado.data)

    if (resultado.sessao === null) {
      return {
        erro: undefined,
        exigeMfa: resultado.exigeMfa,
        empresas: resultado.empresas,
        email: bruto.email
      }
    }

    await criarSessao(resultado.sessao)
  } catch (erro) {
    if (erro instanceof ErroDominio) {
      return { ...ESTADO_LOGIN_INICIAL, email: bruto.email, erro: erro.mensagem }
    }
    return { ...ESTADO_LOGIN_INICIAL, email: bruto.email, erro: t('auth', 'erro.generico') }
  }

  redirect('/painel')
}

export async function sairAction (): Promise<void> {
  await encerrarSessao()
  redirect('/entrar')
}
