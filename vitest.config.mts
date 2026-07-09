import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@lib": path.resolve(__dirname, "./lib"),
      "@components": path.resolve(__dirname, "./components"),
      "@pages": path.resolve(__dirname, "./components/pages"),
      "@common": path.resolve(__dirname, "./components/common"),
      "@layout": path.resolve(__dirname, "./components/layout"),
      "@icons": path.resolve(__dirname, "./components/icons"),
      "@store": path.resolve(__dirname, "./store"),
      "@provider": path.resolve(__dirname, "./components/provider"),
      "@hooks": path.resolve(__dirname, "./hooks"),
      "@api": path.resolve(__dirname, "./lib/api"),
      "@constant": path.resolve(__dirname, "./constant"),
      "@types": path.resolve(__dirname, "./types"),
    },
  },
  test: {
    globals: false,
    exclude: ["**/node_modules/**", "**/tests/e2e/**", "**/.next/**"],
  },
});
