import { Router } from 'express';
import { handleExtractUrl, handleHealthCheck } from '../controllers/utilityController.ts';

const router = Router();

router.post('/extract-url', handleExtractUrl);
router.get('/health', handleHealthCheck);

export default router;
