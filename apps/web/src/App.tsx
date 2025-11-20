import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PenTool, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Zap,
  Loader2
} from 'lucide-react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

import Dashboard from './components/Dashboard';
import NewsGenerator from './components/NewsGenerator';
import ArticleEditor from './components/ArticleEditor';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import { ViewState, Article } from '../../../packages/db/types';

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all border-l-2 ${
      active 
        ? 'bg-green-900/20 border-green-500 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
        : 'border-transparent text-gray-500 hover:bg-gray-800 hover:text-gray-300'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot'>('login');
  
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setTimeout(() => setIsLoadingSession(false), 800);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoadingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAuthView('login');
  };

  const handleArticleGenerated = (article: Article) => {
    setActiveArticle(article);
    setCurrentView('editor');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'generator':
        return <NewsGenerator onArticleGenerated={handleArticleGenerated} />;
      case 'editor':
        return activeArticle ? (
          <ArticleEditor 
            article={activeArticle} 
            onBack={() => setCurrentView('generator')} 
          />
        ) : (
          <div className="text-center py-20 text-gray-500">Nenhum artigo selecionado.</div>
        );
      default:
        return <div className="p-4 text-gray-400">Em construção...</div>;
    }
  };

  // 1. Loading State (Dark Mode)
  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black space-y-6 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="bg-gray-900 p-4 rounded-2xl shadow-[0_0_30px_rgba(22,163,74,0.3)] relative z-10 border border-green-900/50">
            <div className="bg-gradient-to-tr from-green-500 to-emerald-700 p-3 rounded-xl">
              <Zap className="w-10 h-10 text-black" />
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-2">
           <h2 className="text-xl font-bold text-white tracking-wider">GDN<span className="text-green-500">-AI</span></h2>
           <div className="flex items-center gap-2 text-gray-400 text-sm font-medium bg-gray-900 px-4 py-2 rounded-full border border-green-900/30 shadow-sm">
             <Loader2 className="animate-spin w-4 h-4 text-green-500" />
             <span className="text-xs uppercase tracking-widest">Inicializando Sistema...</span>
           </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State
  if (!session) {
    switch (authView) {
      case 'signup':
        return <Signup onNavigate={setAuthView} />;
      case 'forgot':
        return <ForgotPassword onNavigate={(view) => setAuthView(view as any)} />;
      default:
        return <Login onNavigate={setAuthView} />;
    }
  }

  // 3. Authenticated App (Dashboard Shell)
  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-gray-900/80 backdrop-blur-md border-r border-green-900/20 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-20 flex items-center px-6 border-b border-green-900/20">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <div className="bg-gradient-to-tr from-green-500 to-emerald-700 p-1.5 rounded-lg shadow-md">
                <Zap className="w-5 h-5 text-black" />
              </div>
              GDN<span className="text-green-500">-AI</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <div className="text-xs font-bold text-gray-500 uppercase px-4 mb-2 tracking-widest">Menu Principal</div>
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              active={currentView === 'dashboard'} 
              onClick={() => setCurrentView('dashboard')} 
            />
            <SidebarItem 
              icon={PenTool} 
              label="Gerador de Notícias" 
              active={currentView === 'generator' || currentView === 'editor'} 
              onClick={() => setCurrentView('generator')} 
            />
            
            <div className="text-xs font-bold text-gray-500 uppercase px-4 mt-8 mb-2 tracking-widest">Ferramentas</div>
            <SidebarItem icon={Settings} label="Configurações" active={currentView === 'tools'} onClick={() => setCurrentView('tools')} />
          </div>

          <div className="p-4 border-t border-green-900/20">
            <div className="px-4 pb-4">
               <p className="text-xs text-gray-500 mb-1">Logado como:</p>
               <p className="text-sm text-white truncate" title={session.user.email}>{session.user.email}</p>
               <div className="mt-2 flex items-center gap-1.5 text-xs text-green-400 font-mono">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  ONLINE: Plano Free
               </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:text-red-400 transition-colors border-t border-green-900/20 mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Desconectar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-black">
        {/* Mobile Header */}
        <header className="h-16 bg-gray-900 border-b border-green-900/30 flex items-center px-4 lg:hidden justify-between">
          <div className="flex items-center gap-2 font-bold text-white">
             GDN<span className="text-green-500">-AI</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-400">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {renderContent()}
        </main>
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;