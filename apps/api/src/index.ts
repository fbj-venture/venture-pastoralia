import "dotenv/config"
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from "./env.js"
import { auth } from "./routes/auth.js"

const api = new Hono()
  .get('/health', (c) => c.json({ status: 'ok' }))
  .route('/auth', auth)

const app = new Hono()
  .route('/api', api)

export type AppType = typeof app

if (env.NODE_ENV === 'production') {
  const root = env.hono.STATIC_DIR ?? join(fileURLToPath(new URL('.', import.meta.url)), '../../web/dist')
  console.log(`Root: ${root}`)
  app.use('/*', serveStatic({ root }))
}

serve({ fetch: app.fetch, port: env.hono.PORT }, (info) => {
  console.log(`API server running at http://localhost:${info.port}`)
})
