/** For build documentation site use. */
import { readFileSync } from 'node:fs';
import { defineConfig } from '@rsbuild/core';
import { pluginSass } from '@rsbuild/plugin-sass';

// import { pluginTypeCheck } from '@rsbuild/plugin-type-check';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as {
  version: string;
};

const buildDate = new Date().toISOString();

export default defineConfig({
  plugins: [
    pluginSass(),
    // pluginTypeCheck(),
  ],
  html: {
    template: './index.html',
  },
  output: {
    assetPrefix: './',
    distPath: {
      root: 'docs',
    },
    filenameHash: true,
  },
  source: {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_DATE__: JSON.stringify(buildDate),
    },
    entry: {
      index: './src-docs/index.ts',
    },
    include: [
      './src',
    ],
    tsconfigPath: './tsconfig.rsbuild.json',
  },
});
