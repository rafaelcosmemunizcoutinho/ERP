'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { t } from '@/i18n'
import { Button } from '@/ui/atoms/button'
import { Campo } from '@/ui/molecules/campo'
import { criarEmpresaAction } from '../actions'
import { ESTADO_ONBOARDING_INICIAL } from '../estado'
import { SEGMENTOS, TEMPLATES, type Segmento } from '../templates'

export function TelaComecar (): React.JSX.Element {
  const [estado, acao, enviando] = useActionState(criarEmpresaAction, ESTADO_ONBOARDING_INICIAL)
  const [segmento, setSegmento] = useState<Segmento>('padaria')

  const template = TEMPLATES[segmento]

  return (
    <form action={acao} className='flex w-full max-w-lg flex-col gap-6'>
      <header className='flex flex-col gap-1'>
        <h1 className='text-fs24 font-semibold tracking-tight text-on-surface'>
          {t('auth', 'comecar.titulo')}
        </h1>
        <p className='text-on-surface-variant'>{t('auth', 'comecar.subtitulo')}</p>
      </header>

      {estado.erro !== undefined && (
        <p
          role='alert'
          className='rounded-md border border-danger bg-danger-container px-3 py-2 text-fs13 text-on-danger-container'
        >
          {estado.erro}
        </p>
      )}

      <fieldset className='flex flex-col gap-2'>
        <legend className='text-fs13 font-medium text-on-surface'>
          {t('auth', 'comecar.segmento')}
        </legend>
        <p className='text-fs12 text-on-surface-muted'>{t('auth', 'comecar.segmentoAjuda')}</p>

        <div className='mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3'>
          {SEGMENTOS.map((valor) => (
            <label
              key={valor}
              className='flex cursor-pointer items-center gap-2 rounded-md border border-outline bg-surface-lowest px-3 py-2 text-fs13 has-checked:border-primary has-checked:bg-primary-container has-checked:text-on-primary-container'
            >
              <input
                type='radio'
                name='segmento'
                value={valor}
                checked={segmento === valor}
                onChange={() => setSegmento(valor)}
                className='sr-only'
              />
              {TEMPLATES[valor].rotulo}
            </label>
          ))}
        </div>

        <p className='mt-1 text-fs12 text-on-surface-variant'>{template.descricao}</p>

        <ul className='mt-1 flex flex-wrap gap-1.5'>
          {template.categorias.map((categoria) => (
            <li
              key={categoria.nome}
              className='rounded-sm border border-outline bg-surface-low px-2 py-0.5 text-fs12 text-on-surface-variant'
            >
              {categoria.nome}
              {categoria.diasAlertaCritico !== null && (
                <span className='ml-1 font-mono tabular-nums text-on-surface-muted'>
                  {categoria.diasAlertaCritico}d
                </span>
              )}
            </li>
          ))}
        </ul>
      </fieldset>

      <div className='grid gap-4 sm:grid-cols-2'>
        <Campo
          rotulo={t('auth', 'comecar.razaoSocial')}
          ajuda={t('auth', 'comecar.razaoSocialAjuda')}
          name='razaoSocial'
          autoComplete='organization'
          required
        />
        <Campo
          rotulo={t('auth', 'comecar.nomeFantasia')}
          name='nomeFantasia'
        />
      </div>

      <Campo
        rotulo={t('auth', 'comecar.cnpj')}
        ajuda={t('auth', 'comecar.cnpjAjuda')}
        name='cnpj'
        inputMode='numeric'
        maxLength={18}
      />

      <div className='grid gap-4 sm:grid-cols-2'>
        <Campo
          rotulo={t('auth', 'comecar.responsavel')}
          name='responsavelNome'
          autoComplete='name'
          required
        />
        <Campo
          rotulo={t('auth', 'comecar.email')}
          ajuda={t('auth', 'comecar.emailAjuda')}
          name='responsavelEmail'
          type='email'
          autoComplete='username'
          required
        />
      </div>

      <Campo
        rotulo={t('auth', 'comecar.senha')}
        ajuda={t('auth', 'comecar.senhaAjuda')}
        name='senha'
        type='password'
        autoComplete='new-password'
        minLength={10}
        required
      />

      <Button type='submit' tamanho='grande' disabled={enviando}>
        {enviando ? t('auth', 'comecar.enviando') : t('auth', 'comecar.acao')}
      </Button>

      <p className='text-fs13 text-on-surface-variant'>
        {t('auth', 'comecar.jaTemConta')}{' '}
        <Link href='/entrar' className='font-medium text-primary underline underline-offset-2'>
          {t('auth', 'comecar.entrar')}
        </Link>
      </p>
    </form>
  )
}
