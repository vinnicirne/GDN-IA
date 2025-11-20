import React, { useState } from 'react';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AuthLayout from './AuthLayout';

interface SignupProps {
  onNavigate: (view: 'login') => void;
}

const Signup: React.FC<SignupProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Verifique seu e-mail">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="bg-green-900/20 text-green-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-900/50">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-white">Conta criada com sucesso!</h3>
          <p className="text-gray-400">
            Enviamos um link de confirmação para <strong className="text-white">{email}</strong>.
            <br />Por favor, verifique sua caixa de entrada (e spam) para ativar sua conta.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="w-full mt-6 bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors border border-gray-700"
          >
            Voltar para Login
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Criar nova conta" 
      subtitle="Junte-se à revolução da IA Generativa"
    >
      <form onSubmit={handleSignup} className="space-y-4">
        {error && (
          <div className="bg-red-900/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2 border border-red-900/30 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Nome completo</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black border border-green-900/30 text-white placeholder-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
            placeholder="Ex: João Silva"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black border border-green-900/30 text-white placeholder-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
            placeholder="seu@email.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black border border-green-900/30 text-white placeholder-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
              placeholder="Mín. 6 chars"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Confirmar</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg bg-black border text-white placeholder-gray-600 focus:ring-1 outline-none transition-all ${
                confirmPassword && password !== confirmPassword 
                  ? 'border-red-500/50 focus:border-red-500' 
                  : 'border-green-900/30 focus:border-green-500 focus:ring-green-500/50'
              }`}
              placeholder="Repita a senha"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-black py-3 rounded-lg font-bold hover:bg-green-500 transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(22,163,74,0.3)] mt-2"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'CRIAR CONTA GRÁTIS'}
        </button>
      </form>

      <div className="mt-6 text-center border-t border-gray-800 pt-4">
        <p className="text-gray-500">
          Já possui conta?{' '}
          <button 
            onClick={() => onNavigate('login')}
            className="text-green-400 font-bold hover:text-green-300 hover:underline"
          >
            Entrar
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;