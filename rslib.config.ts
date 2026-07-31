/** For build library use */
import { readFileSync } from 'node:fs';

import { defineConfig } from '@rslib/core';

const umdName = 'Sf2Synth';
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
* @author ${pkg.author.name} <${pkg.author.email}>
* @copyright 2013-2026 By Masashi Yoshikawa All rights reserved.
* @license ${pkg.license}
* @version ${pkg.version}
* @see {@link ${pkg.homepage}}
*/
`;

export default defineConfig({
  lib: [
    {
      format: 'esm',
      dts: {
        tsgo: true, // Enable TypeScript 7 native compiler
        // isolated: true,  // SWC fast_dts
        bundle: true,
      },
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
      umdName,
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
    tsconfigPath: './tsconfig.rslib.json',
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_DATE__: JSON.stringify(buildDate),
    },
  },
});
