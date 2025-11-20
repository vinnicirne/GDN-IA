import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { GeminiService } from '../services/gemini';
import { supabaseAdmin } from '../lib/supabase';

// Helper to debit credits
const debitCredits = async (userId: string, amount: number) => {
  const { error } = await supabaseAdmin.rpc('decrement_credits', {
    user_id_arg: userId,
    amount_arg: amount
  });
  if (error) throw error;
};

export const ContentController = {
  async generateNews(req: AuthenticatedRequest, res: Response) {
    try {
      const { topic, tone } = req.body;
      const result = await GeminiService.generateNews(topic, tone);
      
      // Debit 1 credit
      await debitCredits(req.user!.id, 1);

      res.json({ success: true, data: result, credits_spent: 1 });
    } catch (error) {
      res.status(500).json({ error: 'Generation failed' });
    }
  },

  async generateAudio(req: AuthenticatedRequest, res: Response) {
    // Placeholder for Audio generation logic
    // Would call Gemini TTS or Google Cloud TTS
    await debitCredits(req.user!.id, 2); // Audio is more expensive
    res.json({ success: true, message: "Audio generated (mock)", url: "https://cdn.example.com/audio.mp3" });
  },

  async generateLandingPage(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, description } = req.body;
      const result = await GeminiService.generateLandingPage(name, description);
      await debitCredits(req.user!.id, 5);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },

  async generateCopy(req: AuthenticatedRequest, res: Response) {
    try {
      const { topic, framework } = req.body;
      const result = await GeminiService.generateCopy(topic, framework);
      await debitCredits(req.user!.id, 1);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },

  async generateCanva(req: AuthenticatedRequest, res: Response) {
    try {
      const { content } = req.body;
      const result = await GeminiService.generateCanvaStructure(content);
      await debitCredits(req.user!.id, 1);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },

  async generatePrompt(req: AuthenticatedRequest, res: Response) {
    try {
      const { objective } = req.body;
      const result = await GeminiService.generateMetaPrompt(objective);
      await debitCredits(req.user!.id, 1);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
};
