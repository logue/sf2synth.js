/** For build documentation site use. */
import { readFileSync } from 'node:fs';

import { defineConfig } from '@rsbuild/core';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as {
  version: string;
};

const buildDate = new Date().toISOString();

export default defineConfig({
  output: {
    distPath: {
      root: 'docs',
    },
    assetPrefix: './',
    filenameHash: true,
  },
  html: {
    template: './index.html'
  },
  source: {
    tsconfigPath: './tsconfig.rsbuild.json',
    include: ['./src'],
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_DATE__: JSON.stringify(buildDate),
    },
    entry: {
      index: './src-docs/index.ts',
    },
  },
});
