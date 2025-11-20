import React, { useState } from 'react';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import AuthLayout from './AuthLayout';

interface ForgotPasswordProps {
  onNavigate: (view: 'login') => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });

    setLoading(false);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ 
        type: 'success', 
        text: 'Verifique seu e-mail. Enviamos um link de recuperação.' 
      });
    }
  };

  return (
    <AuthLayout 
      title="Recuperar Senha" 
      subtitle="Digite seu e-mail para receber as instruções"
    >
      <form onSubmit={handleReset} className="space-y-4">
        {message && (
          <div className={`text-sm p-3 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-900/20 text-green-400 border-green-900/30' 
              : 'bg-red-900/20 text-red-400 border-red-900/30'
          }`}>
            {message.text}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">E-mail cadastrado</label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-black border border-green-900/30 text-white placeholder-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
              placeholder="seu@email.com"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-black py-3 rounded-lg font-bold hover:bg-green-500 transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(22,163,74,0.3)]"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'ENVIAR LINK'}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-white py-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Login
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;