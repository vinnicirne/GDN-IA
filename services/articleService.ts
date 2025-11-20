import { supabase } from '../lib/supabase';
import { Article, ArticleStatus } from '../types';

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
  // Audio would typically be a join, simplified here:
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
    // Transform App Object to DB Row
    const dbPayload = {
      title: article.title,
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
    const dbPayload: any = {};
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
    // In a real app, you would upload the Blob to Supabase Storage first,
    // then save the reference here. For this demo, we store the URL directly.
    const { error } = await supabase
      .from('audio_assets')
      .insert({
        article_id: articleId,
        public_url: url,
        storage_path: 'demo/path', // Placeholder
        duration_seconds: duration,
        voice_id: 'Kore'
      });
      
    if (error) throw error;
  }
};
