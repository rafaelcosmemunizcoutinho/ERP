import { expect, test } from '@playwright/test'

function marca (): string {
  return Math.random().toString(36).slice(2, 10)
}

// O Next mantem um <div role="alert"> vazio como anunciador de rota; sem
// excluir, todo getByRole('alert') vira violacao de strict mode.
const SELETOR_ALERTA = '[role="alert"]:not(#__next-route-announcer__)'

test.describe('navegação real', () => {
  test('visitante sem sessão é mandado para o login', async ({ page }) => {
    await page.goto('/painel')
    await expect(page).toHaveURL(/\/entrar$/)
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible()
  })

  test('o login recusa credenciais inexistentes sem vazar qual campo errou', async ({ page }) => {
    await page.goto('/entrar')
    await page.getByLabel('E-mail').fill('ninguem@exemplo.com.br')
    await page.getByLabel('Senha').fill('senha-qualquer-123')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await expect(page.locator(SELETOR_ALERTA)).toHaveText('E-mail ou senha incorretos.')
  })

  test('o formulário de cadastro mostra as categorias do segmento escolhido', async ({ page }) => {
    await page.goto('/comecar')

    const categorias = page.getByRole('list', { name: 'Categorias do segmento' })

    await expect(categorias.getByRole('listitem').filter({ hasText: 'Pães' })).toBeVisible()

    await page.getByText('Hortifrúti', { exact: true }).click()
    await expect(categorias.getByRole('listitem').filter({ hasText: 'Verduras' })).toBeVisible()
    await expect(categorias.getByRole('listitem').filter({ hasText: 'Pães' })).toHaveCount(0)

    await page.getByText('Adega', { exact: true }).click()
    await expect(categorias.getByRole('listitem').filter({ hasText: 'Cervejas' })).toBeVisible()
  })

  test('cadastra um comércio, entra no painel e sai', async ({ page }) => {
    const id = marca()
    const email = `dono-${id}@exemplo.com.br`
    const senha = 'senha-de-teste-forte-123'

    await page.goto('/comecar')
    await page.getByText('Padaria', { exact: true }).click()
    await page.getByLabel('Nome do comércio').fill(`Panificadora ${id} Ltda`)
    await page.getByLabel('Nome que aparece no sistema').fill(`Padaria ${id}`)
    await page.getByLabel('Seu nome').fill('Rafael Coutinho')
    await page.getByLabel('Seu e-mail').fill(email)
    await page.getByLabel('Crie uma senha').fill(senha)
    await page.getByRole('button', { name: 'Criar meu sistema' }).click()

    await expect(page).toHaveURL(/\/painel$/)
    await expect(page.getByRole('heading', { name: 'Olá, Rafael Coutinho' })).toBeVisible()

    // A identidade da empresa vive na barra lateral; os numeros, no conteudo.
    const barra = page.getByRole('complementary')
    await expect(barra.getByText(`Padaria ${id}`)).toBeVisible()
    await expect(barra.getByText('padaria', { exact: true })).toBeVisible()

    const conteudo = page.locator('#conteudo')
    await expect(conteudo.getByText('Categorias')).toBeVisible()
    await expect(conteudo.getByText('Contas no plano')).toBeVisible()

    await page.getByRole('button', { name: 'Sair' }).click()
    await expect(page).toHaveURL(/\/entrar$/)

    await page.goto('/painel')
    await expect(page).toHaveURL(/\/entrar$/)

    await page.getByLabel('E-mail').fill(email)
    await page.getByLabel('Senha').fill(senha)
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).toHaveURL(/\/painel$/)
    await expect(page.getByRole('heading', { name: 'Olá, Rafael Coutinho' })).toBeVisible()
  })

  test('o cadastro recusa senha curta antes de criar qualquer coisa', async ({ page }) => {
    const id = marca()
    await page.goto('/comecar')
    await page.getByLabel('Nome do comércio').fill(`Curta ${id}`)
    await page.getByLabel('Seu nome').fill('Teste')
    await page.getByLabel('Seu e-mail').fill(`curta-${id}@exemplo.com.br`)

    const senha = page.getByLabel('Crie uma senha')
    await senha.fill('123')
    await senha.evaluate((campo: HTMLInputElement) => { campo.minLength = 0 })

    await page.getByRole('button', { name: 'Criar meu sistema' }).click()
    await expect(page.locator(SELETOR_ALERTA)).toContainText('pelo menos 10 caracteres')
    await expect(page).toHaveURL(/\/comecar$/)
  })
})

test.describe('tema e PWA', () => {
  test('o manifesto declara o app instalável com ícones válidos', async ({ request }) => {
    const resposta = await request.get('/manifest.webmanifest')
    expect(resposta.ok()).toBe(true)

    const manifesto = await resposta.json()
    expect(manifesto.name).toBe('ERP Web')
    expect(manifesto.display).toBe('standalone')
    expect(manifesto.start_url).toBe('/painel')

    const tamanhos = manifesto.icons.map((i: { sizes: string }) => i.sizes)
    expect(tamanhos).toContain('192x192')
    expect(tamanhos).toContain('512x512')

    for (const icone of manifesto.icons) {
      const arquivo = await request.get(icone.src)
      expect(arquivo.ok(), `ícone ${icone.src} deve existir`).toBe(true)
      expect(arquivo.headers()['content-type']).toContain('image/png')
    }
  })

  test('a escolha de tema sobrevive ao recarregamento, sem lampejo', async ({ page }) => {
    const id = marca()
    const email = `tema-${id}@exemplo.com.br`
    const senha = 'senha-de-teste-forte-123'

    await page.goto('/comecar')
    await page.getByLabel('Nome do comércio').fill(`Adega ${id}`)
    await page.getByLabel('Seu nome').fill('Marcos Dias')
    await page.getByLabel('Seu e-mail').fill(email)
    await page.getByLabel('Crie uma senha').fill(senha)
    await page.getByRole('button', { name: 'Criar meu sistema' }).click()
    await expect(page).toHaveURL(/\/painel$/)

    const raiz = page.locator('html')
    await expect(raiz).not.toHaveClass(/dark/)

    await page.getByRole('radio', { name: 'Escuro' }).click()
    await expect(raiz).toHaveClass(/dark/)

    await page.reload()
    // O script anti-flash aplica a classe ANTES da primeira pintura: se ela
    // já está presente no primeiro instante, não houve lampejo branco.
    await expect(raiz).toHaveClass(/dark/)
    await expect(page.getByRole('radio', { name: 'Escuro' })).toHaveAttribute('aria-checked', 'true')

    await page.getByRole('radio', { name: 'Claro' }).click()
    await page.reload()
    await expect(raiz).not.toHaveClass(/dark/)
  })
})
