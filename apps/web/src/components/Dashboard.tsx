import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';
import { Activity, TrendingUp, Users, FileText } from 'lucide-react';

const data = [
  { name: 'Seg', articles: 4, views: 2400 },
  { name: 'Ter', articles: 3, views: 1398 },
  { name: 'Qua', articles: 9, views: 9800 },
  { name: 'Qui', articles: 6, views: 3908 },
  { name: 'Sex', articles: 8, views: 4800 },
  { name: 'Sáb', articles: 2, views: 3800 },
  { name: 'Dom', articles: 1, views: 4300 },
];

const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
  <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-green-900/20 flex items-center space-x-4 hover:border-green-500/30 transition-all">
    <div className={`p-3 rounded-lg bg-black border border-gray-800`}>
      <Icon className={`w-6 h-6 ${colorClass}`} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Artigos Gerados" value="34" icon={FileText} colorClass="text-blue-400" />
        <StatCard title="Tráfego Estimado" value="12.5k" icon={Activity} colorClass="text-green-400" />
        <StatCard title="Palavras-chave" value="128" icon={TrendingUp} colorClass="text-purple-400" />
        <StatCard title="Assinantes" value="842" icon={Users} colorClass="text-orange-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-green-900/20">
          <h3 className="text-lg font-semibold text-white mb-4">Produção Semanal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#1e293b'}} 
                  contentStyle={{backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', color: '#fff'}} 
                  itemStyle={{color: '#fff'}}
                />
                <Bar dataKey="articles" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-green-900/20">
          <h3 className="text-lg font-semibold text-white mb-4">Tendência de Tráfego</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', color: '#fff'}} 
                />
                <Line type="monotone" dataKey="views" stroke="#22c55e" strokeWidth={3} dot={{r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#000'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-900/40 to-black border border-green-500/30 p-6 rounded-xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2 text-white">Pronto para escalar?</h3>
          <p className="text-gray-300 mb-4 max-w-xl">
            Seu plano atual permite gerar mais <span className="text-green-400 font-bold">15 artigos</span> este mês. Atualize para o plano Pro e desbloqueie a API ilimitada.
          </p>
          <button className="bg-green-600 text-black px-6 py-2 rounded-lg font-bold hover:bg-green-500 transition-colors shadow-[0_0_10px_rgba(34,197,94,0.3)]">
            Ver Planos PRO
          </button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
          <Activity size={200} className="text-green-500" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;