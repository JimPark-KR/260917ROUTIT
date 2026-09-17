module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // reanimated 플러그인은 항상 plugins 배열의 마지막에 위치해야 함
    plugins: ['react-native-reanimated/plugin'],
  };
};
