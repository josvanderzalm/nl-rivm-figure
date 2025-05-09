import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        noconflict: "noconflict-wrapper.html",
      },
    },
  },
});
