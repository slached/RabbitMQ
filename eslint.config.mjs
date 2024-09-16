import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    env: {
      node: true,
      es2021: true,
    },
    extends: "eslint:recommended",
    parserOptions: {
      ecmaVersion: 12,
    },
  },
];
