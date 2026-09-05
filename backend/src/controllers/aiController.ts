import { Request, Response } from 'express';
import { generateConciergeReply } from '../services/geminiService.ts';

export async function handleConcierge(req: Request, res: Response): Promise<void> {
  try {
    const data = await generateConciergeReply(req.body || {});
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('AI Concierge Error:', error);
    res.status(500).json({ message: error.message || 'Concierge request failed.' });
  }
}