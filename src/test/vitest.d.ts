/// <reference types="vitest" />

// 扩展Vitest全局类型
import 'vitest/globals'

// 声明Vitest环境变量类型
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_USE_MOCK_DATA: string
  readonly VITE_DEBUG_MODE: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 扩展全局对象类型
declare global {
  interface Window {
    matchMedia: typeof matchMedia
  }
  
  const vi: typeof import('vitest').vi
  const describe: typeof import('vitest').describe
  const it: typeof import('vitest').it
  const test: typeof import('vitest').test
  const expect: typeof import('vitest').expect
  const beforeAll: typeof import('vitest').beforeAll
  const afterAll: typeof import('vitest').afterAll
  const beforeEach: typeof import('vitest').beforeEach
  const afterEach: typeof import('vitest').afterEach
}