import { expect, test, type Page } from '@playwright/test'

function marca (): string {
  return Math.random().toString(36).slice(2, 10)
}

const SENHA = 'senha-de-teste-forte-123'
const ALERTA = '[role="alert"]:not(#__next-route-announcer__)'

async function cadastrarPadaria (page: Page): Promise<string> {
  const id = marca()
  await page.goto('/comecar')
  await page.getByText('Padaria', { exact: true }).click()
  await page.getByLabel('Nome do comércio').fill(`Padaria ${id}`)
  await page.getByLabel('Seu nome').fill('Ana Souza')
  await page.getByLabel('Seu e-mail').fill(`cat-${id}@exemplo.com.br`)
  await page.getByLabel('Crie uma senha').fill(SENHA)
  await page.getByRole('button', { name: 'Criar meu sistema' }).click()
  await expect(page).toHaveURL(/\/painel$/)
  return id
}

test.describe('categorias', () => {
  test('a navegação leva do painel às categorias do segmento', async ({ page }) => {
    await cadastrarPadaria(page)

    const menu = page.getByRole('navigation', { name: 'Menu principal' })
    await menu.getByRole('link', { name: 'Categorias' }).click()

    await expect(page).toHaveURL(/\/categorias$/)
    await expect(page.getByRole('heading', { name: 'Categorias', level: 1 })).toBeVisible()

    const linhas = page.getByRole('row')
    await expect(linhas.filter({ hasText: 'Pães' })).toBeVisible()
    await expect(linhas.filter({ hasText: 'Mercearia' })).toBeVisible()
  })

  test('a tabela mostra a faixa de vencimento de cada categoria', async ({ page }) => {
    await cadastrarPadaria(page)
    await page.goto('/categorias')

    await expect(page.getByRole('row').filter({ hasText: 'Pães' })).toContainText('1 dia')
    await expect(page.getByRole('row').filter({ hasText: 'Frios e laticínios' })).toContainText('3 dias')
    await expect(page.getByRole('row').filter({ hasText: 'Bebidas' })).toContainText('30 dias')
  })

  test('cria uma categoria nova e ela aparece na lista', async ({ page }) => {
    await cadastrarPadaria(page)
    await page.goto('/categorias')

    await page.getByRole('link', { name: 'Nova categoria' }).click()
    await page.getByLabel('Nome').fill('Sorvetes')
    await page.getByLabel(/Perecível/).check()
    await page.getByLabel('Alerta crítico').fill('60')
    await page.getByLabel('Alerta de atenção').fill('120')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page).toHaveURL(/\/categorias$/)
    const linha = page.getByRole('row').filter({ hasText: 'Sorvetes' })
    await expect(linha).toBeVisible()
    await expect(linha).toContainText('60 dias')
    await expect(linha).toContainText('120 dias')
  })

  test('recusa alerta de atenção que não vem antes do crítico', async ({ page }) => {
    await cadastrarPadaria(page)
    await page.goto('/categorias?nova=1')

    await page.getByLabel('Nome').fill('Congelados')
    await page.getByLabel(/Perecível/).check()
    await page.getByLabel('Alerta crítico').fill('30')
    await page.getByLabel('Alerta de atenção').fill('10')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.locator(ALERTA)).toContainText('antes do crítico')
    await expect(page).toHaveURL(/\/categorias/)
  })

  test('recusa nome repetido', async ({ page }) => {
    await cadastrarPadaria(page)
    await page.goto('/categorias?nova=1')

    await page.getByLabel('Nome').fill('Pães')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.locator(ALERTA)).toContainText('Já existe uma categoria com este nome')
  })

  test('edita a faixa de vencimento de uma categoria existente', async ({ page }) => {
    await cadastrarPadaria(page)
    await page.goto('/categorias')

    await page.getByRole('row').filter({ hasText: 'Bebidas' })
      .getByRole('link', { name: 'Editar' }).click()

    await expect(page.getByLabel('Nome')).toHaveValue('Bebidas')
    await page.getByLabel('Alerta crítico').fill('45')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByRole('row').filter({ hasText: 'Bebidas' })).toContainText('45 dias')
  })

  test('categoria durável não pede faixa de vencimento', async ({ page }) => {
    await cadastrarPadaria(page)
    await page.goto('/categorias?nova=1')

    await expect(page.getByLabel('Alerta crítico')).toHaveCount(0)

    await page.getByLabel('Nome').fill('Descartáveis')
    await page.getByRole('button', { name: 'Salvar' }).click()

    const linha = page.getByRole('row').filter({ hasText: 'Descartáveis' })
    await expect(linha).toBeVisible()
    await expect(linha).toContainText('Não vence')
  })
})
