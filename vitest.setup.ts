import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// O jsdom nao implementa matchMedia. Sem este substituto, qualquer componente
// que consulte preferencia de tema quebra o teste de quem apenas o renderiza.
beforeEach(() => {
  if (typeof window === 'undefined') return
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((consulta: string) => ({
      matches: false,
      media: consulta,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  })
})

afterEach(() => { cleanup() })
