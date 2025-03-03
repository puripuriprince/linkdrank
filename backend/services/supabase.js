const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rszxpqtzxjykvkjwdqhi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzenhwcXR6eGp5a3ZrandkcWhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDk2MTkwNSwiZXhwIjoyMDU2NTM3OTA1fQ.MGKwJDcTS8L6djEQvANrYprSqB5cRfxl3g1ZfpSw8jA';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
