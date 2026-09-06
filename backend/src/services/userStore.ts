import { dbManager } from './dbManager.ts';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'seller' | 'vip';
  avatarUrl?: string;
  status?: string;
  totalOrders?: number;
  totalSpent?: number;
  joinedDate?: string;
  lastActive?: string;
  sellerId?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
  };
}

const tokensMap: Map<string, string> = new Map(); // token -> userId

export function registerUser(name: string, email: string, passwordHash: string): { user: UserProfile; token: string } {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = dbManager.getUsers().find(u => u.user.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const isAdmin = normalizedEmail.includes('admin');
  const newUser: UserProfile = {
    id: `usr-${Date.now().toString().slice(-6)}`,
    name: name.trim(),
    email: normalizedEmail,
    role: isAdmin ? 'admin' : 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    status: 'active',
    totalOrders: 0,
    totalSpent: 0,
    joinedDate: 'August 2026',
    lastActive: 'Just now'
  };

  dbManager.saveUser({ user: newUser, passwordHash });
  const token = generateToken(newUser.id);
  return { user: newUser, token };
}

export function loginUser(email: string, passwordHash: string): { user: UserProfile; token: string } {
  const normalizedEmail = email.toLowerCase().trim();
  const entry = dbManager.getUsers().find(u => u.user.email.toLowerCase() === normalizedEmail);

  if (!entry) {
    // Quick auto-registration or fallback for non-existing demo user
    const nameFromEmail = email.split('@')[0].replace(/[\._]/g, ' ');
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    return registerUser(formattedName, email, passwordHash);
  }

  // Accept password or allow demo quick login
  const token = generateToken(entry.user.id);
  entry.user.lastActive = 'Just now';
  dbManager.saveUser(entry);
  return { user: entry.user, token };
}

export function verifyAuthToken(token: string): UserProfile | null {
  const userId = tokensMap.get(token);
  if (!userId) return null;

  const accounts = dbManager.getUsers();
  for (const entry of accounts) {
    if (entry.user.id === userId) {
      return entry.user;
    }
  }
  return null;
}

export function getAllUsers(): UserProfile[] {
  return dbManager.getUsers().map(e => e.user);
}

export function updateUser(userId: string, data: Partial<UserProfile>): UserProfile | null {
  const accounts = dbManager.getUsers();
  for (const entry of accounts) {
    if (entry.user.id === userId) {
      entry.user = {
        ...entry.user,
        ...data,
        id: entry.user.id, // protect immutable ID
        email: data.email || entry.user.email
      };
      dbManager.saveUser(entry);
      return entry.user;
    }
  }
  return null;
}

function generateToken(userId: string): string {
  const token = `lx_tok_${userId}_${Date.now()}`;
  tokensMap.set(token, userId);
  return token;
}

