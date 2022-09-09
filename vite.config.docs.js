import { checker } from 'vite-plugin-checker';
import { defineConfig } from 'vite';

/** @type {import('vite').UserConfig} https://vitejs.dev/config/ */
const config = {
  // https://vitejs.dev/config/#base
  base: './',
  // https://vitejs.dev/config/#server-options
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
  resolve: {
    alias: [
      {
        // this is required for the SCSS modules
        find: /^~(.*)$/,
        replacement: '$1',
      },
    ],
  },
  plugins: [
    // vite-plugin-checker
    // https://github.com/fi3ework/vite-plugin-checker
    checker({
      typescript: false,
      vueTsc: false,
      eslint: {
        lintCommand: `eslint`, // for example, lint .ts & .tsx
      },
    }),
  ],
  // Build Options
  // https://vitejs.dev/config/#build-options
  build: {
    outDir: 'docs',
    // Minify option
    // https://vitejs.dev/config/#build-minify
    minify: 'esbuild',
  },
};

// Export vite config
export default defineConfig(async ({ command }) => {
  // Hook production build.
  // Write meta data.
  return config;
});
