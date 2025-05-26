/* eslint-env node */
module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ["dist/**"],
  rules: {
    "@typescript-eslint/naming-convention": [
      "error",
      { "selector": "variable", "format": ["camelCase"] },
      { "selector": "function", "format": ["camelCase"] },
      { "selector": "typeLike", "format": ["PascalCase"] },
      { "selector": "memberLike", "format": ["camelCase"] },
      { "selector": "enumMember", "format": ["PascalCase"] }
    ]
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'standard-with-typescript',
      ]
    }
  ]
};