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

export function handleLogout(_req: Request, res: Response): void {
  res.json({ message: 'Successfully logged out.' });
}

export function handleGetMe(req: Request, res: Response): void {
  const user = (req as any).user as UserProfile | undefined;
  if (!user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }
  res.json({ customer: toMedusaCustomer(user) });
}

export function handleUpdateMe(req: Request, res: Response): void {
  const user = (req as any).user as UserProfile | undefined;
  if (!user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }
  const { first_name, last_name, phone, billing_address, metadata } = req.body || {};
  const updatedName = (first_name || last_name)
    ? `${first_name || ''} ${last_name || ''}`.trim()
    : undefined;

  const updated = updateUser(user.id, {
    ...(updatedName ? { name: updatedName } : {}),
    ...(phone ? { phone } : {}),
    ...(billing_address ? { address: billing_address } : {}),
    ...(metadata?.avatarUrl ? { avatarUrl: metadata.avatarUrl } : {})
  });

  res.json({ customer: toMedusaCustomer(updated || user) });
}

export function handleGetCustomerOrders(req: Request, res: Response): void {
  const user = (req as any).user as UserProfile | undefined;
  if (!user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }
  const orders = getOrdersByUser(user.id, user.email);
  res.json({
    orders: orders.map(o => ({
      id: o.id,
      display_id: Number(o.id.replace(/\D/g, '')) || 9901,
      status: o.status.toLowerCase(),
      total: Math.round(o.total * 100),
      currency_code: 'zar',
      created_at: o.orderDate,
      items: o.items.map(it => ({
        id: it.id,
        title: it.name,
        quantity: it.quantity,
        unit_price: Math.round(it.price * 100),
        thumbnail: it.image
      })),
      shipping_address: o.shippingAddress,
      payment_status: 'captured',
      fulfillment_status: o.status.toLowerCase() === 'delivered' ? 'fulfilled' : 'processing'
    })),
    count: orders.length
  });
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