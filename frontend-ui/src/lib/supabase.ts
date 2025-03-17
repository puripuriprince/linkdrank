import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@supabase/supabase-js";

import { CONFIG } from "@/global-config";

// ----------------------------------------------------------------------

const isSupabase = CONFIG.auth.method === "supabase";

const supabaseUrl = CONFIG.supabase.url;
const supabaseKey = CONFIG.supabase.key;

export const supabase = isSupabase
  ? createClient(supabaseUrl, supabaseKey)
  : ({} as SupabaseClient<never, "public", never>);
