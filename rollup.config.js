import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';

export default {
    entry: './src/index.ts',

    output: [
        { file: pkg.main, format: 'cjs' },
        { file: pkg.module, format: 'es' }
    ],

    plugins: [
        typescript()
    ]
}