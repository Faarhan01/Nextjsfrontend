import { Router } from 'express';
import { 
  handleGetProducts, 
  handleGetCategories, 
  handleGetProductById, 
  handleCreateProduct, 
  handleUpdateProduct, 
  handleDeleteProduct 
} from '../controllers/productController.ts';
import { requireAdmin } from '../middleware/authMiddleware.ts';

const router = Router();

router.get('/', handleGetProducts);
router.get('/categories', handleGetCategories);
router.get('/:id', handleGetProductById);
router.post('/', requireAdmin, handleCreateProduct);
router.put('/:id', requireAdmin, handleUpdateProduct);
router.delete('/:id', requireAdmin, handleDeleteProduct);

export default router;
