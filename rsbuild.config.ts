/** For build demo site use. */
import { defineConfig } from '@rsbuild/core';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';

import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as {
  version: string;
};

const buildDate = new Date().toISOString();

export default defineConfig({
  plugins: [
    pluginTypeCheck(),
    pluginSass(),
  ],
  output: {
    assetPrefix: './',
    distPath: {
      root: 'docs',
    },
    filenameHash: true,
  },
  html: {
    template: './src-docs/index.html',
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
  tools: {
    rspack: {
      plugins: [
        process.env.RSDOCTOR === 'true' &&
          new RsdoctorRspackPlugin({
            // plugin options
          }),
      ],
    },
  },
});
