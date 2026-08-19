import { t } from '@/i18n'
import { Button } from '@/ui/atoms/button'
import { sairAction } from '../actions'

export function BotaoSair (): React.JSX.Element {
  return (
    <form action={sairAction}>
      <Button type='submit' variante='fantasma' tamanho='pequeno'>
        {t('auth', 'entrar.sair')}
      </Button>
    </form>
  )
}
