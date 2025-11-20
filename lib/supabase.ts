import { createClient } from '@supabase/supabase-js';
import { Database } from '../packages/db/types';

const getEnvVar = (key: string) => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env[key] || '';
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || '';
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('SUA_URL')) {
  console.warn('⚠️ Root Supabase Client: Credenciais ausentes no .env');
}

export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('SUA_URL'))
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ error: { message: 'Configure o .env' } }),
        signUp: async () => ({ error: { message: 'Configure o .env' } }),
        signOut: async () => ({}),
        resetPasswordForEmail: async () => ({ error: { message: 'Configure o .env' } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({ single: async () => ({ data: null, error: null }) }),
          order: async () => ({ data: [], error: null })
        }),
        insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: async () => ({ error: null }) }),
        upsert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) })
      })
    } as any;
