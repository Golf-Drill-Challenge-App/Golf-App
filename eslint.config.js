const reactNativeConfig = require("@react-native/eslint-config");
const babelParser = require("@babel/eslint-parser");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ["@babel/preset-react"],
        },
      },
    },
    plugins: {
      "react-hooks": reactHooksPlugin,
      reactNativeConfig,
      eslintConfigPrettier,
    },
    rules: {
      "prefer-const": "error",
      ...reactHooksPlugin.configs.recommended.rules,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    ignores: ["venv/**", "node_modules/**"],
  },
];
