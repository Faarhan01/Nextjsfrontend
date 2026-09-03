import express from 'express';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import aiRoutes from './routes/ai.js';
import feedRoutes from './routes/feeds.js';
import utilityRoutes from './routes/utility.js';
import payloadRoutes from './payload/routes.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { errorHandler, AppError } from './middleware/errorHandler.js';

const router = express.Router();

// Apply global API rate limiter
router.use(rateLimiter());

// Register API Routes
router.use('/payload', payloadRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/ai', aiRoutes);
router.use('/feeds', feedRoutes);
router.use('/', utilityRoutes);

// Fallback 404 handler for unknown API endpoints
router.use((req, res, next) => {
  next(new AppError(`API endpoint ${req.originalUrl} not found`, 404));
});

// Register API Error Handler
router.use(errorHandler);

export default router;

