const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const pjson = require('./package.json');
const build = new Date().toISOString();

fs.writeFileSync(path.resolve(path.join(__dirname, 'src/meta.js')),
  `// This file is auto-generated by the build system.
const Meta = {
  version: '${pjson.version}',
  date: '${build}',
};
export default Meta;
`);

module.exports = (env) => {
  const isProduction = env && env.production;
  const banner = `${pjson.name} v${pjson.version} | ${pjson.author.name} / ${pjson.contributors[0].name} | license: ${pjson.license} | build: ${build}`;

  return {
    mode: env,
    target: 'node',
    devtool: !isProduction ? 'source-map' : false,
    devServer: {
      contentBase: 'docs',
      open: false,
    },
    entry: {
      'sf2.synth': './src/wml.js',
      'sf2.parser': './src/sf2.js',
    },
    output: {
      path: path.resolve(__dirname, 'bin'),
      filename: !isProduction ? '[name].js' : '[name].min.js',
      library: 'SoundFont',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      globalObject: `(typeof self !== 'undefined' ? self : this)`,
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 6,
            compress: { drop_console: true },
            output: {
              comments: false,
              beautify: false,
            },
            extractComments: {
              condition: true,
              banner: (f) => {
                return banner;
              },
            },
          },
        }),
      ],
      splitChunks: {
        minSize: 0,
      },
      concatenateModules: false,
    },
    module: {
      rules: [
        {
          test: /\.js/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
      ],
    },
    resolve: {
      modules: [`${__dirname}/src`, 'node_modules'],
      extensions: ['.js'],
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: banner,
      }),
    ],
  };
};