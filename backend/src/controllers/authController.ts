import { Request, Response } from 'express';
import { registerUser, loginUser, getAllUsers, updateUser, UserProfile } from '../services/userStore.ts';
import { getOrdersByUser } from '../services/orderStore.ts';

export function handleRegister(req: Request, res: Response): void {
  try {
    const { name, email, password } = req.body || {};
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }
    const { user, token } = registerUser(name || email.split('@')[0], email, password);
    res.json({ user, customer: user, token });
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
    res.json({ user, customer: user, token });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Login failed.' });
  }
}

export function handleLogout(_req: Request, res: Response): void {
  res.json({ message: 'Successfully logged out.' });
}

export function handleGetMe(req: Request, res: Response): void {
  const user = (req as any).user as UserProfile | undefined;
  if (!user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }
  res.json({ user, customer: user });
}

export function handleUpdateMe(req: Request, res: Response): void {
  const user = (req as any).user as UserProfile | undefined;
  if (!user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }
  const { name, first_name, last_name, phone, address, billing_address, metadata, avatarUrl } = req.body || {};
  const updatedName = name || ((first_name || last_name) ? `${first_name || ''} ${last_name || ''}`.trim() : undefined);

  const updated = updateUser(user.id, {
    ...(updatedName ? { name: updatedName } : {}),
    ...(phone ? { phone } : {}),
    ...(address || billing_address ? { address: address || billing_address } : {}),
    ...(avatarUrl || metadata?.avatarUrl ? { avatarUrl: avatarUrl || metadata?.avatarUrl } : {})
  });

  const finalUser = updated || user;
  res.json({ user: finalUser, customer: finalUser });
}

export function handleGetCustomerOrders(req: Request, res: Response): void {
  const user = (req as any).user as UserProfile | undefined;
  if (!user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }
  const orders = getOrdersByUser(user.id, user.email);
  res.json({
    orders,
    count: orders.length
  });
}

export function handleGetAllUsers(_req: Request, res: Response): void {
  const users = getAllUsers();
  res.json({ users, customers: users, count: users.length });
}
