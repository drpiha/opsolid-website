module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // reanimated 4.x is auto-wired by babel-preset-expo; the standalone
    // 'react-native-reanimated/plugin' is removed (it was for v3 and emits
    // a duplicate-registration warning on v4).
  };
};
