import Link from 'next/link'
import { t } from '@/i18n'
import { Badge } from '@/ui/atoms/badge'
import { Button } from '@/ui/atoms/button'
import type { Categoria } from '../categoria_svc/listar_categorias'
import { FormularioCategoria } from './formulario-categoria'

interface Props {
  categorias: Categoria[]
  emEdicao?: Categoria
  criando: boolean
  podeAlterar: boolean
}

function rotuloDias (dias: number | null): string {
  if (dias === null) return t('cadastros', 'categoria.semAlerta')
  return dias === 1 ? t('cadastros', 'categoria.umDia') : t('cadastros', 'categoria.dias', { dias })
}

export function TelaCategorias ({
  categorias,
  emEdicao,
  criando,
  podeAlterar
}: Props): React.JSX.Element {
  const mostrandoFormulario = criando || emEdicao !== undefined

  return (
    <div className='flex flex-col gap-6'>
      <header className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='text-fs24 font-semibold tracking-tight text-on-surface'>
            {t('cadastros', 'categoria.titulo')}
          </h1>
          <p className='mt-1 max-w-prose text-on-surface-variant'>
            {t('cadastros', 'categoria.descricao')}
          </p>
        </div>
        {podeAlterar && !mostrandoFormulario && (
          <Button asChild>
            <Link href='/categorias?nova=1'>{t('cadastros', 'categoria.novaCategoria')}</Link>
          </Button>
        )}
      </header>

      {mostrandoFormulario && <FormularioCategoria categoria={emEdicao} />}

      <div className='overflow-x-auto rounded-lg border border-outline bg-surface-lowest'>
        <table className='w-full min-w-[40rem] text-fs14'>
          <caption className='sr-only'>{t('cadastros', 'categoria.titulo')}</caption>
          <thead>
            <tr className='border-b border-outline text-left'>
              <th scope='col' className='px-4 py-2.5 font-medium text-on-surface-variant'>
                {t('cadastros', 'categoria.nome')}
              </th>
              <th scope='col' className='px-4 py-2.5 font-medium text-on-surface-variant'>
                {t('cadastros', 'categoria.alertaCritico')}
              </th>
              <th scope='col' className='px-4 py-2.5 font-medium text-on-surface-variant'>
                {t('cadastros', 'categoria.alertaAtencao')}
              </th>
              <th scope='col' className='px-4 py-2.5 text-right font-medium text-on-surface-variant'>
                {t('cadastros', 'categoria.produtos')}
              </th>
              <th scope='col' className='px-4 py-2.5 font-medium text-on-surface-variant'>
                {t('cadastros', 'categoria.situacao')}
              </th>
              {podeAlterar && <th scope='col' className='px-4 py-2.5'><span className='sr-only'>{t('cadastros', 'categoria.editar')}</span></th>}
            </tr>
          </thead>
          <tbody>
            {categorias.length === 0 && (
              <tr>
                <td colSpan={6} className='px-4 py-8 text-center text-on-surface-muted'>
                  {t('cadastros', 'categoria.vazio')}
                </td>
              </tr>
            )}
            {categorias.map((categoria) => (
              <tr key={categoria.id} className='border-b border-outline last:border-b-0'>
                <td className='px-4 py-2.5 font-medium text-on-surface'>{categoria.nome}</td>
                <td className='px-4 py-2.5 text-on-surface-variant'>
                  {categoria.perecivel
                    ? (
                      <Badge tom='perigo'>{rotuloDias(categoria.dias_alerta_critico)}</Badge>
                      )
                    : (
                      <span className='text-on-surface-muted'>{t('cadastros', 'categoria.semAlerta')}</span>
                      )}
                </td>
                <td className='px-4 py-2.5 text-on-surface-variant'>
                  {categoria.perecivel
                    ? <Badge tom='aviso'>{rotuloDias(categoria.dias_alerta_atencao)}</Badge>
                    : <span className='text-on-surface-muted'>—</span>}
                </td>
                <td className='px-4 py-2.5 text-right font-mono tabular-nums text-on-surface-variant'>
                  {categoria.produtos}
                </td>
                <td className='px-4 py-2.5'>
                  <Badge tom={categoria.ativo ? 'sucesso' : 'neutro'}>
                    {categoria.ativo
                      ? t('cadastros', 'categoria.ativa')
                      : t('cadastros', 'categoria.inativa')}
                  </Badge>
                </td>
                {podeAlterar && (
                  <td className='px-4 py-2.5 text-right'>
                    <Button asChild variante='fantasma' tamanho='pequeno'>
                      <Link href={`/categorias?editar=${categoria.id}`}>
                        {t('cadastros', 'categoria.editar')}
                      </Link>
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
