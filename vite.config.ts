import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },

  // ✅ Add this section for production hosting on Render
  build: {
    outDir: "dist", // where Render expects built files
    emptyOutDir: true,
  },

  // ✅ Important for React Router on Render
  base: "./", // ensures paths resolve correctly in static hosting
}));
