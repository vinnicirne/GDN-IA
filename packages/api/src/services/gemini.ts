import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const GeminiService = {
  async generateNews(topic: string, tone: string) {
    const prompt = `
      Atue como jornalista sênior. Escreva uma notícia completa sobre: "${topic}".
      Tom: ${tone}.
      Formato JSON:
      {
        "title": "Título SEO",
        "content": "Conteúdo markdown (+400 palavras)",
        "summary": "Resumo",
        "seo": { "keyword": "", "metaDescription": "" }
      }
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || '{}');
  },

  async generateLandingPage(productName: string, description: string) {
    const prompt = `
      Crie uma estrutura de Landing Page de alta conversão para: ${productName}.
      Descrição: ${description}.
      Retorne JSON com seções: Hero, Problema, Solução, Benefícios, CTA.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || '{}');
  },

  async generateCopy(topic: string, framework: 'AIDA' | 'PAS' = 'AIDA') {
    const prompt = `
      Escreva um texto de vendas (Copywriting) sobre "${topic}" usando a estrutura ${framework}.
      Retorne em Markdown formatado.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return { content: response.text };
  },

  async generateCanvaStructure(content: string) {
    const prompt = `
      Com base no texto abaixo, crie uma estrutura JSON para um carrossel do Instagram (5 slides).
      Texto: "${content.substring(0, 500)}..."
      JSON Schema: { slides: [{ title: "", subtitle: "", hexColor: "" }] }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || '{}');
  },

  async generateMetaPrompt(objective: string) {
    const prompt = `
      Atue como um Engenheiro de Prompt Sênior.
      Crie um "Meta-Prompt" detalhado e otimizado para o seguinte objetivo: "${objective}".
      O prompt resultante deve usar técnicas de Chain-of-Thought e Few-Shot.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return { prompt: response.text };
  }
};
