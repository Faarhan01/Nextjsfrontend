import { Request, Response, NextFunction } from 'express';
import { verifyAuthToken } from '../services/userStore.js';
import { payloadStore } from '../payload/payloadStore.js';
import { PayloadRole } from '../payload/types.js';

export interface AuthenticatedRequest extends Request {
  user?: any;
  payloadUser?: {
    id: string;
    email?: string;
    name?: string;
    role: PayloadRole;
    scopes?: string[];
    isApiKey?: boolean;
  };
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // 1. Check Payload API key header
  const apiKeyHeader = req.headers['x-payload-api-key'] || req.headers['payload-api-key'];
  if (apiKeyHeader && typeof apiKeyHeader === 'string') {
    const keyDoc = payloadStore.validateApiKey(apiKeyHeader);
    if (keyDoc) {
      req.payloadUser = {
        id: keyDoc.id,
        name: keyDoc.name,
        role: keyDoc.role,
        scopes: keyDoc.scopes,
        isApiKey: true
      };
      req.user = {
        id: keyDoc.id,
        name: keyDoc.name,
        role: keyDoc.role
      };
      return next();
    }
  }

  // 2. Check Bearer Token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);

    // Check if token is an API key prefix
    if (token.startsWith('pk_')) {
      const keyDoc = payloadStore.validateApiKey(token);
      if (keyDoc) {
        req.payloadUser = {
          id: keyDoc.id,
          name: keyDoc.name,
          role: keyDoc.role,
          scopes: keyDoc.scopes,
          isApiKey: true
        };
        req.user = {
          id: keyDoc.id,
          name: keyDoc.name,
          role: keyDoc.role
        };
        return next();
      }
    }

    const user = verifyAuthToken(token);
    if (user) {
      req.user = user;
      req.payloadUser = {
        id: user.id || user.email,
        email: user.email,
        name: user.name,
        role: (user.role as PayloadRole) || 'customer'
      };
    }
  }
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  optionalAuth(req, res, () => {
    if (!req.user && !req.payloadUser) {
      return res.status(401).json({ success: false, error: 'Authentication token or API key missing or invalid.' });
    }
    next();
  });
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  optionalAuth(req, res, () => {
    const userRole = req.payloadUser?.role || req.user?.role;
    if (userRole !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin privileges required for this action.' });
    }
    next();
  });
}

export function requirePayloadAccess(collection: string, operation: 'read' | 'create' | 'update' | 'delete') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    optionalAuth(req, res, () => {
      const userRole: PayloadRole = req.payloadUser?.role || (req.user?.role as PayloadRole) || 'guest';
      const userEmail = req.payloadUser?.email || req.user?.email;

      const evalResult = payloadStore.evaluateAccess(collection, operation, userRole, userEmail);
      if (!evalResult.allowed) {
        return res.status(403).json({
          success: false,
          error: evalResult.reason || `Access denied for role ${userRole} on ${collection}.${operation}`,
          evaluation: evalResult
        });
      }
      next();
    });
  };
}
