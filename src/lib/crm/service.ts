import { createClient } from '@supabase/supabase-js'

/** Service-role client for token-based public endpoints. Server only; never import in client code. */
export function serviceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })
}
