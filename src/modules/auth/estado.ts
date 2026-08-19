export interface EstadoLogin {
  erro?: string
  exigeMfa: boolean
  empresas: Array<{ tenantId: string, nome: string }>
  email: string
}

export const ESTADO_LOGIN_INICIAL: EstadoLogin = {
  exigeMfa: false,
  empresas: [],
  email: ''
}
