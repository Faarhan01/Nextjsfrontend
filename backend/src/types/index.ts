import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin' | 'seller' | 'vip';
    status?: string;
    sellerId?: string;
  };
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  data?: T;
  message?: string;
  [key: string]: any;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  timestamp?: string;
  path?: string;
}
