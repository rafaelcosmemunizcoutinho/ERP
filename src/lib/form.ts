export function _ouUndefined (valor: FormDataEntryValue | null): string | undefined {
  const texto = String(valor ?? '').trim()
  return texto === '' ? undefined : texto
}
