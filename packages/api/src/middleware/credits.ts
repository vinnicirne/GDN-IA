import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { supabaseAdmin } from '../lib/supabase';

export const requireCredits = (cost: number) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      // Check user profile for credits
      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('credits')
        .eq('id', req.user.id)
        .single();

      if (error || !profile) {
        return res.status(404).json({ error: 'User profile not found' });
      }

      if (profile.credits < cost) {
        return res.status(403).json({ 
          error: 'Insufficient credits', 
          required: cost, 
          current: profile.credits 
        });
      }

      // Attach cost to request for controller to use if needed, 
      // or we could debit here. Usually debiting happens AFTER successful generation 
      // or we reserve here. For simplicity, we just check here and debit in controller 
      // or use a transaction. 
      // Let's attach logic to debit later.
      (req as any).creditCost = cost;

      next();
    } catch (err) {
      console.error('Credit check error:', err);
      res.status(500).json({ error: 'Failed to check credits' });
    }
  };
};
