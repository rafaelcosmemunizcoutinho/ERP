export function montarUri (emissor: string, conta: string, segredo: string): string {
  const rotulo = encodeURIComponent(`${emissor}:${conta}`)
  const parametros = new URLSearchParams({
    secret: segredo,
    issuer: emissor,
    algorithm: 'SHA1',
    digits: '6',
    period: '30'
  })
  return `otpauth://totp/${rotulo}?${parametros.toString()}`
}
