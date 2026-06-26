/** for build library use.  */
import { readFileSync } from 'node:fs';

import { pluginSass } from '@rsbuild/plugin-sass';
import { defineConfig } from '@rslib/core';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as {
  name: string;
  description: string;
  author: {
    name: string;
    email: string;
  };
  license: string;
  version: string;
  homepage: string;
};

const buildDate = new Date().toISOString();
const bannerText = `/**
 * ${pkg.name}
 *
 * @description ${pkg.description}
 * @author imaya, Logue
 * @license ${pkg.license}
 * @version ${pkg.version}
 * @see {@link ${pkg.homepage}}
 */
`;

export default defineConfig({
  source: {
    tsconfigPath: './tsconfig.app.json',
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_DATE__: JSON.stringify(buildDate),
    },
    entry: {
      index: './src/index.ts',
    },
  },
  plugins: [pluginSass()],
  output: {
    target: 'web',
    emitCss: true,
    distPath: {
      root: 'dist',
      css: '.',
    },
    filename: {
      css: 'sf2synth.css',
    },
    injectStyles: false,
  },
  lib: [
    {
      format: 'esm',
      syntax: 'esnext',
      bundle: true,
      banner: {
        js: bannerText,
      },
      output: {
        filename: {
          js: 'sf2synth.es.js',
        },
        sourceMap: true,
      },
    },
    {
      format: 'umd',
      syntax: 'esnext',
      umdName: 'sf2synth',
      bundle: true,
      banner: {
        js: bannerText,
      },
      output: {
        filename: {
          js: 'sf2synth.umd.js',
        },
        cleanDistPath: false,
        minify: true,
        sourceMap: true,
      },
      redirect: {
        style: {
          extension: false,
        },
      },
    },
  ],
});
