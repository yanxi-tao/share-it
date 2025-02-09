import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      '~': '/src',
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
  },
})
