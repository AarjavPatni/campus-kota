const { createClient } = require("@supabase/supabase-js");

// list all envs
console.log('Environment Variables:');
for (const key in process.env) {
  console.log(`${key}: ${process.env[key]}`);
}

// Read env variables set in GitHub Actions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize client
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    // Perform a lightweight query to keep the project alive
    const { data, error } = await supabase
      .from('student_details')  // Replace with a real table in your project
      .select('id')
      .limit(1);

    if (error) {
      console.error('Supabase ping failed:', error.message);
      process.exit(1);
    }

    console.log('Supabase ping success:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
})();

