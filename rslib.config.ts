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
 * @author iyama, Logue
 * @license ${pkg.license}
 * @version ${pkg.version}
 * @see {@link ${pkg.homepage}}
 */
`;

export default defineConfig({
  plugins: [pluginSass()],
  lib: [
    {
      format: 'esm',
      syntax: 'es2021',
      dts: true,
      banner: {
        js: bannerText,
      },
      output: {
        filename: {
          js: 'index.es.js',
        },
        sourceMap: true,
      },
    },
    {
      format: 'umd',
      syntax: 'es2021',
      umdName: 'sf2synth',
      banner: {
        js: bannerText,
      },
      output: {
        filename: {
          js: 'index.umd.js',
        },
        cleanDistPath: false,
        minify: true,
        sourceMap: true,
      },
    },
  ],
  source: {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_DATE__: JSON.stringify(buildDate),
    },
  },
});
