import { createEnv, formatEnvError, group, Infer, prop } from "inertia-ts"
import pkg from "../package.json" with { type: "json" }

const schema = {
   NODE_ENV: prop.string(),
   hono: group({
      PORT: prop.port("the Hono (API) web server port"),
      STATIC_DIR: prop.string("the directory to server the static parts of the website from")
   }),
   db: group({
      DATABASE_URL: prop.url("the Supabase DB connection string")
   }),
   supabase: group({
      SUPABASE_URL: prop.url("the Supabase project URL"),
      SUPABASE_ANON_KEY: prop.string("the Supabase anon/public key"),
      SUPABASE_SERVICE_ROLE_KEY: prop.string("the Supabase service role key for admin operations")
   })
}

const result = createEnv(schema)

if (!result.success) {
   throw formatEnvError(pkg.name, result, {description: pkg.description, color: true})
}

export const env: Infer<typeof schema> = result.data

