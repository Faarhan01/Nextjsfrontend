import { Request, Response } from 'express';
import { registerUser, loginUser, getAllUsers, UserProfile } from '../services/userStore.ts';

export function handleRegister(req: Request, res: Response): void {
  try {
    const { name, email, password } = req.body || {};
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }
    const { user, token } = registerUser(name || email.split('@')[0], email, password);
    res.json({ customer: toMedusaCustomer(user), token });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Registration failed.' });
  }
}

export function handleLogin(req: Request, res: Response): void {
  try {
    const { email, password } = req.body || {};
    if (!email) {
      res.status(400).json({ message: 'Email is required.' });
      return;
    }
    const { user, token } = loginUser(email, password || 'defaultpass');
    res.json({ customer: toMedusaCustomer(user), token });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Login failed.' });
  }
}

export function handleGetMe(req: Request, res: Response): void {
  const user = (req as any).user as UserProfile | undefined;
  if (!user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }
  res.json({ customer: toMedusaCustomer(user) });
}

export function handleGetAllUsers(_req: Request, res: Response): void {
  const users = getAllUsers().map(toMedusaCustomer);
  res.json({ customers: users, count: users.length });
}

function toMedusaCustomer(u: UserProfile) {
  return {
    id: `cust_${u.id.replace(/^usr-/, '')}`,
    email: u.email,
    first_name: u.name?.split(' ')[0] || '',
    last_name: u.name?.split(' ').slice(1).join(' ') || '',
    phone: u.phone,
    has_account: true,
    metadata: {
      role: u.role,
      status: u.status,
      sellerId: u.sellerId,
      avatarUrl: u.avatarUrl,
      totalOrders: u.totalOrders,
      totalSpent: u.totalSpent,
      joinedDate: u.joinedDate,
      lastActive: u.lastActive,
      address: u.address
    }
  };
}