import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rszxpqtzxjykvkjwdqhi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzenhwcXR6eGp5a3ZrandkcWhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDk2MTkwNSwiZXhwIjoyMDU2NTM3OTA1fQ.MGKwJDcTS8L6djEQvANrYprSqB5cRfxl3g1ZfpSw8jA';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
