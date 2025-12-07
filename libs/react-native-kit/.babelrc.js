module.exports = function (api) {
  api.cache(false);

  // For React Native, always include nativewind/babel
  // It's safe to include even for web builds
  const presets = [
    // nativewind/babel must come first to transform className -> style
    'nativewind/babel',
    [
      '@nx/react/babel',
      {
        runtime: 'automatic',
        useBuiltIns: 'usage',
      },
    ],
  ];

  return {
    presets,
    plugins: [],
    env: {
      test: {
        presets: ['babel-preset-expo'],
      },
    },
  };
};
