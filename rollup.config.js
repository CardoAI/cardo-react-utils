import babel from 'rollup-plugin-babel'
import pkg from './package.json'
import resolve from '@rollup/plugin-node-resolve'
import {terser} from 'rollup-plugin-terser'
import commonjs from "@rollup/plugin-commonjs";
import typescript from '@rollup/plugin-typescript';

const extensions = ['.js', '.jsx', '.ts', '.tsx']

export default [
    {
        input: 'src/index.ts',
        external: [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
        ],
        output: [
            {
                file: pkg.main,
                format: 'cjs',
            },
            {
                file: pkg.module,
                format: 'es',
            },
        ],
        plugins: [
            typescript(),
            resolve({extensions}),
            commonjs({ extensions: extensions }) ,
            babel({
                extensions,
                include: ['src/**/*'],
            }),
            terser(),
        ],
    },
]