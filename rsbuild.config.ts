import { readFileSync } from 'node:fs';

import { defineConfig } from '@rsbuild/core';
import { pluginSass } from '@rsbuild/plugin-sass';

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

export default defineConfig({
  source: {
    entry: {
      index: './src/main.ts',
    },
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_DATE__: JSON.stringify(buildDate),
    },
  },
  plugins: [pluginSass()],
  html: {
    template: './index.html',
  },
  output: {
    distPath: {
      root: 'docs',
    },
  },
});
