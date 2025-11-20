import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Article, ToneType, TrendResult } from "../types";

// Initialize client
// NOTE: In a real production app, backend proxy is recommended to hide API keys.
// However, for this frontend-only demo, we use process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchTrends = async (topic: string = "notícias urgentes tecnologia e negócios brasil"): Promise<TrendResult[]> => {
  try {
    // Use Search Grounding to get real-time signals
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Liste 5 tendências ou notícias quentes das últimas 48 horas sobre: ${topic}. Retorne apenas uma lista concisa.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Extract grounding chunks to get URLs and titles
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const trends: TrendResult[] = [];

    if (chunks) {
      chunks.forEach((chunk) => {
        if (chunk.web) {
            trends.push({
              query: topic,
              title: chunk.web.title || "Sem título",
              url: chunk.web.uri || "",
              snippet: "Tendência identificada via Google Search",
            });
        }
      });
    }

    // De-duplicate based on URL
    const uniqueTrends = Array.from(new Map(trends.map(item => [item.url, item])).values()).slice(0, 5);
    return uniqueTrends;

  } catch (error) {
    console.error("Error fetching trends:", error);
    return [];
  }
};

export const generateArticle = async (trend: TrendResult, tone: ToneType): Promise<Partial<Article>> => {
  const prompt = `
    Atue como um jornalista sênior e especialista em SEO (Rank Math/Yoast).
    Escreva uma notícia completa baseada nesta fonte/tendência: "${trend.title}" (${trend.url}).
    
    Tom de voz: ${tone}.
    
    A resposta DEVE ser um JSON válido com a seguinte estrutura:
    {
      "title": "Título chamativo e otimizado",
      "slug": "slug-url-amigavel",
      "summary": "Resumo curto (lead) para redes sociais",
      "content": "O corpo da notícia em Markdown (use ## para subtítulos, ** para negrito). Mínimo 400 palavras.",
      "seo": {
        "focusKeyword": "palavra-chave principal",
        "seoTitle": "Título para SERP (máx 60 chars)",
        "metaDescription": "Descrição para SERP (máx 160 chars)",
        "tags": ["tag1", "tag2", "tag3"],
        "score": 85
      },
      "canva": {
        "headline": "Texto curto para arte",
        "subheadline": "Subtexto para arte",
        "suggestedImagePrompt": "Prompt para gerar imagem de capa",
        "colors": ["#HEX", "#HEX"]
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            slug: { type: Type.STRING },
            summary: { type: Type.STRING },
            content: { type: Type.STRING },
            seo: {
              type: Type.OBJECT,
              properties: {
                focusKeyword: { type: Type.STRING },
                seoTitle: { type: Type.STRING },
                metaDescription: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                score: { type: Type.NUMBER },
              }
            },
            canva: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                subheadline: { type: Type.STRING },
                suggestedImagePrompt: { type: Type.STRING },
                colors: { type: Type.ARRAY, items: { type: Type.STRING } },
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from API");
    
    const json = JSON.parse(text);
    
    return {
      ...json,
      sourceUrls: [trend.url],
      createdAt: new Date().toISOString(),
    };

  } catch (error) {
    console.error("Error generating article:", error);
    throw error;
  }
};

// Helper to convert base64 string to ArrayBuffer for audio decoding
function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export const generateAudio = async (text: string): Promise<{ audioUrl: string, duration: number }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text.substring(0, 4000) }] }], // Limit text length for demo
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Options: Puck, Charon, Kore, Fenrir, Zephyr
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
        throw new Error("Failed to generate audio data");
    }

    // Convert to Blob URL for playback
    const audioBuffer = base64ToArrayBuffer(base64Audio);
    const blob = new Blob([audioBuffer], { type: 'audio/mp3' }); // Usually raw PCM but we treat as generic binary blob for URL
    const url = URL.createObjectURL(blob);
    
    // Estimate duration (rough calculation as we don't have header info easily without decoding context)
    // Just returning a placeholder duration or use AudioContext to get real duration if needed.
    // For this snippet, we return the URL.
    
    return { audioUrl: url, duration: 0 }; 

  } catch (error) {
    console.error("Error generating audio:", error);
    throw error;
  }
};
