import { Request, Response } from 'express';
import { extractAndScanUrl } from '../services/urlScannerService.js';

export async function handleExtractUrl(req: Request, res: Response): Promise<void> {
  try {
    const { url, text } = req.body || {};
    const targetText = url || text || '';
    const result = await extractAndScanUrl(targetText);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'URL extraction failed' });
  }
}

export function handleHealthCheck(req: Request, res: Response): void {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: Date.now(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
}
