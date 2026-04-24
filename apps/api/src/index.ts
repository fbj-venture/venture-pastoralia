import "dotenv/config"
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from "./env.js";

const app = new Hono()

const api = new Hono()
api.get('/health', (c) => c.json({status: 'ok'}))

app.route('/api', api)

if (env.NODE_ENV === 'production') {
   const root = env.hono.STATIC_DIR ?? join(fileURLToPath(new URL('.', import.meta.url)), '../../web/dist')
   console.log(`Root: ${root}`)
   app.use('/*', serveStatic({root}))
}

serve({fetch: app.fetch, port: env.hono.PORT}, (info) => {
   console.log(`API server running at http://localhost:${info.port}`)
})
