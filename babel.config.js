module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "module:metro-react-native-babel-preset"],
    plugins: [
      // Fix issues with test login script (yarn test), and build cache
      // Reference: https://github.com/expo/router/issues/41#issuecomment-1657674119
      [
        "transform-inline-environment-variables",
        {
          include: ["EXPO_ROUTER_APP_ROOT"],
        },
      ],
      require.resolve("expo-router/babel"),
      "@babel/plugin-transform-export-namespace-from",
      "react-native-paper/babel",
      "react-native-reanimated/plugin",
      [
        "babel-plugin-root-import",
        {
          rootPathPrefix: "~",
          rootPathSuffix: ".",
        },
      ],
    ],
  };
};
