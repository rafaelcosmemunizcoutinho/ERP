import a11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: [
      'legacy/**',
      '.next/**',
      'drizzle/**',
      'node_modules/**',
      'storybook-static/**',
      'coverage/**'
    ]
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    }
  },
  {
    files: ['**/*.tsx'],
    plugins: { 'jsx-a11y': a11y },
    rules: a11y.flatConfigs.strict.rules
  }
]
