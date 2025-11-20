import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../../packages/db/types';

// Função auxiliar para buscar variáveis de ambiente em diferentes contextos (Vite vs Node)
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

// Debug logs para ajudar a verificar se a conexão está configurada
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('SUA_URL')) {
  console.warn('⚠️ Supabase não configurado! Verifique o arquivo .env na raiz do projeto.');
  console.log('Esperado: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
} else {
  console.log('✅ Supabase Client inicializado com URL:', supabaseUrl);
}

// Criação do cliente Supabase
// Se as chaves não existirem, cria um cliente "mock" (falso) para o app não quebrar visualmente,
// mas as funções de login retornarão erro até que o .env seja corrigido.
export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('SUA_URL'))
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ error: { message: 'ERRO: Configure o arquivo .env com suas chaves do Supabase.' } }),
        signUp: async () => ({ error: { message: 'ERRO: Configure o arquivo .env com suas chaves do Supabase.' } }),
        signOut: async () => ({}),
        resetPasswordForEmail: async () => ({ error: { message: 'Supabase keys missing.' } }),
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
