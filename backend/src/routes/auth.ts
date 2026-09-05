import { Router } from 'express';
import { 
  handleRegister, 
  handleLogin, 
  handleGetMe, 
  handleGetAllUsers 
} from '../controllers/authController.ts';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.get('/me', requireAuth, handleGetMe);
router.get('/users', requireAdmin, handleGetAllUsers);

export default router;
