import React, { useState } from 'react';
import { Article } from '../types';
import { ArrowLeft, Save, Play, Mic, Download, Share2, Layout, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { generateAudio } from '../services/geminiService';

interface ArticleEditorProps {
  article: Article;
  onBack: () => void;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ article, onBack }) => {
  const [currentArticle, setCurrentArticle] = useState<Article>(article);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    setAudioError(null);
    try {
      const { audioUrl, duration } = await generateAudio(currentArticle.content);
      setCurrentArticle(prev => ({
        ...prev,
        audioUrl,
        audioDuration: duration
      }));
    } catch (e) {
      setAudioError("Falha ao gerar áudio. Tente novamente.");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const ScoreBadge = ({ score }: { score: number }) => {
    let color = 'bg-red-900/30 text-red-400 border-red-900/50';
    if (score > 50) color = 'bg-yellow-900/30 text-yellow-400 border-yellow-900/50';
    if (score > 80) color = 'bg-green-900/30 text-green-400 border-green-900/50';
    
    return (
      <span className={`px-3 py-1 rounded-full font-bold text-sm border ${color}`}>
        SEO: {score}/100
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-black/80 backdrop-blur-md py-4 z-10 border-b border-green-900/30">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-white truncate max-w-md">{currentArticle.title}</h2>
          <ScoreBadge score={currentArticle.seo.score} />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-300 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 font-medium text-sm transition-colors">
            <Save className="w-4 h-4" /> Salvar Rascunho
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-black bg-green-600 rounded-lg hover:bg-green-500 font-bold text-sm shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-colors">
            <Share2 className="w-4 h-4" /> Publicar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Editor */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Meta Preview */}
          <div className="bg-gray-900 p-6 rounded-xl border border-green-900/20 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Google SERP Preview</h3>
            <div className="space-y-1 font-sans bg-white p-4 rounded border border-gray-200">
              <div className="text-sm text-slate-500 flex items-center gap-1">
                <span className="bg-slate-100 rounded-full p-1"><GlobeIcon size={10} /></span>
                seusite.com.br › {currentArticle.slug}
              </div>
              <div className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate">
                {currentArticle.seo.seoTitle}
              </div>
              <div className="text-sm text-slate-600 line-clamp-2">
                <span className="text-slate-400 text-xs mr-1">{new Date().toLocaleDateString()} —</span>
                {currentArticle.seo.metaDescription}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-gray-900 p-8 rounded-xl border border-green-900/20 shadow-sm min-h-[500px]">
            <textarea
              value={currentArticle.content}
              onChange={(e) => setCurrentArticle({...currentArticle, content: e.target.value})}
              className="w-full h-full min-h-[500px] bg-transparent outline-none text-gray-200 leading-relaxed resize-y font-serif text-lg placeholder-gray-700"
              placeholder="Escreva seu artigo aqui..."
            />
          </div>
        </div>

        {/* Sidebar Tools */}
        <div className="space-y-6">
          
          {/* Audio Generator */}
          <div className="bg-gray-900 p-5 rounded-xl border border-green-900/20 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Mic className="w-5 h-5 text-purple-400" /> Narração AI
              </h3>
              {currentArticle.audioUrl && <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-900/50">Pronto</span>}
            </div>
            
            {currentArticle.audioUrl ? (
              <div className="bg-black p-3 rounded-lg border border-gray-800">
                <audio controls src={currentArticle.audioUrl} className="w-full h-8" />
                <div className="flex justify-end mt-2">
                   <a href={currentArticle.audioUrl} download="news-audio.mp3" className="text-xs text-green-400 hover:underline flex items-center gap-1">
                     <Download className="w-3 h-3" /> Baixar MP3
                   </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400 mb-4">Transforme este artigo em um podcast curto usando Gemini TTS.</p>
                <button 
                  onClick={handleGenerateAudio}
                  disabled={isGeneratingAudio}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-500 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {isGeneratingAudio ? <Loader2 className="animate-spin w-4 h-4" /> : <Play className="w-4 h-4" />}
                  Gerar Áudio (Kore)
                </button>
                {audioError && <p className="text-xs text-red-400 mt-2">{audioError}</p>}
              </div>
            )}
          </div>

          {/* Canva Structure */}
          <div className="bg-gray-900 p-5 rounded-xl border border-green-900/20 shadow-sm">
             <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
                <Layout className="w-5 h-5 text-blue-400" /> Canva Template
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-black rounded border border-gray-800">
                  <span className="text-xs font-bold text-gray-500 block mb-1">HEADLINE</span>
                  <span className="text-gray-200">{currentArticle.canva.headline}</span>
                </div>
                <div className="p-3 bg-black rounded border border-gray-800">
                  <span className="text-xs font-bold text-gray-500 block mb-1">SUB-HEADLINE</span>
                  <span className="text-gray-200">{currentArticle.canva.subheadline}</span>
                </div>
                <div className="p-3 bg-black rounded border border-gray-800">
                  <span className="text-xs font-bold text-gray-500 block mb-1">PROMPT IMAGEM (AI)</span>
                  <span className="italic text-gray-400">{currentArticle.canva.suggestedImagePrompt}</span>
                </div>
                <div className="flex gap-2 mt-2">
                    {currentArticle.canva.colors.map((c, i) => (
                        <div key={i} className="w-6 h-6 rounded-full shadow-sm border border-gray-600" style={{backgroundColor: c}} title={c}></div>
                    ))}
                </div>
              </div>
          </div>

          {/* SEO Checks */}
          <div className="bg-gray-900 p-5 rounded-xl border border-green-900/20 shadow-sm">
             <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" /> SEO Checklist
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" /> Palavra-chave no título
                </li>
                <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" /> Meta description otimizada
                </li>
                <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" /> +300 palavras
                </li>
                <li className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" /> Adicionar links internos
                </li>
              </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

const GlobeIcon = ({ size }: {size:number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);

export default ArticleEditor;