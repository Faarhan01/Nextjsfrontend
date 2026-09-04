import express from 'express';
import authRoutes from './routes/auth.ts';
import productRoutes from './routes/products.ts';
import orderRoutes from './routes/orders.ts';
import aiRoutes from './routes/ai.ts';
import feedRoutes from './routes/feeds.ts';
import utilityRoutes from './routes/utility.ts';
import { rateLimiter } from './middleware/rateLimiter.ts';
import { errorHandler, AppError } from './middleware/errorHandler.ts';

const router = express.Router();

// Apply global API rate limiter
router.use(rateLimiter());

// Register API Routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/ai', aiRoutes);
router.use('/feeds', feedRoutes);
router.use('/', utilityRoutes);

// Register API Error Handler
router.use(errorHandler);

export default router;
