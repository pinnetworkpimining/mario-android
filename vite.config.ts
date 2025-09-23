import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    port: 3000,
    host: true
  },
  // test config for Vitest should be in vite.config.ts only if using Vitest plugin, otherwise move to vitest.config.ts
  plugins: [vue()]
});
