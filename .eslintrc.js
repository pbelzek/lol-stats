module.exports = {
  plugins: ["prettier", "import"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended"
  ],
  rules: {
    '@typescript-eslint/ban-types': ['error', { types: { Function: false } }],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: false },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@lib/logger',
            importNames: ['logger'],
            message: 'consider using injected contextual logger',
          },
        ],
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        modifiers: ['const', 'destructured', 'global'],
        format: ['strictCamelCase'],
      },
      {
        selector: 'variable',
        modifiers: ['exported'],
        types: ['boolean', 'string', 'number', 'array'],
        format: ['UPPER_CASE'],
      },
      {
        selector: 'enum',
        format: ['UPPER_CASE'],
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
      {
        selector: 'function',
        // allow StrictPascalCase for decorators
        format: ['strictCamelCase', 'StrictPascalCase'],
      },
      {
        selector: ['class', 'interface', 'typeAlias'],
        format: ['StrictPascalCase'],
      },
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
      },
    ],
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '@/**',
            group: 'parent',
            position: 'before',
          },
        ],

        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'ignore',
        alphabetize: { order: 'ignore' },
      },
    ],
    '@typescript-eslint/quotes': [
      'error',
      'double',
      { allowTemplateLiterals: false, avoidEscape: true },
    ],
  },
};