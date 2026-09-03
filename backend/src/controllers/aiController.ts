import { Request, Response } from 'express';
import { 
  generateBrand, 
  generateProducts, 
  generateStudioAssets, 
  generateConciergeReply, 
  enhanceProductCopy 
} from '../services/geminiService.js';

export async function handleGenerateBrand(req: Request, res: Response): Promise<void> {
  try {
    const data = await generateBrand(req.body || {});
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('AI Brand Generation Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Brand generation failed.' });
  }
}

export async function handleGenerateProducts(req: Request, res: Response): Promise<void> {
  try {
    const data = await generateProducts(req.body || {});
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('AI Product Generation Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Product generation failed.' });
  }
}

export async function handleGenerateStudio(req: Request, res: Response): Promise<void> {
  try {
    const data = await generateStudioAssets(req.body || {});
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('AI Studio Generation Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Studio generation failed.' });
  }
}

export async function handleConciergeReply(req: Request, res: Response): Promise<void> {
  try {
    const data = await generateConciergeReply(req.body || {});
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('AI Concierge Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Concierge request failed.' });
  }
}

export async function handleEnhanceProductCopy(req: Request, res: Response): Promise<void> {
  try {
    const data = await enhanceProductCopy(req.body || {});
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('AI Product Enhancer Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Product enhancement failed.' });
  }
}
