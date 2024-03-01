module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "module:metro-react-native-babel-preset"],
    plugins: [
      require.resolve("expo-router/babel"),
      'react-native-paper/babel',
      "react-native-reanimated/plugin",
[
      'babel-plugin-root-import',
      {
        rootPathPrefix: '~',
        rootPathSuffix: '.',
      },]
    ],
  };
};
