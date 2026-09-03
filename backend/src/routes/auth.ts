import { Router } from 'express';
import { 
  handleRegister, 
  handleLogin, 
  handleGetMe, 
  handleGetAllUsers 
} from '../controllers/authController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.get('/me', requireAuth, handleGetMe);
router.get('/users', requireAdmin, handleGetAllUsers);

export default router;
