import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipMap = new Map<string, RateLimitRecord>();

export function rateLimiter(options = { windowMs: 60 * 1000, max: 600 }) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Exempt GET and OPTIONS requests from strict throttling to ensure fast catalog browsing
    if (req.method === 'GET' || req.method === 'OPTIONS') {
      return next();
    }

    const ip = req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown-ip';
    const now = Date.now();
    const record = ipMap.get(ip);

    if (!record || now > record.resetTime) {
      ipMap.set(ip, { count: 1, resetTime: now + options.windowMs });
      return next();
    }

    if (record.count >= options.max) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please slow down and try again shortly.',
        retryAfterMs: record.resetTime - now
      });
    }

    record.count += 1;
    next();
  };
}
