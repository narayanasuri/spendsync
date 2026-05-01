import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

export const getSupabase = () => {
  const url = process.env.SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient<Database>(url, key)
}

export const missingCreds = () => {
  return Response.json(
    { error: "Server misconfiguration: missing Supabase credentials" },
    { status: 500 }
  )
}
