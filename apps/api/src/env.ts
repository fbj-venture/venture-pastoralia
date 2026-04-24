import { createEnv, group, Infer, prop } from "inertia-ts"

const schema = {
   NODE_ENV: prop.string(),
   Hono: group({
      PORT: prop.port("the Hono (API) web server port"),
      STATIC_DIR: prop.string("the directory to server the static parts of the website from")
   }),
   db: group({
      DATABASE_URL: prop.url("the Supabase DB connection string")
   })
}

const result = createEnv(schema)

if (!result.success) {
   throw result.errors
}

export const env: Infer<typeof schema> = result.data

