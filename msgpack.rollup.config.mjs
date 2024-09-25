import typescript from "@rollup/plugin-typescript";

/** @type {import('rollup').RollupOptions} */
const options = {
  input: "src/plugins/msgpack/index.ts",
  external: [
    "@msgpack/msgpack",
    "@utiliread/http",
    "@utiliread/msgpack",
    "luxon",
  ],
  treeshake: false,
  plugins: [typescript({ declaration: false })],
};

export default [
  Object.assign(
    {
      output: {
        file: "dist/plugins/msgpack/index.mjs",
        sourcemap: true,
        format: "es",
      },
    },
    options,
  ),
  Object.assign(
    {
      output: {
        file: "dist/plugins/msgpack/index.js",
        sourcemap: true,
        format: "cjs",
      },
    },
    options,
  ),
];
