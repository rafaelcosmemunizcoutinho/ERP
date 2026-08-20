export abstract class ErroDominio extends Error {
  abstract readonly status: number
  abstract readonly codigo: string

  constructor (readonly mensagem: string) {
    super(mensagem)
    this.name = new.target.name
  }
}

export class EntradaInvalida extends ErroDominio {
  readonly status = 400
  readonly codigo = 'ENTRADA_INVALIDA'

  constructor (mensagem = 'Confira os dados informados.') {
    super(mensagem)
  }
}

export class NaoAutenticado extends ErroDominio {
  readonly status = 401
  readonly codigo = 'NAO_AUTENTICADO'

  constructor (mensagem = 'Entre na sua conta para continuar.') {
    super(mensagem)
  }
}

export class CredenciaisInvalidas extends ErroDominio {
  readonly status = 401
  readonly codigo = 'CREDENCIAIS_INVALIDAS'

  constructor (mensagem = 'E-mail ou senha incorretos.') {
    super(mensagem)
  }
}

export class SegundoFatorInvalido extends ErroDominio {
  readonly status = 401
  readonly codigo = 'SEGUNDO_FATOR_INVALIDO'

  constructor (mensagem = 'Código de verificação incorreto ou expirado.') {
    super(mensagem)
  }
}

export class SemPermissao extends ErroDominio {
  readonly status = 403
  readonly codigo = 'SEM_PERMISSAO'

  constructor (mensagem = 'Você não tem permissão para esta ação.') {
    super(mensagem)
  }
}

export class ContaDesativada extends ErroDominio {
  readonly status = 403
  readonly codigo = 'CONTA_DESATIVADA'

  constructor (mensagem = 'Esta conta foi desativada. Fale com o responsável pela empresa.') {
    super(mensagem)
  }
}

export class NaoEncontrado extends ErroDominio {
  readonly status = 404
  readonly codigo = 'NAO_ENCONTRADO'

  constructor (mensagem = 'Registro não encontrado.') {
    super(mensagem)
  }
}

export class Conflito extends ErroDominio {
  readonly status = 409
  readonly codigo: string = 'CONFLITO'

  constructor (mensagem = 'Este registro já existe.') {
    super(mensagem)
  }
}

export class CnpjJaCadastrado extends Conflito {
  readonly codigo = 'CNPJ_JA_CADASTRADO'

  constructor (mensagem = 'Já existe uma empresa cadastrada com este CNPJ.') {
    super(mensagem)
  }
}
