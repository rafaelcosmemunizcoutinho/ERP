'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { t } from '@/i18n'
import { Button } from '@/ui/atoms/button'
import { Label } from '@/ui/atoms/label'
import { Campo } from '@/ui/molecules/campo'
import { salvarCategoriaAction } from '../actions'
import { ESTADO_CATEGORIA_INICIAL } from '../estado'
import type { Categoria } from '../categoria_svc/listar_categorias'

interface Props {
  categoria?: Categoria
}

export function FormularioCategoria ({ categoria }: Props): React.JSX.Element {
  const [estado, acao, enviando] = useActionState(salvarCategoriaAction, ESTADO_CATEGORIA_INICIAL)
  const [perecivel, setPerecivel] = useState(categoria?.perecivel ?? false)

  return (
    <form
      action={acao}
      className='flex flex-col gap-5 rounded-lg border border-outline bg-surface-lowest p-6'
    >
      <h2 className='text-fs18 font-semibold text-on-surface'>
        {categoria === undefined
          ? t('cadastros', 'categoria.novaCategoria')
          : t('cadastros', 'categoria.editar')}
      </h2>

      {categoria !== undefined && <input type='hidden' name='id' value={categoria.id} />}

      {estado.erro !== undefined && (
        <p
          role='alert'
          className='rounded-md border border-danger bg-danger-container px-3 py-2 text-fs13 text-on-danger-container'
        >
          {estado.erro}
        </p>
      )}

      <Campo
        rotulo={t('cadastros', 'categoria.nome')}
        name='nome'
        defaultValue={categoria?.nome}
        maxLength={80}
        required
      />

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='perecivel'>{t('cadastros', 'categoria.perecivel')}</Label>
        <label className='flex items-center gap-2 text-fs14 text-on-surface'>
          <input
            id='perecivel'
            name='perecivel'
            type='checkbox'
            checked={perecivel}
            onChange={(evento) => { setPerecivel(evento.target.checked) }}
            className='size-4 accent-primary'
          />
          {t('cadastros', 'categoria.ajudaPerecivel')}
        </label>
      </div>

      {perecivel && (
        <div className='grid gap-4 sm:grid-cols-2'>
          <Campo
            rotulo={t('cadastros', 'categoria.alertaCritico')}
            ajuda={t('cadastros', 'categoria.ajudaCritico')}
            name='diasAlertaCritico'
            type='number'
            min={1}
            defaultValue={categoria?.dias_alerta_critico ?? 3}
            required
          />
          <Campo
            rotulo={t('cadastros', 'categoria.alertaAtencao')}
            ajuda={t('cadastros', 'categoria.ajudaAtencao')}
            name='diasAlertaAtencao'
            type='number'
            min={2}
            defaultValue={categoria?.dias_alerta_atencao ?? 7}
            required
          />
        </div>
      )}

      {categoria !== undefined && (
        <div className='flex flex-col gap-1.5'>
          <Label htmlFor='ativo'>{t('cadastros', 'categoria.situacao')}</Label>
          <label className='flex items-center gap-2 text-fs14 text-on-surface'>
            <input
              id='ativo'
              name='ativo'
              type='checkbox'
              defaultChecked={categoria.ativo}
              className='size-4 accent-primary'
            />
            {t('cadastros', 'categoria.ativa')}
          </label>
        </div>
      )}

      <div className='flex items-center gap-3'>
        <Button type='submit' disabled={enviando}>
          {enviando ? t('cadastros', 'categoria.salvando') : t('cadastros', 'categoria.salvar')}
        </Button>
        <Button asChild variante='secundaria'>
          <Link href='/categorias'>{t('cadastros', 'categoria.cancelar')}</Link>
        </Button>
      </div>
    </form>
  )
}
