import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const app = new Hono()

const api = new Hono()
api.get('/health', (c) => c.json({ status: 'ok' }))

app.route('/api', api)

if (process.env['NODE_ENV'] === 'production') {
  const root = process.env['STATIC_DIR'] ?? join(fileURLToPath(new URL('.', import.meta.url)), '../../web/dist')
  console.log(`Root: ${root}`)
  app.use('/*', serveStatic({ root }))
}

const port = Number(process.env['PORT'] ?? 3000)
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API server running at http://localhost:${info.port}`)
})
