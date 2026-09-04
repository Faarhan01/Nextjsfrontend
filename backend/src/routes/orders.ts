import { Router } from 'express';
import { 
  handleCreateOrder, 
  handleTrackOrder, 
  handleGetUserOrders, 
  handleUpdateOrderStatus, 
  handleGetStoreStats 
} from '../controllers/orderController.ts';
import { optionalAuth, requireAdmin } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/', optionalAuth, handleCreateOrder);
router.get('/track/:id', handleTrackOrder);
router.get('/user', optionalAuth, handleGetUserOrders);
router.put('/:id/status', requireAdmin, handleUpdateOrderStatus);
router.get('/stats', requireAdmin, handleGetStoreStats);

export default router;
