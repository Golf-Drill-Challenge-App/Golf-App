// General Reference: https://www.npmjs.com/package/eslint-plugin-react-hooks
// Note that eslint (main library) is downgraded to version "8.57.0", due to some compatibility issues
// between eslint v9 and the eslint react-hooks plugin: https://github.com/facebook/react/issues/28313

module.exports = {
  plugins: [
    // Also added "eslint-plugin-react" to package.json just in case it helps in the future, but for now we are not using it
    "react-hooks",
  ],
  rules: {
    // Your custom rules
    "react-hooks/rules-of-hooks": "error",
    // "react-hooks/exhaustive-deps": "warn"
  },
  parserOptions: {
    // to stop it from complaining about "import" syntax
    sourceType: "module",
    ecmaVersion: 2015,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
