'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { t } from '@/i18n'
import { Button } from '@/ui/atoms/button'
import { Campo } from '@/ui/molecules/campo'
import { entrarAction } from '../actions'
import { ESTADO_LOGIN_INICIAL } from '../estado'

export function TelaEntrar (): React.JSX.Element {
  const [estado, acao, enviando] = useActionState(entrarAction, ESTADO_LOGIN_INICIAL)

  const escolhendoEmpresa = estado.empresas.length > 0

  return (
    <form action={acao} className='flex w-full max-w-sm flex-col gap-5'>
      <header className='flex flex-col gap-1'>
        <h1 className='text-fs24 font-semibold tracking-tight text-on-surface'>
          {estado.exigeMfa ? t('auth', 'entrar.mfaTitulo') : t('auth', 'entrar.titulo')}
        </h1>
        <p className='text-on-surface-variant'>
          {estado.exigeMfa ? t('auth', 'entrar.mfaSubtitulo') : t('auth', 'entrar.subtitulo')}
        </p>
      </header>

      {estado.erro !== undefined && (
        <p
          role='alert'
          className='rounded-md border border-danger bg-danger-container px-3 py-2 text-fs13 text-on-danger-container'
        >
          {estado.erro}
        </p>
      )}

      {escolhendoEmpresa
        ? (
          <fieldset className='flex flex-col gap-2'>
            <legend className='mb-2 text-fs13 font-medium text-on-surface'>
              {t('auth', 'entrar.escolhaEmpresa')}
            </legend>
            <p className='mb-1 text-fs12 text-on-surface-muted'>
              {t('auth', 'entrar.escolhaEmpresaAjuda')}
            </p>
            {estado.empresas.map((empresa) => (
              <label
                key={empresa.tenantId}
                className='flex cursor-pointer items-center gap-2 rounded-md border border-outline bg-surface-lowest px-3 py-2 text-fs14 has-checked:border-primary'
              >
                <input type='radio' name='tenantId' value={empresa.tenantId} required />
                {empresa.nome}
              </label>
            ))}
          </fieldset>
          )
        : null}

      <Campo
        rotulo={t('auth', 'entrar.email')}
        name='email'
        type='email'
        autoComplete='username'
        defaultValue={estado.email}
        readOnly={estado.exigeMfa}
        required
      />

      <Campo
        rotulo={t('auth', 'entrar.senha')}
        name='senha'
        type='password'
        autoComplete='current-password'
        required
      />

      {estado.exigeMfa && (
        <Campo
          rotulo={t('auth', 'entrar.mfaCodigo')}
          ajuda={t('auth', 'entrar.mfaAjuda')}
          name='codigoMfa'
          inputMode='numeric'
          autoComplete='one-time-code'
          maxLength={6}
          className='font-mono'
          required
        />
      )}

      <Button type='submit' tamanho='grande' disabled={enviando}>
        {enviando ? t('auth', 'entrar.enviando') : t('auth', 'entrar.acao')}
      </Button>

      <p className='text-fs13 text-on-surface-variant'>
        {t('auth', 'entrar.semConta')}{' '}
        <Link href='/comecar' className='font-medium text-primary underline underline-offset-2'>
          {t('auth', 'entrar.criarConta')}
        </Link>
      </p>
    </form>
  )
}
