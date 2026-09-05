import { Request, Response } from 'express';

export function handleHealth(_req: Request, res: Response): void {
  res.json({
    status: 'healthy',
    timestamp: Date.now(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
}