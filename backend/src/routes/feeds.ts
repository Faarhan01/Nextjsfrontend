import { Router } from 'express';
import { handleGetGoogleShoppingFeed, handleGetFeedHealthStatus } from '../controllers/feedController.js';

const router = Router();

// Google Shopping XML feed endpoint (standard + .xml extension)
router.get('/google-shopping', handleGetGoogleShoppingFeed);
router.get('/google-shopping.xml', handleGetGoogleShoppingFeed);

// Feed Health & Audit Status
router.get('/status', handleGetFeedHealthStatus);

export default router;
