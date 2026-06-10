import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
// import { qrcode } from 'vite-plugin-qrcode'
import { devtools } from '@tanstack/devtools-vite'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  envDir: path.resolve(__dirname, '../..'),
  plugins: [
  	devtools(),
  	preact(),
  	// qrcode()
 ],
  css: {
    transformer: 'lightningcss',
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3330',
        changeOrigin: true,
      },
    },
  },
})
