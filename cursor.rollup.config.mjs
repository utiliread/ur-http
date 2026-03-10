import typescript from "@rollup/plugin-typescript";

/** @type {import('rollup').RollupOptions} */
const options = {
  input: "src/plugins/cursor/index.ts",
  external: [
    "@utiliread/http",
    "@utiliread/json",
  ],
  treeshake: false,
  plugins: [typescript({ declaration: false })],
};

export default [
  Object.assign(
    {
      output: {
        file: "dist/plugins/cursor/index.mjs",
        sourcemap: true,
        format: "es",
      },
    },
    options,
  ),
  Object.assign(
    {
      output: {
        file: "dist/plugins/cursor/index.js",
        sourcemap: true,
        format: "cjs",
      },
    },
    options,
  ),
];
