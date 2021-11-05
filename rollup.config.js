import path from 'path';
import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import cleaner from 'rollup-plugin-cleaner';
import alias from '@rollup/plugin-alias';
import { terser } from 'rollup-plugin-terser';

const resolve = (p) => {
  return path.resolve(process.cwd(), p);
};

export default defineConfig({
  input: resolve('./src/index.ts'),
  output: [
    {
      format: 'cjs',
      file: resolve('lib/index.js'),
    },
    {
      format: 'cjs',
      file: resolve('lib/index.min.js'),
      plugins: [terser()],
    },
    {
      format: 'esm',
      file: resolve('es/index.js'),
    },
    {
      format: 'esm',
      file: resolve('es/index.min.js'),
      plugins: [terser()],
    },
  ],
  plugins: [
    alias({
      entries: [{ find: '@', replacement: resolve('src') }],
    }),
    json(),
    cleaner({
      targets: ['lib', 'es'],
    }),
    commonjs(),
    nodeResolve({
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
    }),
  ],
});
