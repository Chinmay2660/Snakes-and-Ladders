import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: [
          [
            '@babel/preset-react',
            {
              development: process.env.NODE_ENV === 'development',
              runtime: 'automatic',
            },
          ],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    // Enable code splitting and tree shaking
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching and smaller initial bundle
        manualChunks: (id) => {
          // Split node_modules into smaller chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('react-router')) {
              return 'router-vendor'
            }
            if (id.includes('redux') || id.includes('@reduxjs')) {
              return 'redux-vendor'
            }
            // Other vendor libraries
            return 'vendor'
          }
        },
        // Optimize chunk file names for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
      // Tree shaking configuration
      treeshake: {
        // Remove unused code more aggressively
        moduleSideEffects: (id) => {
          // Only CSS files and main entry have side effects
          return id.endsWith('.css') || id.includes('main.tsx')
        },
        // Preserve class names for better debugging (optional)
        propertyReadSideEffects: false,
        // Try to remove unused code even if it might have side effects
        tryCatchDeoptimization: false,
      },
    },
    // Tree shaking is enabled by default in Vite with esbuild
    minify: 'esbuild', // Fast minification with tree shaking
    sourcemap: process.env.NODE_ENV === 'development',
    // Optimize for tree shaking
    target: 'esnext', // Use modern ES features for better tree shaking
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize asset inlining threshold (inline small assets)
    assetsInlineLimit: 4096,
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'react-redux'],
    // Exclude large dependencies from pre-bundling if not needed immediately
    exclude: [],
  },
})
