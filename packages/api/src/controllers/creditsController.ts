import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { supabaseAdmin } from '../lib/supabase';

export const CreditsController = {
  async getBalance(req: AuthenticatedRequest, res: Response) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('credits')
      .eq('id', req.user!.id)
      .single();

    if (error) return res.status(500).json({ error: 'Fetch failed' });
    res.json({ credits: data?.credits || 0 });
  },

  async debitManual(req: AuthenticatedRequest, res: Response) {
    // Admin or manual trigger
    const { amount } = req.body;
    const { error } = await supabaseAdmin.rpc('decrement_credits', {
      user_id_arg: req.user!.id,
      amount_arg: amount
    });

    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true });
  }
};
