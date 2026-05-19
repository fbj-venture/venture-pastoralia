import { createClient } from '@supabase/supabase-js'
import { env } from '../env.js'

// Public client — used for signInWithPassword and token validation
export const supabase = createClient(
  env.supabase.SUPABASE_URL,
  env.supabase.SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

// Admin client — used for invite, revoke, and other user management operations
export const supabaseAdmin = createClient(
  env.supabase.SUPABASE_URL,
  env.supabase.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
)
