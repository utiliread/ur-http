import typescript from "@rollup/plugin-typescript";

/** @type {import('rollup').RollupOptions} */
const options = {
  input: "src/plugins/jsonpatch/index.ts",
  external: ["@utiliread/http", "@utiliread/json", "luxon"],
  treeshake: false,
  plugins: [typescript({ declaration: false })],
};

export default [
  Object.assign(
    {
      output: {
        file: "dist/plugins/jsonpatch/index.mjs",
        sourcemap: true,
        format: "es",
      },
    },
    options,
  ),
  Object.assign(
    {
      output: {
        file: "dist/plugins/jsonpatch/index.js",
        sourcemap: true,
        format: "cjs",
      },
    },
    options,
  ),
];
