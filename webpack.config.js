const webpack = require('webpack');
const path = require('path');
const pjson = require('./package.json');

module.exports = env => {
  const isProduction = (env && env.production);
  return {
    mode: env,
    target: 'node',
    devtool: !isProduction ? 'source-map' : false,
    devServer: {
      contentBase: "docs",
      open: false
    },
    entry: {
      'sf2.synth': './src/wml.js',
      'sf2.parser': './src/sf2.js',
      'reverb': './src/reverb.js',
    }, 
    output: {
      path: path.resolve(__dirname, 'bin'),
      filename: !isProduction ? '[name].js' : '[name].min.js',
      library: "SoundFont",
      libraryTarget: 'umd',
      umdNamedDefine: true,
      globalObject: `(typeof self !== 'undefined' ? self : this)`
    },
    plugins: [
      new webpack.BannerPlugin({
          banner: `${pjson.name} | ${pjson.author} / ${pjson.contributors} | license: ${pjson.license}`
      })
    ]
  };
};