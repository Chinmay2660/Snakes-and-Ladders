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
    // No custom manualChunks/treeshake overrides: they broke React (setting Activity of undefined).
    rollupOptions: {
      output: {
        // Optimize chunk file names for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
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
