/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  // Use '/' for Vercel/web deployments, './' for Electron
  // Vercel automatically sets VERCEL=1 and VERCEL_URL during CI/CD builds
  base: (process.env.VERCEL === '1' || process.env.VERCEL_URL || process.env.BUILD_TARGET === 'web') ? '/' : './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Use a more resilient approach for Windows
    rollupOptions: {
      output: {
        // This helps avoid file locking issues on Windows
        manualChunks: undefined,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      strict: false, // Allow accessing files outside of project root
    },
  },
  cacheDir: 'node_modules/.vite',
  optimizeDeps: {
    force: false, // Set to true if you need to force re-optimization
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/',
      ],
    },
  },
})
