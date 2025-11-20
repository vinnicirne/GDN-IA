
import { supabase } from '../db/supabase';
import { Article, ArticleStatus, Database } from '../db/types';

// Map Database Row to Application Article Interface
const mapRowToArticle = (row: any): Article => ({
  id: row.id,
  user_id: row.user_id,
  title: row.title,
  slug: row.slug,
  summary: row.summary,
  content: row.content,
  tone: row.tone,
  status: row.status,
  seo: row.seo_data,
  canva: row.canva_data,
  sourceUrls: row.source_signals || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  audioUrl: row.audio_assets?.[0]?.public_url,
  audioDuration: row.audio_assets?.[0]?.duration_seconds,
});

export const articleService = {
  async fetchAll(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        audio_assets (public_url, duration_seconds)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapRowToArticle);
  },

  async create(article: Partial<Article>): Promise<Article> {
    const dbPayload: Database['public']['Tables']['articles']['Insert'] = {
      title: article.title || 'Untitled',
      slug: article.slug,
      summary: article.summary,
      content: article.content,
      tone: article.tone,
      status: ArticleStatus.DRAFT,
      seo_data: article.seo,
      canva_data: article.canva,
      source_signals: article.sourceUrls,
      user_id: (await supabase.auth.getUser()).data.user?.id
    };

    const { data, error } = await supabase
      .from('articles')
      .insert(dbPayload)
      .select()
      .single();

    if (error) throw error;
    return mapRowToArticle(data);
  },

  async update(id: string, updates: Partial<Article>): Promise<void> {
    const dbPayload: Database['public']['Tables']['articles']['Update'] = {};
    if (updates.title) dbPayload.title = updates.title;
    if (updates.content) dbPayload.content = updates.content;
    if (updates.status) dbPayload.status = updates.status;
    if (updates.seo) dbPayload.seo_data = updates.seo;
    
    const { error } = await supabase
      .from('articles')
      .update(dbPayload)
      .eq('id', id);

    if (error) throw error;
  },

  async saveAudio(articleId: string, url: string, duration: number): Promise<void> {
    const payload: Database['public']['Tables']['audio_assets']['Insert'] = {
      article_id: articleId,
      public_url: url,
      storage_path: 'demo/path',
      duration_seconds: duration,
      voice_id: 'Kore'
    };

    const { error } = await supabase
      .from('audio_assets')
      .insert(payload);
      
    if (error) throw error;
  }
};
