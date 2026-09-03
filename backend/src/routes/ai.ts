import { Router } from 'express';
import { 
  handleGenerateBrand, 
  handleGenerateProducts, 
  handleGenerateStudio, 
  handleConciergeReply, 
  handleEnhanceProductCopy 
} from '../controllers/aiController.js';

const router = Router();

router.post('/brands/generate', handleGenerateBrand);
router.post('/products/generate', handleGenerateProducts);
router.post('/studio/generate', handleGenerateStudio);
router.post('/concierge', handleConciergeReply);
router.post('/products/enhance', handleEnhanceProductCopy);

export default router;
