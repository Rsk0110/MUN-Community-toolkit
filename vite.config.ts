import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/MUN-Community-toolkit/",
  plugins: [react()],
});
