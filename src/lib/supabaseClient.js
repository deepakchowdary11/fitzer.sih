import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    '[Fitzer Supabase] Missing environment variables: VITE_SUPABASE_URL and/or VITE_SUPABASE_PUBLISHABLE_KEY. ' +
    'Please configure them in your .env.local file.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://zwgoaizhwujmfghpmdjy.supabase.co',
  supabasePublishableKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3Z29haXpod3VqbWZnaHBtZGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3Mzg4ODYsImV4cCI6MjA5MTMxNDg4Nn0.5hs8Ci6ylzT6ZYrWPkpzTR7TNnw2cEC1Kzt7Tqs3foo',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
