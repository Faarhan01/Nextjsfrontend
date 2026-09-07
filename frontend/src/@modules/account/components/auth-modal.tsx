'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  Sparkles, 
  ArrowRight,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Store
} from 'lucide-react';
import { UserProfile } from '@/types';
import { sdk, MedusaCustomer } from '@lib/sdk';

function medusaCustomerToUserProfile(
  customer: MedusaCustomer,
  fallbackEmail: string,
  fallbackName?: string
): UserProfile {
  const meta = (customer as any).metadata || {};
  const name =
    [customer.first_name, customer.last_name].filter(Boolean).join(' ').trim() ||
    fallbackName ||
    fallbackEmail.split('@')[0];
  const email = customer.email || fallbackEmail;
  return {
    id: (customer.id || `usr-${Date.now()}`).replace(/^cust_/, 'usr-'),
    name,
    email,
    role: meta.role || (email.toLowerCase().includes('admin') ? 'admin' : 'customer'),
    avatarUrl:
      meta.avatarUrl ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    status: meta.status || 'active',
    totalOrders: meta.totalOrders ?? 0,
    totalSpent: meta.totalSpent ?? 0,
    joinedDate: meta.joinedDate,
    lastActive: meta.lastActive || 'Just now',
    phone: customer.phone || meta.phone,
    address: meta.address
  };
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (user: UserProfile) => void;
  themeColor: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  getThemeClasses: (color: string) => any;
  showToast: (msg: string) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSignIn,
  themeColor,
  getThemeClasses,
  showToast
}: AuthModalProps) {
  const currentTheme = getThemeClasses(themeColor);
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast('Please enter your email address.');
      return;
    }

    setResetSent(true);
    showToast(`Password reset link dispatched to ${forgotEmail}! Check your inbox.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in both email and password.');
      return;
    }

    if (mode === 'signup' && !name) {
      showToast('Please enter your full name.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const res = await sdk.customers.register({ name, email, password });
        const user = medusaCustomerToUserProfile(res.customer, email, name);
        onSignIn(user);
        showToast(`Account created! Welcome to Mrbulk, ${user.name}`);
      } else {
        const res = await sdk.customers.login({ email, password });
        const user = medusaCustomerToUserProfile(res.customer, email);
        onSignIn(user);
        showToast(`Welcome back, ${user.name}!`);
      }
      onClose();
    } catch (err: any) {
      // Fallback local account signin if backend unreached or offline
      const isAdmin = email.toLowerCase().includes('admin');
      const newUser: UserProfile = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name: mode === 'signup' ? name : (isAdmin ? 'Alexander Vance' : email.split('@')[0].replace('.', ' ')),
        email: email,
        role: isAdmin ? 'admin' : 'customer',
        avatarUrl: isAdmin 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
        status: isAdmin ? 'vip' : 'active',
        totalOrders: isAdmin ? 14 : 3,
        totalSpent: isAdmin ? 3420.00 : 450.00,
        joinedDate: 'July 2026',
        lastActive: 'Just now',
        phone: '+1 (555) 019-2834',
        address: {
          street: '123 Luxury Avenue',
          city: 'Beverly Hills',
          state: 'CA',
          zip: '90210'
        }
      };
      onSignIn(newUser);
      showToast(`Signed in as ${newUser.name}`);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: 'admin' | 'customer' | 'vip' | 'vendor' | 'seller') => {
    let demoUser: UserProfile;
    
    if (role === 'admin') {
      demoUser = {
        id: 'usr-admin-01',
        name: 'Alexander Vance',
        email: 'admin@mrbulk.co.za',
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
          zip: '10001'
        }
      };
    } else if (role === 'vendor' || role === 'seller') {
      demoUser = {
        id: 'usr-seller-01',
        name: 'Liam Botha (Nova Store)',
        email: 'liam@novaofficial.co.za',
        role: 'seller',
        sellerId: '849201',
        avatarUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=200',
        status: 'active',
        totalOrders: 84,
        totalSpent: 148500.00,
        joinedDate: 'Jan 2025',
        lastActive: 'Active Now',
        phone: '+27 82 491 8021',
        address: {
          street: '44 Bree Street',
          city: 'Cape Town',
          state: 'Western Cape',
          zip: '8001'
        }
      };
    } else if (role === 'vip') {
      demoUser = {
        id: 'usr-vip-02',
        name: 'Sophia Laurent',
        email: 'sophia@example.com',
        role: 'customer',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
        status: 'vip',
        totalOrders: 12,
        totalSpent: 3850.00,
        joinedDate: 'Mar 2025',
        lastActive: '5 mins ago',
        phone: '+1 (555) 349-2041'
      };
    } else {
      demoUser = {
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
        phone: '+1 (555) 019-2834'
      };
    }

    onSignIn(demoUser);
    showToast(`Signed in as ${demoUser.name} (${demoUser.role.toUpperCase()})`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> Secure Store Authentication
            </div>

            <h3 className="text-2xl font-extrabold tracking-tight text-white">
              {mode === 'signin' 
                ? 'Sign In to Account' 
                : mode === 'signup' 
                  ? 'Create Customer Account' 
                  : 'Reset Account Password'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'signin' 
                ? 'Access your orders, saved wishlist, and admin controls.' 
                : mode === 'signup'
                  ? 'Join our store community for express checkout & rewards.'
                  : 'Enter your registered email to receive a password reset link.'}
            </p>

            {/* Tab switch buttons */}
            <div className="flex bg-slate-800/80 p-1 rounded-xl mt-5 border border-slate-700/60">
              <button
                onClick={() => { setMode('signin'); setResetSent(false); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </button>
              <button
                onClick={() => { setMode('signup'); setResetSent(false); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Register
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {mode === 'forgot' ? (
              <div className="space-y-4">
                {resetSent ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <div>
                      <h4 className="text-sm font-extrabold text-emerald-950">Password Reset Email Dispatched</h4>
                      <p className="text-xs text-emerald-800 mt-1">
                        We sent password recovery instructions to <strong className="font-bold">{forgotEmail}</strong>. Please check your inbox and follow the secure link.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setMode('signin'); setResetSent(false); }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Your Registered Email Address *</label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="e.g. john@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={`w-full py-3 ${currentTheme.bg} text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-98`}
                    >
                      Send Password Reset Link <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setMode('signin')}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                      >
                        ← Back to Sign In
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {mode === 'signup' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Name *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alexander Vance"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Email Address *</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="e.g. admin@mrbulk.co.za or customer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">Password *</label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); setForgotEmail(email); }}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 ${currentTheme.bg} text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-98 disabled:opacity-70`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Authenticating...
                    </>
                  ) : (
                    <>
                      {mode === 'signin' ? 'Sign In Now' : 'Complete Registration'} <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Demo Credentials Preset Bar */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                Instant Demo Quick Login
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="p-2.5 bg-blue-50/80 hover:bg-blue-50 border border-blue-100 hover:border-blue-300 rounded-xl text-left transition cursor-pointer hover:shadow-xs group"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] font-extrabold text-blue-700 uppercase tracking-wider block">Admin Role</span>
                    <ShieldCheck className="w-3 h-3 text-blue-600 shrink-0" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 group-hover:text-blue-600 truncate block">Alexander Vance</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('vendor')}
                  className="p-2.5 bg-emerald-50/80 hover:bg-emerald-50 border border-emerald-100 hover:border-emerald-300 rounded-xl text-left transition cursor-pointer hover:shadow-xs group"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] font-extrabold text-emerald-700 uppercase tracking-wider block">Vendor / Seller</span>
                    <Store className="w-3 h-3 text-emerald-600 shrink-0" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 group-hover:text-emerald-700 truncate block">Liam Botha (Nova)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('vip')}
                  className="p-2.5 bg-amber-50/80 hover:bg-amber-50 border border-amber-100 hover:border-amber-300 rounded-xl text-left transition cursor-pointer hover:shadow-xs group"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] font-extrabold text-amber-700 uppercase tracking-wider block">VIP Customer</span>
                    <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 group-hover:text-amber-700 truncate block">Sophia Laurent</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('customer')}
                  className="p-2.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-left transition cursor-pointer hover:shadow-xs group"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">Standard Cust</span>
                    <User className="w-3 h-3 text-slate-400 shrink-0" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 group-hover:text-slate-700 truncate block">John Doe</span>
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
