import { esbuildPlugin } from "@web/dev-server-esbuild";

export default {
  nodeResolve: true,
  files: ["src/**/*.spec.ts"],
  plugins: [esbuildPlugin({ ts: true })],
};
