// Application Types
export enum ArticleStatus {
  DRAFT = 'DRAFT',
  GENERATED = 'GENERATED',
  PUBLISHED = 'PUBLISHED',
}

export enum ToneType {
  FACTUAL = 'FACTUAL',
  SENSATIONAL = 'SENSATIONAL',
  PREDICTIVE = 'PREDICTIVE',
  EDUCATIONAL = 'EDUCATIONAL',
}

// UI Labels for Tone Enum
export const ToneLabels: Record<ToneType, string> = {
  [ToneType.FACTUAL]: 'Factual/Jornalístico',
  [ToneType.SENSATIONAL]: 'Sensacionalista/Viral',
  [ToneType.PREDICTIVE]: 'Preditivo/Análise',
  [ToneType.EDUCATIONAL]: 'Educativo',
};

export interface SeoData {
  focusKeyword: string;
  seoTitle: string;
  metaDescription: string;
  tags: string[];
  score: number;
}

export interface CanvaStructure {
  headline: string;
  subheadline: string;
  suggestedImagePrompt: string;
  colors: string[];
}

export interface Article {
  id: string;
  user_id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tone: ToneType;
  status: ArticleStatus;
  
  // Mapped from JSONB in DB
  seo: SeoData; 
  canva: CanvaStructure;
  sourceUrls: string[]; 
  
  // Audio relation
  audioUrl?: string;
  audioDuration?: number;
  
  createdAt: string;
  updatedAt?: string;
}

export interface TrendResult {
  query: string;
  title: string;
  snippet: string;
  url: string;
}

export type ViewState = 'dashboard' | 'generator' | 'editor' | 'tools';

// Supabase Database Types Definition
export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          slug: string;
          summary: string;
          content: string;
          tone: ToneType;
          status: ArticleStatus;
          seo_data: SeoData;
          canva_data: CanvaStructure;
          source_signals: string[]; // Stored as JSONB array of strings
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string; // Optional if handled by RLS/Trigger, but usually passed or inferred
          title: string;
          slug?: string;
          summary?: string;
          content?: string;
          tone?: ToneType;
          status?: ArticleStatus;
          seo_data?: SeoData;
          canva_data?: CanvaStructure;
          source_signals?: string[];
        };
        Update: Partial<Database['public']['Tables']['articles']['Insert']>;
      };
      audio_assets: {
        Row: {
          id: string;
          article_id: string;
          storage_path: string;
          public_url: string;
          duration_seconds: number;
          voice_id: string;
          created_at: string;
        };
        Insert: {
          article_id: string;
          storage_path: string;
          public_url: string;
          duration_seconds?: number;
          voice_id?: string;
        };
      };
    };
  };
}
