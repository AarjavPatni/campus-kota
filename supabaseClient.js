import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.DEV_NEXT_PUBLIC_SUPABASE_URL,
  process.env.DEV_NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default supabase;
