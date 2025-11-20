import { Router } from 'express';
import { AuthController } from './controllers/authController';
import { ContentController } from './controllers/contentController';
import { CreditsController } from './controllers/creditsController';
import { requireAuth } from './middleware/auth';
import { requireCredits } from './middleware/credits';

const router = Router();

// --- AUTH ROUTES ---
router.post('/auth/signup', AuthController.signup);
router.post('/auth/login', AuthController.login);
router.get('/auth/user', requireAuth, AuthController.getUser);
router.post('/auth/logout', AuthController.logout);

// --- CONTENT GENERATION ROUTES ---
// News (Cost: 1)
router.post('/conteudos/noticia', requireAuth, requireCredits(1), ContentController.generateNews);

// Audio (Cost: 2)
router.post('/conteudos/noticia/audio', requireAuth, requireCredits(2), ContentController.generateAudio);

// Landing Page (Cost: 5)
router.post('/conteudos/landingpage', requireAuth, requireCredits(5), ContentController.generateLandingPage);

// Copywriting (Cost: 1)
router.post('/conteudos/copy', requireAuth, requireCredits(1), ContentController.generateCopy);

// Canva Structure (Cost: 1)
router.post('/conteudos/canva', requireAuth, requireCredits(1), ContentController.generateCanva);

// Metaprompts (Cost: 1)
router.post('/conteudos/prompt', requireAuth, requireCredits(1), ContentController.generatePrompt);

// --- CREDITS & PAYMENTS ---
router.get('/creditos', requireAuth, CreditsController.getBalance);
router.post('/creditos/debitar', requireAuth, CreditsController.debitManual);

router.get('/planos', (req, res) => {
  res.json([
    { name: 'Free', price: 0, credits: 5 },
    { name: 'Pro', price: 29, credits: 100 },
    { name: 'Agency', price: 99, credits: 500 }
  ]);
});

// Mock Transaction endpoints
router.post('/transacoes/criar', requireAuth, (req, res) => {
  res.json({ checkoutUrl: 'https://stripe.com/mock-checkout' });
});

router.post('/transacoes/webhook', (req, res) => {
  // Handle webhook logic
  console.log('Webhook received', req.body);
  res.json({ received: true });
});

export default router;
