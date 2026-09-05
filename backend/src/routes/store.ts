import { Router } from 'express';
import {
  listProducts,
  retrieveProduct,
  listProductCategories,
  listCollections,
  listRegions,
  retrieveRegion,
  createCart,
  retrieveCart,
  addLineItem,
  updateLineItem,
  deleteLineItem,
  completeCart,
  lookupOrder
} from '../controllers/storeController.ts';
import {
  handleRegister,
  handleLogin,
  handleGetMe,
  handleGetAllUsers
} from '../controllers/authController.ts';
import { handleConcierge } from '../controllers/aiController.ts';
import { handleHealth } from '../controllers/healthController.ts';

const router = Router();

// Medusa Store API surface
router.get('/health', handleHealth);

// Products
router.get('/products', listProducts);
router.get('/products/:id', retrieveProduct);

// Product categories
router.get('/product-categories', listProductCategories);

// Collections
router.get('/collections', listCollections);

// Regions
router.get('/regions', listRegions);
router.get('/regions/:id', retrieveRegion);

// Carts
router.post('/carts', createCart);
router.get('/carts/:id', retrieveCart);
router.post('/carts/:id/line-items', addLineItem);
router.post('/carts/:id/line-items/:lineId', updateLineItem);
router.delete('/carts/:id/line-items/:lineId', deleteLineItem);
router.post('/carts/:id/complete', completeCart);

// Auth (customers)
router.post('/auth', handleLogin);
router.get('/auth', handleGetMe);
router.post('/auth/register', handleRegister);
router.get('/auth/users', handleGetAllUsers);

// Orders (read-only tracking)
router.get('/orders/:id', lookupOrder);

// AI concierge (auxiliary, kept under store namespace for Medusa-style discoverability)
router.post('/ai/concierge', handleConcierge);

export default router;