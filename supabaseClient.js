import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  "https://umtkiyexnkwxnzbujsyf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtdGtpeWV4bmt3eG56YnVqc3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3OTY2MTgsImV4cCI6MjA0MTM3MjYxOH0.V_4ZUhUEXr_rLrcZjeyhhQQjX2jmGGpAKJxPH6zDfL8"
);
