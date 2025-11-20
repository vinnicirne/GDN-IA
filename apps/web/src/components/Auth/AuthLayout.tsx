import React from 'react';
import { Zap } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-900/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-green-900/30 overflow-hidden relative z-10">
        <div className="p-8">
          <div className="flex justify-center mb-6">
             <div className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight">
              <div className="bg-gradient-to-tr from-green-500 to-emerald-700 p-2 rounded-lg shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                <Zap className="w-6 h-6 text-black" />
              </div>
              GDN<span className="text-green-500">-AI</span>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            {subtitle && <p className="text-gray-400 mt-2">{subtitle}</p>}
          </div>

          {children}
        </div>
        <div className="bg-black/50 px-8 py-4 border-t border-green-900/20 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} GDN-AI & SEO. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;