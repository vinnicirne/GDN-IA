import { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';

export const AuthController = {
  async signup(req: Request, res: Response) {
    const { email, password } = req.body;
    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password
    });

    if (error) return res.status(400).json({ error: error.message });
    
    // Initialize profile with free credits
    if (data.user) {
      await supabaseAdmin.from('profiles').upsert({
        id: data.user.id,
        credits: 5 // Free tier
      });
    }

    res.json(data);
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (error) return res.status(401).json({ error: error.message });
    res.json(data);
  },

  async getUser(req: any, res: Response) {
    // req.user is set by requireAuth middleware
    const { data } = await supabaseAdmin.from('profiles').select('*').eq('id', req.user.id).single();
    res.json({ user: req.user, profile: data });
  },

  async logout(req: Request, res: Response) {
    // Stateless JWTs are handled client-side usually, but we can sign out scope
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) await supabaseAdmin.auth.admin.signOut(token);
    res.json({ success: true });
  }
};
