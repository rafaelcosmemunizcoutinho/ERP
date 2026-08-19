interface ErroPostgres {
  code: string
  constraint_name?: string
}

function _ehErroPostgres (valor: unknown): valor is ErroPostgres {
  return typeof valor === 'object' && valor !== null && typeof (valor as ErroPostgres).code === 'string'
}

export function violouUnicidade (erro: unknown, constraint: string): boolean {
  let atual: unknown = erro
  const vistos = new Set<unknown>()

  while (atual !== null && atual !== undefined && !vistos.has(atual)) {
    vistos.add(atual)

    if (_ehErroPostgres(atual) && atual.code === '23505') {
      if (atual.constraint_name === constraint) return true
    }

    if (atual instanceof Error && typeof atual.message === 'string' && atual.message.includes(constraint)) {
      return true
    }

    atual = (atual as { cause?: unknown }).cause
  }

  return false
}
