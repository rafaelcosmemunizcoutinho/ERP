import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  timeout: 60000,
  expect: { timeout: 15000 },
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://erp-web-app:3000',
    navigationTimeout: 45000,
    actionTimeout: 20000,
    trace: 'retain-on-failure',
    locale: 'pt-BR'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // O host interno "app" faz o Chromium tentar upgrade para HTTPS e
        // falhar com ERR_SSL_PROTOCOL_ERROR num endereco http:// legitimo.
        launchOptions: {
          args: ['--disable-features=HttpsUpgrades,HttpsFirstBalancedModeAutoEnable']
        }
      }
    }
  ]
})
