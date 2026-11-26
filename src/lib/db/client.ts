import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireEnv } from "@/lib/env.server";
import type { Database } from "./types";

/*
 * The one database client for server code (02 §4, §7). It uses the service
 * role, which bypasses RLS, so it lives behind `server-only` and every caller
 * that touches private data checks permissions first (src/lib/permissions.ts).
 * The browser keys can't read any table: RLS is forced and they hold no grants.
 */

export type Db = SupabaseClient<Database>;

let client: Db | undefined;

export function db(): Db {
  client ??= createClient<Database>(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-client-info": "tsoh-server" } },
  });
  return client;
}
