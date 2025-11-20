import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AuthLayout from './AuthLayout';

interface LoginProps {
  onNavigate: (view: 'signup' | 'forgot') => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('E-mail ou senha incorretos.');
      setLoading(false);
    } else {
      // App.tsx handles session state change automatically
    }
  };

  return (
    <AuthLayout 
      title="Acesso ao Terminal" 
      subtitle="Bem-vindo de volta ao GDN-AI"
    >
      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <div className="bg-red-900/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2 border border-red-900/30">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black border border-green-900/30 text-white placeholder-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-gray-400">Senha</label>
            <button 
              type="button"
              onClick={() => onNavigate('forgot')}
              className="text-sm text-green-400 hover:text-green-300 hover:underline"
            >
              Esqueceu a senha?
            </button>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black border border-green-900/30 text-white placeholder-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 text-green-600 bg-black border-gray-600 rounded focus:ring-green-500 focus:ring-offset-gray-900"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
            Manter conectado
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-black py-3 rounded-lg font-bold hover:bg-green-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(22,163,74,0.3)] hover:shadow-[0_0_20px_rgba(22,163,74,0.5)]"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'ENTRAR NO SISTEMA'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-500">
          Não tem conta?{' '}
          <button 
            onClick={() => onNavigate('signup')}
            className="text-green-400 font-semibold hover:text-green-300 hover:underline"
          >
            Solicitar acesso
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;