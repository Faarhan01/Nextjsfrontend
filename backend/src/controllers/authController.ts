import { Request, Response } from 'express';
import { registerUser, loginUser, getAllUsers } from '../services/userStore.js';
import { AuthenticatedRequest } from '../types/index.js';

export function handleRegister(req: Request, res: Response): void {
  try {
    const { name, email, password } = req.body || {};
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required.' });
      return;
    }

    const { user, token } = registerUser(name || email.split('@')[0], email, password);
    res.json({ success: true, user, token, message: 'Account registered successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Registration failed.' });
  }
}

export function handleLogin(req: Request, res: Response): void {
  try {
    const { email, password } = req.body || {};
    if (!email) {
      res.status(400).json({ success: false, error: 'Email is required.' });
      return;
    }

    const { user, token } = loginUser(email, password || 'defaultpass');
    res.json({ success: true, user, token, message: `Welcome back, ${user.name}!` });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Login failed.' });
  }
}

export function handleGetMe(req: AuthenticatedRequest, res: Response): void {
  res.json({ success: true, user: req.user });
}

export function handleGetAllUsers(req: Request, res: Response): void {
  const users = getAllUsers();
  res.json({ success: true, users });
}
