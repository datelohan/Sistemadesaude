/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'auth',
        'budget',
        'quote',
        'contract',
        'product',
        'client',
        'supplier',
        'admin',
        'shared',
        'infra',
        'docker',
        'docs',
      ],
    ],
  },
}
