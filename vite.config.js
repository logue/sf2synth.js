import { writeFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';

import banner from 'vite-plugin-banner';
import { checker } from 'vite-plugin-checker';

import pkg from './package.json';

const build = new Date().toISOString();

// Export vite config
export default defineConfig(async ({ mode, command }) => {
  // Hook production build.
  const buildDate = new Date().toISOString();
  /** @type {import('vite').UserConfig} https://vitejs.dev/config/ */
  const config = {
    // https://vitejs.dev/config/shared-options.html#base
    base: './',
    // https://vitejs.dev/config/shared-options.html#define
    define: {
      'process.env': {},
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_DATE__: JSON.stringify(buildDate),
    },
    plugins: [
      // vite-plugin-checker
      // https://github.com/fi3ework/vite-plugin-checker
      checker({
        typescript: false,
        vueTsc: false,
        // eslint: { lintCommand: 'eslint' }, // for example, lint .ts & .tsx
      }),
      // vite-plugin-banner
      // https://github.com/chengpeiquan/vite-plugin-banner
      // @ts-ignore
      banner(`/**
 * ${pkg.name}
 *
 * @description ${pkg.description}
 * @author iyama, Logue
 * @license ${pkg.license}
 * @version ${pkg.version}
 * @see {@link ${pkg.homepage}}
 */
`),
    ],
    // Resolver
    resolve: {
      // https://vitejs.dev/config/shared-options.html#resolve-alias
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('./node_modules', import.meta.url)),
      },
    },
    // Build Options
    // https://vitejs.dev/config/build-options.html
    build: {
      // Build Target
      // https://vitejs.dev/config/build-options.html#build-target
      target: 'esnext',
      outDir: mode === 'docs' ? 'docs' : 'dist',
      // Minify option
      // https://vitejs.dev/config/build-options.html#build-minify
      minify: true,
      // https://vitejs.dev/config/build-options.html#build-lib
      lib:
        mode === 'docs'
          ? undefined
          : {
              entry: fileURLToPath(new URL('./src/Index.ts', import.meta.url)),
              name: 'SoundFont',
              formats: ['es', 'umd', 'iife'],
              fileName: format => `sf2synth.${format}.js`,
            },
      // https://vitejs.dev/config/build-options.html#build-sourcemap
      sourcemap: true,
    },
  };

  return config;
});
