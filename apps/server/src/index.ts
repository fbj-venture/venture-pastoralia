import "dotenv/config"
import {serve} from '@hono/node-server'
import {serveStatic} from '@hono/node-server/serve-static'
import {Hono} from 'hono'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {env} from "./env.js"
import {auth} from "./routes/auth.js"

// Base routes
const api = new Hono()
  .route('/auth', auth)

// Root route (everything is under `api`)
const app =
  new Hono()
    .get('/health', (c) => c.json({status: 'ok'}))
    .route('/api', api)

// The Types for the API
export type AppType = typeof app

// Setup the static part of the app - in production this will be the Vite Web app
if (env.NODE_ENV === 'production') {
  const root = env.hono.STATIC_DIR ?? join(fileURLToPath(new URL('.', import.meta.url)), '../../client/dist')
  console.log(`Root: ${root}`)
  app.use('/*', serveStatic({root}))
}

// Start the API server
serve({fetch: app.fetch, port: env.hono.PORT}, (info) => {
  console.log(`API server running at http://localhost:${info.port}`)
})
