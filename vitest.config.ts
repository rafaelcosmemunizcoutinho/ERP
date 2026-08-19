import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'lcov'],
      // Lista escopada ao que JA tem teste, crescendo arquivo a arquivo.
      // Um include amplo travaria o gate de 100% sem chance de merge.
      include: [
        'src/ui/atoms/**/*.tsx',
        'src/lib/cn.ts',
        'src/i18n/index.ts',
      ],
      exclude: ['**/*.stories.tsx', '**/*.test.{ts,tsx}'],
      thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 },
    },
  },
})
