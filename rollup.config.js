import babel from 'rollup-plugin-babel';
import commonjs from "@rollup/plugin-commonjs";
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: './src/index.js',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/index.es.js',
        format: 'es',
        exports: 'named',
      }
    ],
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react'],
        plugins: ["@babel/plugin-proposal-class-properties"]
      }),
      commonjs({
        include: 'node_modules/**',
        namedExports: {
          'node_modules/react-is/index.js': ['isFragment', 'ForwardRef']
        }
      }),
      external(),
      resolve(),
      terser(),
    ]
  }
];