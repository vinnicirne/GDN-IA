import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Loader2, Globe, Zap } from 'lucide-react';
import { searchTrends, generateArticle } from '../services/geminiService';
import { TrendResult, ToneType, Article } from '../types';

interface NewsGeneratorProps {
  onArticleGenerated: (article: Article) => void;
}

const NewsGenerator: React.FC<NewsGeneratorProps> = ({ onArticleGenerated }) => {
  const [topic, setTopic] = useState('');
  const [trends, setTrends] = useState<TrendResult[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState<TrendResult | null>(null);
  const [selectedTone, setSelectedTone] = useState<ToneType>(ToneType.FACTUAL);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!topic.trim()) return;

    setIsLoadingTrends(true);
    setTrends([]);
    setSelectedTrend(null);
    
    try {
      const results = await searchTrends(topic);
      setTrends(results);
    } catch (error) {
      alert("Erro ao buscar tendências. Verifique sua chave API.");
    } finally {
      setIsLoadingTrends(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTrend) return;
    
    setIsGenerating(true);
    try {
      const partialArticle = await generateArticle(selectedTrend, selectedTone);
      // Construct full Article object
      const article: Article = {
        id: crypto.randomUUID(),
        status: 'DRAFT' as any,
        ...partialArticle,
      } as Article;
      
      onArticleGenerated(article);
    } catch (error) {
      alert("Erro ao gerar artigo. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">O que vamos cobrir hoje?</h2>
        <p className="text-gray-400">Analise tendências das últimas 48h e crie conteúdo otimizado em segundos.</p>
      </div>

      {/* Search Section */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-green-900/20">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex: Tecnologias emergentes, Mercado financeiro, Futebol..."
            className="w-full pl-12 pr-4 py-4 rounded-lg bg-black border border-gray-700 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500/50 outline-none transition-all text-lg placeholder-gray-600"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <button 
            type="submit"
            disabled={isLoadingTrends || !topic}
            className="absolute right-2 top-2 bottom-2 bg-green-600 text-black px-6 rounded-md font-bold hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoadingTrends ? <Loader2 className="animate-spin w-5 h-5" /> : 'BUSCAR'}
          </button>
        </form>

        {/* Quick Selectors */}
        <div className="mt-4 flex flex-wrap gap-2">
          {['Inteligência Artificial', 'Criptomoedas', 'Política Brasil', 'Sustentabilidade'].map(tag => (
            <button 
              key={tag}
              onClick={() => { setTopic(tag); handleSearch(); }}
              className="text-xs font-medium px-3 py-1 bg-black border border-gray-800 text-gray-400 rounded-full hover:border-green-500 hover:text-green-400 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Trends Results */}
      {trends.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Tendências Encontradas
            </h3>
            <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded font-medium border border-green-900/50">Ao vivo (Google Search)</span>
          </div>
          
          <div className="grid gap-4">
            {trends.map((trend, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedTrend(trend)}
                className={`cursor-pointer p-4 rounded-lg border transition-all hover:shadow-lg hover:shadow-green-900/10 ${
                  selectedTrend?.url === trend.url 
                    ? 'border-green-500 bg-green-900/10' 
                    : 'border-transparent bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`font-bold mb-1 ${selectedTrend?.url === trend.url ? 'text-green-400' : 'text-white'}`}>{trend.title}</h4>
                    <p className="text-sm text-gray-400 line-clamp-2">{trend.snippet}</p>
                    <p className="text-xs text-blue-400 mt-2 truncate opacity-70">{trend.url}</p>
                  </div>
                  {selectedTrend?.url === trend.url && (
                    <div className="bg-green-500 text-black p-1 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generation Configuration */}
      {selectedTrend && (
        <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-green-900/20 animate-slide-up">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Configurar Geração
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Tom de Voz</label>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(ToneType).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`text-left px-4 py-3 rounded-lg border transition-all text-sm ${
                      selectedTone === tone 
                        ? 'border-green-500 bg-green-900/20 text-green-400 font-medium' 
                        : 'border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-black p-4 rounded-lg border border-gray-800">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">O que será gerado:</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></span> Artigo completo (+400 palavras)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></span> Otimização SEO (Rank Math)</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></span> Sugestão de arte Canva</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></span> Lead para redes sociais</li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 bg-green-600 text-black rounded-lg font-bold text-lg hover:bg-green-500 transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(22,163,74,0.3)]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin w-6 h-6" />
                Processando com Gemini 2.5...
              </>
            ) : (
              <>
                INICIAR GERAÇÃO
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsGenerator;