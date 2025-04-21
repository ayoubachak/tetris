import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Add this to fix HMR issues with React components
      fastRefresh: true
    }),
  ],
  base: '/tetris/', // Base path for GitHub Pages
  css: {
    // Ensure CSS modules are processed correctly
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    // Improve CSS handling during development
    devSourcemap: true,
  },
  // Enable more detailed HMR logging
  build: {
    sourcemap: true,
    cssCodeSplit: true,
    minify: 'terser',
  },
  // Optimize caching and asset handling
  server: {
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
  }
})
