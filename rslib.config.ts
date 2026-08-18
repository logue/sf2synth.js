/** For build library use */
import { readFileSync } from 'node:fs';

//import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
import { pluginSass } from '@rsbuild/plugin-sass';
import { defineConfig } from '@rslib/core';

/**
 * The UMD name is used for the global variable name when the library
 * is included via a <script> tag.
 * DO NOT use kebab-case or snake_case for the UMD name.
 * Use camelCase or PascalCase instead.
 *
 * For example, if your library is called "my-library", you might use
 * "MyLibrary" as the UMD name.
 * Then, name might be used in the following way:
 *
 * @example
 * <script src="https://cdn.jsdelivr.net/npm/your-library@1.0.0/dist/index.umd.js"></script>
 * <script>
 *   const myLibrary = window.umdName;
 * </script>
 */
const umdName = 'Sf2Synth'; // CHANGE THIS to your library's global variable name.

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
  plugins: [
    pluginSass(),
    //pluginTypeCheck(),
  ],
  lib: [
    {
      banner: {
        js: bannerText,
      },
      dts: {
        // isolated: true,  // SWC fast_dts
        bundle: true,
        tsgo: true, // Enable TypeScript 7 native compiler
      },
      format: 'esm',
      output: {
        filename: {
          js: 'index.es.js',
        },
        sourceMap: true,
      },
    },
    {
      banner: {
        js: bannerText,
      },
      format: 'umd',
      output: {
        cleanDistPath: false,
        filename: {
          js: 'index.umd.js',
        },
        minify: true,
        sourceMap: true,
      },
      umdName,
    },
  ],
  source: {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_DATE__: JSON.stringify(buildDate),
    },
    tsconfigPath: './tsconfig.rslib.json',
  },
});
