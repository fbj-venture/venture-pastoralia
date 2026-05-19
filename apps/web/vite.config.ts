import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import { qrcode } from 'vite-plugin-qrcode'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  envDir: path.resolve(__dirname, '../..'),
  plugins: [
  	preact(), 
  	qrcode() 
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
