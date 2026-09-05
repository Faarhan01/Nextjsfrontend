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

const usersDb: Map<string, { user: UserProfile; passwordHash: string }> = new Map();
const tokensMap: Map<string, string> = new Map(); // token -> userId

// Pre-populate with default demo accounts
const DEFAULT_USERS: Array<{ user: UserProfile; passwordHash: string }> = [
  {
    user: {
      id: 'usr-admin-01',
      name: 'Alexander Vance',
      email: 'admin@luxestore.com',
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
      status: 'vip',
      totalOrders: 28,
      totalSpent: 8900.00,
      joinedDate: 'Jan 2025',
      lastActive: 'Active Now',
      phone: '+1 (555) 992-1083',
      address: {
        street: '1 Executive Plaza',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States'
      }
    },
    passwordHash: 'admin123'
  },
  {
    user: {
      id: 'usr-seller-01',
      name: 'Liam Botha (Nova Store)',
      email: 'liam@novaofficial.co.za',
      role: 'seller',
      sellerId: 'sel-01',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      status: 'active',
      totalOrders: 84,
      totalSpent: 148500.00,
      joinedDate: 'Jan 2025',
      lastActive: 'Just now',
      phone: '+27 82 459 1029',
      address: {
        street: '22 Long Street',
        city: 'Cape Town',
        state: 'Western Cape',
        zip: '8001',
        country: 'South Africa'
      }
    },
    passwordHash: 'seller123'
  },
  {
    user: {
      id: 'usr-vip-02',
      name: 'Sophia Laurent',
      email: 'sophia@example.com',
      role: 'vip',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
      status: 'vip',
      totalOrders: 12,
      totalSpent: 3850.00,
      joinedDate: 'Mar 2025',
      lastActive: '5 mins ago',
      phone: '+1 (555) 349-2041',
      address: {
        street: '884 Bel Air Road',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90077',
        country: 'United States'
      }
    },
    passwordHash: 'vip123'
  },
  {
    user: {
      id: 'usr-cust-03',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'customer',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
      status: 'active',
      totalOrders: 4,
      totalSpent: 620.00,
      joinedDate: 'June 2026',
      lastActive: '10 mins ago',
      phone: '+1 (555) 019-2834',
      address: {
        street: '123 Luxury Avenue',
        city: 'Beverly Hills',
        state: 'CA',
        zip: '90210',
        country: 'United States'
      }
    },
    passwordHash: 'customer123'
  }
];

// Initialize users database
DEFAULT_USERS.forEach((entry) => {
  usersDb.set(entry.user.email.toLowerCase(), entry);
});

export function registerUser(name: string, email: string, passwordHash: string): { user: UserProfile; token: string } {
  const normalizedEmail = email.toLowerCase().trim();
  if (usersDb.has(normalizedEmail)) {
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

  usersDb.set(normalizedEmail, { user: newUser, passwordHash });
  const token = generateToken(newUser.id);
  return { user: newUser, token };
}

export function loginUser(email: string, passwordHash: string): { user: UserProfile; token: string } {
  const normalizedEmail = email.toLowerCase().trim();
  const entry = usersDb.get(normalizedEmail);

  if (!entry) {
    // Quick auto-registration or fallback for non-existing demo user
    const nameFromEmail = email.split('@')[0].replace(/[\._]/g, ' ');
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    return registerUser(formattedName, email, passwordHash);
  }

  // Accept password or allow demo quick login
  const token = generateToken(entry.user.id);
  entry.user.lastActive = 'Just now';
  return { user: entry.user, token };
}

export function verifyAuthToken(token: string): UserProfile | null {
  const userId = tokensMap.get(token);
  if (!userId) return null;

  for (const entry of usersDb.values()) {
    if (entry.user.id === userId) {
      return entry.user;
    }
  }
  return null;
}

export function getAllUsers(): UserProfile[] {
  return Array.from(usersDb.values()).map(e => e.user);
}

function generateToken(userId: string): string {
  const token = `lx_tok_${userId}_${Date.now()}`;
  tokensMap.set(token, userId);
  return token;
}
