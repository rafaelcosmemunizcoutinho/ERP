'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { _ouUndefined } from '@/lib/form'
import { ErroDominio } from '@/lib/erros'
import { t } from '@/i18n'
import { autenticar } from '@/modules/auth/login_svc/autenticar'
import { criarSessao } from '@/modules/auth/sessao_svc/criar_sessao'
import { type EstadoOnboarding } from './estado'
import { criarEmpresa } from './criar_empresa_svc/criar_empresa'
import { SEGMENTOS } from './templates'

const entrada = z.object({
  segmento: z.enum(SEGMENTOS as [string, ...string[]]),
  razaoSocial: z.string().trim().min(2, { error: t('auth', 'erro.campoObrigatorio') }),
  nomeFantasia: z.string().trim().optional(),
  cnpj: z.string().trim().optional(),
  responsavelNome: z.string().trim().min(2, { error: t('auth', 'erro.campoObrigatorio') }),
  responsavelEmail: z.email({ error: t('auth', 'erro.emailInvalido') }),
  senha: z.string().min(10, { error: t('auth', 'erro.senhaCurta') })
})

export async function criarEmpresaAction (
  _anterior: EstadoOnboarding,
  dados: FormData
): Promise<EstadoOnboarding> {
  const validado = entrada.safeParse({
    segmento: String(dados.get('segmento') ?? ''),
    razaoSocial: String(dados.get('razaoSocial') ?? ''),
    nomeFantasia: _ouUndefined(dados.get('nomeFantasia')),
    cnpj: _ouUndefined(dados.get('cnpj')),
    responsavelNome: String(dados.get('responsavelNome') ?? ''),
    responsavelEmail: String(dados.get('responsavelEmail') ?? ''),
    senha: String(dados.get('senha') ?? '')
  })

  if (!validado.success) {
    return { erro: validado.error.issues[0]?.message }
  }

  try {
    await criarEmpresa({
      ...validado.data,
      segmento: validado.data.segmento as Parameters<typeof criarEmpresa>[0]['segmento']
    })

    const resultado = await autenticar({
      email: validado.data.responsavelEmail,
      senha: validado.data.senha
    })

    if (resultado.sessao !== null) await criarSessao(resultado.sessao)
  } catch (erro) {
    if (erro instanceof ErroDominio) return { erro: erro.mensagem }
    return { erro: t('auth', 'erro.generico') }
  }

  redirect('/painel')
}
