import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const compat = new FlatCompat({
  baseDirectory: dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [{
  ignores: ["dist/**/*", "**/.eslintrc.cjs", "**/eslint.config.mjs", "**/jest.config.js"],
}, ...compat.extends("plugin:@typescript-eslint/recommended"), {
  plugins: {
    typescriptEslint: typescriptEslint,
  },

  languageOptions: {
    parser: tsParser,
    ecmaVersion: 5,
    sourceType: "script",

    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: dirname,
    },
  },

  rules: {
    "@typescript-eslint/naming-convention": ["error", {
      selector: "variable",
      format: ["camelCase"],
    }, {
        selector: "function",
        format: ["camelCase"],
      }, {
        selector: "typeLike",
        format: ["PascalCase"],
      }, {
        selector: "memberLike",
        format: ["camelCase"],
      }, {
        selector: "enumMember",
        format: ["PascalCase"],
      }],
  },
}, ...compat.extends("standard-with-typescript").map(config => ({
  ...config,
  files: ["**/*.ts"],
}))];