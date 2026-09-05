import express from 'express';
import storeRoutes from './routes/store.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import { optionalAuth } from './middleware/authMiddleware.ts';

const router = express.Router();

// Medusa Store API: everything lives under /store/...
// Populate req.user from Bearer token when present; /store/auth GET is public.
router.use(optionalAuth);
router.use('/store', storeRoutes);

// Health endpoint (root of /api namespace)
router.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: Date.now() });
});

router.use(errorHandler);

export default router;