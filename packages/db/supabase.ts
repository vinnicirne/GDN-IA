import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Access environment variables
// Note: In monorepo, ensure env vars are accessible to the workspace running this code
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing! Check your .env file.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);